// src/components/admin/pengaturan/TabProduk.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage, faSpinner } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_CATALOG_FIELDS = {
  catalog_search_title: "Cari Produk",
  catalog_search_title_en: "Search Product",
  catalog_category_title: "Kategori Pilihan",
  catalog_category_title_en: "Categories",
  catalog_all_label: "Semua Produk",
  catalog_all_label_en: "All Products",
  catalog_food_label: "Makanan",
  catalog_food_label_en: "Food",
  catalog_beverage_label: "Minuman",
  catalog_beverage_label_en: "Beverages",
  catalog_empty_title: "Produk Tidak Ditemukan",
  catalog_empty_title_en: "Products Not Found",
  catalog_empty_desc:
    "Maaf, tidak ada produk makanan atau minuman yang cocok dengan pencarian Anda.",
  catalog_empty_desc_en:
    "Sorry, no food or beverage products match your search criteria.",
  catalog_empty_btn: "Tampilkan Semua Produk",
  catalog_empty_btn_en: "Show All Products",
};

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
    if (typeof val === "string" && val.trim() !== "") {
      cleaned[key] = val.trim();
    }
  });

  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

export default function TabProduk({ form = {}, onChange, onBatchChange }) {
  const [translating, setTranslating] = useState(false);
  const [translateMsg, setTranslateMsg] = useState(null);
  const abortRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const missingEntries = Object.entries(DEFAULT_CATALOG_FIELDS).filter(
      ([key]) => form[key] === undefined || form[key] === null || form[key] === ""
    );

    if (missingEntries.length === 0) return;

    if (typeof onBatchChange === "function") {
      onBatchChange(Object.fromEntries(missingEntries));
      return;
    }

    if (typeof onChange === "function") {
      missingEntries.forEach(([key, defaultVal]) => {
        onChange({
          target: {
            name: key,
            value: defaultVal,
          },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const applyTranslationsToForm = (translatedObj) => {
    if (typeof onBatchChange === "function") {
      onBatchChange(translatedObj);
      return;
    }

    if (typeof onChange === "function") {
      Object.entries(translatedObj).forEach(([fieldName, translatedText]) => {
        onChange({
          target: {
            name: fieldName,
            value: translatedText,
          },
        });
      });
    }
  };

  const handleAutoTranslate = async () => {
    if (translating) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const fieldsToTranslate = {
      catalog_search_title_en:
        form.catalog_search_title || DEFAULT_CATALOG_FIELDS.catalog_search_title,
      catalog_category_title_en:
        form.catalog_category_title || DEFAULT_CATALOG_FIELDS.catalog_category_title,
      catalog_all_label_en:
        form.catalog_all_label || DEFAULT_CATALOG_FIELDS.catalog_all_label,
      catalog_food_label_en:
        form.catalog_food_label || DEFAULT_CATALOG_FIELDS.catalog_food_label,
      catalog_beverage_label_en:
        form.catalog_beverage_label ||
        DEFAULT_CATALOG_FIELDS.catalog_beverage_label,
      catalog_empty_title_en:
        form.catalog_empty_title || DEFAULT_CATALOG_FIELDS.catalog_empty_title,
      catalog_empty_desc_en:
        form.catalog_empty_desc || DEFAULT_CATALOG_FIELDS.catalog_empty_desc,
      catalog_empty_btn_en:
        form.catalog_empty_btn || DEFAULT_CATALOG_FIELDS.catalog_empty_btn,
    };

    const cacheKey = JSON.stringify(fieldsToTranslate);
    if (translateCache.has(cacheKey)) {
      applyTranslationsToForm(translateCache.get(cacheKey));
      setTranslateMsg({
        type: "success",
        text: "Diterjemahkan instan dari cache! Klik Simpan Pengaturan untuk menyimpan.",
      });
      return;
    }

    setTranslating(true);
    setTranslateMsg(null);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sourceLang: "id",
          targetLang: "en",
          fields: fieldsToTranslate,
        }),
      });

      const result = await response.json().catch(() => ({}));
      const translatedMap = extractTranslatedMap(result);

      if (!response.ok || result?.success === false || !translatedMap) {
        throw new Error(result?.error || "Gagal menerjemahkan konten katalog.");
      }

      translateCache.set(cacheKey, translatedMap);
      applyTranslationsToForm(translatedMap);

      setTranslateMsg({
        type: "success",
        text: "Label kategori & teks katalog versi English berhasil diterjemahkan! Klik Simpan Pengaturan untuk menyimpan.",
      });
    } catch (err) {
      if (err?.name === "AbortError") {
        setTranslateMsg({
          type: "error",
          text: "Terjemahan terlalu lama (timeout). Coba lagi atau isi manual kolom English.",
        });
      } else {
        console.error("Gagal auto-translate katalog:", err);
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
    <div className="space-y-6">
      {/* Bar Terjemahan Otomatis */}
      <div className="bg-[#FAF7F0] border border-[#6E1423]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[#6E1423]">
            Pengaturan Pilihan Kategori Produk
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Atur label kategori (Makanan &amp; Minuman) lalu klik Terjemahkan untuk mengisi versi English secara otomatis.
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

      {/* Daftar Pilihan Kategori */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#6E1423] border-b border-[#6E1423]/15 pb-2">
          Pilihan Kategori Katalog
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Semua Produk (Indonesia)
            </label>
            <input
              type="text"
              name="catalog_all_label"
              value={form.catalog_all_label ?? DEFAULT_CATALOG_FIELDS.catalog_all_label}
              onChange={onChange}
              placeholder="Semua Produk"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Semua Produk (English)
            </label>
            <input
              type="text"
              name="catalog_all_label_en"
              value={
                form.catalog_all_label_en ?? DEFAULT_CATALOG_FIELDS.catalog_all_label_en
              }
              onChange={onChange}
              placeholder="All Products"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Kategori Makanan (Indonesia)
            </label>
            <input
              type="text"
              name="catalog_food_label"
              value={form.catalog_food_label ?? DEFAULT_CATALOG_FIELDS.catalog_food_label}
              onChange={onChange}
              placeholder="Makanan"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Kategori Makanan (English)
            </label>
            <input
              type="text"
              name="catalog_food_label_en"
              value={
                form.catalog_food_label_en ?? DEFAULT_CATALOG_FIELDS.catalog_food_label_en
              }
              onChange={onChange}
              placeholder="Food"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Kategori Minuman (Indonesia)
            </label>
            <input
              type="text"
              name="catalog_beverage_label"
              value={
                form.catalog_beverage_label ??
                DEFAULT_CATALOG_FIELDS.catalog_beverage_label
              }
              onChange={onChange}
              placeholder="Minuman"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Kategori Minuman (English)
            </label>
            <input
              type="text"
              name="catalog_beverage_label_en"
              value={
                form.catalog_beverage_label_en ??
                DEFAULT_CATALOG_FIELDS.catalog_beverage_label_en
              }
              onChange={onChange}
              placeholder="Beverages"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>
      </div>

      {/* Label Sidebar & Pencarian */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#6E1423] border-b border-[#6E1423]/15 pb-2">
          Label Sidebar &amp; Pencarian
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Pencarian (Indonesia)
            </label>
            <input
              type="text"
              name="catalog_search_title"
              value={
                form.catalog_search_title ??
                DEFAULT_CATALOG_FIELDS.catalog_search_title
              }
              onChange={onChange}
              placeholder="Cari Produk"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Pencarian (English)
            </label>
            <input
              type="text"
              name="catalog_search_title_en"
              value={
                form.catalog_search_title_en ??
                DEFAULT_CATALOG_FIELDS.catalog_search_title_en
              }
              onChange={onChange}
              placeholder="Search Product"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Daftar Kategori (Indonesia)
            </label>
            <input
              type="text"
              name="catalog_category_title"
              value={
                form.catalog_category_title ??
                DEFAULT_CATALOG_FIELDS.catalog_category_title
              }
              onChange={onChange}
              placeholder="Kategori Pilihan"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Daftar Kategori (English)
            </label>
            <input
              type="text"
              name="catalog_category_title_en"
              value={
                form.catalog_category_title_en ??
                DEFAULT_CATALOG_FIELDS.catalog_category_title_en
              }
              onChange={onChange}
              placeholder="Categories"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>
      </div>

      {/* Pesan Saat Produk Tidak Ditemukan */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#6E1423] border-b border-[#6E1423]/15 pb-2">
          Pesan Saat Produk Tidak Ditemukan
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Kosong (Indonesia)
            </label>
            <input
              type="text"
              name="catalog_empty_title"
              value={
                form.catalog_empty_title ?? DEFAULT_CATALOG_FIELDS.catalog_empty_title
              }
              onChange={onChange}
              placeholder="Produk Tidak Ditemukan"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Judul Kosong (English)
            </label>
            <input
              type="text"
              name="catalog_empty_title_en"
              value={
                form.catalog_empty_title_en ??
                DEFAULT_CATALOG_FIELDS.catalog_empty_title_en
              }
              onChange={onChange}
              placeholder="Products Not Found"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi Kosong (Indonesia)
            </label>
            <textarea
              rows={2}
              name="catalog_empty_desc"
              value={
                form.catalog_empty_desc ?? DEFAULT_CATALOG_FIELDS.catalog_empty_desc
              }
              onChange={onChange}
              placeholder="Maaf, tidak ada produk makanan atau minuman yang cocok dengan pencarian Anda."
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deskripsi Kosong (English)
            </label>
            <textarea
              rows={2}
              name="catalog_empty_desc_en"
              value={
                form.catalog_empty_desc_en ??
                DEFAULT_CATALOG_FIELDS.catalog_empty_desc_en
              }
              onChange={onChange}
              placeholder="Sorry, no food or beverage products match your search criteria."
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tombol Reset Kosong (Indonesia)
            </label>
            <input
              type="text"
              name="catalog_empty_btn"
              value={form.catalog_empty_btn ?? DEFAULT_CATALOG_FIELDS.catalog_empty_btn}
              onChange={onChange}
              placeholder="Tampilkan Semua Produk"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tombol Reset Kosong (English)
            </label>
            <input
              type="text"
              name="catalog_empty_btn_en"
              value={
                form.catalog_empty_btn_en ?? DEFAULT_CATALOG_FIELDS.catalog_empty_btn_en
              }
              onChange={onChange}
              placeholder="Show All Products"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6E1423]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}