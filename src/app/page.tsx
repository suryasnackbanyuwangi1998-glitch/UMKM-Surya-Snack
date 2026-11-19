// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRight,
  faQuoteLeft,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import ProductCard from '@/components/ProductCard';
import PromoPopupModal from '@/components/PromoPopupModal';
import HomeFeaturesSection from '@/components/HomeFeaturesSection';
import { getFeaturedProducts } from '@/lib/products';
import { supabase } from '@/lib/supabase';
import { useStoreContact } from '@/context/ContactProvider';
import { useLanguage } from '@/context/LanguageContext';
import type { Product } from '@/types';

const DEFAULT_HERITAGE_IMAGE =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600";

const DEFAULT_HERO_BG_IMAGE = "/hero-background.jpg";

const DEFAULTS = {
  id: {
    storeLabel: "Oleh-Oleh Khas Banyuwangi",
    heroTitle: "Cita Rasa Legendaris Khas Banyuwangi",
    heroDesc:
      "Mengangkat kelezatan resep pusaka leluhur tanah Blambangan, disajikan khusus dalam balutan kualitas artisan yang renyah dan penuh kenangan.",
    quoteText:
      "Resep boleh diwariskan, namun ketulusan rasa adalah rahasia yang tidak pernah berubah sejak 1998.",
    quoteAuthor: "— SURYA SNACK",
    heritageTitle: "Menjaga Tradisi, Memahat Cita Rasa",
    heritageSubtitle: "✦ Sejarah & Dedikasi ✦",
    heritageDesc:
      "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
  },
  en: {
    storeLabel: "Authentic Banyuwangi Delicacies",
    heroTitle: "Timeless Taste of Banyuwangi",
    heroDesc:
      "Bringing heritage recipes from Blambangan to life with artisan quality that is crispy and full of nostalgia.",
    quoteText:
      "Recipes may be passed down, yet sincerity of taste is the secret that has never changed since 1998.",
    quoteAuthor: "— SURYA SNACK",
    heritageTitle: "Honoring Tradition, Crafting Flavor",
    heritageSubtitle: "✦ Heritage & Dedication ✦",
    heritageDesc:
      "Starting from a home kitchen in Banyuwangi, Surya Snack grew by holding firmly to the authenticity of ancestral recipes.",
  },
};

function normalizeImageUrl(url?: string | null, fallback: string = DEFAULT_HERITAGE_IMAGE): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }

  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }

  const driveOpenMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && driveOpenMatch && driveOpenMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  return fallback;
}

