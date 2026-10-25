// src/app/kontak/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faStore,
  faClock,
  faDirections,
  faCopy,
  faCheck,
  faPhone,
  faChevronDown,
  faTruckFast,
  faShieldHalved,
  faCircleQuestion,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faWhatsapp, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { supabase } from '@/lib/supabase';

export default function KontakPage(): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // State untuk data kontak dari database Supabase
  const [contactData, setContactData] = useState({
    whatsapp1: '089509604700',
    whatsapp2: '',
    instagram: 'suryasnack.banyuwangi',
    alamat: 'Pusat Oleh-Oleh Khas Banyuwangi Surya Snack, Jl. Barong No.110, Lingkungan Watu Ulo R, Bakungan, Kec. Glagah, Kabupaten Banyuwangi, Jawa Timur 68431',
    tiktok: '@suryasnack',
  });
  const [loadingContact, setLoadingContact] = useState(true);

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', 'informasi_utama')
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setContactData({
            whatsapp1: data.whatsapp1 || '089509604700',
            whatsapp2: data.whatsapp2 || '',
            instagram: data.instagram || 'suryasnack.banyuwangi',
            alamat: data.alamat || 'Pusat Oleh-Oleh Khas Banyuwangi Surya Snack, Jl. Barong No.110, Lingkungan Watu Ulo R, Bakungan, Kec. Glagah, Kabupaten Banyuwangi, Jawa Timur 68431',
            tiktok: data.tiktok || '@suryasnack',
          });
        }
      } catch (err) {
        console.error('Gagal memuat informasi kontak:', err);
      } finally {
        setLoadingContact(false);
      }
    }

    fetchContactInfo();
  }, []);

  const formatWaNumber = (num: string) => {
    let clean = num.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean;
  };

  const primaryWa = contactData.whatsapp1 || '089509604700';
  const waNumber = formatWaNumber(primaryWa);
  const waDisplay = primaryWa;

  const secondaryWa = contactData.whatsapp2 ? formatWaNumber(contactData.whatsapp2) : '';

  const igHandle = contactData.instagram.startsWith('@') 
    ? contactData.instagram 
    : `@${contactData.instagram}`;
  
  const rawIg = contactData.instagram.replace('@', '').trim();
  const instagramUrl = rawIg.startsWith('http') 
    ? rawIg 
    : `https://www.instagram.com/${rawIg}`;

  const tiktokHandle = contactData.tiktok.startsWith('@')
    ? contactData.tiktok
    : `@${contactData.tiktok}`;

  const rawTiktok = contactData.tiktok.replace('@', '').trim();
  const tiktokUrl = rawTiktok.startsWith('http')
    ? rawTiktok
    : `https://www.tiktok.com/@${rawTiktok}`;

  const fullAddress = contactData.alamat;
  
  const shortAddress = fullAddress.length > 70 
    ? fullAddress.substring(0, 70) + '...' 
    : fullAddress;

  const mapSearchAddress = encodeURIComponent(fullAddress);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapSearchAddress}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapSearchAddress}`;
  const googleMapsViewUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchAddress}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Contact Chips di atas (Email dihapus, WhatsApp 2 otomatis ikut jika diisi)
  const quickContacts = [
    {
      icon: faWhatsapp,
      label: 'WHATSAPP ADMIN 1',
      value: waDisplay,
      href: `https://wa.me/${waNumber}`,
      color: 'from-emerald-500/15 to-emerald-500/5',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
    },
    ...(contactData.whatsapp2
      ? [
          {
            icon: faWhatsapp,
            label: 'WHATSAPP ADMIN 2',
            value: contactData.whatsapp2,
            href: `https://wa.me/${secondaryWa}`,
            color: 'from-teal-500/15 to-teal-500/5',
            iconBg: 'bg-teal-500/15 text-teal-600',
          },
        ]
      : []),
    {
      icon: faPhone,
      label: 'TELEPON LANGSUNG',
      value: waDisplay,
      href: `tel:+${waNumber}`,
      color: 'from-amber-500/15 to-amber-500/5',
      iconBg: 'bg-amber-500/15 text-amber-600',
    },
  ];

  const faqs = [
    {
      q: 'Apakah bisa pesan untuk dikirim ke luar kota?',
      a: 'Tentu! Kami melayani pengiriman ke seluruh Indonesia via ekspedisi JNE, J&T, SiCepat, dan Pos Indonesia. Kemasan kami sudah food-grade dan dirancang khusus agar camilan tetap utuh sampai tujuan.',
    },
    {
      q: 'Berapa lama waktu produksi pesanan?',
      a: 'Pesanan diproses dalam 1x24 jam pada hari kerja. Produk dibuat fresh dari dapur produksi kami di hari yang sama sebelum dikemas dan dikirim.',
    },
    {
      q: 'Apakah ada minimum order untuk pengiriman?',
      a: 'Tidak ada minimum order khusus untuk pembelian retail. Untuk pembelian grosir atau reseller, silakan chat admin untuk penawaran harga khusus.',
    },
    {
      q: 'Bisakah saya mengunjungi toko langsung?',
      a: `Bisa banget! Toko kami buka setiap hari jam 08.00–21.30 WIB. Silakan datang langsung ke ${shortAddress}. Tersedia area parkir yang luas.`,
    },
    {
      q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (OVO, DANA, GoPay, ShopeePay), QRIS, serta COD untuk area Banyuwangi.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF8F5] font-sans text-gray-800 antialiased selection:bg-[#5c0f1c] selection:text-amber-100">
      
      {/* ===== BACKGROUND PREMIUM ===== */}
      <div className="absolute inset-0 -z-30 bg-[#FAF8F5]" />
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #5c0f1c 1px, transparent 1px), linear-gradient(to bottom, #5c0f1c 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse at center, transparent 8%, black 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 8%, black 72%)',
        }}
      />
      <div className="pointer-events-none absolute -top-48 -left-24 -z-10 h-170 w-170 rounded-full bg-linear-to-br from-amber-200/50 via-orange-100/25 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -right-32 -z-10 h-155 w-155 rounded-full bg-linear-to-bl from-rose-200/40 via-amber-100/20 to-transparent blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-162.5 w-162.5 rounded-full bg-linear-to-tr from-[rgba(92,15,28,0.08)] via-amber-100/25 to-transparent blur-[150px]" />

      <div className="relative z-10">
        
        {/* ===== HERO ===== */}
        <section className="mx-auto max-w-4xl px-4 pb-10 pt-24 text-center sm:px-6 sm:pb-14 sm:pt-28">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-400/40 bg-[#3b0912]/90 backdrop-blur-md shadow-xl mx-auto">
            <span className="text-amber-400 text-xs tracking-widest font-serif">★ EST. 1998 ★</span>
            <span className="w-1 h-1 rounded-full bg-amber-400"></span>
            <span className="text-amber-200 text-xs uppercase tracking-wider font-sans font-semibold">
              Pusat Oleh-Oleh Khas Banyuwangi
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-serif font-bold tracking-tight text-[#3b0912] sm:text-5xl md:text-6xl">
            Mari Berkunjung &{' '}
            <span className="italic font-normal text-[#5c0f1c]">
              Terhubung dengan Kami
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg font-sans font-light">
            Mau belanja langsung di toko atau pesan oleh-oleh khas berkualitas tinggi dengan resep pusaka leluhur? Tim kami siap melayani Anda sepenuh hati.
          </p>

          {/* Quick Contact Chips (Disesuaikan grid-nya agar pas dengan jumlah item) */}
          <div className={`mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:gap-4 font-sans ${quickContacts.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {quickContacts.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl border border-[#EBE3D5] bg-linear-to-br ${item.color} p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5c0f1c]/30 hover:shadow-md`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-gray-900 break-all sm:break-normal sm:truncate">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ===== GRID UTAMA: LOKASI + KONTAK ===== */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            
            {/* ===== KOLOM KIRI: LOKASI & MAPS (7 kolom) ===== */}
            <div className="space-y-6 lg:col-span-7">
              
              {/* Card Lokasi */}
              <div className="flex flex-col space-y-6 rounded-3xl border border-[#EBE3D5] bg-white p-6 shadow-xl shadow-gray-200/40 md:p-8 font-sans">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5c0f1c]">
                    <span className="h-0.5 w-4 rounded-full bg-[#5c0f1c]" />
                    Lokasi Toko Resmi
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5c0f1c]/10 text-[#5c0f1c]">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <h2 className="text-lg font-serif font-bold leading-snug text-[#3b0912] md:text-xl">
                        Surya Snack 
                      </h2>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {fullAddress}
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi Lokasi */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#3b0912] px-4 py-2.5 text-xs font-bold text-amber-200 shadow-md shadow-[#5c0f1c]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5c0f1c] hover:shadow-lg uppercase tracking-wider"
                    >
                      <FontAwesomeIcon icon={faDirections} className="h-3.5 w-3.5" />
                      Petunjuk Arah
                    </a>
                    <a
                      href={googleMapsViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#EBE3D5] bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5c0f1c]/30 hover:text-[#5c0f1c] uppercase tracking-wider"
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3.5 w-3.5" />
                      Lihat di Maps
                    </a>
                    <button
                      onClick={handleCopyAddress}
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold shadow-sm transition-all duration-200 uppercase tracking-wider ${
                        copied
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-[#EBE3D5] bg-white text-gray-700 hover:border-[#5c0f1c]/30 hover:text-[#5c0f1c]'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={copied ? faCheck : faCopy}
                        className="h-3.5 w-3.5"
                      />
                      {copied ? 'Tersalin!' : 'Salin Alamat'}
                    </button>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="group relative h-95 w-full overflow-hidden rounded-2xl border border-[#EBE3D5] bg-[#FAF6F0] shadow-inner">
                  <iframe
                    title="Pusat Oleh-Oleh Khas Banyuwangi Surya Snack"
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full"
                  />
                  
                  {/* Overlay "Buka di Maps" saat hover */}
                  <a
                    href={googleMapsViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-white/95 px-3.5 py-2 text-xs font-bold text-[#5c0f1c] shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white hover:shadow-lg font-sans"
                  >
                    <FontAwesomeIcon icon={faDirections} className="h-3 w-3" />
                    Buka di Google Maps
                  </a>
                </div>
              </div>

              {/* Tips Berkunjung */}
              <div className="flex items-start gap-4 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 md:p-6 font-sans">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                  <FontAwesomeIcon icon={faCircleQuestion} className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">
                    Tips Berkunjung ke Toko
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-600 md:text-sm font-light">
                    Area parkir luas tersedia di depan toko. Jika datang dari
                    arah Kawah Ijen, toko kami berada di jalur utama menuju Kota
                    Banyuwangi. Nikmati pengalaman belanja dengan standar pelayanan artisan!
                  </p>
                </div>
              </div>
            </div>

            {/* ===== KOLOM KANAN: KONTAK & JAM OPERASIONAL (5 kolom) ===== */}
            <div className="flex flex-col gap-6 lg:col-span-5 lg:sticky lg:top-24 font-sans">
              
              {/* Box Kontak Media Sosial */}
              <div className="space-y-5 rounded-3xl border border-[#EBE3D5] bg-white p-6 shadow-xl shadow-gray-200/40 md:p-8">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5c0f1c]">
                  <span className="h-0.5 w-4 rounded-full bg-[#5c0f1c]" />
                  Layanan Cepat
                </div>

                <h3 className="text-xl font-serif font-bold text-[#3b0912]">
                  Hubungi Langsung
                </h3>

                <p className="text-sm leading-relaxed text-gray-500 font-light">
                  Pilih channel favoritmu untuk respon personal dan hangat dari tim kami.
                </p>

                {/* WhatsApp 1 */}
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    'Halo Surya Snack, saya ingin bertanya tentang produk oleh-oleh.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30 transition-transform duration-200 group-hover:scale-105">
                    <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                      WhatsApp Admin 1
                    </p>
                    <p className="truncate text-base font-bold tracking-wide text-gray-900 md:text-lg">
                      {waDisplay}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-4 w-4 shrink-0 text-emerald-600 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>

                {/* WhatsApp 2 */}
                {contactData.whatsapp2 && (
                  <a
                    href={`https://wa.me/${secondaryWa}?text=${encodeURIComponent(
                      'Halo Surya Snack, saya ingin bertanya tentang produk oleh-oleh.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border-2 border-teal-100 bg-teal-50/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-500/30 transition-transform duration-200 group-hover:scale-105">
                      <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-teal-700">
                        WhatsApp Admin 2
                      </p>
                      <p className="truncate text-base font-bold tracking-wide text-gray-900 md:text-lg">
                        {contactData.whatsapp2}
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 shrink-0 text-teal-600 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </a>
                )}

                {/* Instagram */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border-2 border-pink-100 bg-pink-50/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-50 hover:shadow-lg"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-md shadow-pink-500/30 transition-transform duration-200 group-hover:scale-105">
                    <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-700">
                      Instagram Resmi
                    </p>
                    <p className="truncate text-base font-bold tracking-wide text-gray-900 md:text-lg">
                      {igHandle}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-4 w-4 shrink-0 text-pink-600 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>

                {/* TikTok */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border-2 border-zinc-200 bg-zinc-50/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-zinc-100 hover:shadow-lg"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-md shadow-black/20 transition-transform duration-200 group-hover:scale-105">
                    <FontAwesomeIcon icon={faTiktok} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">
                      TikTok Resmi
                    </p>
                    <p className="truncate text-base font-bold tracking-wide text-gray-900 md:text-lg">
                      {tiktokHandle}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-4 w-4 shrink-0 text-black transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
              </div>

              {/* Box Jam Operasional */}
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#5c0f1c] via-[#4a0c16] to-[#2e070e] p-6 text-white shadow-xl md:p-8 font-sans">
                {/* Pattern titik */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                    <FontAwesomeIcon icon={faClock} className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-white">
                      Jam Operasional Toko
                    </h4>
                    <p className="text-xs text-gray-300 font-light">
                      Buka setiap hari, siap melayani
                    </p>
                  </div>
                </div>

                <div className="relative mt-6 space-y-3 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-200 font-light">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Senin – Sabtu
                    </span>
                    <span className="text-sm font-bold text-amber-300">
                      08.00 – 21.30 WIB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-200 font-light">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Minggu
                    </span>
                    <span className="text-sm font-bold text-amber-300">
                      08.30 – 21.00 WIB
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl bg-white/5 p-3 text-center text-xs text-gray-300 font-light">
                    <FontAwesomeIcon
                      icon={faShieldHalved}
                      className="mr-1.5 h-3 w-3 text-amber-300"
                    />
                    Respon chat cepat pada jam operasional
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION FAQ ===== */}
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-20 font-sans">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5c0f1c]/10 bg-[#5c0f1c]/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5c0f1c]">
              <FontAwesomeIcon icon={faCircleQuestion} className="h-3 w-3" />
              Pertanyaan Umum
            </span>
            <h2 className="mt-4 text-2xl font-serif font-bold tracking-tight text-[#3b0912] sm:text-3xl">
              Sering Ditanyakan Pelanggan
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 md:text-base font-light">
              Belum menemukan jawabannya? Silakan hubungi admin kami via
              WhatsApp, kami siap membantu Anda.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-[#5c0f1c]/25 bg-white shadow-md'
                      : 'border-[#EBE3D5] bg-white/70 hover:border-[#5c0f1c]/20 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6 cursor-pointer"
                  >
                    <span
                      className={`text-sm font-bold transition-colors md:text-base font-serif ${
                        isOpen ? 'text-[#5c0f1c]' : 'text-gray-900'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`h-3.5 w-3.5 shrink-0 text-[#5c0f1c] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600 md:px-6 md:text-[15px] font-light">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== CTA AKHIR ===== */}
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-24 font-sans">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#5c0f1c] via-[#6b1220] to-[#3a0911] p-8 text-center shadow-2xl shadow-[#5c0f1c]/25 md:p-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <div className="flex justify-center gap-3">
                <FontAwesomeIcon
                  icon={faTruckFast}
                  className="h-5 w-5 text-amber-300"
                />
                <FontAwesomeIcon
                  icon={faShieldHalved}
                  className="h-5 w-5 text-amber-300"
                />
                <FontAwesomeIcon
                  icon={faStore}
                  className="h-5 w-5 text-amber-300"
                />
              </div>

              <h2 className="text-2xl font-serif font-bold leading-tight tracking-tight text-white md:text-4xl">
                Siap Menikmati Kelezatan Khas Banyuwangi?
              </h2>
              <p className="text-sm leading-relaxed text-white/70 md:text-base font-light">
                Jelajahi katalog lengkap kami atau langsung chat admin untuk
                rekomendasi camilan terbaik sesuai kebutuhanmu.
              </p>

              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <Link
                  href="/katalog"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#5c0f1c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Jelajahi Katalog
                  <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
                  <span>Chat Admin</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}