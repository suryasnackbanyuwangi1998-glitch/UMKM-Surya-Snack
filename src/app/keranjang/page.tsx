// src/app/keranjang/page.tsx
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
import { useStoreContact } from '@/context/ContactProvider';
import { useLanguage } from '@/context/LanguageContext';
import { formatRupiah } from '@/lib/products';

export default function KeranjangPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { waNumber } = useStoreContact();
  const { lang } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = {
    id: {
      back: 'Kembali ke Katalog',
      brandTag: 'EST. 1998 • KERANJANG PILIHAN PRODUK',
      titlePart1: 'Keranjang',
      titlePart2: 'Belanja.',
      subtitle:
        'Tinjau daftar camilan & minuman khas Banyuwangi pilihan Anda sebelum mengirimkan rincian konsultasi atau pemesanan langsung ke WhatsApp admin.',
      addMoreBtn: '+ Tambah Produk Lain',
      emptyTitle: 'Keranjang Belanja Masih Kosong',
      emptyDesc:
        'Anda belum menambahkan produk ke keranjang. Silakan jelajahi koleksi oleh-oleh khas Banyuwangi kami.',
      emptyBtn: 'Lihat Katalog Produk',
      selectedItems: 'Item Dipilih',
      clearCart: 'Kosongkan Keranjang',
      variantLabel: 'Varian:',
      removeTitle: 'Hapus produk',
      summaryTitle: 'Ringkasan Pilihan',
      nameLabel: 'Nama Anda (Opsional)',
      namePlaceholder: 'Contoh: Bu Ani / Pak Budi',
      addressLabel: 'Kecamatan / Kota Tujuan (Opsional)',
      addressPlaceholder: 'Contoh: Banyuwangi Kota / Surabaya',
      totalItemsLabel: 'Total Item Pilihan',
      estTotalLabel: 'Estimasi Total Produk',
      reviewBtn: 'Lihat Rincian & Kirim WhatsApp',
      addCatalogBtn: '+ Tambah Produk dari Katalog',
      modalTitle: 'Rincian Daftar Pilihan Produk',
      modalName: 'Nama:',
      modalAddress: 'Alamat/Kecamatan:',
      notFilled: '(Tidak diisi)',
      productListTitle: 'Daftar Produk',
      productTypes: 'Jenis Produk',
      modalTotal: 'Estimasi Total Harga:',
      editBtn: 'Kembali Edit',
      sendWaBtn: 'Kirim ke WhatsApp',
    },
    en: {
      back: 'Back to Catalog',
      brandTag: 'EST. 1998 • SELECTED PRODUCTS CART',
      titlePart1: 'Shopping',
      titlePart2: 'Cart.',
      subtitle:
        'Review your selected Banyuwangi snacks & beverages before sending your inquiry or order details directly to our WhatsApp admin.',
      addMoreBtn: '+ Add Other Products',
      emptyTitle: 'Your Shopping Cart is Empty',
      emptyDesc:
        'You have not added any items yet. Explore our signature Banyuwangi food and beverage catalog.',
      emptyBtn: 'Browse Product Catalog',
      selectedItems: 'Selected Items',
      clearCart: 'Clear Cart',
      variantLabel: 'Variant:',
      removeTitle: 'Remove product',
      summaryTitle: 'Selection Summary',
      nameLabel: 'Your Name (Optional)',
      namePlaceholder: 'e.g., Mrs. Ani / Mr. Budi',
      addressLabel: 'District / Destination City (Optional)',
      addressPlaceholder: 'e.g., Banyuwangi / Surabaya',
      totalItemsLabel: 'Total Selected Items',
      estTotalLabel: 'Estimated Product Total',
      reviewBtn: 'Review Details & Send WhatsApp',
      addCatalogBtn: '+ Add More from Catalog',
      modalTitle: 'Selected Products Summary',
      modalName: 'Name:',
      modalAddress: 'Address / District:',
      notFilled: '(Not provided)',
      productListTitle: 'Product List',
      productTypes: 'Product Types',
      modalTotal: 'Estimated Total Price:',
      editBtn: 'Back to Edit',
      sendWaBtn: 'Send to WhatsApp',
    },
  }[lang];

  const handleCheckoutWA = () => {
    if (cart.length === 0) return;

    let message =
      lang === 'en'
        ? `*PRODUCT INQUIRY / ORDER - SURYA SNACK*\n\n`
        : `*KONSULTASI / TANYA PRODUK - SURYA SNACK*\n\n`;

    if (customerName) {
      message +=
        lang === 'en'
          ? `👤 *Name:* ${customerName}\n`
          : `👤 *Nama Pembeli:* ${customerName}\n`;
    }
    if (customerAddress) {
      message +=
        lang === 'en'
          ? `📍 *District/City:* ${customerAddress}\n`
          : `📍 *Alamat/Kecamatan:* ${customerAddress}\n`;
    }

    message +=
      lang === 'en'
        ? `\n📦 *Selected Products (${totalItems} pcs):*\n`
        : `\n📦 *Daftar Produk yang Ingin Ditanyakan (${totalItems} pcs):*\n`;
    message += `-----------------------------------\n`;

    cart.forEach((item, index) => {
      const priceVal = item.product.price ?? 0;
      const itemTotal = priceVal * item.quantity;
      const variantText = item.product.selectedVariant
        ? ` (${item.product.selectedVariant})`
        : '';

      message += `${index + 1}. *${item.product.name}${variantText}*\n`;
      message +=
        lang === 'en'
          ? `   └ Qty: ${item.quantity} pcs | Price: ${formatRupiah(item.product.price)} = *${formatRupiah(itemTotal)}*\n`
          : `   └ Jumlah: ${item.quantity} pcs | Harga: ${formatRupiah(item.product.price)} = *${formatRupiah(itemTotal)}*\n`;
    });

    message += `-----------------------------------\n`;
    message +=
      lang === 'en'
        ? `💰 *ESTIMATED TOTAL:* *${formatRupiah(totalPrice)}*\n\n`
        : `💰 *ESTIMASI TOTAL:* *${formatRupiah(totalPrice)}*\n\n`;
    message +=
      lang === 'en'
        ? `Hello Admin Surya Snack, I would like to ask about availability, flavors, and details for the products above. Thank you! 🙏`
        : `Halo Kak Admin, saya ingin bertanya-tanya seputar ketersediaan, rasa, dan detail dari produk-produk di atas ya. Mohon informasinya, terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2B211B] font-serif pt-14 sm:pt-20 pb-24 selection:bg-[#5A0A14] selection:text-amber-100 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-10">
        {/* Header Editorial — Selaras dengan Beranda, Katalog, Tentang, & Kontak */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#5A0A14]/15 pb-7">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 rounded-full border border-[#5A0A14]/20 bg-[#FAF7F0] px-4 py-1.5 text-xs font-sans font-bold text-[#5A0A14] shadow-2xs transition hover:bg-[#5A0A14] hover:text-amber-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                <span>{t.back}</span>
              </Link>
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-sans font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
                {t.brandTag}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#5A0A14] tracking-tight leading-[1.08]">
              {t.titlePart1}{' '}
              <span className="italic font-normal text-[#9A5D0A]">
                {t.titlePart2}
              </span>
            </h1>
          </div>

          <div className="flex flex-col lg:items-end gap-3.5 max-w-md">
            <p className="font-sans text-xs sm:text-sm text-[#5f524a] lg:text-right leading-relaxed">
              {t.subtitle}
            </p>
            {cart.length > 0 && (
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center gap-2 bg-[#EFE6D5] hover:bg-[#5A0A14] text-[#5A0A14] hover:text-amber-200 border border-[#5A0A14]/20 font-sans font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition shadow-2xs w-fit"
              >
                <FontAwesomeIcon icon={faCartPlus} />
                <span>{t.addMoreBtn}</span>
              </Link>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#FAF7F0] rounded-3xl border border-dashed border-[#5A0A14]/25 p-12 sm:p-16 text-center space-y-4 font-sans shadow-2xs">
            <div className="w-16 h-16 bg-[#EFE6D5] text-[#5A0A14] border border-[#5A0A14]/15 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <FontAwesomeIcon icon={faShoppingBag} />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#5A0A14]">
              {t.emptyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#5f524a] max-w-md mx-auto leading-relaxed">
              {t.emptyDesc}
            </p>
            <div className="pt-2">
              <Link
                href="/katalog"
                className="bg-[#5A0A14] hover:bg-[#46070F] text-amber-200 font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition inline-flex items-center gap-2 shadow-sm"
              >
                <FontAwesomeIcon icon={faStore} />
                <span>{t.emptyBtn}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans items-start">
            {/* Daftar Item di Keranjang */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-extrabold text-[#9A5D0A] uppercase tracking-[0.2em]">
                  {t.selectedItems} ({totalItems} pcs)
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-bold text-[#9A5D0A] hover:text-[#5A0A14] hover:underline cursor-pointer transition"
                >
                  {t.clearCart}
                </button>
              </div>

              <div className="space-y-3">
                {cart.map((item: CartItem, index: number) => {
                  const displayImg =
                    item.product.image_url ||
                    (Array.isArray(item.product.images) ? item.product.images[0] : null) ||
                    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=200';

                  const uniqueKey = `${item.product.id}-${item.product.selectedVariant || 'utama'}-${index}`;

                  return (
                    <div
                      key={uniqueKey}
                      className="bg-[#FAF7F0] p-4 rounded-3xl border border-[#5A0A14]/15 shadow-2xs flex items-center gap-3.5 sm:gap-4 transition hover:border-[#5A0A14]/35"
                    >
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-white border border-[#5A0A14]/12 shrink-0">
                        <Image
                          src={displayImg}
                          alt={item.product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-serif font-bold text-[#5A0A14] truncate">
                          {item.product.name}
                        </h3>
                        {item.product.selectedVariant && (
                          <span className="inline-block bg-[#EFE6D5] text-[#5A0A14] border border-[#5A0A14]/15 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1">
                            {t.variantLabel} {item.product.selectedVariant}
                          </span>
                        )}
                        <p className="text-xs sm:text-sm font-black font-serif text-[#2B211B] mt-1">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      {/* Tombol Kuantitas (- / +) */}
                      <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-full border border-[#5A0A14]/20 shadow-2xs">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.product.selectedVariant
                            )
                          }
                          className="w-6 h-6 rounded-full bg-[#F5EFE6] hover:bg-[#EFE6D5] flex items-center justify-center text-xs font-bold text-[#5A0A14] cursor-pointer transition"
                        >
                          <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-[#5A0A14]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.product.selectedVariant
                            )
                          }
                          className="w-6 h-6 rounded-full bg-[#5A0A14] hover:bg-[#46070F] flex items-center justify-center text-xs font-bold text-amber-200 cursor-pointer transition"
                        >
                          <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.product.id, item.product.selectedVariant)
                        }
                        className="p-2 text-[#6b5a50] hover:text-[#5A0A14] transition cursor-pointer"
                        title={t.removeTitle}
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Ringkasan & Tombol Pop-up */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#5A0A14]/15 shadow-2xs space-y-5">
                <div className="border-b border-[#5A0A14]/12 pb-3.5 space-y-1">
                  <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#9A5D0A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
                    Surya Snack
                  </span>
                  <h2 className="font-serif font-bold text-xl text-[#5A0A14]">
                    {t.summaryTitle}
                  </h2>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5f524a] mb-1.5">
                      {t.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="w-full bg-white border border-[#5A0A14]/20 rounded-2xl px-4 py-2.5 text-xs text-[#2B211B] placeholder:text-[#9c8c82] focus:outline-none focus:border-[#5A0A14]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5f524a] mb-1.5">
                      {t.addressLabel}
                    </label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder={t.addressPlaceholder}
                      className="w-full bg-white border border-[#5A0A14]/20 rounded-2xl px-4 py-2.5 text-xs text-[#2B211B] placeholder:text-[#9c8c82] focus:outline-none focus:border-[#5A0A14]"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#5A0A14]/12 text-xs text-[#5f524a]">
                  <div className="flex justify-between">
                    <span>{t.totalItemsLabel}</span>
                    <span className="font-bold text-[#2B211B]">{totalItems} pcs</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#5A0A14] pt-2.5 border-t border-[#5A0A14]/12">
                    <span>{t.estTotalLabel}</span>
                    <span className="text-[#5A0A14] font-serif font-black text-xl">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#5A0A14] hover:bg-[#46070F] text-amber-200 font-extrabold py-3.5 rounded-full shadow-xs transition-all duration-300 flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  <FontAwesomeIcon icon={faFileInvoice} className="text-base text-amber-300" />
                  <span>{t.reviewBtn}</span>
                </button>

                <Link
                  href="/katalog"
                  className="w-full bg-[#EFE6D5] hover:bg-[#e5d9c3] text-[#5A0A14] border border-[#5A0A14]/20 font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center"
                >
                  <FontAwesomeIcon icon={faCartPlus} />
                  <span>{t.addCatalogBtn}</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MODAL / POP-UP RINCIAN PILIHAN */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#2B1607]/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
            <div className="bg-[#FAF7F0] w-full max-w-lg rounded-3xl shadow-2xl border border-[#5A0A14]/20 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="bg-[#5A0A14] text-amber-100 p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FontAwesomeIcon icon={faFileInvoice} className="text-amber-300 text-lg" />
                  <h3 className="font-serif font-bold text-base tracking-wide">
                    {t.modalTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-100 transition cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#2B211B]">
                <div className="bg-[#EFE6D5]/80 p-3.5 rounded-2xl border border-[#5A0A14]/15 space-y-1">
                  <p>
                    <strong className="text-[#5A0A14]">{t.modalName}</strong>{' '}
                    {customerName || t.notFilled}
                  </p>
                  <p>
                    <strong className="text-[#5A0A14]">{t.modalAddress}</strong>{' '}
                    {customerAddress || t.notFilled}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#5A0A14] uppercase tracking-wider mb-2 text-[11px]">
                    {t.productListTitle} ({cart.length} {t.productTypes} | Total {totalItems} pcs):
                  </h4>
                  <div className="divide-y divide-[#5A0A14]/12 border-y border-[#5A0A14]/12">
                    {cart.map((item, idx) => {
                      const itemPrice = item.product.price || 0;
                      const subtotal = itemPrice * item.quantity;

                      return (
                        <div key={idx} className="py-2.5 flex justify-between items-center gap-2">
                          <div>
                            <p className="font-bold text-[#2B211B]">
                              {item.product.name}{' '}
                              {item.product.selectedVariant
                                ? `(${item.product.selectedVariant})`
                                : ''}
                            </p>
                            <p className="text-[#6b5a50] text-[11px]">
                              {item.quantity} pcs x {formatRupiah(itemPrice)}
                            </p>
                          </div>
                          <span className="font-bold text-[#5A0A14] text-xs">
                            {formatRupiah(subtotal)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-sm font-bold text-[#5A0A14]">
                  <span>{t.modalTotal}</span>
                  <span className="text-[#5A0A14] text-lg font-serif font-black">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="p-5 bg-[#EFE6D5]/60 border-t border-[#5A0A14]/12 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white hover:bg-[#EFE6D5] text-[#5A0A14] font-bold py-3 rounded-full border border-[#5A0A14]/20 text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  {t.editBtn}
                </button>
                <button
                  type="button"
                  onClick={handleCheckoutWA}
                  className="flex-1 bg-[#18C95A] hover:bg-[#15b550] text-white font-bold py-3 rounded-full shadow-sm text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                  <span>{t.sendWaBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}