// src/app/api/translate/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const translateCache = new Map();

async function fetchWithTimeout(url, options = {}, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function translateViaGoogleGtx(text, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;

  const res = await fetchWithTimeout(
    url,
    {
      cache: 'no-store',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    },
    6000
  );

  if (!res.ok) {
    throw new Error(`Google GTX status ${res.status}`);
  }

  const data = await res.json();
  if (Array.isArray(data?.[0])) {
    return data[0].map((part) => part?.[0] || '').join('');
  }

  throw new Error('Format respons GTX tidak sesuai');
}

async function translateViaGoogleDict(text, sourceLang, targetLang) {
  const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(
    text
  )}`;

  const res = await fetchWithTimeout(
    url,
    {
      cache: 'no-store',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    },
    6000
  );

  if (!res.ok) {
    throw new Error(`Google Dict status ${res.status}`);
  }

  const data = await res.json();
  if (Array.isArray(data) && typeof data[0] === 'string') {
    return data[0];
  }
  if (Array.isArray(data?.[0]) && typeof data[0][0] === 'string') {
    return data[0][0];
  }

  throw new Error('Format respons Dict tidak sesuai');
}

async function translateViaMyMemory(text, sourceLang, targetLang) {
  // MyMemory memiliki batas ~500 karakter per query
  const trimmed = text.slice(0, 480);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    trimmed
  )}&langpair=${sourceLang}|${targetLang}`;

  const res = await fetchWithTimeout(url, { cache: 'no-store' }, 5000);
  if (!res.ok) {
    throw new Error(`MyMemory status ${res.status}`);
  }

  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (translated && Number(data?.responseStatus) === 200) {
    return translated;
  }

  throw new Error('MyMemory gagal menerjemahkan');
}

async function translateSingleItem(text, sourceLang, targetLang) {
  const clean = String(text || '').trim();
  if (!clean) return '';

  const cacheKey = `${sourceLang}->${targetLang}:${clean}`;
  if (translateCache.has(cacheKey)) {
    return translateCache.get(cacheKey);
  }

  const providers = [
    () => translateViaGoogleGtx(clean, sourceLang, targetLang),
    () => translateViaGoogleDict(clean, sourceLang, targetLang),
    () => translateViaMyMemory(clean, sourceLang, targetLang),
  ];

  for (const runProvider of providers) {
    try {
      const out = await runProvider();
      const cleanOut = String(out || '').trim();
      if (cleanOut && cleanOut.toLowerCase() !== clean.toLowerCase()) {
        translateCache.set(cacheKey, cleanOut);
        return cleanOut;
      }
    } catch {
      // Coba provider berikutnya
    }
  }

  return clean;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fields,
      texts,
      sourceLang = 'id',
      targetLang = 'en',
    } = body || {};

    let normalizedEntries = [];
    if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
      normalizedEntries = Object.entries(fields);
    } else if (Array.isArray(texts)) {
      normalizedEntries = texts.map((txt, idx) => [String(idx), txt]);
    } else {
      return NextResponse.json(
        { success: false, error: 'Data teks tidak valid' },
        { status: 400 }
      );
    }

    const resultMap = {};
    const nonEmptyItems = [];

    for (const [key, rawVal] of normalizedEntries) {
      const trimmed = String(rawVal || '').trim();
      if (!trimmed) {
        resultMap[key] = '';
      } else {
        const cacheKey = `${sourceLang}->${targetLang}:${trimmed}`;
        if (translateCache.has(cacheKey)) {
          resultMap[key] = translateCache.get(cacheKey);
        } else {
          nonEmptyItems.push({ key, text: trimmed, cacheKey });
        }
      }
    }

    if (nonEmptyItems.length === 0) {
      return NextResponse.json({
        success: true,
        translated: resultMap,
        translations: resultMap,
      });
    }

    // Terjemahkan secara paralel per gelombang (maksimal 5 item bersamaan) menggunakan multi-provider fallback
    const chunkSize = 5;
    for (let i = 0; i < nonEmptyItems.length; i += chunkSize) {
      const chunk = nonEmptyItems.slice(i, i + chunkSize);
      const translatedChunk = await Promise.all(
        chunk.map((item) =>
          translateSingleItem(item.text, sourceLang, targetLang)
        )
      );
      chunk.forEach((item, idx) => {
        resultMap[item.key] = translatedChunk[idx];
      });
    }

    return NextResponse.json({
      success: true,
      translated: resultMap,
      translations: resultMap,
    });
  } catch (error) {
    console.error('Error translate API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menerjemahkan teks' },
      { status: 500 }
    );
  }
}