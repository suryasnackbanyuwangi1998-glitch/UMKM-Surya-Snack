// src/components/LanguageToggle.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageToggleProps {
  isScrolled?: boolean;
  isHomePage?: boolean;
}

export default function LanguageToggle({ isScrolled = true, isHomePage = true }: LanguageToggleProps) {
  const { lang, setLang } = useLanguage();

  // Menentukan warna tombol agar selaras dengan menu Navbar (Beranda, Produk, dll)
  // Jika di beranda dan belum di-scroll -> warna putih transparan & teks putih
  // Jika sudah di-scroll atau di halaman lain -> warna abu-abu terang & teks gelap/hitam
  const isDarkTheme = isHomePage && !isScrolled;

  return (
    <div
      className={`flex items-center rounded-full p-0.5 text-xs font-bold font-sans transition-colors ${
        isDarkTheme
          ? "bg-black/30 border border-white/30 text-white"
          : "bg-gray-100 border border-gray-200 text-gray-800"
      }`}
    >
      <button
        onClick={() => setLang("id")}
        className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
          lang === "id"
            ? "bg-[#5c0f1c] text-white shadow-sm"
            : isDarkTheme
            ? "text-white/80 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
          lang === "en"
            ? "bg-[#5c0f1c] text-white shadow-sm"
            : isDarkTheme
            ? "text-white/80 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        EN
      </button>
    </div>
  );
}