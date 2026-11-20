// src/components/admin/pengaturan/TabTentangKami.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLanguage,
  faSpinner,
  faStore,
  faChartColumn,
  faClockRotateLeft,
  faBullseye,
  faListCheck,
  faBullhorn,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import SettingsImageField from "./SettingsImageField";

const DEFAULTS_ABOUT = {
  subtitle: "★ EST. 1998 ★ TENTANG SURYA SNACK",
  subtitle_en: "★ EST. 1998 ★ ABOUT SURYA SNACK",
  title: "Menjaga Resep Leluhur, Menghadirkan Kehangatan Banyuwangi",
  title_en: "Preserving Ancestral Recipes, Bringing Banyuwangi Warmth",
  description:
    "Berawal dari dapur sederhana di Banyuwangi pada tahun 1998, kami mendedikasikan diri untuk menghadirkan camilan tradisional berkualitas tinggi dengan resep pusaka leluhur.",
  description_en:
    "Starting from a humble kitchen in Banyuwangi in 1998, we are dedicated to bringing high-quality traditional snacks with ancestral heritage recipes.",
  vision_text:
    "Menjadi pusat oleh-oleh khas Banyuwangi terdepan dan terpercaya dengan menjunjung tinggi kualitas rasa tradisional serta kearifan lokal.",
  vision_text_en:
    "To be the leading and trusted Banyuwangi souvenir center by upholding traditional taste quality and local wisdom.",
  about_image: "/foto-depan.jpeg",
  photo_badge: "SEJAK 1998",
  photo_badge_en: "SINCE 1998",
  photo_quote:
    "Konsistensi rasa otentik adalah resep utama kami bertahan hingga hari ini.",
  photo_quote_en:
    "Authentic taste consistency is our main recipe for surviving until today.",
  // Bagian 6: Banner Ajakan (CTA Bawah)
  cta_badge: "CITA RASA KHAS BANYUWANGI",
  cta_badge_en: "AUTHENTIC BANYUWANGI FLAVORS",
  cta_title: "Siap Menikmati Kelezatan Produk Kami?",
  cta_title_en: "Ready to Enjoy the Deliciousness of Our Products?",
  cta_desc:
    "Temukan berbagai pilihan camilan renyah dan gurih berkualitas tinggi yang siap melengkapi momen santai dan kebersamaan Anda.",
  cta_desc_en:
    "Discover a wide selection of crispy and savory high-quality snacks ready to complement your relaxing moments and togetherness.",
  cta_btn_catalog: "JELAJAHI KATALOG",
  cta_btn_catalog_en: "EXPLORE CATALOG",
  cta_btn_whatsapp: "CHAT ADMIN",
  cta_btn_whatsapp_en: "CHAT ADMIN",
};

const DEFAULT_STATS = [
  {
    label: "BERDIRI SEJAK",
    label_en: "ESTABLISHED",
    value: "1998",
    desc: "Dari dapur kecil di belakang rumah.",
    desc_en: "From a small kitchen in the backyard.",
    tone: "dark",
  },
  {
    label: "RESMI & LEGAL",
    label_en: "OFFICIAL & LEGAL",
    value: "2000",
    desc: "Toko depan rumah & sertifikat lengkap.",
    desc_en: "Front store & complete permits.",
    tone: "light",
  },
  {
    label: "TAHUN PENGALAMAN",
    label_en: "YEARS OF EXPERIENCE",
    value: "25+",
    desc: "Resep dijaga lintas generasi.",
    desc_en: "Recipes passed across generations.",
    tone: "light",
  },
  {
    label: "PELANGGAN PUAS",
    label_en: "HAPPY CUSTOMERS",
    value: "10rb+",
    desc: "Dikirim ke berbagai kota di Indonesia.",
    desc_en: "Shipped to various cities across Indonesia.",
    tone: "amber",
  },
];

const DEFAULT_TIMELINE = [
  {
    year: "1998",
    year_en: "1998",
    title: "Awal yang Sederhana",
    title_en: "A Humble Beginning",
    desc: "Surya Snack dirintis sebagai usaha rumahan berskala kecil di bagian belakang rumah.",
    desc_en:
      "Surya Snack started as a small-scale home business in the backyard.",
  },
  {
    year: "2000",
    year_en: "2000",
    title: "Toko Resmi & Perizinan Lengkap",
    title_en: "Official Store & Licensing",
    desc: "Langkah besar diambil dengan membuka toko di bagian depan rumah.",
    desc_en: "A big step taken by opening a store in front of the house.",
  },
  {
    year: "SEKARANG",
    year_en: "NOW",
    title: "Tumbuh di Era Digital",
    title_en: "Growing in the Digital Era",
    desc: "Kini Surya Snack melayani pemesanan online dan pengiriman ke berbagai kota.",
    desc_en:
      "Now Surya Snack serves online orders and nationwide shipping.",
  },
];

