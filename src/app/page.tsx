// src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faAward,
  faSeedling,
  faFireFlameCurved,
  faPhoneVolume,
  faArrowRight,
  faQuoteLeft,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts } from '@/lib/products';
import { supabase } from '@/lib/supabase';
import { useStoreContact } from '@/context/ContactProvider';

export default function HomePage() {
  const { waNumber, getWaLink } = useStoreContact();
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [showPromoModal, setShowPromoModal] = useState<boolean>(false);
  const [promoModalIndex, setPromoModalIndex] = useState<number>(0);
  
  const [storeLabel, setStoreLabel] = useState<string>("Oleh-Oleh Khas Banyuwangi");

  // State untuk Heritage Story
  const [heritage, setHeritage] = useState({
    title: "Menjaga Tradisi, Memahat Cita Rasa",
    subtitle: "✦ Sejarah & Dedikasi ✦",
    desc: "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
    image_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600"
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const prod = await getFeaturedProducts(10);
        if (prod) {
          setProducts(prod);
        }

        const { data: bannerData, error: bannerError } = await supabase
          .from('store_banners')
          .select('*')
          .order('banner_number', { ascending: true });

        if (bannerError) throw bannerError;
        if (bannerData && bannerData.length > 0) {
          setBanners(bannerData);
          // Cek apakah iklan pop-up sudah pernah ditutup dalam sesi browser ini
          try {
            const isClosed = sessionStorage.getItem('surya_promo_closed');
            if (!isClosed) {
              setShowPromoModal(true);
            }
          } catch {
            setShowPromoModal(true);
          }
        }

        const { data: storeData, error: storeError } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 'main')
          .maybeSingle();

        if (storeError) throw storeError;
        if (storeData) {
          if (storeData.store_label) setStoreLabel(storeData.store_label);
          setHeritage({
            title: storeData.heritage_title || "Menjaga Tradisi, Memahat Cita Rasa",
            subtitle: storeData.heritage_subtitle || "✦ Sejarah & Dedikasi ✦",
            desc: storeData.heritage_desc || "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
            image_url: storeData.heritage_image_url || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600"
          });
        }
      } catch (err) {
        console.error("Gagal memuat beranda:", err);
      }
    }
    fetchData();
  }, []);

  // Menutup modal dengan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPromoModal(false);
      }
    };
    if (showPromoModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPromoModal]);

  const handleClosePromoModal = () => {
    setShowPromoModal(false);
    try {
      sessionStorage.setItem('surya_promo_closed', 'true');
    } catch {}
  };

  const heritageFeatures = [
    {
      icon: faAward,
      title: 'Resep Warisan Autentik',
      desc: 'Diwariskan dari generasi ke generasi sejak tahun 1998, menjaga keaslian rasa tradisional Banyuwangi.',
    },
    {
      icon: faSeedling,
      title: 'Bahan Pilihan Premium',
      desc: 'Hanya menggunakan hasil bumi pilihan tanpa pengawet buatan, diolah secara higienis setiap hari.',
    },
    {
      icon: faFireFlameCurved,
      title: 'Dipanggang & Digoreng Sempurna',
      desc: 'Tekstur renyah di luar, empuk dan gurih di dalam dengan standar kualitas artisan.',
    },
    {
      icon: faPhoneVolume,
      title: 'Layanan Pelanggan Personal',
      desc: 'Pemesanan transparan dan konfirmasi langsung dengan respon hangat melalui WhatsApp.',
    },
  ];

  // Banner aktif saat ini untuk popup modal iklan
  const activeModalBanner = banners[promoModalIndex] || banners[0] || null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100 antialiased overflow-x-hidden">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full h-screen min-h-175 flex items-center justify-center text-center overflow-hidden border-b-4 border-[#5c0f1c] bg-[#1a120e]">
        {/* Latar Belakang Gambar Statis dari public/hero-background.jpg */}
        <div className="absolute inset-0">
          <Image
            src="/hero-background.jpg"
            alt="Hero Background Surya Snack"
            fill
            priority
            className="object-cover object-center filter brightness-[0.55] contrast-105"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-[#1a120e]/90 via-[#1a120e]/50 to-black/50" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pt-16">
          
          {/* Badge Est. & Store Label */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-400/40 bg-[#3b0912]/80 backdrop-blur-md shadow-xl mx-auto">
            <span className="text-amber-400 text-xs tracking-widest font-sans font-semibold">★ EST. 1998 ★</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="text-amber-200 text-xs uppercase tracking-wider font-sans font-semibold">
              {storeLabel}
            </span>
          </div>

          {/* Judul Utama Hero */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] font-serif drop-shadow-lg">
            Kelezatan Tradisional Kelas Artisan
          </h1>

          {/* Tagline / Subtitle Hero */}
          <p className="max-w-2xl mx-auto text-gray-200 text-sm sm:text-lg font-sans font-light leading-relaxed">
            Menghadirkan camilan dan jajanan khas berkualitas tinggi dengan resep pusaka leluhur, diolah penuh dedikasi untuk Anda.
          </p>

          {/* Tombol CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-sans">
            <Link
              href="/katalog"
              className="group bg-amber-400 hover:bg-amber-300 text-[#3b0912] font-bold px-8 py-4 rounded-md shadow-2xl transition-all text-sm uppercase tracking-wider inline-flex items-center gap-2 border border-amber-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Jelajahi Katalog
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/80 font-bold px-8 py-4 rounded-md transition-all text-sm uppercase tracking-wider hover:scale-105 active:scale-95 cursor-pointer"
            >
              Hubungi Toko
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
            “Kualitas sejati tidak pernah berkompromi pada rasa. Setiap gigitan adalah cerita tentang tradisi dan ketulusan.”
          </h2>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto" />
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600 font-sans font-bold">
            — Surya Snack Artisan Kitchen
          </p>
        </div>
      </section>

      {/* ================= 3. PRODUK UNGGULAN (SCROLL KESAMPING) ================= */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#5c0f1c] text-xs font-bold tracking-[0.3em] uppercase font-sans">
            ✦ Koleksi Pilihan ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#3b0912] tracking-tight">
            Produk Unggulan Kami
          </h2>
          <p className="text-gray-600 font-sans text-sm">
            Camilan terlaris yang selalu dirindukan para penikmat kuliner tradisional. (Geser ke samping untuk melihat lainnya)
          </p>
          <div className="w-24 h-px bg-amber-500/50 mx-auto pt-2" />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-sans text-sm bg-white rounded-xl border border-amber-900/10 shadow-xs">
            Belum ada produk unggulan di database.
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
            Lihat Seluruh Katalog Produk →
          </Link>
        </div>
      </section>

      {/* ================= 4. HERITAGE STORY SECTION (DINAMIS DARI ADMIN) ================= */}
      <section className="bg-[#3b0912] text-amber-100 py-20 sm:py-28 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-sans font-bold uppercase tracking-[0.25em]">
              {heritage.subtitle}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              {heritage.title.includes(',') ? (
                <>
                  {heritage.title.split(',')[0]}, <br />
                  <span className="text-amber-300 italic font-normal">{heritage.title.split(',')[1]}</span>
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
              src={heritage.image_url}
              alt="Proses Pembuatan Tradisional"
              fill
              className="object-cover filter sepia-[0.2]"
            />
          </div>
        </div>
      </section>

      {/* ================= 5. KENAPA MEMILIH KAMI ================= */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#5c0f1c] text-xs font-bold tracking-[0.3em] uppercase font-sans">
            ✦ Standar Artisan ✦
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3b0912]">
            Komitmen Kualitas Kami
          </h2>
          <div className="w-16 h-px bg-amber-600 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
          {heritageFeatures.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-lg border border-amber-900/10 shadow-sm hover:shadow-xl transition-all text-center space-y-4 group cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#3b0912] text-amber-300 flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3b0912]">{item.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed text-justify">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 6. CLASSIC BANNER CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-20 font-sans">
        <div className="bg-[#FAF7F0] border-2 border-dashed border-amber-900/30 rounded-2xl p-8 sm:p-14 text-center space-y-6 shadow-inner">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#3b0912]">
            Siap Menikmati Kelezatan Khas Banyuwangi?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/katalog"
              className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition shadow-md hover:scale-105"
            >
              Lihat Katalog Produk
            </Link>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition shadow-md inline-flex items-center gap-2 hover:scale-105"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
              <span>WhatsApp Admin</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= 7. MODAL IKLAN / POP-UP BANNER PROMOSI ================= */}
      {showPromoModal && activeModalBanner && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={handleClosePromoModal}
        >
          <div 
            className="relative w-full max-w-lg bg-[#FAF7F0] text-[#2D241E] rounded-3xl shadow-2xl border-2 border-amber-500/40 overflow-hidden transition-transform animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Silang (✕) */}
            <button
              type="button"
              onClick={handleClosePromoModal}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-[#3b0912] text-white flex items-center justify-center text-sm font-bold transition shadow-lg border border-white/30 cursor-pointer"
              title="Tutup Iklan"
              aria-label="Tutup Iklan"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            {/* Header Strip Mewah */}
            <div className="bg-[#3b0912] text-amber-200 px-5 py-2.5 flex items-center justify-between font-sans text-xs font-bold uppercase tracking-wider border-b border-amber-500/30">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                ✦ Penawaran Spesial Toko ✦
              </span>
              {banners.length > 1 && (
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/20 text-amber-300">
                  {promoModalIndex + 1} / {banners.length}
                </span>
              )}
            </div>

            {/* Area Foto Banner Iklan */}
            <div className="relative w-full h-56 sm:h-64 bg-[#1a120e] overflow-hidden">
              <img
                src={activeModalBanner.image_url}
                alt={activeModalBanner.title || "Banner Promo"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

              {/* Navigasi Slide Banner jika lebih dari 1 */}
              {banners.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setPromoModalIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#3b0912] text-white flex items-center justify-center text-xs transition border border-white/30 cursor-pointer shadow-md"
                    title="Promo Sebelumnya"
                    aria-label="Promo Sebelumnya"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromoModalIndex((prev) => (prev + 1) % banners.length)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#3b0912] text-white flex items-center justify-center text-xs transition border border-white/30 cursor-pointer shadow-md"
                    title="Promo Selanjutnya"
                    aria-label="Promo Selanjutnya"
                  >
                    ›
                  </button>

                  {/* Indikator Titik */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPromoModalIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          promoModalIndex === idx ? "w-4 bg-amber-400" : "w-1.5 bg-white/50"
                        }`}
                        title={`Lihat Promo ${idx + 1}`}
                        aria-label={`Lihat Promo ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Area Informasi Promo */}
            <div className="p-5 sm:p-6 space-y-3 bg-[#FAF7F0]">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#3b0912] leading-tight">
                {activeModalBanner.title}
              </h3>

              {activeModalBanner.description && (
                <p className="text-xs sm:text-sm text-gray-700 font-sans leading-relaxed">
                  {activeModalBanner.description}
                </p>
              )}

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-3 font-sans">
                <a
                  href={getWaLink(
                    `Halo Surya Snack, saya melihat promo "${activeModalBanner.title}". Apakah promo ini masih tersedia?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                  <span>Klaim Promo via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleClosePromoModal}
                  className="px-5 py-3 rounded-xl border border-amber-900/20 text-[#3b0912] hover:bg-amber-100/50 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Mengambang (Floating Button) untuk membuka kembali promo */}
      {banners.length > 0 && !showPromoModal && (
        <button
          type="button"
          onClick={() => setShowPromoModal(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 border-2 border-amber-400/50 shadow-2xl px-4 py-2.5 rounded-full text-xs font-bold font-sans flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer group"
          title="Buka Iklan Promo"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Lihat Promo Toko ({banners.length})</span>
        </button>
      )}

    </div>
  );
}