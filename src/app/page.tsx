// src/app/page.tsx
import React from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts } from '@/lib/products';

// Memastikan data selalu diperbarui (tidak menggunakan cache lama)
export const revalidate = 0;

export default async function HomePage() {
  // Mengambil data produk unggulan langsung dari database Supabase
  const products = await getFeaturedProducts(4);

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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100 antialiased overflow-x-hidden">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full h-screen min-h-175 flex items-center justify-center text-center overflow-hidden border-b-4 border-[#5c0f1c] bg-[#1a120e]">
        <div className="absolute inset-0">
          <Image
            src="/hero-background.jpg"
            alt="Surya Snack Heritage"
            fill
            priority
            className="object-cover object-center filter brightness-[0.55] contrast-110"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-[#1a120e]/80 via-black/30 to-black/50" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pt-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-400/40 bg-[#3b0912]/80 backdrop-blur-md shadow-xl mx-auto">
            <span className="text-amber-400 text-xs tracking-widest">★ EST. 1998 ★</span>
            <span className="w-1 h-1 rounded-full bg-amber-400"></span>
            <span className="text-amber-200 text-xs uppercase tracking-wider font-sans font-semibold">
              Oleh-Oleh Khas Banyuwangi
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] font-serif drop-shadow-lg">
            Kelezatan Tradisional <br />
            <span className="italic font-normal text-amber-300">Kelas Artisan</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-200 text-sm sm:text-lg font-sans font-light leading-relaxed">
            Menghadirkan camilan dan jajanan khas berkualitas tinggi dengan resep pusaka leluhur, diolah penuh dedikasi untuk Anda.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-sans">
            <Link
              href="/katalog"
              className="group bg-amber-400 hover:bg-amber-300 text-[#3b0912] font-bold px-8 py-4 rounded-md shadow-2xl transition-all text-sm uppercase tracking-wider inline-flex items-center gap-2 border border-amber-300 hover:scale-105 active:scale-95"
            >
              Jelajahi Katalog
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/6289509604700"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/80 font-bold px-8 py-4 rounded-md transition-all text-sm uppercase tracking-wider hover:scale-105 active:scale-95"
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

      {/* ================= 3. PRODUK UNGGULAN (FEATURED PRODUCTS) ================= */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#5c0f1c] text-xs font-bold tracking-[0.3em] uppercase font-sans">
            ✦ Koleksi Pilihan ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#3b0912] tracking-tight">
            Produk Unggulan Kami
          </h2>
          <p className="text-gray-600 font-sans text-sm">
            Camilan terlaris yang selalu dirindukan para penikmat kuliner tradisional.
          </p>
          <div className="w-24 h-px bg-amber-500/50 mx-auto pt-2" />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-sans text-sm bg-white rounded-xl border border-amber-900/10 shadow-xs">
            Belum ada produk unggulan di database. Silakan centang "Jadikan Produk Unggulan" melalui panel admin.
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center pt-6 font-sans">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-8 py-3.5 rounded-md transition text-xs uppercase tracking-widest shadow-md hover:scale-105"
          >
            Lihat Seluruh Katalog Produk →
          </Link>
        </div>
      </section>

      {/* ================= 4. HERITAGE STORY SECTION ================= */}
      <section className="bg-[#3b0912] text-amber-100 py-20 sm:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-sans font-bold uppercase tracking-[0.25em]">
              ✦ Sejarah & Dedikasi ✦
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Menjaga Tradisi, <br />
              <span className="text-amber-300 italic font-normal">Memahat Cita Rasa</span>
            </h2>
            <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed font-light text-justify">
              Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur. Kami percaya bahwa makanan terbaik dibuat bukan dari mesin, melainkan dari ketelitian dan bahan-bahan pilihan berkualitas tinggi.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10 font-sans">
              <div>
                <h4 className="text-3xl font-serif font-bold text-amber-400">25+</h4>
                <p className="text-xs text-gray-300 uppercase tracking-wider mt-1">Tahun Pengalaman</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-amber-400">100%</h4>
                <p className="text-xs text-gray-300 uppercase tracking-wider mt-1">Bahan Alami Lokal</p>
              </div>
            </div>
          </div>

          <div className="relative h-80 sm:h-105 rounded-lg overflow-hidden border-4 border-amber-400/30 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600"
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
          <p className="text-gray-600 text-sm max-w-xl mx-auto text-justify sm:text-center">
            Pesan langsung melalui katalog digital kami atau hubungi admin via WhatsApp untuk pemesanan khusus dan pengiriman ke seluruh wilayah.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/katalog"
              className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition shadow-md hover:scale-105"
            >
              Lihat Katalog Produk
            </Link>
            <a
              href="https://wa.me/6289509604700"
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

    </div>
  );
}