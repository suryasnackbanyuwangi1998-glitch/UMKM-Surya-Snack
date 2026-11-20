// src/app/api/translate/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SEPARATOR = "\n###END###\n";
const translateCache = new Map();

async function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
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

async function translateViaGoogle(combinedText, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    combinedText
  )}`;

  const res = await fetchWithTimeout(
    url,
    {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" },
    },
    4500
  );

  if (!res.ok) {
    throw new Error(`Google Translate status ${res.status}`);
  }

  const data = await res.json();
  if (Array.isArray(data?.[0])) {
    return data[0].map((part) => part?.[0] || "").join("");
  }

  throw new Error("Format respons tidak sesuai");
}

async function translateSingleItem(text, sourceLang, targetLang) {
  const cacheKey = `${sourceLang}->${targetLang}:${text}`;
  if (translateCache.has(cacheKey)) {
    return translateCache.get(cacheKey);
  }

  try {
    const out = await translateViaGoogle(text, sourceLang, targetLang);
    const cleanOut = out.trim();
    translateCache.set(cacheKey, cleanOut);
    return cleanOut;
  } catch {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`;
      const res = await fetchWithTimeout(url, { cache: "no-store" }, 3500);
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && data?.responseStatus === 200) {
        const cleanOut = translated.trim();
        translateCache.set(cacheKey, cleanOut);
        return cleanOut;
      }
    } catch {
      // Abaikan jika gagal
    }
    return text;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { fields, sourceLang = "id", targetLang = "en" } = body || {};

    if (!fields || typeof fields !== "object") {
      return NextResponse.json(
        { success: false, error: "Data teks tidak valid" },
        { status: 400 }
      );
    }

    const entries = Object.entries(fields);
    const resultMap = {};
    const nonEmptyItems = [];

    for (const [key, rawVal] of entries) {
      const trimmed = String(rawVal || "").trim();
      if (!trimmed) {
        resultMap[key] = "";
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
      return NextResponse.json({ success: true, translated: resultMap });
    }

    // Coba terjemahkan semua item yang belum ada di cache dalam 1 request batch
    const combinedInput = nonEmptyItems.map((item) => item.text).join(SEPARATOR);

    try {
      const combinedOutput = await translateViaGoogle(
        combinedInput,
        sourceLang,
        targetLang
      );
      const parts = combinedOutput.split(/\s*###END###\s*/i);

      if (parts.length === nonEmptyItems.length) {
        nonEmptyItems.forEach((item, idx) => {
          const val = (parts[idx] || "").trim() || item.text;
          translateCache.set(item.cacheKey, val);
          resultMap[item.key] = val;
        });
        return NextResponse.json({ success: true, translated: resultMap });
      }
    } catch {
      // Lanjut ke fallback cepat per item dengan batas waktu singkat
    }

    // Fallback cepat paralel (maksimal 4 item per gelombang biar tidak kena limit & tetap cepat)
    const chunkSize = 4;
    for (let i = 0; i < nonEmptyItems.length; i += chunkSize) {
      const chunk = nonEmptyItems.slice(i, i + chunkSize);
      const translatedChunk = await Promise.all(
        chunk.map((item) => translateSingleItem(item.text, sourceLang, targetLang))
      );
      chunk.forEach((item, idx) => {
        resultMap[item.key] = translatedChunk[idx];
      });
    }

    return NextResponse.json({
      success: true,
      translated: resultMap,
    });
  } catch (error) {
    console.error("Error translate API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menerjemahkan teks" },
      { status: 500 }
    );
  }
}