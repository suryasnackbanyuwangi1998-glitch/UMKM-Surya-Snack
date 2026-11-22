// src/components/HomeFeaturesSection.tsx
"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faSeedling,
  faFireFlameCurved,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeFeaturesSection() {
  const { t, lang } = useLanguage();

  const features = [
    {
      num: "01",
      icon: faAward,
      title: t("feat1Title"),
      desc: t("feat1Desc"),
    },
    {
      num: "02",
      icon: faSeedling,
      title: t("feat2Title"),
      desc: t("feat2Desc"),
    },
    {
      num: "03",
      icon: faFireFlameCurved,
      title: t("feat3Title"),
      desc: t("feat3Desc"),
    },
    {
      num: "04",
      icon: faHeadset,
      title: t("feat4Title"),
      desc: t("feat4Desc"),
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#EFE6D5]/70 border-y border-[#5A0A14]/12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* SISI KIRI: JUDUL EDITORIAL STICKY */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <span className="inline-flex items-center gap-2 text-[#9A5D0A] text-[11px] font-bold tracking-[0.26em] uppercase font-sans">
              <span className="w-2 h-2 rounded-full bg-[#5A0A14]" />
              {t("featureTag")}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#5A0A14] leading-[1.1] tracking-tight">
              {t("featureTitle")}
            </h2>
            <div className="w-14 h-0.5 bg-[#5A0A14]/30 rounded-full" />
            <p className="text-xs sm:text-sm font-sans text-[#5f524a] leading-relaxed pt-1">
              {lang === "en"
                ? "Every batch is prepared with selected local ingredients from Banyuwangi to preserve authentic flavor and crunch."
                : "Setiap kemasan diolah dari bahan pilihan lokal Banyuwangi demi menjaga keaslian cita rasa dan kerenyahan di setiap gigitan."}
            </p>
          </div>

          {/* SISI KANAN: DAFTAR KEUNGGULAN BERNOMOR (EDITORIAL LIST) */}
          <div className="lg:col-span-7 divide-y divide-[#5A0A14]/15 border-y border-[#5A0A14]/15">
            {features.map((item, index) => (
              <div
                key={index}
                className="group py-6 sm:py-7 flex items-start gap-4 sm:gap-6 transition-colors"
              >
                {/* Nomor Urut + Ikon */}
                <div className="flex items-center gap-3 shrink-0 pt-0.5">
                  <span className="font-serif italic text-sm font-bold text-[#9A5D0A]">
                    {item.num}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF7F0] group-hover:bg-[#5A0A14] text-[#5A0A14] group-hover:text-amber-200 border border-[#5A0A14]/20 flex items-center justify-center text-base transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                </div>

                {/* Judul & Deskripsi */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#5A0A14] group-hover:text-[#9A5D0A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#5f524a] font-sans text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}