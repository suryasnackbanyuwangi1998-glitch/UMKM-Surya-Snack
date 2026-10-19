// src/components/ProductDetailClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faLocationDot,
  faWeightHanging,
  faBoxOpen,
  faCircleCheck,
  faFire,
  faMagnifyingGlassPlus,
  faXmark,
  faShieldHeart,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';
import type { Product } from '@/types';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'komposisi' | 'pemesanan'>('deskripsi');

  const waNumber = '6289509604700';
  const instagramUrl = 'https://www.instagram.com/suryasnack.banyuwangi';

  const images: string[] = [
    product.image_url || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800',
    ...(product.images || []),
  ].filter(Boolean).slice(0, 4);

  const formatRupiah = (price: number | null): string =>
    price === null || price === undefined
      ? 'Hubungi untuk harga'
      : `Rp ${price.toLocaleString('id-ID')}`;

  const priceText = product.price ? ` (${formatRupiah(product.price)})` : '';

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Surya Snack, saya ingin memesan ${product.name}${priceText}`.trim()
  )}`;

  // Lock scroll + tutup pakai Esc saat lightbox terbuka
  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomOpen]);

  const highlights = [
    'Dibuat fresh setiap hari dengan resep khas turun-temurun sejak 1998',
    'Bahan baku pilihan dari hasil bumi petani lokal Banyuwangi',
    'Kemasan rapat food-grade yang menjaga kerenyahan tahan lama',
    'Higienis, halal, dan tanpa pengawet buatan',
    product.sales > 0 ? `Telah terjual lebih dari ${product.sales} pcs ke berbagai kota` : null,
  ].filter(Boolean) as string[];

  const orderSteps: [string, string][] = [
    ['1. Klik Pesan WhatsApp', 'Tombol pesanan akan otomatis membawa Anda ke chat WhatsApp resmi admin kami.'],
    ['2. Konfirmasi Detail', 'Admin akan memeriksa ketersediaan stok terbaru dan total biaya pesanan Anda.'],
    ['3. Pembayaran Aman', 'Pilih metode pembayaran via transfer bank, e-wallet, atau COD (khusus area Banyuwangi).'],
    ['4. Pengemasan & Pengiriman', 'Pesanan Anda dikemas dengan aman dan dikirimkan pada hari yang sama.'],
  ];

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-28 pt-20 sm:px-6 lg:pb-16 font-sans">
      
      {/* ===== TOMBOL KEMBALI & BREADCRUMB ===== */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 rounded-xl border border-amber-900/15 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-xs transition hover:border-[#5c0f1c]/40 hover:text-[#5c0f1c]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
          <span>Kembali ke Katalog</span>
        </Link>
        <span className="text-xs uppercase tracking-widest text-gray-400 font-bold hidden sm:block">
          ✦ Surya Snack Artisan Catalog ✦
        </span>
      </div>

      {/* ===== KONTEN UTAMA: SPLIT SCREEN (GALERI & INFO UTAMA) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-10 shadow-sm">
        
        {/* KOLOM KIRI: FOTO & GALERI */}
        <div className="lg:col-span-6 space-y-4">
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            aria-label="Perbesar gambar produk"
            className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-amber-900/10 bg-[#FAF7F0] shadow-inner"
          >
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              priority
              quality={90}
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition group-hover:bg-black/70">
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="h-3 w-3" />
              Perbesar Gambar
            </span>
          </button>

          {/* Thumbnail galeri */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    selectedImage === idx
                      ? 'border-[#5c0f1c] ring-2 ring-amber-400/40'
                      : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* KOLOM KANAN: INFORMASI & AKSI UTAMA */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#5c0f1c] text-amber-200 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full font-serif shadow-xs">
                {product.badge || 'Khas Banyuwangi'}
              </span>
              {product.category && (
                <span className="bg-amber-100/70 text-[#3b0912] text-xs font-bold px-3 py-1 rounded-full">
                  {product.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3b0912] leading-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-black text-[#5c0f1c] pt-2">
              {formatRupiah(product.price)}
            </div>
          </div>

          {/* Spesifikasi Ringkas */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-amber-900/10 text-xs font-semibold text-gray-700">
            {product.weight && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faWeightHanging} className="text-[#5c0f1c]" />
                <span>Berat: {product.weight}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBoxOpen} className="text-[#5c0f1c]" />
              <span>{product.stock > 0 ? `Stok: ${product.stock} Tersedia` : 'Stok Pre-Order'}</span>
            </div>
            {product.sales > 0 && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFire} className="text-[#5c0f1c]" />
                <span>Terjual: {product.sales}+ pcs</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-[#5c0f1c]" />
              <span>Asal: Banyuwangi</span>
            </div>
          </div>

          {/* Tombol Aksi WhatsApp & Instagram */}
          <div className="space-y-3 pt-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] py-4 text-sm font-bold text-white shadow-md transition-all active:scale-95 uppercase tracking-wider"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
              <span>Pesan Cepat via WhatsApp</span>
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#5c0f1c]/20 hover:border-[#5c0f1c] hover:bg-[#5c0f1c] hover:text-white py-3 text-xs font-bold text-[#5c0f1c] transition-all uppercase tracking-widest"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
              <span>Lihat Testimoni di Instagram</span>
            </a>
          </div>

          {/* Jaminan Layanan */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-2 bg-[#FAF7F0] p-3 rounded-xl border border-amber-900/5">
              <FontAwesomeIcon icon={faShieldHeart} className="text-[#5c0f1c] text-base" />
              <span>100% Halal & Tanpa Pengawet</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FAF7F0] p-3 rounded-xl border border-amber-900/5">
              <FontAwesomeIcon icon={faTruck} className="text-[#5c0f1c] text-base" />
              <span>Pengiriman Seluruh Nusantara</span>
            </div>
          </div>

        </div>
      </div>

      {/* ===== SECTION TAB INFORMASI RINCI ===== */}
      <div className="mt-12 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Tombol Tab Navigasi */}
        <div className="flex flex-wrap gap-2 border-b border-amber-900/10 pb-4">
          <button
            onClick={() => setActiveTab('deskripsi')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'deskripsi'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Deskripsi & Keunggulan
          </button>
          <button
            onClick={() => setActiveTab('komposisi')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'komposisi'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Komposisi & Spesifikasi
          </button>
          <button
            onClick={() => setActiveTab('pemesanan')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'pemesanan'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Alur Pemesanan
          </button>
        </div>

        {/* Isi Konten Tab dengan whitespace-pre-line */}
        <div className="min-h-[180px]">
          {activeTab === 'deskripsi' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#3b0912] mb-3">Tentang Produk Ini</h3>
                {/* Deskripsi lengkap dengan dukungan format baris baru & emoji */}
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {product.long_description || product.description || 'Belum ada deskripsi lengkap.'}
                </div>
              </div>

              <div className="pt-4 border-t border-amber-900/10">
                <h4 className="font-serif font-bold text-base text-[#3b0912] mb-3">Keunggulan Utama:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'komposisi' && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#3b0912]">Detail Komposisi & Kemasan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c0f1c]">Bahan Pilihan</span>
                  <p className="text-sm text-gray-700 font-medium whitespace-pre-line">
                    {product.ingredients || 'Menggunakan bahan-bahan alami pilihan berkualitas tinggi tanpa pengawet buatan.'}
                  </p>
                </div>
                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c0f1c]">Standar Kemasan</span>
                  <p className="text-sm text-gray-700 font-medium">
                    Dikemas menggunakan plastik kedap udara (food grade) tebal untuk menjamin kerenyahan dan aroma khas tetap terjaga.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pemesanan' && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#3b0912]">Alur Pemesanan Cepat & Transparan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orderSteps.map(([title, desc], idx) => (
                  <div key={idx} className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 space-y-1.5">
                    <h4 className="font-bold text-sm text-[#3b0912]">{title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ===== LIGHTBOX ZOOM (FULLSCREEN) ===== */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            aria-label="Tutup gambar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>

          <div className="relative h-[75vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              quality={90}
              className="object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}