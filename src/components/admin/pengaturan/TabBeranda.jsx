// src/components/admin/pengaturan/TabBeranda.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import SettingsImageField from "./SettingsImageField";

const DEFAULT_FEATURES = [
  {
    icon: "award",
    title: "Resep Warisan Autentik",
    title_en: "Authentic Heritage Recipe",
    desc: "Diwariskan dari generasi ke generasi sejak tahun 1998, menjaga keaslian rasa tradisional Banyuwangi.",
    desc_en:
      "Passed down from generation to generation since 1998, preserving authentic Banyuwangi traditional flavors.",
  },
  {
    icon: "leaf",
    title: "Bahan Pilihan Premium",
    title_en: "Premium Selected Ingredients",
    desc: "Hanya menggunakan hasil bumi pilihan tanpa pengawet buatan, diolah secara higienis setiap hari.",
    desc_en:
      "Using only selected local harvests without artificial preservatives, processed hygienically every day.",
  },
  {
    icon: "fire",
    title: "Dipanggang & Digoreng Sempurna",
    title_en: "Baked & Fried to Perfection",
    desc: "Tekstur renyah di luar, empuk dan gurih di dalam dengan standar kualitas artisan.",
    desc_en:
      "Crispy outside, tender and savory inside with artisan quality standards.",
  },
  {
    icon: "phone",
    title: "Layanan Pelanggan Personal",
    title_en: "Personal Customer Service",
    desc: "Pemesanan transparan dan konfirmasi langsung dengan respon hangat melalui WhatsApp.",
    desc_en:
      "Transparent ordering and direct confirmation with warm responses via WhatsApp.",
  },
];

const TRANSLATE_TIMEOUT_MS = 6000;
const translateCache = new Map();

