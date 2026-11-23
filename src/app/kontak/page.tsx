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
import { useLanguage } from '@/context/LanguageContext';

interface FaqItem {
  q: string;
  a: string;
}

export default function KontakPage(): React.ReactElement {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // State untuk data kontak, jam operasional, dan FAQ dari Supabase
  const [contactData, setContactData] = useState({
    whatsapp1: '089509604700',
    whatsapp2: '',
    instagram: 'suryasnack.banyuwangi',
    alamat:
      'Pusat Oleh-Oleh Khas Banyuwangi Surya Snack, Jl. Barong No.110, Lingkungan Watu Ulo R, Bakungan, Kec. Glagah, Kabupaten Banyuwangi, Jawa Timur 68431',
    tiktok: '@suryasnack',
    jam_operasional_senin_sabtu: '08.00 – 21.30 WIB',
    jam_operasional_minggu: '08.30 – 21.00 WIB',
  });

  const [dbFaqs, setDbFaqs] = useState<FaqItem[]>([]);
  const [, setLoadingContact] = useState(true);

  const t = {
    id: {
      heroBadgeTag: 'EST. 1998 • PUSAT OLEH-OLEH KHAS BANYUWANGI',
      heroTitlePart1: 'Mari Berkunjung &',
      heroTitlePart2: 'Terhubung dengan Kami.',
      heroDesc:
        'Berada di lokasi strategis jalur utama Banyuwangi dengan akses mudah dan area parkir luas. Mau belanja langsung di toko atau pesan oleh-oleh khas berkualitas tinggi dengan resep pusaka leluhur? Tim kami siap melayani Anda sepenuh hati.',
      waAdmin1: 'WHATSAPP ADMIN 1',
      waAdmin2: 'WHATSAPP ADMIN 2',
      directCall: 'TELEPON LANGSUNG',
      locationTag: 'Lokasi Strategis Toko Resmi',
      directionsBtn: 'Petunjuk Arah',
      viewMapsBtn: 'Lihat di Maps',
      copyBtn: 'Salin Alamat',
      copiedBtn: 'Tersalin!',
      openMapsBtn: 'Buka di Google Maps',
      tipsTitle: 'Keunggulan Lokasi Strategis Kami',
      tipsDesc:
        'Terletak di lokasi strategis pada jalur utama menuju pusat Kota Banyuwangi dan akses wisata Kawah Ijen dengan area parkir luas. Mudah dijangkau kendaraan pribadi maupun rombongan wisata dengan standar pelayanan artisan!',
      quickServiceTag: 'Layanan Cepat',
      contactDirectTitle: 'Hubungi Langsung',
      waAdmin1Card: 'WhatsApp Admin 1',
      waAdmin2Card: 'WhatsApp Admin 2',
      igCard: 'Instagram Resmi',
      tiktokCard: 'TikTok Resmi',
      hoursTitle: 'Jam Operasional Toko',
      hoursSub: 'Buka setiap hari, siap melayani',
      monSat: 'Senin – Sabtu',
      sun: 'Minggu',
      fastReplyNote: 'Respon chat cepat pada jam operasional',
      faqTag: 'Pertanyaan Umum',
      faqTitle: 'Sering Ditanyakan Pelanggan',
      faqSub:
        'Belum menemukan jawabannya? Silakan hubungi admin kami via WhatsApp, kami siap membantu Anda.',
      ctaBadge: 'Cita Rasa Khas Banyuwangi',
      ctaTitle: 'Siap Menikmati Kelezatan Khas Banyuwangi?',
      ctaDesc:
        'Jelajahi katalog lengkap kami atau langsung chat admin untuk rekomendasi camilan terbaik sesuai kebutuhanmu.',
      exploreBtn: 'Jelajahi Katalog',
      chatAdminBtn: 'Chat Admin',
      waDefaultMsg: 'Halo Surya Snack, saya ingin bertanya tentang produk oleh-oleh.',
      faqs: [
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
          a: 'Bisa banget! Toko kami berada di lokasi strategis dan buka setiap hari. Silakan datang langsung ke alamat pusat kami. Tersedia area parkir yang luas.',
        },
        {
          q: 'Metode pembayaran apa saja yang tersedia?',
          a: 'Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (OVO, DANA, GoPay, ShopeePay), QRIS, serta COD untuk area Banyuwangi.',
        },
      ],
    },
    en: {
      heroBadgeTag: 'EST. 1998 • BANYUWANGI AUTHENTIC SOUVENIR CENTER',
      heroTitlePart1: 'Visit &',
      heroTitlePart2: 'Connect with Us.',
      heroDesc:
        'Situated in a strategic location along Banyuwangi’s main route with easy access and spacious parking. Want to shop directly at our store or order high-quality souvenirs crafted from ancestral recipes? Our team is ready to serve you wholeheartedly.',
      waAdmin1: 'WHATSAPP ADMIN 1',
      waAdmin2: 'WHATSAPP ADMIN 2',
      directCall: 'DIRECT CALL',
      locationTag: 'Strategic Official Store Location',
      directionsBtn: 'Get Directions',
      viewMapsBtn: 'View on Maps',
      copyBtn: 'Copy Address',
      copiedBtn: 'Copied!',
      openMapsBtn: 'Open in Google Maps',
      tipsTitle: 'Strategic Location Advantages',
      tipsDesc:
        'Positioned in a strategic location along the main route toward central Banyuwangi and the Ijen Crater tourism corridor with spacious parking. Easy to reach by private cars or tour groups with artisan hospitality!',
      quickServiceTag: 'Quick Service',
      contactDirectTitle: 'Contact Directly',
      waAdmin1Card: 'WhatsApp Admin 1',
      waAdmin2Card: 'WhatsApp Admin 2',
      igCard: 'Official Instagram',
      tiktokCard: 'Official TikTok',
      hoursTitle: 'Store Operating Hours',
      hoursSub: 'Open daily, ready to serve',
      monSat: 'Monday – Saturday',
      sun: 'Sunday',
      fastReplyNote: 'Fast chat response during operating hours',
      faqTag: 'Frequently Asked Questions',
      faqTitle: 'Customer FAQ',
      faqSub:
        'Haven’t found your answer? Please reach out to our admin via WhatsApp, we’re happy to help.',
      ctaBadge: 'Authentic Banyuwangi Flavor',
      ctaTitle: 'Ready to Enjoy Authentic Banyuwangi Flavors?',
      ctaDesc:
        'Explore our complete catalog or chat directly with our admin for snack recommendations tailored to your needs.',
      exploreBtn: 'Explore Catalog',
      chatAdminBtn: 'Chat Admin',
      waDefaultMsg: 'Hello Surya Snack, I would like to ask about your souvenir products.',
      faqs: [
        {
          q: 'Can I place an order for delivery outside the city?',
          a: 'Of course! We ship nationwide across Indonesia via JNE, J&T, SiCepat, and Pos Indonesia. Our packaging is food-grade and specially designed to keep snacks intact until they arrive.',
        },
        {
          q: 'How long does order preparation take?',
          a: 'Orders are processed within 1x24 hours on working days. Products are made fresh from our kitchen on the same day before packing and shipping.',
        },
        {
          q: 'Is there a minimum order for shipping?',
          a: 'There is no specific minimum order for retail purchases. For wholesale or reseller orders, please chat with our admin for special pricing.',
        },
        {
          q: 'Can I visit the store in person?',
          a: 'Definitely! Our store is in a strategic location and open every day. Feel free to visit our main address, where spacious parking is available.',
        },
        {
          q: 'What payment methods are available?',
          a: 'We accept bank transfers (BCA, Mandiri, BRI, BNI), e-wallets (OVO, DANA, GoPay, ShopeePay), QRIS, as well as COD for the Banyuwangi area.',
        },
      ],
    },
  }[lang];

  useEffect(() => {
    async function fetchContactAndFaqs() {
      try {
        const { data: contactRes, error: contactErr } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', 'informasi_utama')
          .maybeSingle();

        if (contactErr) throw contactErr;
        if (contactRes) {
          setContactData({
            whatsapp1: contactRes.whatsapp1 || '089509604700',
            whatsapp2: contactRes.whatsapp2 || '',
            instagram: contactRes.instagram || 'suryasnack.banyuwangi',
            alamat:
              contactRes.alamat ||
              'Pusat Oleh-Oleh Khas Banyuwangi Surya Snack, Jl. Barong No.110, Lingkungan Watu Ulo R, Bakungan, Kec. Glagah, Kabupaten Banyuwangi, Jawa Timur 68431',
            tiktok: contactRes.tiktok || '@suryasnack',
            jam_operasional_senin_sabtu:
              contactRes.jam_operasional_senin_sabtu || '08.00 – 21.30 WIB',
            jam_operasional_minggu:
              contactRes.jam_operasional_minggu || '08.30 – 21.00 WIB',
          });
        }

        const { data: faqRes, error: faqErr } = await supabase
          .from('faqs')
          .select('*')
          .order('created_at', { ascending: true });

        if (faqErr) throw faqErr;

        if (faqRes && faqRes.length > 0) {
          setDbFaqs(
            faqRes.map((item: any) => ({
              q: item.question,
              a: item.answer,
            }))
          );
        }
      } catch (err) {
        console.error('Gagal memuat informasi kontak dan FAQ:', err);
      } finally {
        setLoadingContact(false);
      }
    }

    fetchContactAndFaqs();
  }, []);

  const faqs = lang === 'en' ? t.faqs : dbFaqs.length > 0 ? dbFaqs : t.faqs;

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

  const secondaryWa = contactData.whatsapp2
    ? formatWaNumber(contactData.whatsapp2)
    : '';

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

  const mapSearchAddress = encodeURIComponent(fullAddress);
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapSearchAddress}`;
  const googleMapsViewUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchAddress}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickContacts = [
    {
      icon: faWhatsapp,
      label: t.waAdmin1,
      value: waDisplay,
      href: `https://wa.me/${waNumber}?text=${encodeURIComponent(t.waDefaultMsg)}`,
      iconBg: 'bg-emerald-600/12 text-emerald-700',
    },
    ...(contactData.whatsapp2
      ? [
          {
            icon: faWhatsapp,
            label: t.waAdmin2,
            value: contactData.whatsapp2,
            href: `https://wa.me/${secondaryWa}?text=${encodeURIComponent(t.waDefaultMsg)}`,
            iconBg: 'bg-teal-600/12 text-teal-700',
          },
        ]
      : []),
    {
      icon: faPhone,
      label: t.directCall,
      value: waDisplay,
      href: `tel:+${waNumber}`,
      iconBg: 'bg-neutral-200/80 text-[#5A0A14]',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#2B211B] font-serif selection:bg-[#5A0A14] selection:text-amber-100 antialiased pt-14 sm:pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12 sm:space-y-16">
        {/* ===== HERO ===== */}
        <section className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-neutral-200 pb-8">
            <div className="space-y-2 max-w-3xl">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-sans font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
                {t.heroBadgeTag}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#5A0A14] tracking-tight leading-[1.08]">
                {t.heroTitlePart1}{' '}
                <span className="italic font-normal text-[#9A5D0A]">
                  {t.heroTitlePart2}
                </span>
              </h1>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#5f524a] max-w-md leading-relaxed">
              {t.heroDesc}
            </p>
          </div>

          {/* KARTU KONTAK CEPAT */}
          <div
            className={`grid grid-cols-1 gap-3.5 sm:gap-5 font-sans ${
              quickContacts.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            }`}
          >
            {quickContacts.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-3.5 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5A0A14]/35 hover:shadow-md"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.iconBg}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9A5D0A]">
                    {item.label}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[#2B211B] group-hover:text-[#5A0A14] transition-colors truncate">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ===== GRID UTAMA: LOKASI + KONTAK ===== */}
        <section>
          <div className="grid items-start gap-8 lg:grid-cols-12">
            {/* KOLOM KIRI: LOKASI & MAPS */}
            <div className="space-y-6 lg:col-span-7">
              <div className="flex flex-col space-y-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 shadow-2xs font-sans">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
                    {t.locationTag}
                  </span>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-200/80 text-[#5A0A14]">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <h2 className="text-xl font-serif font-bold leading-snug text-[#5A0A14] md:text-2xl">
                        Surya Snack
                      </h2>
                      <p className="text-xs sm:text-sm leading-relaxed text-[#5f524a]">
                        {fullAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#5A0A14] px-5 py-2.5 text-xs font-extrabold text-amber-200 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#46070F] uppercase tracking-wider"
                    >
                      <FontAwesomeIcon icon={faDirections} className="h-3.5 w-3.5" />
                      {t.directionsBtn}
                    </a>
                    <a
                      href={googleMapsViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-[#5A0A14] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 uppercase tracking-wider"
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3.5 w-3.5" />
                      {t.viewMapsBtn}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold shadow-2xs transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                        copied
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-neutral-300 bg-white text-[#2B211B] hover:border-[#5A0A14]/40 hover:text-[#5A0A14]'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={copied ? faCheck : faCopy}
                        className="h-3.5 w-3.5"
                      />
                      {copied ? t.copiedBtn : t.copyBtn}
                    </button>
                  </div>
                </div>

                <div className="group relative h-96 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200">
                  <iframe
                    title="Pusat Oleh-Oleh Khas Banyuwangi Surya Snack"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1778.0674498492522!2d114.35055334475906!3d-8.22083597406677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd1454c95cde09f%3A0x39d4a19b8f537844!2sOleh-oleh%20khas%20Banyuwangi%20Surya%20Snack!5e0!3m2!1sen!2sid!4v1795052457538!5m2!1sen!2sid"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 h-full w-full"
                  />

                  <a
                    href={googleMapsViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/95 border border-neutral-300 px-4 py-2 text-xs font-bold text-[#5A0A14] shadow-md backdrop-blur-md transition-all duration-200 hover:bg-[#5A0A14] hover:text-amber-200 font-sans"
                  >
                    <FontAwesomeIcon icon={faDirections} className="h-3 w-3" />
                    {t.openMapsBtn}
                  </a>
                </div>
              </div>

              {/* Keunggulan Lokasi Strategis */}
              <div className="flex items-start gap-4 rounded-3xl border border-neutral-200 bg-neutral-100 p-5 sm:p-6 font-sans">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#5A0A14] text-amber-200">
                  <FontAwesomeIcon icon={faCircleQuestion} className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-serif font-bold text-[#5A0A14]">
                    {t.tipsTitle}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#5f524a]">
                    {t.tipsDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: KONTAK & JAM OPERASIONAL */}
            <div className="flex flex-col gap-6 lg:col-span-5 lg:sticky lg:top-24 font-sans">
              <div className="space-y-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 shadow-2xs">
                <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
                  {t.quickServiceTag}
                </span>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#5A0A14]">
                  {t.contactDirectTitle}
                </h3>

                {/* WhatsApp 1 */}
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(t.waDefaultMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-emerald-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                    <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                      {t.waAdmin1Card}
                    </p>
                    <p className="truncate text-base font-bold text-[#2B211B] md:text-lg">
                      {waDisplay}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-4 w-4 shrink-0 text-emerald-600"
                  />
                </a>

                {/* WhatsApp 2 */}
                {contactData.whatsapp2 && (
                  <a
                    href={`https://wa.me/${secondaryWa}?text=${encodeURIComponent(t.waDefaultMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-teal-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                      <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700">
                        {t.waAdmin2Card}
                      </p>
                      <p className="truncate text-base font-bold text-[#2B211B] md:text-lg">
                        {contactData.whatsapp2}
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 shrink-0 text-teal-600"
                    />
                  </a>
                )}

                {/* Instagram */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-pink-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-400 hover:shadow-md"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                    <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-pink-700">
                      {t.igCard}
                    </p>
                    <p className="truncate text-base font-bold text-[#2B211B] md:text-lg">
                      {igHandle}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-4 w-4 shrink-0 text-pink-600"
                  />
                </a>

                {/* TikTok */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2B211B] hover:shadow-md"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2B211B] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                    <FontAwesomeIcon icon={faTiktok} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#5f524a]">
                      {t.tiktokCard}
                    </p>
                    <p className="truncate text-base font-bold text-[#2B211B] md:text-lg">
                      {tiktokHandle}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-4 w-4 shrink-0 text-[#2B211B]"
                  />
                </a>
              </div>

              {/* JAM OPERASIONAL */}
              <div className="relative overflow-hidden rounded-3xl bg-[#5A0A14] p-6 sm:p-8 text-amber-50 shadow-sm font-sans">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: 'radial-gradient(#fde68a 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="relative flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-amber-300/25 text-amber-200">
                    <FontAwesomeIcon icon={faClock} className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold text-amber-50">
                      {t.hoursTitle}
                    </h4>
                    <p className="text-xs text-amber-100/75">{t.hoursSub}</p>
                  </div>
                </div>

                <div className="relative mt-6 space-y-3 border-t border-amber-200/15 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-amber-100/90">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      {t.monSat}
                    </span>
                    <span className="text-sm font-bold text-amber-200">
                      {contactData.jam_operasional_senin_sabtu}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-amber-100/90">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      {t.sun}
                    </span>
                    <span className="text-sm font-bold text-amber-200">
                      {contactData.jam_operasional_minggu}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/10 border border-amber-200/15 p-3 text-center text-xs text-amber-100/85">
                    <FontAwesomeIcon
                      icon={faShieldHalved}
                      className="mr-1.5 h-3 w-3 text-amber-300"
                    />
                    {t.fastReplyNote}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION FAQ ===== */}
        <section className="max-w-4xl mx-auto font-sans">
          <div className="text-center space-y-2.5">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
              {t.faqTag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#5A0A14]">
              {t.faqTitle}
            </h2>
            <p className="mx-auto max-w-xl text-xs sm:text-sm text-[#5f524a]">
              {t.faqSub}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-[#5A0A14]/30 bg-white shadow-sm'
                      : 'border-neutral-200 bg-neutral-50 hover:border-[#5A0A14]/30 hover:bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6 cursor-pointer"
                  >
                    <span
                      className={`text-sm font-bold transition-colors md:text-base font-serif ${
                        isOpen ? 'text-[#5A0A14]' : 'text-[#2B211B]'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`h-3.5 w-3.5 shrink-0 text-[#5A0A14] transition-transform duration-300 ${
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
                      <p className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-[#5f524a] md:px-6">
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
        <section className="font-sans">
          <div className="relative overflow-hidden rounded-3xl bg-[#5A0A14] p-8 sm:p-12 md:p-16 text-center shadow-sm">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(#fde68a 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />

            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <div className="flex justify-center gap-3">
                <FontAwesomeIcon
                  icon={faTruckFast}
                  className="h-5 w-5 text-amber-200"
                />
                <FontAwesomeIcon
                  icon={faShieldHalved}
                  className="h-5 w-5 text-amber-200"
                />
                <FontAwesomeIcon
                  icon={faStore}
                  className="h-5 w-5 text-amber-200"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight tracking-tight text-amber-50">
                {t.ctaTitle}
              </h2>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed text-amber-100/80">
                {t.ctaDesc}
              </p>

              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <Link
                  href="/katalog"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-200 px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#5A0A14] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white shadow-sm"
                >
                  {t.exploreBtn}
                  <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(t.waDefaultMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/35 bg-white/10 px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-amber-100 transition-all duration-300 hover:border-amber-200 hover:bg-white/15"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
                  <span>{t.chatAdminBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}