const DEFAULT_PILAR_MISI = [
  {
    num: "01",
    title: "Kualitas Rasa",
    title_en: "Taste Quality",
    desc: "Mengembangkan resep otentik dengan prinsip produksi tradisional untuk menghadirkan cita rasa terbaik.",
    desc_en:
      "Developing authentic recipes with traditional production principles to deliver the best taste.",
  },
  {
    num: "02",
    title: "Mutu & Kualitas",
    title_en: "Quality & Mutu",
    desc: "Menggunakan bahan baku alami pilihan tanpa pengawet tambahan agar produk aman dikonsumsi.",
    desc_en:
      "Using selected natural raw materials without artificial preservatives for safe consumption.",
  },
  {
    num: "03",
    title: "Pemberdayaan Lokal",
    title_en: "Local Empowerment",
    desc: "Bermitra dengan UMKM dan petani lokal Banyuwangi dalam proses produksi untuk tumbuh bersama.",
    desc_en:
      "Partnering with local MSMEs and farmers in Banyuwangi to grow together.",
  },
  {
    num: "04",
    title: "Kepuasan Pelanggan",
    title_en: "Customer Satisfaction",
    desc: "Menghadirkan pelayanan hangat dan produk segar dengan konsistensi kualitas yang selalu terjaga.",
    desc_en:
      "Providing warm service and fresh products with consistent quality.",
  },
];

const DEFAULT_NILAI = [
  {
    title: "Integritas & Kejujuran",
    title_en: "Integrity & Honesty",
    desc: "Transparansi penuh dalam setiap bahan baku dan proses pembuatan produk.",
    desc_en:
      "Full transparency in every raw material and product manufacturing process.",
  },
  {
    title: "Komitmen Mutu",
    title_en: "Quality Commitment",
    desc: "Konsistensi rasa otentik yang selalu dijaga dari generasi ke generasi.",
    desc_en:
      "Authentic taste consistency preserved from generation to generation.",
  },
  {
    title: "Keberlanjutan",
    title_en: "Sustainability",
    desc: "Kepedulian terhadap lingkungan dan kolaborasi erat bersama masyarakat lokal.",
    desc_en:
      "Environmental care and close collaboration with local communities.",
  },
];

const TRANSLATE_TIMEOUT_MS = 6000;
const aboutTranslateCache = new Map();

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