export default function HomePage() {
  const { getWaLink } = useStoreContact();
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSettings, setStoreSettings] = useState<Record<string, any> | null>(null);

  const [storeLabel, setStoreLabel] = useState<string>(DEFAULTS.id.storeLabel);
  const [heroData, setHeroData] = useState({
    title: DEFAULTS.id.heroTitle,
    desc: DEFAULTS.id.heroDesc,
    bgUrl: DEFAULT_HERO_BG_IMAGE,
  });
  const [quoteData, setQuoteData] = useState({
    text: DEFAULTS.id.quoteText,
    author: DEFAULTS.id.quoteAuthor,
  });
  const [heritage, setHeritage] = useState({
    title: DEFAULTS.id.heritageTitle,
    subtitle: DEFAULTS.id.heritageSubtitle,
    desc: DEFAULTS.id.heritageDesc,
    image_url: DEFAULT_HERITAGE_IMAGE,
  });

  const syncContentByLanguage = useCallback(
    (currentLang: 'id' | 'en', dbData: Record<string, any> | null) => {
      const resolvedHeritageUrl = normalizeImageUrl(
        dbData && dbData.heritage_image_url,
        DEFAULT_HERITAGE_IMAGE
      );
      const resolvedHeroBgUrl = normalizeImageUrl(
        (dbData && (dbData.hero_image_url || dbData.hero_bg_url)) || DEFAULT_HERO_BG_IMAGE,
        DEFAULT_HERO_BG_IMAGE
      );

      if (currentLang === 'en') {
        const en = DEFAULTS.en;
        setStoreLabel((dbData && dbData.store_label_en) || en.storeLabel);
        setHeroData({
          title: (dbData && dbData.hero_title_en) || en.heroTitle,
          desc: (dbData && dbData.hero_desc_en) || en.heroDesc,
          bgUrl: resolvedHeroBgUrl,
        });
        setQuoteData({
          text: (dbData && dbData.quote_text_en) || en.quoteText,
          author: (dbData && dbData.quote_author_en) || en.quoteAuthor,
        });
        setHeritage({
          title: (dbData && dbData.heritage_title_en) || en.heritageTitle,
          subtitle: (dbData && dbData.heritage_subtitle_en) || en.heritageSubtitle,
          desc: (dbData && dbData.heritage_desc_en) || en.heritageDesc,
          image_url: resolvedHeritageUrl,
        });
        return;
      }

      const id = DEFAULTS.id;
      setStoreLabel((dbData && dbData.store_label) || id.storeLabel);
      setHeroData({
        title: (dbData && dbData.hero_title) || id.heroTitle,
        desc: (dbData && dbData.hero_desc) || id.heroDesc,
        bgUrl: resolvedHeroBgUrl,
      });
      setQuoteData({
        text: (dbData && dbData.quote_text) || id.quoteText,
        author: (dbData && dbData.quote_author) || id.quoteAuthor,
      });
      setHeritage({
        title: (dbData && dbData.heritage_title) || id.heritageTitle,
        subtitle: (dbData && dbData.heritage_subtitle) || id.heritageSubtitle,
        desc: (dbData && dbData.heritage_desc) || id.heritageDesc,
        image_url: resolvedHeritageUrl,
      });
    },
    []
  );

  useEffect(() => {
    syncContentByLanguage(lang, storeSettings);
  }, [lang, storeSettings, syncContentByLanguage]);

  useEffect(() => {
    let isMounted = true;

    async function loadStoreSettings() {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("*")
          .eq("id", "main")
          .maybeSingle();

        if (!error && data && isMounted) {
          setStoreSettings(data);
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan toko di beranda:", err);
      }
    }

    loadStoreSettings();

    const channel = supabase
      .channel("store-settings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "store_settings",
          filter: "id=eq.main",
        },
        (payload) => {
          if (payload.new && isMounted) {
            setStoreSettings(payload.new as Record<string, any>);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const prod = await getFeaturedProducts(10);
        if (prod) {
          setProducts(prod);
        }
      } catch (err) {
        console.error("Gagal memuat produk beranda:", err);
      }
    }
    fetchData();
  }, []);

  const resolvedHeritageUrl = normalizeImageUrl(heritage.image_url, DEFAULT_HERITAGE_IMAGE);
  const hasHeritageSplit =
    heritage.title.includes(',') ||
    heritage.title.includes('–') ||
    heritage.title.includes('Tradisi') ||
    heritage.title.includes('Tradition');
  const heritageParts = heritage.title.split(/[,–]/);

  const heroWords = heroData.title.trim().split(/\s+/);
  const heroPrimary = heroWords.slice(0, Math.ceil(heroWords.length / 2)).join(' ');
  const heroAccent = heroWords.slice(Math.ceil(heroWords.length / 2)).join(' ');

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2B211B] font-serif selection:bg-[#6E1423] selection:text-amber-100 antialiased overflow-x-hidden">

      {/* ================= 1. FULL-BLEED HERO DENGAN BLUR HALUS & TULISAN MARUN-EMAS ================= */}
      <section className="relative w-full min-h-screen flex items-center border-b border-[#6E1423]/15 bg-[#23140e] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            key={heroData.bgUrl}
            src={heroData.bgUrl}
            alt="Hero Background Surya Snack"
            fill
            priority
            loading="eager"
            unoptimized
            className="object-cover object-right sm:object-center brightness-[0.9] contrast-105"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#F5EFE6]/96 via-[#F5EFE6]/82 to-transparent sm:via-[#F5EFE6]/68 lg:w-[74%] backdrop-blur-[3px]"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, black 55%, transparent 100%)',
            maskImage: 'linear-gradient(to right, black 55%, transparent 100%)',
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#F5EFE6]/65 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-16">
          <div className="max-w-xl lg:max-w-2xl space-y-6">
            <p className="text-[11px] font-sans font-bold uppercase tracking-[0.26em] text-[#6E1423]">
              {storeLabel}
            </p>

            <h1 className="text-4xl sm:text-6xl lg:text-[4.35rem] font-serif font-bold leading-[1.05] tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              <span className="text-[#6E1423]">{heroPrimary}</span>
              {heroAccent ? (
                <>
                  {' '}
                  <span className="text-[#B87614] underline decoration-[#6E1423]/30 decoration-2 underline-offset-4">
                    {heroAccent}
                  </span>
                </>
              ) : null}
            </h1>

            <p className="max-w-lg text-[#5C0F1C] font-sans text-sm sm:text-base font-medium leading-relaxed">
              {heroData.desc}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-sans">
              <Link
                href="/katalog"
                className="group inline-flex items-center gap-3 bg-[#6E1423] hover:bg-[#5C0F1C] text-amber-300 font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-md cursor-pointer border border-amber-400/50"
              >
                <span>{t('exploreCatalog') || 'Jelajahi Katalog'}</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="w-3.5 h-3.5 text-amber-300 transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href={getWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-[#6E1423] hover:text-[#B87614] font-bold px-3 py-2 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span className="w-9 h-9 rounded-full border border-[#6E1423]/45 bg-[#F5EFE6]/95 group-hover:bg-white flex items-center justify-center transition shadow-xs">
                  <FontAwesomeIcon icon={faPlay} className="w-2.5 h-2.5 ml-0.5 text-[#B87614]" />
                </span>
                <span>{t('contactStore') || 'Hubungi Toko'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. FEATURED DELICACIES ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.26em] text-[#6E1423] block">
              {lang === 'en' ? 'Our Selection' : 'Pilihan Unggulan'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#6E1423] tracking-tight">
              {lang === 'en' ? 'Featured delicacies.' : 'Camilan unggulan.'}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 max-w-md font-sans">
            <p className="text-xs sm:text-sm text-[#5f524a] leading-relaxed">
              {lang === 'en'
                ? 'Crafted with care using authentic recipes. Swipe sideways to explore more treats.'
                : 'Diolah penuh ketulusan dari resep warisan. Geser ke samping untuk melihat lainnya.'}
            </p>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF7F0] text-[#6E1423] border border-[#6E1423]/25 font-semibold px-5 py-2.5 rounded-full text-xs whitespace-nowrap transition cursor-pointer shrink-0"
            >
              <span>{lang === 'en' ? 'View Full Catalog' : 'Lihat Katalog'}</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 px-6 text-[#6b5a50] font-sans text-sm bg-white rounded-2xl border border-[#6E1423]/15">
            {lang === 'en' ? 'No featured products found in the database.' : 'Belum ada produk unggulan di database.'}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-6 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#6E1423]/40 scrollbar-track-amber-100/50">
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-65 sm:min-w-70 md:min-w-73.75 snap-start shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= 3. HERITAGE STORY & QUOTE PANEL ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#6E1423]/20 shadow-xl bg-[#6E1423] text-[#FBF6EE]">
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 bg-linear-to-b from-[#781727] to-[#5C0F1C]">
            <div className="space-y-4">
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.26em] text-amber-300 block">
                {heritage.subtitle}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                {hasHeritageSplit && heritageParts.length > 1 ? (
                  <>
                    {heritageParts[0]},{' '}
                    <span className="block text-amber-300 italic font-normal mt-1">
                      {heritageParts[1].trim()}
                    </span>
                  </>
                ) : (
                  heritage.title
                )}
              </h2>
              <p className="text-amber-50/85 font-sans text-sm leading-relaxed">
                {heritage.desc}
              </p>
            </div>

            <div className="pt-2 font-sans">
              <Link
                href="/tentang-kami"
                className="inline-flex items-center gap-2.5 bg-white/15 hover:bg-white/20 text-white border border-amber-200/35 font-semibold px-6 py-3 rounded-full text-xs transition cursor-pointer"
              >
                <span>{lang === 'en' ? 'Our Story' : 'Tentang Kami'}</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-amber-300" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 relative min-h-72 sm:min-h-96 bg-[#5C0F1C]">
            <Image
              key={resolvedHeritageUrl}
              src={resolvedHeritageUrl}
              alt="Proses Pembuatan Tradisional"
              fill
              priority
              loading="eager"
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-3 p-8 sm:p-10 bg-[#EFE6D5] text-[#5C0F1C] flex flex-col justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-[#6E1423]/15">
            <div className="w-9 h-9 rounded-full bg-[#6E1423]/10 flex items-center justify-center text-[#6E1423]">
              <FontAwesomeIcon icon={faQuoteLeft} className="w-3.5 h-3.5" />
            </div>
            <blockquote className="text-lg sm:text-xl font-serif font-semibold leading-snug text-[#5C0F1C]">
              “{quoteData.text}”
            </blockquote>
            <div className="w-10 h-px bg-[#6E1423]/25" />
            <p className="text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-[#6b5b50]">
              {quoteData.author}
            </p>
          </div>
        </div>
      </section>

      {/* ================= 4. KOMITMEN KUALITAS KAMI ================= */}
      <HomeFeaturesSection />

      {/* ================= 5. CLASSIC BANNER CTA ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-24 pt-6 font-sans">
        <div className="bg-linear-to-r from-[#781727] via-[#6E1423] to-[#5C0F1C] text-[#FBF6EE] rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-amber-300/20">
          <div className="space-y-2 text-center lg:text-left max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-amber-300">
              Surya Snack Banyuwangi
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-snug">
              {t('readyTitle') || 'Siap Menikmati Kelezatan Khas Banyuwangi?'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <Link
              href="/katalog"
              className="bg-amber-400 hover:bg-amber-300 text-[#5C0F1C] font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              {t('exploreCatalog') || 'Lihat Katalog Produk'}
            </Link>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
              <span>{t('waAdmin') || 'WhatsApp Admin & Tanya-tanya'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= 6. PROMO POPUP MODAL ================= */}
      <PromoPopupModal />

    </div>
  );
}