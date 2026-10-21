'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faClipboardCheck,
  faLocationDot,
  faNoteSticky,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { getProductById, formatRupiah } from '@/lib/products';
import type { Product } from '@/types';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id');
  const qtyParam = searchParams.get('qty');

  const quantity = parseInt(qtyParam || '1', 10);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [note, setNote] = useState('');

  const waNumber = '6289509604700'; // Nomor WhatsApp Admin Surya Snack

  useEffect(() => {
    async function fetchProduct() {
      if (productId) {
        const data = await getProductById(productId);
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] font-sans">
        <p className="text-xs font-bold text-gray-500 animate-pulse">Memuat Detail Transaksi...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] font-sans p-4 space-y-4 text-center">
        <h2 className="text-lg font-serif font-bold text-[#3b0912]">Produk Tidak Ditemukan</h2>
        <Link
          href="/katalog"
          className="bg-[#3b0912] text-amber-200 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const totalPrice = (product.price || 0) * quantity;

  const handleSendToWhatsApp = () => {
    let message = `*KONFIRMASI PESANAN BARU - SURYA SNACK*\n\n`;

    if (customerName) {
      message += `👤 *Nama Pembeli:* ${customerName}\n`;
    }
    if (deliveryLocation) {
      message += `📍 *Lokasi Pengiriman:* ${deliveryLocation}\n`;
    }
    if (note) {
      message += `📝 *Catatan:* ${note}\n`;
    }

    message += `\n📦 *Detail Produk:*\n`;
    message += `• *${product.name}*\n`;
    message += `• Jumlah: ${quantity} pcs x ${formatRupiah(product.price)}\n`;
    message += `-----------------------------------\n`;
    message += `💰 *TOTAL ESTIMASI:* *${formatRupiah(totalPrice)}*\n\n`;
    message += `Halo Admin, mohon proses pesanan ini dan infokan stok & total ongkirnya ya. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');
  };

  const displayImg =
    product.image_url ||
    (Array.isArray(product.images) ? product.images[0] : null) ||
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=400';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href={`/katalog/${product.slug}`}
            className="inline-flex items-center gap-2 text-xs font-sans font-bold text-[#5c0f1c] hover:underline uppercase tracking-wider"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Ubah Kuantitas / Kembali</span>
          </Link>
          <span className="text-xs font-sans uppercase tracking-widest text-gray-400 font-bold hidden sm:block">
            ✦ Detail Transaksi Pesanan ✦
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#3b0912] flex items-center gap-3">
          <FontAwesomeIcon icon={faClipboardCheck} className="text-amber-600" />
          <span>Konfirmasi Detail Transaksi</span>
        </h1>

        <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
          
          {/* Ringkasan Item */}
          <div>
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
              1. Ringkasan Item
            </h2>
            <div className="flex items-center gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-900/5">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                <Image src={displayImg} alt={product.name} fill unoptimized className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
                <p className="text-xs text-[#5c0f1c] font-bold mt-0.5">
                  {formatRupiah(product.price)} / pcs
                </p>
                <p className="text-xs font-extrabold text-gray-700 mt-1">
                  Kuantitas: <span className="text-[#5c0f1c]">{quantity} pcs</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Subtotal</span>
                <span className="font-serif font-black text-sm text-[#3b0912]">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Form Detail Pengiriman & Catatan */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
              2. Data Pengiriman & Catatan
            </h2>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faUser} className="text-[#5c0f1c]" />
                <span>Nama Lengkap Anda (Opsional)</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Ibu Rahma"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#5c0f1c]" />
                <span>Lokasi / Alamat Pengiriman</span>
              </label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Contoh: Kec. Giri, Banyuwangi Kota"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faNoteSticky} className="text-[#5c0f1c]" />
                <span>Catatan Opsional</span>
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Tolong dikemas dengan bubble wrap ekstra."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
              />
            </div>
          </div>

          {/* Rincian Total & Tombol WhatsApp */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600">Total Estimasi Harga Produk</span>
              <span className="font-serif font-black text-xl text-[#5c0f1c]">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
              <span>PESAN SEKARANG VIA WHATSAPP</span>
            </button>

            <p className="text-[10px] text-center text-gray-400">
              Rincian pesanan akan otomatis disusun dan dikirim ke admin WhatsApp Surya Snack.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs font-bold text-gray-500">Memuat...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}