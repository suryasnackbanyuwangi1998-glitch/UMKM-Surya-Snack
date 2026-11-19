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
} from '@fortawesome/free-solid-svg-icons';
import ProductCard from '@/components/ProductCard';
import PromoPopupModal from '@/components/PromoPopupModal';
import HomeFeaturesSection from '@/components/HomeFeaturesSection';
import { getFeaturedProducts } from '@/lib/products';
import { supabase } from '@/lib/supabase';
import { useStoreContact } from '@/context/ContactProvider';
import { useLanguage } from '@/context/LanguageContext';

const DEFAULT_HERITAGE_IMAGE =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600";

function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') {
    return DEFAULT_HERITAGE_IMAGE;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return DEFAULT_HERITAGE_IMAGE;
  }

  // Konversi tautan Google Drive (file/d/<ID>/view atau open?id=<ID>) ke direct image view
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }

  const driveOpenMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && driveOpenMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  return DEFAULT_HERITAGE_IMAGE;
}

export default function HomePage() {
  const { getWaLink } = useStoreContact();
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [storeLabel, setStoreLabel] = useState<string>("Oleh-Oleh Khas Banyuwangi");

  const [heroData, setHeroData] = useState({
    title: "Cita Rasa Legendaris Khas Banyuwangi",
    desc: "Mengangkat kelezatan resep pusaka leluhur tanah Blambangan, disajikan khusus dalam balutan kualitas artisan yang renyah dan penuh kenangan.",
  });

  const [quoteData, setQuoteData] = useState({
    text: "Kualitas sejati tidak pernah berkompromi pada rasa. Setiap gigitan adalah cerita tentang tradisi dan ketulusan.",
    author: "— SURYA SNACK ARTISAN KITCHEN",
  });

  const [heritage, setHeritage] = useState({
    title: "Menjaga Tradisi, Memahat Cita Rasa",
    subtitle: "✦ Sejarah & Dedikasi ✦",
    desc: "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
    image_url: DEFAULT_HERITAGE_IMAGE,
  });

  const applyStoreSettings = useCallback(
    (storeData: any, currentLang: string) => {
      if (!storeData) return;

      if (storeData.store_label) {
        setStoreLabel(storeData.store_label);
      } else {
        setStoreLabel(
          currentLang === 'en'
            ? "Authentic Banyuwangi Souvenirs"
            : "Oleh-Oleh Khas Banyuwangi"
        );
      }

      setHeroData((prev) => ({
        title: storeData.hero_title || prev.title,
        desc: storeData.hero_desc || prev.desc,
      }));

      setQuoteData((prev) => ({
        text: storeData.quote_text || prev.text,
        author: storeData.quote_author || prev.author,
      }));

      setHeritage((prev) => ({
        title: storeData.heritage_title || prev.title,
        subtitle: storeData.heritage_subtitle || prev.subtitle,
        desc: storeData.heritage_desc || prev.desc,
        image_url: normalizeImageUrl(storeData.heritage_image_url) || prev.image_url,
      }));
    },
    []
  );

  // Sinkronisasi teks default saat bahasa diganti & muat data terbaru dari Supabase
  useEffect(() => {
    let isMounted = true;

    if (lang === 'en') {
      setHeroData({
        title: "Legendary Authentic Taste of Banyuwangi",
        desc: "Elevating the delicious heritage recipes of Blambangan, specially served in an artisan quality that is crispy and full of memories.",
      });
      setQuoteData({
        text: "True quality never compromises on taste. Every bite is a story of tradition and sincerity.",
        author: "— SURYA SNACK ARTISAN KITCHEN",
      });
      setHeritage((prev) => ({
        title: "Preserving Tradition, Sculpting Flavor",
        subtitle: "✦ History & Dedication ✦",
        desc: "Starting from a home kitchen in Banyuwangi, Surya Snack grew by strictly holding onto the principle of ancestral recipe authenticity.",
        image_url: prev.image_url || DEFAULT_HERITAGE_IMAGE,
      }));
      setStoreLabel("Authentic Banyuwangi Souvenirs");
    } else {
      setHeroData({
        title: "Cita Rasa Legendaris Khas Banyuwangi",
        desc: "Mengangkat kelezatan resep pusaka leluhur tanah Blambangan, disajikan khusus dalam balutan kualitas artisan yang renyah dan penuh kenangan.",
      });
      setQuoteData({
        text: "Kualitas sejati tidak pernah berkompromi pada rasa. Setiap gigitan adalah cerita tentang tradisi dan ketulusan.",
        author: "— SURYA SNACK ARTISAN KITCHEN",
      });
      setHeritage((prev) => ({
        title: "Menjaga Tradisi, Memahat Cita Rasa",
        subtitle: "✦ Sejarah & Dedikasi ✦",
        desc: "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
        image_url: prev.image_url || DEFAULT_HERITAGE_IMAGE,
      }));
      setStoreLabel("Oleh-Oleh Khas Banyuwangi");
    }

    async function loadStoreSettings() {
      try {
        const { data: storeData, error } = await supabase
          .from("store_settings")
          .select("*")
          .eq("id", "main")
          .maybeSingle();

        if (!error && storeData && isMounted) {
          applyStoreSettings(storeData, lang);
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan toko di beranda:", err);
      }
    }

    loadStoreSettings();

    return () => {
      isMounted = false;
    };
  }, [lang, applyStoreSettings]);

  // Dengarkan perubahan realtime pada tabel store_settings agar saat admin menyimpan langsung update
  useEffect(() => {
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
          if (payload.new) {
            applyStoreSettings(payload.new, lang);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applyStoreSettings, lang]);

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

  const getValidImageUrl = (url: string) => {
    return normalizeImageUrl(url);
  };

  const resolvedHeritageUrl = getValidImageUrl(heritage.image_url);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100 antialiased overflow-x-hidden">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full h-screen min-h-175 flex items-center justify-center text-center overflow-hidden border-b-4 border-[#5c0f1c] bg-[#1a120e]">
        <div className="absolute inset-0">
          <Image
            src="/hero-background.jpg"
            alt="Hero Background Surya Snack"
            fill
            priority
            loading="eager"
            className="object-cover object-center filter brightness-[0.55] contrast-105"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-[#1a120e]/90 via-[#1a120e]/50 to-black/50" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pt-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-400/40 bg-[#3b0912]/80 backdrop-blur-md shadow-xl mx-auto">
            <span className="text-amber-400 text-xs tracking-widest font-sans font-semibold">★ EST. 1998 ★</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="text-amber-200 text-xs uppercase tracking-wider font-sans font-semibold">
              {storeLabel}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] font-serif drop-shadow-lg">
            {heroData.title}
          </h1>

          <p className="max-w-2xl mx-auto text-gray-200 text-sm sm:text-lg font-sans font-light leading-relaxed">
            {heroData.desc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-sans">
            <Link
              href="/katalog"
              className="group bg-amber-400 hover:bg-amber-300 text-[#3b0912] font-bold px-8 py-4 rounded-md shadow-2xl transition-all text-sm uppercase tracking-wider inline-flex items-center gap-2 border border-amber-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t('exploreCatalog') || 'Jelajahi Katalog'}
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/80 font-bold px-8 py-4 rounded-md transition-all text-sm uppercase tracking-wider hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t('contactStore') || 'Hubungi Toko'}
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-3 bg-linear-to-r from-amber-600 via-amber-400 to-amber-600 z-20" />
      </section>

      {/* ================= 2. QUOTE STATEMENT SECTION ================= */}
      <section className="py-16 sm:py-24 bg-[#FAF7F0] border-b border-amber-900/10 text-center px-4 overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6">
          <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl text-[#5c0f1c]/40" />
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#3b0912] leading-snug">
            “{quoteData.text}”
          </h2>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto" />
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600 font-sans font-bold">
            {quoteData.author}
          </p>
        </div>
      </section>

      {/* ================= 3. PRODUK UNGGULAN ================= */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#5c0f1c] text-xs font-bold tracking-[0.3em] uppercase font-sans">
            ✦ {lang === 'en' ? 'Featured Collection' : 'Koleksi Pilihan'} ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#3b0912] tracking-tight">
            {lang === 'en' ? 'Our Featured Products' : 'Produk Unggulan Kami'}
          </h2>
          <p className="text-gray-600 font-sans text-sm">
            {lang === 'en' 
              ? 'Best-selling snacks always sought after by traditional culinary lovers. (Swipe sideways to view more)'
              : 'Camilan terlaris yang selalu dirindukan para penikmat kuliner tradisional. (Geser ke samping untuk melihat lainnya)'}
          </p>
          <div className="w-24 h-px bg-amber-500/50 mx-auto pt-2" />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-sans text-sm bg-white rounded-xl border border-amber-900/10 shadow-xs">
            {lang === 'en' ? 'No featured products found in database.' : 'Belum ada produk unggulan di database.'}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-amber-100">
            {products.map((product) => (
              <div key={product.id} className="min-w-65 sm:min-w-70 md:min-w-75 snap-start shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-2 font-sans">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-8 py-3.5 rounded-md transition text-xs uppercase tracking-widest shadow-md hover:scale-105"
          >
            {t('viewAllProducts') || 'Lihat Seluruh Katalog Produk →'}
          </Link>
        </div>
      </section>

      {/* ================= 4. HERITAGE STORY SECTION ================= */}
      <section className="bg-[#3b0912] text-amber-100 py-20 sm:py-28 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-sans font-bold uppercase tracking-[0.25em]">
              {heritage.subtitle}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              {heritage.title.includes(',') || heritage.title.includes('Tradisi') ? (
                <>
                  {heritage.title.split(/[,–]/)[0]}, <br />
                  <span className="text-amber-300 italic font-normal">{heritage.title.split(/[,–]/)[1] || ''}</span>
                </>
              ) : (
                heritage.title
              )}
            </h2>
            <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed font-light text-justify">
              {heritage.desc}
            </p>
          </div>
          <div className="relative h-80 sm:h-105 rounded-lg overflow-hidden border-4 border-amber-400/30 shadow-2xl">
            <Image
              key={resolvedHeritageUrl}
              src={resolvedHeritageUrl}
              alt="Proses Pembuatan Tradisional"
              fill
              priority
              loading="eager"
              unoptimized
              className="object-cover filter sepia-[0.2]"
            />
          </div>
        </div>
      </section>

      {/* ================= 5. KOMITMEN KUALITAS KAMI ================= */}
      <HomeFeaturesSection />

      {/* ================= 6. CLASSIC BANNER CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-20 font-sans">
        <div className="bg-[#FAF7F0] border-2 border-dashed border-amber-900/30 rounded-2xl p-8 sm:p-14 text-center space-y-6 shadow-inner">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#3b0912]">
            {t('readyTitle') || 'Siap Menikmati Kelezatan Khas Banyuwangi?'}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/katalog"
              className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition shadow-md hover:scale-105"
            >
              {t('exploreCatalog') || 'Lihat Katalog Produk'}
            </Link>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition shadow-md inline-flex items-center gap-2 hover:scale-105"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
              <span>{t('waAdmin') || 'WhatsApp Admin & Tanya-tanya'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= 7. PROMO POPUP MODAL ================= */}
      <PromoPopupModal />

    </div>
  );
}