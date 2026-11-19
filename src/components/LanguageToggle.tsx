// src/components/LanguageToggle.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageToggleProps {
  isScrolled?: boolean;
  isHomePage?: boolean;
}

export default function LanguageToggle({
  isScrolled = true,
  isHomePage = true,
}: LanguageToggleProps) {
  const { lang, setLang } = useLanguage();

  const isDarkTheme = isHomePage && !isScrolled;

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`inline-flex shrink-0 items-center rounded-full p-0.5 text-xs font-bold font-sans transition-colors ${
        isDarkTheme
          ? "bg-black/35 border border-white/35 text-white"
          : "bg-gray-100 border border-gray-200 text-gray-800"
      }`}
    >
      <button
        type="button"
        onClick={() => setLang("id")}
        aria-pressed={lang === "id"}
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
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
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