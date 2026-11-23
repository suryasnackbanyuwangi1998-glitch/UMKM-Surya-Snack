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
const STORE_SETTINGS_CACHE_KEY = "surya_snack_store_settings_v1";

const DEFAULTS = {
  id: {
    storeLabel: "Oleh-Oleh Khas Banyuwangi • Est. 1998",
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
    storeLabel: "Authentic Banyuwangi Delicacies • Est. 1998",
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
  const [settingsReady, setSettingsReady] = useState<boolean>(false);

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
    (currentLang: 'id' | 'en', dbData: Record<string, any> | null, isReady: boolean) => {
      const resolvedHeritageUrl = isReady
        ? normalizeImageUrl(dbData && dbData.heritage_image_url, DEFAULT_HERITAGE_IMAGE)
        : DEFAULT_HERITAGE_IMAGE;
      const resolvedHeroBgUrl = isReady
        ? normalizeImageUrl(
            (dbData && (dbData.hero_image_url || dbData.hero_bg_url)) || DEFAULT_HERO_BG_IMAGE,
            DEFAULT_HERO_BG_IMAGE
          )
        : DEFAULT_HERO_BG_IMAGE;

      if (currentLang === 'en') {
        const en = DEFAULTS.en;
        setStoreLabel((dbData && (dbData.store_label_en || dbData.store_label)) || en.storeLabel);
        setHeroData({
          title: (dbData && (dbData.hero_title_en || dbData.hero_title)) || en.heroTitle,
          desc: (dbData && (dbData.hero_desc_en || dbData.hero_desc)) || en.heroDesc,
          bgUrl: resolvedHeroBgUrl,
        });
        setQuoteData({
          text: (dbData && (dbData.quote_text_en || dbData.quote_text)) || en.quoteText,
          author: (dbData && (dbData.quote_author_en || dbData.quote_author)) || en.quoteAuthor,
        });
        setHeritage({
          title: (dbData && (dbData.heritage_title_en || dbData.heritage_title)) || en.heritageTitle,
          subtitle:
            (dbData && (dbData.heritage_subtitle_en || dbData.heritage_subtitle)) ||
            en.heritageSubtitle,
          desc: (dbData && (dbData.heritage_desc_en || dbData.heritage_desc)) || en.heritageDesc,
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
    syncContentByLanguage(lang, storeSettings, settingsReady);
  }, [lang, storeSettings, settingsReady, syncContentByLanguage]);

  useEffect(() => {
    let isMounted = true;

    try {
      const cachedRaw = window.localStorage.getItem(STORE_SETTINGS_CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (parsed && typeof parsed === "object") {
          setStoreSettings(parsed);
          setSettingsReady(true);
        }
      }
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }

    async function loadStoreSettings() {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("*")
          .eq("id", "main")
          .maybeSingle();

        if (!isMounted) return;

        if (!error && data) {
          setStoreSettings(data);
          try {
            window.localStorage.setItem(STORE_SETTINGS_CACHE_KEY, JSON.stringify(data));
          } catch {
            // Abaikan error kuota storage
          }
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan toko di beranda:", err);
      } finally {
        if (isMounted) {
          setSettingsReady(true);
        }
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
            const nextSettings = payload.new as Record<string, any>;
            setStoreSettings(nextSettings);
            setSettingsReady(true);
            try {
              window.localStorage.setItem(
                STORE_SETTINGS_CACHE_KEY,
                JSON.stringify(nextSettings)
              );
            } catch {
              // Abaikan error kuota storage
            }
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
    <div className="min-h-screen bg-white text-[#2B211B] font-serif selection:bg-[#5A0A14] selection:text-amber-100 antialiased overflow-x-hidden">

      {/* ================= 1. FULL-SCREEN HERO TANPA BLUR BACKGROUND ================= */}
      <section className="relative w-full min-h-screen flex items-center border-b border-neutral-200 bg-neutral-100 overflow-hidden">
        {/* Gambar Full 1 Layar Penuh */}
        <div className="absolute inset-0 z-0">
          {heroData.bgUrl ? (
            <Image
              key={heroData.bgUrl}
              src={heroData.bgUrl}
              alt="Hero Background Surya Snack"
              fill
              priority
              loading="eager"
              unoptimized
              className="object-cover object-right sm:object-center"
            />
          ) : null}
          {/* Gradasi halus abu-abu/putih sisi kiri agar teks kontras tanpa menutup gambar penuh di sisi kanan */}
          <div className="absolute inset-0 bg-linear-to-r from-white/95 via-neutral-50/75 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent pointer-events-none" />
        </div>

        {/* Konten Utama Hero */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-20">
          <div className="max-w-xl lg:max-w-2xl space-y-6">
            {/* Badge Kecil Khas Maroon */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-100/90 border border-[#5A0A14]/20 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#5A0A14]" />
              <span className="text-[11px] font-sans font-extrabold uppercase tracking-[0.22em] text-[#5A0A14]">
                {storeLabel}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[4.35rem] font-serif font-bold leading-[1.06] tracking-tight">
              <span className="text-[#5A0A14]">{heroPrimary}</span>
              {heroAccent ? (
                <>
                  {' '}
                  <span className="text-[#9A5D0A] italic font-semibold">
                    {heroAccent}
                  </span>
                </>
              ) : null}
            </h1>

            <p className="max-w-lg text-[#2B1D14] font-sans text-sm sm:text-base font-medium leading-relaxed">
              {heroData.desc}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2 font-sans">
              <Link
                href="/katalog"
                className="group inline-flex items-center gap-3 bg-[#5A0A14] hover:bg-[#46070F] text-amber-200 font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-[0_10px_25px_-8px_rgba(90,10,20,0.5)] cursor-pointer border border-amber-400/30"
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
                className="group inline-flex items-center gap-2.5 bg-white hover:bg-neutral-100 text-[#5A0A14] border border-[#5A0A14]/25 font-bold px-5 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPlay} className="w-2.5 h-2.5 ml-0.5 text-[#5A0A14]" />
                </span>
                <span>{t('contactStore') || 'Hubungi Toko'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. FEATURED DELICACIES ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-[0.26em] text-[#5A0A14]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
              {lang === 'en' ? 'Our Selection' : 'Pilihan Unggulan'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#5A0A14] tracking-tight">
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
              className="inline-flex items-center gap-2 bg-[#5A0A14] hover:bg-[#46070F] text-amber-200 font-semibold px-5 py-2.5 rounded-full text-xs whitespace-nowrap transition cursor-pointer shrink-0 shadow-xs"
            >
              <span>{lang === 'en' ? 'View Full Catalog' : 'Lihat Katalog'}</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 px-6 text-[#6b5a50] font-sans text-sm bg-neutral-50 rounded-2xl border border-neutral-200">
            {lang === 'en' ? 'No featured products found in the database.' : 'Belum ada produk unggulan di database.'}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-6 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#5A0A14]/40 scrollbar-track-neutral-200">
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
        <div className="grid lg:grid-cols-12 rounded-3xl overflow-hidden border border-neutral-200 shadow-xl bg-[#5A0A14] text-neutral-100">
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 bg-[#5A0A14]">
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
              <p className="text-neutral-200 font-sans text-sm leading-relaxed">
                {heritage.desc}
              </p>
            </div>

            <div className="pt-2 font-sans">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2.5 bg-white/12 hover:bg-white/20 text-white border border-white/25 font-semibold px-6 py-3 rounded-full text-xs transition cursor-pointer"
              >
                <span>{lang === 'en' ? 'Our Story' : 'Tentang Kami'}</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-amber-300" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 relative min-h-72 sm:min-h-96 bg-[#46070F]">
            {heritage.image_url ? (
              <Image
                key={heritage.image_url}
                src={heritage.image_url}
                alt="Proses Pembuatan Tradisional"
                fill
                priority
                loading="eager"
                unoptimized
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="lg:col-span-3 p-8 sm:p-10 bg-neutral-100 text-[#5A0A14] flex flex-col justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-neutral-200">
            <div className="w-10 h-10 rounded-full bg-neutral-200/80 flex items-center justify-center text-[#5A0A14]">
              <FontAwesomeIcon icon={faQuoteLeft} className="w-4 h-4" />
            </div>
            <blockquote className="text-lg sm:text-xl font-serif font-semibold leading-snug text-[#5A0A14]">
              “{quoteData.text}”
            </blockquote>
            <div className="w-10 h-px bg-[#5A0A14]/25" />
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
        <div className="relative overflow-hidden bg-[#5A0A14] text-neutral-100 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-[#5A0A14]/20">
          <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl" />

          <div className="relative z-10 space-y-2 text-center lg:text-left max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-amber-300">
              Surya Snack Banyuwangi
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-snug">
              {t('readyTitle') || 'Siap Menikmati Kelezatan Khas Banyuwangi?'}
            </h2>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <Link
              href="/katalog"
              className="bg-amber-400 hover:bg-amber-300 text-[#2B1607] font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              {t('exploreCatalog') || 'JELAJAHI KATALOG'}
            </Link>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#18C95A] hover:bg-[#15b550] text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
              <span>{t('waAdmin') || 'WHATSAPP ADMIN & TANYA-TANYA'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= 6. PROMO POPUP MODAL ================= */}
      <PromoPopupModal />

    </div>
  );
}