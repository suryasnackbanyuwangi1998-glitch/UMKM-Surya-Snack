'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  faBoxArchive,
  faStar,
  faPlus,
  faMinus,
  faCartPlus,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import type { Product } from '@/types';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'komposisi' | 'pemesanan'>('deskripsi');
  
  // Kuantitas awal dimulai dari 0
  const [quantity, setQuantity] = useState(0);

  const images: string[] = [
    product.image_url || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800',
    ...(Array.isArray(product.images) ? product.images : product.images ? [product.images] : []),
  ].filter(Boolean) as string[];

  const formatRupiah = (price: number | null | undefined): string =>
    price === null || price === undefined
      ? 'Hubungi untuk harga'
      : `Rp ${price.toLocaleString('id-ID')}`;

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      if (newQty === 0) setShowModal(false);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const totalPrice = (product.price || 0) * quantity;

  // Klik "Tambah Pesanan" memicu Pop-up Modal
  const handleOpenModal = () => {
    if (quantity > 0) {
      setShowModal(true);
    }
  };

  // Klik "Pesan Sekarang" di dalam Pop-up mengarahkan ke Halaman Konfirmasi Checkout
  const handleGoToCheckout = () => {
    if (quantity <= 0) return;
    router.push(`/checkout?product_id=${product.id}&qty=${quantity}`);
  };

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

  const dynamicKeyFeatures = Array.isArray(product.key_features)
    ? product.key_features
    : product.key_features
    ? String(product.key_features).split(',')
    : [];

  const defaultHighlights = [
    'Dibuat fresh setiap hari dengan resep khas turun-temurun sejak 1998',
    'Bahan baku pilihan dari hasil bumi petani lokal Banyuwangi',
    'Kemasan rapat food-grade yang menjaga kerenyahan tahan lama',
    'Higienis, halal, dan tanpa pengawet buatan',
    (product.sales ?? 0) > 0 ? `Telah terjual lebih dari ${product.sales} pcs ke berbagai kota` : null,
  ].filter(Boolean) as string[];

  const highlights = dynamicKeyFeatures.length > 0 ? dynamicKeyFeatures : defaultHighlights;

  const orderSteps: [string, string][] = [
    ['1. Tentukan Kuantitas', 'Pilih jumlah pesanan dimulai dari angka yang Anda butuhkan lalu klik Tambah Pesanan.'],
    ['2. Konfirmasi di Pop-up', 'Periksa ringkasan singkat item lalu klik Pesan Sekarang untuk masuk ke halaman detail transaksi.'],
    ['3. Lengkapi Pengiriman', 'Isi lokasi pengiriman dan catatan opsional pada halaman konfirmasi pesanan.'],
    ['4. Kirim via WhatsApp', 'Sistem akan merapikan format pesan belanja Anda langsung ke WhatsApp resmi admin.'],
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

      {/* ===== KONTEN UTAMA ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-10 shadow-sm">
        
        {/* GALERI FOTO */}
        <div className="lg:col-span-6 space-y-4">
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-amber-900/10 bg-[#FAF7F0] shadow-inner"
          >
            <Image
              src={images[selectedImage] || images[0]}
              alt={product.name}
              fill
              unoptimized
              priority
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="h-3 w-3" />
              Perbesar Gambar
            </span>
          </button>

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
                  <Image src={img} alt="" fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFORMASI & AKSI UTAMA */}
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

            <div className="text-3xl font-black text-[#5c0f1c] pt-2 font-serif">
              {formatRupiah(product.price)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-amber-900/10 text-xs font-semibold text-gray-700">
            {product.weight && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faWeightHanging} className="text-[#5c0f1c]" />
                <span>Berat: {product.weight}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBoxOpen} className="text-[#5c0f1c]" />
              <span>{(product.stock ?? 0) > 0 ? `Stok: ${product.stock} Tersedia` : 'Stok Pre-Order'}</span>
            </div>
            {(product.sales ?? 0) > 0 && (
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

          {/* AKSI: - + KUANTITAS DARI 0 & TOMBOL TAMBAH PESANAN */}
          <div className="space-y-4 pt-2">
            
            <div className="flex items-center justify-between bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70">
              <span className="text-xs font-bold text-[#3b0912]">Jumlah Pesanan</span>

              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 0}
                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-amber-100 text-gray-800 flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Kurangi Kuantitas"
                >
                  <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                </button>

                <span className="w-8 text-center text-sm font-black text-[#3b0912]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-7 h-7 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#3b0912] flex items-center justify-center font-bold transition cursor-pointer shadow-2xs"
                  title="Tambah Kuantitas"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-gray-500 font-medium">Total Estimasi:</span>
                <span className="font-black text-lg text-[#5c0f1c] font-serif">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              {/* Tombol TAMBAH PESANAN */}
              <button
                type="button"
                onClick={handleOpenModal}
                disabled={quantity <= 0}
                className={`flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-xs font-extrabold text-white shadow-md transition-all uppercase tracking-wider ${
                  quantity > 0
                    ? 'bg-[#5c0f1c] hover:bg-[#3b0912] cursor-pointer active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <FontAwesomeIcon icon={faCartPlus} className="h-4 w-4 text-amber-300" />
                <span>TAMBAH PESANAN</span>
              </button>
            </div>

          </div>

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

      {/* ===== POP-UP MODAL KONFIRMASI ITEM ===== */}
      {showModal && quantity > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-amber-100 relative animate-in fade-in zoom-in-95 duration-200 font-sans space-y-5">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                Rincian Pesanan
              </span>
              <h3 className="font-serif font-bold text-lg text-[#3b0912] mt-2">
                Item Ditambahkan
              </h3>
            </div>

            <div className="flex items-center gap-3.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                <Image
                  src={images[0]}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-[#5c0f1c] font-bold mt-0.5">
                  {formatRupiah(product.price)} / pcs
                </p>
                <p className="text-xs font-extrabold text-gray-700 mt-1">
                  Kuantitas: <span className="text-[#5c0f1c]">{quantity} pcs</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-500">Total Estimasi</span>
              <span className="font-serif font-black text-base text-[#5c0f1c]">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            {/* Tombol PESAN SEKARANG mengarahkan ke /checkout */}
            <button
              type="button"
              onClick={handleGoToCheckout}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
            >
              <span>PESAN SEKARANG</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION TAB DESKRIPSI */}
      <div className="mt-12 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-wrap gap-2 border-b border-amber-900/10 pb-4">
          <button
            onClick={() => setActiveTab('deskripsi')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'deskripsi'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Deskripsi & Keunggulan
          </button>
          <button
            onClick={() => setActiveTab('komposisi')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'komposisi'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Komposisi & Kemasan
          </button>
          <button
            onClick={() => setActiveTab('pemesanan')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'pemesanan'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Alur Pemesanan
          </button>
        </div>

        <div className="min-h-[180px]">
          {activeTab === 'deskripsi' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#3b0912] mb-3">Tentang Produk Ini</h3>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {product.long_description || product.description || 'Belum ada deskripsi lengkap.'}
                </div>
              </div>

              <div className="pt-4 border-t border-amber-900/10">
                <h4 className="font-serif font-bold text-base text-[#3b0912] mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-amber-500" />
                  <span>Keunggulan Utama:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-900/5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 mt-0.5 shrink-0" />
                      <span className="font-medium">{typeof item === 'string' ? item.trim() : item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'komposisi' && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#3b0912]">Detail Komposisi & Standar Kemasan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c0f1c]">Komposisi / Bahan Utama</span>
                  <p className="text-sm text-gray-700 font-medium whitespace-pre-line">
                    {product.ingredients || 'Menggunakan bahan-bahan alami pilihan berkualitas tinggi tanpa pengawet buatan.'}
                  </p>
                </div>
                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c0f1c] flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faBoxArchive} className="text-amber-600" />
                    <span>Standar Kemasan</span>
                  </span>
                  <p className="text-sm text-gray-700 font-medium whitespace-pre-line">
                    {product.packaging_standard || 'Dikemas menggunakan plastik kedap udara (food grade) tebal untuk menjamin kerenyahan dan aroma khas tetap terjaga.'}
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

      {/* LIGHTBOX */}
      {zoomOpen && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
          <div className="relative h-[75vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedImage] || images[0]}
              alt={product.name}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}