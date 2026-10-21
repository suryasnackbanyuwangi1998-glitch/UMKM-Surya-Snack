'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faTrash,
  faPlus,
  faMinus,
  faArrowLeft,
  faShoppingBag,
  faStore,
  faFileInvoice,
  faXmark,
  faCartPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useCart, type CartItem } from '@/context/CartProvider';
import { formatRupiah } from '@/lib/products';

export default function KeranjangPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const waNumber = '6289509604700';

  const handleCheckoutWA = () => {
    if (cart.length === 0) return;

    let message = `*PESANAN BARU - SURYA SNACK BANYUWANGI*\n\n`;

    if (customerName) {
      message += `👤 *Nama Pembeli:* ${customerName}\n`;
    }
    if (customerAddress) {
      message += `📍 *Alamat/Kecamatan:* ${customerAddress}\n`;
    }

    message += `\n📦 *Daftar Belanjaan (${totalItems} pcs):*\n`;
    message += `-----------------------------------\n`;

    cart.forEach((item, index) => {
      const priceVal = item.product.price ?? 0;
      const itemTotal = priceVal * item.quantity;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   └ ${item.quantity} x ${formatRupiah(item.product.price)} = *${formatRupiah(itemTotal)}*\n`;
    });

    message += `-----------------------------------\n`;
    message += `💰 *TOTAL ESTIMASI:* *${formatRupiah(totalPrice)}*\n\n`;
    message += `Halo Admin, mohon info total ketersediaan stok dan ongkos kirimnya ya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif pt-28 pb-24 selection:bg-[#5c0f1c] selection:text-amber-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigasi Atas */}
        <div className="flex items-center justify-between">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-sans font-bold text-[#5c0f1c] hover:underline uppercase tracking-wider"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Kembali Lanjut Belanja</span>
          </Link>
          <span className="text-xs uppercase tracking-widest text-gray-400 font-bold hidden sm:block">
            ✦ Keranjang Belanja Multi-Item ✦
          </span>
        </div>

        {/* Header Judul & Tombol Tambah Produk */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#3b0912] flex items-center gap-3">
            <FontAwesomeIcon icon={faShoppingBag} className="text-amber-600" />
            <span>Keranjang Belanja Anda</span>
          </h1>
          {cart.length > 0 && (
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-[#5c0f1c] font-sans font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-xs"
            >
              <FontAwesomeIcon icon={faCartPlus} />
              <span>+ Tambah Produk Lain</span>
            </Link>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-amber-900/20 p-12 text-center space-y-4 font-sans shadow-xs">
            <div className="w-16 h-16 bg-amber-50 text-[#5c0f1c] rounded-full flex items-center justify-center mx-auto text-2xl">
              <FontAwesomeIcon icon={faShoppingBag} />
            </div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912]">Keranjang Belanja Masih Kosong</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Anda belum menambahkan camilan ke keranjang. Silakan jelajahi katalog khas Banyuwangi kami.
            </p>
            <div>
              <Link
                href="/katalog"
                className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition inline-flex items-center gap-2 shadow-md"
              >
                <FontAwesomeIcon icon={faStore} />
                <span>Lihat Katalog Produk</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
            
            {/* Daftar Item di Keranjang */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Item Dipilih ({totalItems} pcs)
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Kosongkan Keranjang
                </button>
              </div>

              <div className="space-y-3">
                {cart.map((item: CartItem) => {
                  const displayImg =
                    item.product.image_url ||
                    (Array.isArray(item.product.images) ? item.product.images[0] : null) ||
                    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=200';

                  return (
                    <div
                      key={item.product.id}
                      className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs flex items-center gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image
                          src={displayImg}
                          alt={item.product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-[#3b0912] truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs font-extrabold text-[#5c0f1c] mt-0.5">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      {/* Tombol Kuantitas (- / +) */}
                      <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                        title="Hapus produk"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Ringkasan & Tombol Pop-up */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-sm space-y-5">
                <h2 className="font-serif font-bold text-base text-[#3b0912] border-b border-gray-100 pb-3">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Nama Anda (Opsional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Bu Ani / Pak Budi"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Kecamatan / Kota Pengiriman (Opsional)
                    </label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Contoh: Banyuwangi Kota / Surabaya"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Item Belanja</span>
                    <span className="font-bold text-gray-800">{totalItems} pcs</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#3b0912] pt-2 border-t border-gray-100">
                    <span>Estimasi Total Produk</span>
                    <span className="text-[#5c0f1c] font-black text-base">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 text-xs uppercase tracking-widest cursor-pointer"
                >
                  <FontAwesomeIcon icon={faFileInvoice} className="text-lg" />
                  <span>Lihat Rincian & Kirim Pesanan</span>
                </button>

                <Link
                  href="/katalog"
                  className="w-full bg-amber-50 hover:bg-amber-100 text-[#5c0f1c] border border-amber-900/10 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider block text-center"
                >
                  <FontAwesomeIcon icon={faCartPlus} />
                  <span>+ Tambah Produk Lain dari Katalog</span>
                </Link>
              </div>
            </div>

          </div>
        )}

        {/* MODAL / POP-UP RINCIAN PESANAN */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-amber-900/10 overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="bg-[#3b0912] text-amber-100 p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FontAwesomeIcon icon={faFileInvoice} className="text-amber-400 text-lg" />
                  <h3 className="font-serif font-bold text-base tracking-wide">Rincian Nota Pesanan</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-100 transition cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700">
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-900/10 space-y-1">
                  <p><strong className="text-gray-900">Nama Pemesan:</strong> {customerName || '(Tidak diisi)'}</p>
                  <p><strong className="text-gray-900">Alamat/Kecamatan:</strong> {customerAddress || '(Tidak diisi)'}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2 text-[11px]">Daftar Produk ({totalItems} pcs):</h4>
                  <div className="divide-y divide-gray-100 border-y border-gray-100">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-2.5 flex justify-between items-center gap-2">
                        <div>
                          <p className="font-bold text-gray-900">{item.product.name}</p>
                          <p className="text-gray-500">{item.quantity} pcs x {formatRupiah(item.product.price)}</p>
                        </div>
                        <span className="font-bold text-[#5c0f1c]">
                          {formatRupiah((item.product.price || 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-sm font-bold text-[#3b0912] border-t border-gray-200">
                  <span>Total Estimasi Harga:</span>
                  <span className="text-[#5c0f1c] text-base font-black">{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              <div className="p-5 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl border border-gray-200 text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Kembali Edit
                </button>
                <button
                  type="button"
                  onClick={handleCheckoutWA}
                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}