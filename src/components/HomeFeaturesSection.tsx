// src/components/HomeFeaturesSection.tsx
"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faSeedling, faFireFlameCurved, faHeadset } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeFeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: faAward,
      title: t('feat1Title'),
      desc: t('feat1Desc'),
    },
    {
      icon: faSeedling,
      title: t('feat2Title'),
      desc: t('feat2Desc'),
    },
    {
      icon: faFireFlameCurved,
      title: t('feat3Title'),
      desc: t('feat3Desc'),
    },
    {
      icon: faHeadset,
      title: t('feat4Title'),
      desc: t('feat4Desc'),
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF7F0] border-y border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#5c0f1c] text-xs font-bold tracking-[0.3em] uppercase font-sans">
            {t('featureTag')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#3b0912] tracking-tight">
            {t('featureTitle')}
          </h2>
          <div className="w-24 h-px bg-amber-500/50 mx-auto pt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-amber-900/15 p-8 rounded-3xl shadow-sm hover:shadow-md transition space-y-4 text-center flex flex-col items-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#3b0912] text-amber-300 flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#3b0912]">
                {item.title}
              </h3>
              <p className="text-gray-600 font-sans text-xs sm:text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}