function extractTranslatedMap(result) {
  const rawMap =
    result?.translated ||
    result?.data?.translated ||
    result?.translations ||
    result?.data ||
    null;

  if (!rawMap || typeof rawMap !== "object") return null;

  const cleaned = {};
  Object.entries(rawMap).forEach(([key, val]) => {
    if (typeof val === "string") {
      cleaned[key] = val.trim();
    }
  });

  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

async function compressImageBeforeUpload(file) {
  if (
    typeof window === "undefined" ||
    !file?.type?.startsWith("image/") ||
    file.type === "image/gif"
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDimension = 1280;
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          resolve(
            new File([blob], `${baseName}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
        },
        "image/jpeg",
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export default function TabBeranda({
  form = {},
  uploadingField,
  onChange,
  onBatchChange,
  onUpload,
}) {
  const [translating, setTranslating] = useState(false);
  const [translateMsg, setTranslateMsg] = useState(null);
  const abortRef = useRef(null);

  const features =
    Array.isArray(form.home_features) && form.home_features.length > 0
      ? form.home_features
      : DEFAULT_FEATURES;

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const handleFastUpload = async (fieldName, file) => {
    if (!file || typeof onUpload !== "function") return;
    const optimizedFile = await compressImageBeforeUpload(file);
    return onUpload(fieldName, optimizedFile);
  };

  const handleFeatureFieldChange = (index, key, value) => {
    const updated = features.map((item, idx) =>
      idx === index ? { ...item, [key]: value } : item
    );
    onChange({
      target: {
        name: "home_features",
        value: updated,
      },
    });
  };

  const applyTranslations = (tr, baseFeatures) => {
    const directFields = [
      "store_label_en",
      "hero_title_en",
      "hero_desc_en",
      "heritage_subtitle_en",
      "heritage_title_en",
      "heritage_desc_en",
      "quote_text_en",
      "quote_author_en",
    ];

    const updatedFeatures = baseFeatures.map((item, idx) => ({
      ...item,
      title_en: tr[`feature_${idx}_title_en`] ?? item.title_en ?? "",
      desc_en: tr[`feature_${idx}_desc_en`] ?? item.desc_en ?? "",
    }));

    const batchUpdates = {
      home_features: updatedFeatures,
    };

    directFields.forEach((fieldName) => {
      if (fieldName in tr) {
        batchUpdates[fieldName] = tr[fieldName];
      }
    });

    if (typeof onBatchChange === "function") {
      onBatchChange(batchUpdates);
      return;
    }

    Object.entries(batchUpdates).forEach(([name, value]) => {
      onChange({ target: { name, value } });
    });
  };

  const handleAutoTranslate = async () => {
    if (translating) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const featureFields = {};
    features.forEach((item, idx) => {
      featureFields[`feature_${idx}_title_en`] = item.title || "";
      featureFields[`feature_${idx}_desc_en`] = item.desc || "";
    });

    const fieldsPayload = {
      store_label_en: form.store_label || "",
      hero_title_en: form.hero_title || "",
      hero_desc_en: form.hero_desc || "",
      heritage_subtitle_en: form.heritage_subtitle || "",
      heritage_title_en: form.heritage_title || "",
      heritage_desc_en: form.heritage_desc || "",
      quote_text_en: form.quote_text || "",
      quote_author_en: form.quote_author || "",
      ...featureFields,
    };

    const cacheKey = JSON.stringify(fieldsPayload);
    if (translateCache.has(cacheKey)) {
      applyTranslations(translateCache.get(cacheKey), features);
      setTranslateMsg({
        type: "success",
        text: "Diterjemahkan instan dari cache! Klik Simpan Perubahan untuk menyimpan.",
      });
      return;
    }

    setTranslating(true);
    setTranslateMsg(null);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(
      () => controller.abort(),
      TRANSLATE_TIMEOUT_MS
    );

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sourceLang: "id",
          targetLang: "en",
          fields: fieldsPayload,
        }),
      });

      const result = await response.json().catch(() => ({}));
      const tr = extractTranslatedMap(result);

      if (!response.ok || result?.success === false || !tr) {
        throw new Error(result?.error || "Gagal menerjemahkan teks.");
      }

      translateCache.set(cacheKey, tr);
      applyTranslations(tr, features);

      setTranslateMsg({
        type: "success",
        text: "Semua kolom English (termasuk 4 Pilar Komitmen) berhasil diterjemahkan! Klik Simpan Perubahan untuk menyimpan.",
      });
    } catch (err) {
      if (err?.name === "AbortError") {
        setTranslateMsg({
          type: "error",
          text: "Terjemahan terlalu lama (timeout). Silakan coba lagi.",
        });
      } else {
        console.error("Gagal auto-translate:", err);
        setTranslateMsg({
          type: "error",
          text: err?.message || "Gagal menerjemahkan otomatis.",
        });
      }
    } finally {
      clearTimeout(timeoutId);
      abortRef.current = null;
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Bar Bantuan Terjemahan Otomatis */}
      <div className="bg-[#FAF7F0] border border-[#6E1423]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[#6E1423]">
            Terjemahan Otomatis Bahasa Inggris
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Isi kolom Bahasa Indonesia terlebih dahulu, lalu klik tombol di samping untuk mengisi versi English secara otomatis.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoTranslate}
          disabled={translating}
          className="inline-flex items-center justify-center gap-2 bg-[#6E1423] hover:bg-[#5C0F1C] disabled:opacity-60 text-amber-300 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-xs transition cursor-pointer shrink-0"
        >
          {translating ? (
            <FontAwesomeIcon
              icon={faSpinner}
              className="w-3.5 h-3.5 animate-spin"
            />
          ) : (
            <FontAwesomeIcon icon={faLanguage} className="w-4 h-4" />
          )}
          <span>{translating ? "Menerjemahkan..." : "Terjemahkan (ID → EN)"}</span>
        </button>
      </div>

      {translateMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium ${
            translateMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {translateMsg.text}
        </div>
      )}

      {/* 1. Bagian Utama (Hero Beranda) */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#6E1423] border-b border-[#6E1423]/15 pb-2">
          1. Bagian Utama (Hero Beranda)
        </h2>

        <SettingsImageField
          label="Gambar Latar Hero Beranda"
          name="hero_image_url"
          value={form.hero_image_url}
          placeholder="/hero-background.jpg atau link gambar Google Drive"
          uploadingField={uploadingField}
          onChange={onChange}
          onUpload={handleFastUpload}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Label Atas (Indonesia)
            </label>
            <input
              type="text"
              name="store_label"
              value={form.store_label || ""}
              onChange={onChange}
              placeholder="Oleh - Oleh Khas Banyuwangi"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Label Atas (English)
            </label>
            <input
              type="text"
              name="store_label_en"
              value={form.store_label_en || ""}
              onChange={onChange}
              placeholder="Authentic Banyuwangi Delicacies"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Utama Hero (Indonesia)
            </label>
            <input
              type="text"
              name="hero_title"
              value={form.hero_title || ""}
              onChange={onChange}
              placeholder="Cita Rasa Legendaris Khas Banyuwangi"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Utama Hero (English)
            </label>
            <input
              type="text"
              name="hero_title_en"
              value={form.hero_title_en || ""}
              onChange={onChange}
              placeholder="Timeless Taste of Banyuwangi"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi Singkat Hero (Indonesia)
            </label>
            <textarea
              rows={3}
              name="hero_desc"
              value={form.hero_desc || ""}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi Singkat Hero (English)
            </label>
            <textarea
              rows={3}
              name="hero_desc_en"
              value={form.hero_desc_en || ""}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>
      </div>

      {/* 2. Bagian Sejarah Singkat & Kutipan di Beranda */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#6E1423] border-b border-[#6E1423]/15 pb-2">
          2. Bagian Sejarah Singkat &amp; Kutipan di Beranda
        </h2>

        <SettingsImageField
          label="Foto Bagian Sejarah (Heritage)"
          name="heritage_image_url"
          value={form.heritage_image_url}
          placeholder="Tempel link foto atau unggah dari galeri / Google Drive"
          uploadingField={uploadingField}
          onChange={onChange}
          onUpload={handleFastUpload}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Subjudul Sejarah (Indonesia)
            </label>
            <input
              type="text"
              name="heritage_subtitle"
              value={form.heritage_subtitle || ""}
              onChange={onChange}
              placeholder="✦ Sejarah & Dedikasi ✦"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Subjudul Sejarah (English)
            </label>
            <input
              type="text"
              name="heritage_subtitle_en"
              value={form.heritage_subtitle_en || ""}
              onChange={onChange}
              placeholder="✦ Heritage & Dedication ✦"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Sejarah (Indonesia)
            </label>
            <input
              type="text"
              name="heritage_title"
              value={form.heritage_title || ""}
              onChange={onChange}
              placeholder="Menjaga Tradisi, Memahat Cita Rasa"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Sejarah (English)
            </label>
            <input
              type="text"
              name="heritage_title_en"
              value={form.heritage_title_en || ""}
              onChange={onChange}
              placeholder="Honoring Tradition, Crafting Flavor"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi Sejarah (Indonesia)
            </label>
            <textarea
              rows={3}
              name="heritage_desc"
              value={form.heritage_desc || ""}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi Sejarah (English)
            </label>
            <textarea
              rows={3}
              name="heritage_desc_en"
              value={form.heritage_desc_en || ""}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Kutipan / Quote (Indonesia)
            </label>
            <textarea
              rows={2}
              name="quote_text"
              value={form.quote_text || ""}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Kutipan / Quote (English)
            </label>
            <textarea
              rows={2}
              name="quote_text_en"
              value={form.quote_text_en || ""}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Sumber / Penulis Kutipan (Indonesia)
            </label>
            <input
              type="text"
              name="quote_author"
              value={form.quote_author || ""}
              onChange={onChange}
              placeholder="— SURYA SNACK"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Sumber / Penulis Kutipan (English)
            </label>
            <input
              type="text"
              name="quote_author_en"
              value={form.quote_author_en || ""}
              onChange={onChange}
              placeholder="— SURYA SNACK"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>
      </div>

      {/* 3. Kelola Komitmen Kualitas Kami (4 Pilar) */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#6E1423] border-b border-[#6E1423]/15 pb-2">
          3. Kelola Komitmen Kualitas Kami (4 Pilar)
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((item, idx) => (
            <div
              key={item.icon || idx}
              className="p-4 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[#6E1423]">
                Pilar ke-{idx + 1} ({item.icon || "pilar"})
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Judul Pilar (ID)
                  </label>
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) =>
                      handleFeatureFieldChange(idx, "title", e.target.value)
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Judul Pilar (EN)
                  </label>
                  <input
                    type="text"
                    value={item.title_en || ""}
                    onChange={(e) =>
                      handleFeatureFieldChange(idx, "title_en", e.target.value)
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Deskripsi (ID)
                  </label>
                  <textarea
                    rows={3}
                    value={item.desc || ""}
                    onChange={(e) =>
                      handleFeatureFieldChange(idx, "desc", e.target.value)
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Deskripsi (EN)
                  </label>
                  <textarea
                    rows={3}
                    value={item.desc_en || ""}
                    onChange={(e) =>
                      handleFeatureFieldChange(idx, "desc_en", e.target.value)
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}