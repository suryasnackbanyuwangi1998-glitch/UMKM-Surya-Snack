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
} from '@fortawesome/free-solid-svg-icons';
import { useCart, type CartItem } from '@/context/CartProvider';
import { formatRupiah } from '@/lib/products';

export default function KeranjangPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
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

    cart.forEach((item: CartItem, index: number) => {
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
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif pt-28 pb-24 selection:bg-[#5c0f1c] selection:text-amber-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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

        <h1 className="text-2xl sm:text-4xl font-bold text-[#3b0912] flex items-center gap-3">
          <FontAwesomeIcon icon={faShoppingBag} className="text-amber-600" />
          <span>Keranjang Belanja Anda</span>
        </h1>

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

                      <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
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
                  onClick={handleCheckoutWA}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 text-xs uppercase tracking-widest cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                  <span>Kirim Pesanan ke WhatsApp</span>
                </button>

                <p className="text-[10px] text-center text-gray-400 leading-relaxed">
                  Pesan ringkasan item belanjaan akan langsung terkirim otomatis ke WhatsApp resmi Surya Snack Banyuwangi.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}