export default function TabTentangKami({
  form = {},
  uploadingField,
  onChange,
  onBatchChange,
  onUpload,
  onArrayChange,
  onAddArrayItem,
  onRemoveArrayItem,
}) {
  const [translating, setTranslating] = useState(false);
  const [translateMsg, setTranslateMsg] = useState(null);
  const abortRef = useRef(null);
  const initializedRef = useRef(false);

  const stats =
    Array.isArray(form.stats_items) && form.stats_items.length > 0
      ? form.stats_items
      : DEFAULT_STATS;

  const timeline =
    Array.isArray(form.timeline) && form.timeline.length > 0
      ? form.timeline
      : DEFAULT_TIMELINE;

  const pilarMisi =
    Array.isArray(form.pilar_misi) && form.pilar_misi.length > 0
      ? form.pilar_misi
      : DEFAULT_PILAR_MISI;

  const nilaiItems =
    Array.isArray(form.nilai_items) && form.nilai_items.length > 0
      ? form.nilai_items
      : DEFAULT_NILAI;

  const applyUpdates = (updates) => {
    if (!updates || typeof updates !== "object") return;
    if (typeof onBatchChange === "function") {
      onBatchChange(updates);
      return;
    }
    Object.entries(updates).forEach(([name, value]) => {
      onChange({ target: { name, value } });
    });
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const missingDefaults = {};
    Object.entries(DEFAULTS_ABOUT).forEach(([key, defaultVal]) => {
      if (form[key] === undefined || form[key] === null || form[key] === "") {
        missingDefaults[key] = defaultVal;
      }
    });

    if (!Array.isArray(form.stats_items) || form.stats_items.length === 0) {
      missingDefaults.stats_items = DEFAULT_STATS;
    }
    if (!Array.isArray(form.timeline) || form.timeline.length === 0) {
      missingDefaults.timeline = DEFAULT_TIMELINE;
    }
    if (!Array.isArray(form.pilar_misi) || form.pilar_misi.length === 0) {
      missingDefaults.pilar_misi = DEFAULT_PILAR_MISI;
    }
    if (!Array.isArray(form.nilai_items) || form.nilai_items.length === 0) {
      missingDefaults.nilai_items = DEFAULT_NILAI;
    }

    if (Object.keys(missingDefaults).length > 0) {
      applyUpdates(missingDefaults);
    }

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getVal = (key) =>
    form[key] !== undefined && form[key] !== null
      ? form[key]
      : DEFAULTS_ABOUT[key] || "";

  const handleFastUpload = async (fieldName, file) => {
    if (!file || typeof onUpload !== "function") return;
    const optimizedFile = await compressImageBeforeUpload(file);
    return onUpload(fieldName, optimizedFile);
  };

  const handleItemFieldChange = (fieldName, index, key, value) => {
    if (typeof onArrayChange === "function") {
      onArrayChange(fieldName, index, key, value);
      return;
    }
    const currentList =
      fieldName === "stats_items"
        ? stats
        : fieldName === "timeline"
        ? timeline
        : fieldName === "pilar_misi"
        ? pilarMisi
        : nilaiItems;
    const next = currentList.map((item, idx) =>
      idx === index ? { ...item, [key]: value } : item
    );
    onChange({ target: { name: fieldName, value: next } });
  };

  const handleAddItem = (fieldName, newItem) => {
    if (typeof onAddArrayItem === "function") {
      onAddArrayItem(fieldName, newItem);
      return;
    }
    const currentList =
      fieldName === "stats_items"
        ? stats
        : fieldName === "timeline"
        ? timeline
        : fieldName === "pilar_misi"
        ? pilarMisi
        : nilaiItems;
    onChange({ target: { name: fieldName, value: [...currentList, newItem] } });
  };

  const handleRemoveItem = (fieldName, index) => {
    if (typeof onRemoveArrayItem === "function") {
      onRemoveArrayItem(fieldName, index);
      return;
    }
    const currentList =
      fieldName === "stats_items"
        ? stats
        : fieldName === "timeline"
        ? timeline
        : fieldName === "pilar_misi"
        ? pilarMisi
        : nilaiItems;
    onChange({
      target: {
        name: fieldName,
        value: currentList.filter((_, i) => i !== index),
      },
    });
  };

  const applyTranslations = (tr) => {
    const updates = {};

    [
      "subtitle_en",
      "title_en",
      "description_en",
      "vision_text_en",
      "photo_badge_en",
      "photo_quote_en",
      "cta_badge_en",
      "cta_title_en",
      "cta_desc_en",
      "cta_btn_catalog_en",
      "cta_btn_whatsapp_en",
    ].forEach((fieldName) => {
      if (fieldName in tr) {
        updates[fieldName] = tr[fieldName];
      }
    });

    updates.stats_items = stats.map((item, idx) => ({
      ...item,
      label_en: tr[`stat_${idx}_label_en`] ?? item.label_en ?? "",
      desc_en: tr[`stat_${idx}_desc_en`] ?? item.desc_en ?? "",
    }));

    updates.timeline = timeline.map((item, idx) => ({
      ...item,
      year_en: tr[`tl_${idx}_year_en`] ?? item.year_en ?? item.year ?? "",
      title_en: tr[`tl_${idx}_title_en`] ?? item.title_en ?? "",
      desc_en: tr[`tl_${idx}_desc_en`] ?? item.desc_en ?? "",
    }));

    updates.pilar_misi = pilarMisi.map((item, idx) => ({
      ...item,
      title_en: tr[`misi_${idx}_title_en`] ?? item.title_en ?? "",
      desc_en: tr[`misi_${idx}_desc_en`] ?? item.desc_en ?? "",
    }));

    updates.nilai_items = nilaiItems.map((item, idx) => ({
      ...item,
      title_en: tr[`nilai_${idx}_title_en`] ?? item.title_en ?? "",
      desc_en: tr[`nilai_${idx}_desc_en`] ?? item.desc_en ?? "",
    }));

    applyUpdates(updates);
  };

  const handleAutoTranslate = async () => {
    if (translating) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const dynamicFields = {};

    stats.forEach((item, idx) => {
      dynamicFields[`stat_${idx}_label_en`] = item.label || "";
      dynamicFields[`stat_${idx}_desc_en`] = item.desc || "";
    });

    timeline.forEach((item, idx) => {
      dynamicFields[`tl_${idx}_year_en`] = item.year || "";
      dynamicFields[`tl_${idx}_title_en`] = item.title || "";
      dynamicFields[`tl_${idx}_desc_en`] = item.desc || "";
    });

    pilarMisi.forEach((item, idx) => {
      dynamicFields[`misi_${idx}_title_en`] = item.title || "";
      dynamicFields[`misi_${idx}_desc_en`] = item.desc || "";
    });

    nilaiItems.forEach((item, idx) => {
      dynamicFields[`nilai_${idx}_title_en`] = item.title || "";
      dynamicFields[`nilai_${idx}_desc_en`] = item.desc || "";
    });

    const fieldsPayload = {
      subtitle_en: getVal("subtitle"),
      title_en: getVal("title"),
      description_en: getVal("description"),
      vision_text_en: getVal("vision_text"),
      photo_badge_en: getVal("photo_badge"),
      photo_quote_en: getVal("photo_quote"),
      cta_badge_en: getVal("cta_badge"),
      cta_title_en: getVal("cta_title"),
      cta_desc_en: getVal("cta_desc"),
      cta_btn_catalog_en: getVal("cta_btn_catalog"),
      cta_btn_whatsapp_en: getVal("cta_btn_whatsapp"),
      ...dynamicFields,
    };

    const cacheKey = JSON.stringify(fieldsPayload);
    if (aboutTranslateCache.has(cacheKey)) {
      applyTranslations(aboutTranslateCache.get(cacheKey));
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
        throw new Error(
          result?.error || "Gagal menerjemahkan teks Tentang Kami."
        );
      }

      aboutTranslateCache.set(cacheKey, tr);
      applyTranslations(tr);

      setTranslateMsg({
        type: "success",
        text: "Semua teks Tentang Kami (termasuk Banner Ajakan) berhasil diterjemahkan ke English! Klik Simpan Perubahan untuk menyimpan.",
      });
    } catch (err) {
      if (err?.name === "AbortError") {
        setTranslateMsg({
          type: "error",
          text: "Terjemahan terlalu lama (timeout). Silakan coba lagi.",
        });
      } else {
        console.error("Gagal auto-translate Tentang Kami:", err);
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
      {/* Bar Terjemahan Otomatis */}
      <div className="bg-[#FAF7F0] border border-[#6E1423]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[#6E1423]">
            Terjemahan Otomatis Bahasa Inggris (Tentang Kami)
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Atur konten Bahasa Indonesia, lalu klik Terjemahkan untuk mengisi versi English secara otomatis.
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

      {/* 1. KONTEN UTAMA, FOTO TOKO & VISI */}
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#6E1423]/15">
          <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
            <FontAwesomeIcon icon={faStore} className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#3b0912]">
              1. Konten Teks Utama, Foto Toko &amp; Visi
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Sub Judul / Badge Atas Halaman (ID)
            </label>
            <input
              type="text"
              name="subtitle"
              value={getVal("subtitle")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Sub Judul / Badge Atas Halaman (EN)
            </label>
            <input
              type="text"
              name="subtitle_en"
              value={getVal("subtitle_en")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Utama Halaman (ID)
            </label>
            <input
              type="text"
              name="title"
              value={getVal("title")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Utama Halaman (EN)
            </label>
            <input
              type="text"
              name="title_en"
              value={getVal("title_en")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi / Paragraf Pengantar (ID)
            </label>
            <textarea
              rows={4}
              name="description"
              value={getVal("description")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi / Paragraf Pengantar (EN)
            </label>
            <textarea
              rows={4}
              name="description_en"
              value={getVal("description_en")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <SettingsImageField
          label="Foto Toko Tampak Depan"
          name="about_image"
          value={getVal("about_image")}
          placeholder="/foto-depan.jpeg atau link gambar"
          uploadingField={uploadingField}
          onChange={onChange}
          onUpload={handleFastUpload}
        />

        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Badge di Pojok Foto (ID)
            </label>
            <input
              type="text"
              name="photo_badge"
              value={getVal("photo_badge")}
              onChange={onChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Badge di Pojok Foto (EN)
            </label>
            <input
              type="text"
              name="photo_badge_en"
              value={getVal("photo_badge_en")}
              onChange={onChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Kutipan di Bawah Foto (ID)
            </label>
            <input
              type="text"
              name="photo_quote"
              value={getVal("photo_quote")}
              onChange={onChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Kutipan di Bawah Foto (EN)
            </label>
            <input
              type="text"
              name="photo_quote_en"
              value={getVal("photo_quote_en")}
              onChange={onChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Visi Utama Perusahaan (ID)
            </label>
            <textarea
              rows={3}
              name="vision_text"
              value={getVal("vision_text")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Visi Utama Perusahaan (EN)
            </label>
            <textarea
              rows={3}
              name="vision_text_en"
              value={getVal("vision_text_en")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>
      </div>

      {/* 2. KARTU STATISTIK */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#6E1423]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
              <FontAwesomeIcon icon={faChartColumn} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#3b0912]">
                2. Pengaturan Kartu Statistik
              </h2>
              <p className="text-xs text-gray-500">
                Atur, tambah, atau hapus kartu statistik.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleAddItem("stats_items", {
                label: "",
                label_en: "",
                value: "",
                desc: "",
                desc_en: "",
                tone: "light",
              })
            }
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} /> Tambah Statistik
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5c0f1c] uppercase">
                  Statistik #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("stats_items", idx)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200"
                >
                  <FontAwesomeIcon icon={faTrash} /> Hapus
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Label (ID)
                  </label>
                  <input
                    type="text"
                    value={stat.label || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "stats_items",
                        idx,
                        "label",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Label (EN)
                  </label>
                  <input
                    type="text"
                    value={stat.label_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "stats_items",
                        idx,
                        "label_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Nilai
                  </label>
                  <input
                    type="text"
                    value={stat.value || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "stats_items",
                        idx,
                        "value",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Warna Tema
                  </label>
                  <select
                    value={stat.tone || "light"}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "stats_items",
                        idx,
                        "tone",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  >
                    <option value="light">Putih (Light)</option>
                    <option value="dark">Merah Tua (Dark)</option>
                    <option value="amber">Kuning Emas (Amber)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Keterangan (ID)
                  </label>
                  <input
                    type="text"
                    value={stat.desc || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "stats_items",
                        idx,
                        "desc",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Keterangan (EN)
                  </label>
                  <input
                    type="text"
                    value={stat.desc_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "stats_items",
                        idx,
                        "desc_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TIMELINE SEJARAH */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#6E1423]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
              <FontAwesomeIcon icon={faClockRotateLeft} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#3b0912]">
                3. Jejak Langkah (Timeline)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleAddItem("timeline", {
                year: "",
                year_en: "",
                title: "",
                title_en: "",
                desc: "",
                desc_en: "",
              })
            }
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} /> Tambah Riwayat
          </button>
        </div>

        <div className="space-y-4">
          {timeline.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5c0f1c] uppercase">
                  Timeline #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("timeline", idx)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200"
                >
                  <FontAwesomeIcon icon={faTrash} /> Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Tahun / Periode (ID)
                  </label>
                  <input
                    type="text"
                    value={item.year || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "timeline",
                        idx,
                        "year",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Tahun / Periode (EN)
                  </label>
                  <input
                    type="text"
                    value={item.year_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "timeline",
                        idx,
                        "year_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Judul Peristiwa (ID)
                  </label>
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "timeline",
                        idx,
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Judul Peristiwa (EN)
                  </label>
                  <input
                    type="text"
                    value={item.title_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "timeline",
                        idx,
                        "title_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Deskripsi Lengkap (ID)
                  </label>
                  <textarea
                    rows={2}
                    value={item.desc || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "timeline",
                        idx,
                        "desc",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Deskripsi Lengkap (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={item.desc_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "timeline",
                        idx,
                        "desc_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 4 PILAR MISI */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#6E1423]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
              <FontAwesomeIcon icon={faBullseye} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#3b0912]">
                4. Pengaturan Pilar Misi
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleAddItem("pilar_misi", {
                num: String(pilarMisi.length + 1).padStart(2, "0"),
                title: "",
                title_en: "",
                desc: "",
                desc_en: "",
              })
            }
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} /> Tambah Pilar
          </button>
        </div>

        <div className="space-y-4">
          {pilarMisi.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5c0f1c] uppercase">
                  Pilar #{item.num || String(idx + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("pilar_misi", idx)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200"
                >
                  <FontAwesomeIcon icon={faTrash} /> Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Nomor (Cth: 01)
                  </label>
                  <input
                    type="text"
                    value={item.num || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "pilar_misi",
                        idx,
                        "num",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Judul Pilar (ID)
                  </label>
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "pilar_misi",
                        idx,
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Judul Pilar (EN)
                  </label>
                  <input
                    type="text"
                    value={item.title_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "pilar_misi",
                        idx,
                        "title_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Deskripsi Pilar (ID)
                  </label>
                  <input
                    type="text"
                    value={item.desc || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "pilar_misi",
                        idx,
                        "desc",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Deskripsi Pilar (EN)
                  </label>
                  <input
                    type="text"
                    value={item.desc_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "pilar_misi",
                        idx,
                        "desc_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. NILAI YANG KAMI JAGA */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#6E1423]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
              <FontAwesomeIcon icon={faListCheck} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#3b0912]">
                5. Pengaturan Nilai yang Kami Jaga
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleAddItem("nilai_items", {
                title: "",
                title_en: "",
                desc: "",
                desc_en: "",
              })
            }
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} /> Tambah Nilai
          </button>
        </div>

        <div className="space-y-4">
          {nilaiItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5c0f1c] uppercase">
                  Nilai #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("nilai_items", idx)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200"
                >
                  <FontAwesomeIcon icon={faTrash} /> Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Judul Nilai (ID)
                  </label>
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "nilai_items",
                        idx,
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Judul Nilai (EN)
                  </label>
                  <input
                    type="text"
                    value={item.title_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "nilai_items",
                        idx,
                        "title_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Deskripsi Nilai (ID)
                  </label>
                  <input
                    type="text"
                    value={item.desc || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "nilai_items",
                        idx,
                        "desc",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Deskripsi Nilai (EN)
                  </label>
                  <input
                    type="text"
                    value={item.desc_en || ""}
                    onChange={(e) =>
                      handleItemFieldChange(
                        "nilai_items",
                        idx,
                        "desc_en",
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. BANNER AJAKAN (CTA BAWAH HALAMAN) */}
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#6E1423]/15">
          <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
            <FontAwesomeIcon icon={faBullhorn} className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#3b0912]">
              6. Banner Ajakan (CTA Bawah Halaman)
            </h2>
            <p className="text-xs text-gray-500">
              Atur teks badge, judul ajakan, deskripsi, dan tombol Katalog / Chat Admin di bagian bawah halaman Tentang Kami.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Badge Atas CTA (ID)
            </label>
            <input
              type="text"
              name="cta_badge"
              value={getVal("cta_badge")}
              onChange={onChange}
              placeholder="CITA RASA KHAS BANYUWANGI"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Badge Atas CTA (EN)
            </label>
            <input
              type="text"
              name="cta_badge_en"
              value={getVal("cta_badge_en")}
              onChange={onChange}
              placeholder="AUTHENTIC BANYUWANGI FLAVORS"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Ajakan CTA (ID)
            </label>
            <input
              type="text"
              name="cta_title"
              value={getVal("cta_title")}
              onChange={onChange}
              placeholder="Siap Menikmati Kelezatan Produk Kami?"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Ajakan CTA (EN)
            </label>
            <input
              type="text"
              name="cta_title_en"
              value={getVal("cta_title_en")}
              onChange={onChange}
              placeholder="Ready to Enjoy the Deliciousness of Our Products?"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi CTA (ID)
            </label>
            <textarea
              rows={3}
              name="cta_desc"
              value={getVal("cta_desc")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi CTA (EN)
            </label>
            <textarea
              rows={3}
              name="cta_desc_en"
              value={getVal("cta_desc_en")}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Tombol 1 / Katalog (ID)
            </label>
            <input
              type="text"
              name="cta_btn_catalog"
              value={getVal("cta_btn_catalog")}
              onChange={onChange}
              placeholder="JELAJAHI KATALOG"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Tombol 1 / Katalog (EN)
            </label>
            <input
              type="text"
              name="cta_btn_catalog_en"
              value={getVal("cta_btn_catalog_en")}
              onChange={onChange}
              placeholder="EXPLORE CATALOG"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Tombol 2 / WhatsApp (ID)
            </label>
            <input
              type="text"
              name="cta_btn_whatsapp"
              value={getVal("cta_btn_whatsapp")}
              onChange={onChange}
              placeholder="CHAT ADMIN"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teks Tombol 2 / WhatsApp (EN)
            </label>
            <input
              type="text"
              name="cta_btn_whatsapp_en"
              value={getVal("cta_btn_whatsapp_en")}
              onChange={onChange}
              placeholder="CHAT ADMIN"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}