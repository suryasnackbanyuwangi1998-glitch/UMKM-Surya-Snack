// src/app/tentang/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faLeaf,
  faHandshake,
  faHeart,
  faArrowRight,
  faBullseye,
  faUsers,
  faAward,
  faSeedling,
  faScroll,
  faQuoteLeft,
  faCircleCheck,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/lib/supabase';
import { getWaLink } from '@/lib/contacts';
import { useLanguage } from '@/context/LanguageContext';

export default function TentangKamiPage() {
  const { lang } = useLanguage();
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    async function fetchContact() {
      const { data } = await supabase
        .from('contacts')
        .select('whatsapp1')
        .eq('id', 'informasi_utama')
        .maybeSingle();
      if (data) setContactData(data);
    }
    fetchContact();
  }, []);

  const waHref = getWaLink(
    contactData?.whatsapp1,
    lang === 'en'
      ? 'Hello Surya Snack, I would like to inquire about Banyuwangi traditional souvenir products.'
      : 'Halo Surya Snack, saya ingin bertanya tentang produk oleh-oleh khas Banyuwangi.'
  );

  // Kamus terjemahan tanpa merubah tata letak / desain sedikitpun
  const t = {
    id: {
      subtitle: "★ EST. 1998 ★ TENTANG SURYA SNACK",
      titlePart1: "Warisan Cita Rasa,",
      titlePart2: "Menjaga Rasa Asli",
      description: "Berawal dari dapur sederhana di Banyuwangi pada tahun 1998, kami mendedikasikan diri untuk menghadirkan camilan tradisional berkualitas tinggi dengan resep pusaka leluhur.",
      photoBadge: "SEJAK 1998",
      photoQuote: "Konsistensi rasa otentik adalah resep utama kami bertahan hingga hari ini.",
      timelineHeader: "Perjalanan Waktu",
      timelineTitle: "Jejak Langkah Surya Snack",
      visionBadge: "Visi Utama",
      visionText: "Menjadi pusat oleh-oleh khas Banyuwangi terdepan dan terpercaya dengan menjunjung tinggi kualitas rasa tradisional serta kearifan lokal.",
      valuesHeader: "Kearifan Lokal",
      valuesTitle: "Nilai yang Kami Jaga",
      valuesDesc: "Pilar moral dan etika kerja yang dipegang teguh oleh seluruh tim Surya Snack — dari dapur produksi hingga sampai ke tangan Anda dengan penuh kepuasan.",
      ctaBadge: "Cita Rasa Khas Banyuwangi",
      ctaTitle: "Siap Menikmati Kelezatan Produk Kami?",
      ctaDesc: "Temukan berbagai pilihan camilan renyah dan gurih berkualitas tinggi yang siap melengkapi momen santai dan kebersamaan Anda.",
      explore: "Jelajahi Katalog",
      chat: "Chat Admin",
      stats: [
        { label: 'BERDIRI SEJAK', value: '1998', desc: 'Dari dapur kecil di belakang rumah.', tone: 'dark' },
        { label: 'RESMI & LEGAL', value: '2000', desc: 'Toko depan rumah & sertifikat lengkap.', tone: 'light' },
        { label: 'TAHUN PENGALAMAN', value: '25+', desc: 'Resep dijaga lintas generasi.', tone: 'light' },
        { label: 'PELANGGAN PUAS', value: '10rb+', desc: 'Dikirim ke berbagai kota di Indonesia.', tone: 'amber' },
      ],
      timeline: [
        { year: '1998', title: 'Awal yang Sederhana', desc: 'Surya Snack dirintis sebagai usaha rumahan berskala kecil di bagian belakang rumah.' },
        { year: '2000', title: 'Toko Resmi & Perizinan Lengkap', desc: 'Langkah besar diambil dengan membuka toko di bagian depan rumah.' },
        { year: 'SEKARANG', title: 'Tumbuh di Era Digital', desc: 'Kini Surya Snack melayani pemesanan online dan pengiriman ke berbagai kota.' },
      ],
      pilarMisi: [
        { num: '01', title: 'Kualitas Rasa', desc: 'Mengembangkan resep otentik dengan prinsip produksi tradisional untuk menghadirkan cita rasa terbaik.' },
        { num: '02', title: 'Mutu & Kualitas', desc: 'Menggunakan bahan baku alami pilihan tanpa pengawet tambahan agar produk aman dikonsumsi.' },
        { num: '03', title: 'Pemberdayaan Lokal', desc: 'Bermitra dengan UMKM dan petani lokal Banyuwangi dalam proses produksi untuk tumbuh bersama.' },
        { num: '04', title: 'Kepuasan Pelanggan', desc: 'Menghadirkan pelayanan hangat dan produk segar dengan konsistensi kualitas yang selalu terjaga.' },
      ],
      nilaiItems: [
        { title: 'Integritas & Kejujuran', desc: 'Transparansi penuh dalam setiap bahan baku dan proses pembuatan produk.' },
        { title: 'Komitmen Mutu', desc: 'Konsistensi rasa otentik yang selalu dijaga dari generasi ke generasi.' },
        { title: 'Keberlanjutan', desc: 'Kepedulian terhadap lingkungan dan kolaborasi erat bersama masyarakat lokal.' },
      ],
      heroChips: [
        { label: '100% Halal' },
        { label: 'Tanpa Pengawet' },
        { label: 'UMKM Lokal' },
      ],
    },
    en: {
      subtitle: "★ EST. 1998 ★ ABOUT SURYA SNACK",
      titlePart1: "Heritage of Taste,",
      titlePart2: "Preserving Original Flavor",
      description: "Starting from a humble kitchen in Banyuwangi in 1998, we are dedicated to bringing high-quality traditional snacks with ancestral heritage recipes.",
      photoBadge: "SINCE 1998",
      photoQuote: "Authentic taste consistency is our main recipe for surviving until today.",
      timelineHeader: "Timeline",
      timelineTitle: "The Journey of Surya Snack",
      visionBadge: "Core Vision",
      visionText: "To be the leading and trusted Banyuwangi souvenir center by upholding traditional taste quality and local wisdom.",
      valuesHeader: "Local Wisdom",
      valuesTitle: "Values We Uphold",
      valuesDesc: "Moral pillars and work ethics strictly held by the entire Surya Snack team — from the production kitchen to your hands with full satisfaction.",
      ctaBadge: "Authentic Banyuwangi Flavor",
      ctaTitle: "Ready to Enjoy Our Products?",
      ctaDesc: "Discover various choices of high-quality crispy and savory snacks ready to complete your relaxing and togetherness moments.",
      explore: "Explore Catalog",
      chat: "Chat Admin",
      stats: [
        { label: 'ESTABLISHED', value: '1998', desc: 'From a small backyard kitchen.', tone: 'dark' },
        { label: 'OFFICIAL & LEGAL', value: '2000', desc: 'Store front & full certification.', tone: 'light' },
        { label: 'YEARS EXPERIENCE', value: '25+', desc: 'Recipes preserved across generations.', tone: 'light' },
        { label: 'SATISFIED CLIENTS', value: '10k+', desc: 'Shipped to various cities in Indonesia.', tone: 'amber' },
      ],
      timeline: [
        { year: '1998', title: 'A Humble Beginning', desc: 'Surya Snack started as a small-scale home business in the backyard.' },
        { year: '2000', title: 'Official Store & Licensing', desc: 'A big step taken by opening a store in front of the house.' },
        { year: 'NOW', title: 'Growing in the Digital Era', desc: 'Now Surya Snack serves online orders and nationwide shipping.' },
      ],
      pilarMisi: [
        { num: '01', title: 'Taste Quality', desc: 'Developing authentic recipes with traditional production principles to deliver the best taste.' },
        { num: '02', title: 'Quality & Mutu', desc: 'Using selected natural raw materials without artificial preservatives for safe consumption.' },
        { num: '03', title: 'Local Empowerment', desc: 'Partnering with local MSMEs and farmers in Banyuwangi to grow together.' },
        { num: '04', title: 'Customer Satisfaction', desc: 'Providing warm service and fresh products with consistent quality.' },
      ],
      nilaiItems: [
        { title: 'Integrity & Honesty', desc: 'Full transparency in every raw material and product manufacturing process.' },
        { title: 'Quality Commitment', desc: 'Authentic taste consistency preserved from generation to generation.' },
        { title: 'Sustainability', desc: 'Environmental care and close collaboration with local communities.' },
      ],
      heroChips: [
        { label: '100% Halal' },
        { label: 'Preservative-Free' },
        { label: 'Local MSME' },
      ],
    },
  }[lang];

  const aboutImage = '/foto-depan.jpeg';
  const pilarIcons = [faLeaf, faAward, faHandshake, faHeart];
  const pilarMisi = t.pilarMisi.map((item, idx) => ({
    ...item,
    icon: pilarIcons[idx % pilarIcons.length],
  }));

  const nilaiIcons = [faScroll, faSeedling, faUsers];
  const nilaiItems = t.nilaiItems.map((item, idx) => ({
    ...item,
    icon: nilaiIcons[idx % nilaiIcons.length],
  }));

  const heroChipIcons = [faCircleCheck, faLeaf, faStore];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF8F5] font-sans text-gray-800 antialiased selection:bg-[#5c0f1c] selection:text-amber-100">

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

        {/* HERO */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">

            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-400/40 bg-[#3b0912]/90 backdrop-blur-md shadow-xl">
                <span className="text-amber-200 text-xs uppercase tracking-wider font-sans font-semibold">
                  {t.subtitle}
                </span>
              </div>

              <h1 className="text-4xl font-serif font-bold leading-[1.08] tracking-tight text-[#3b0912] sm:text-5xl md:text-6xl">
                {t.titlePart1} <span className="italic font-normal text-[#5c0f1c]">{t.titlePart2}</span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-gray-600 md:text-lg font-sans font-light">
                {t.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-1 font-sans">
                {t.heroChips.map((chip, idx) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EBE3D5] bg-white/80 px-3.5 py-1.5 text-xs font-bold text-gray-600 shadow-sm"
                  >
                    <FontAwesomeIcon icon={heroChipIcons[idx]} className="h-3 w-3 text-[#5c0f1c]" />
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Statistik Dinamis */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-5 font-sans">
              {t.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col justify-between space-y-2 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6 ${stat.tone === 'dark'
                      ? 'bg-[#5c0f1c] text-white shadow-lg shadow-[#5c0f1c]/25'
                      : stat.tone === 'amber'
                        ? 'border border-amber-200/60 bg-amber-50 shadow-sm hover:shadow-md'
                        : 'border border-[#EBE3D5] bg-white shadow-sm hover:shadow-md'
                    }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest sm:text-xs ${stat.tone === 'dark'
                        ? 'text-amber-300'
                        : stat.tone === 'amber'
                          ? 'text-amber-700'
                          : 'text-[#5c0f1c]'
                      }`}
                  >
                    {stat.label}
                  </span>
                  <p
                    className={`text-3xl font-serif font-extrabold tracking-tight sm:text-4xl ${stat.tone === 'dark' ? 'text-white' : 'text-[#3b0912]'
                      }`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-[11px] leading-relaxed sm:text-xs font-light ${stat.tone === 'dark' ? 'text-white/70' : 'text-gray-500'
                      }`}
                  >
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 1 — TIMELINE & FOTO TOKO */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 font-sans">
          <div className="grid items-stretch overflow-hidden rounded-3xl border border-[#EBE3D5] bg-white shadow-xl lg:grid-cols-12">

            <div className="relative min-h-70 sm:min-h-90 lg:col-span-5 lg:min-h-0">
              <Image
                src={aboutImage}
                alt="Toko Surya Snack Banyuwangi"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute left-6 top-6 rounded-full bg-[#5c0f1c] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-md">
                {t.photoBadge}
              </span>
              <p className="absolute inset-x-6 bottom-6 text-sm font-serif italic leading-relaxed text-white sm:text-base">
                &ldquo;{t.photoQuote}&rdquo;
              </p>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-7">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5c0f1c]">
                  {t.timelineHeader}
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#3b0912] md:text-3xl">
                  {t.timelineTitle}
                </h2>
              </div>

              <div className="relative mt-8 space-y-9">
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 left-2.25 top-2 w-0.5 bg-[#EBE3D5]"
                />
                {t.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-10">
                    <span className="absolute left-0 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#5c0f1c] bg-white shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5c0f1c]" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-[#5c0f1c]">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-base font-serif font-bold text-gray-900 md:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base font-light">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — VISI & PILAR MISI */}
        <section className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 sm:py-16 font-sans">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#5c0f1c] to-[#3a0911] p-8 text-white shadow-xl md:p-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="pointer-events-none absolute -top-10 right-0 h-48 w-48 translate-x-8 rounded-full bg-white/5 blur-xl" />
            <div className="relative z-10 mx-auto max-w-3xl space-y-5 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                <FontAwesomeIcon icon={faBullseye} className="h-3.5 w-3.5" />
                {t.visionBadge}
              </span>
              <FontAwesomeIcon
                icon={faQuoteLeft}
                className="mx-auto h-7 w-7 text-amber-300/50"
              />
              <blockquote className="font-serif text-xl italic leading-relaxed text-gray-100 md:text-2xl">
                &ldquo;{t.visionText}&rdquo;
              </blockquote>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pilarMisi.map((item: any) => (
              <div
                key={item.num}
                className="group relative flex flex-col justify-between space-y-4 overflow-hidden rounded-2xl border border-[#EBE3D5] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#5c0f1c]/30 hover:shadow-xl"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#5c0f1c] to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#5c0f1c] shadow-sm transition-colors duration-300 group-hover:bg-[#5c0f1c] group-hover:text-white">
                    <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-black text-gray-200 transition-colors duration-300 group-hover:text-[#5c0f1c]/20 font-serif">
                    {item.num}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-serif font-bold text-[#3b0912]">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — NILAI YANG KAMI JAGA */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 font-sans">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">

            <div className="lg:col-span-4">
              <div className="space-y-4 lg:sticky lg:top-28">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5c0f1c]">
                  {t.valuesHeader}
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#3b0912] md:text-3xl">
                  {t.valuesTitle}
                </h2>
                <p className="text-sm leading-relaxed text-gray-500 md:text-base font-light">
                  {t.valuesDesc}
                </p>
                <div className="hidden h-1 w-16 rounded-full bg-linear-to-r from-[#5c0f1c] to-amber-400 lg:block" />
              </div>
            </div>

            <div className="divide-y divide-[#EBE3D5] border-y border-[#EBE3D5] lg:col-span-8">
              {nilaiItems.map((item: any, idx: number) => (
                <div
                  key={item.title}
                  className="group -mx-4 flex items-start gap-5 rounded-2xl px-4 py-7 transition-colors duration-300 hover:bg-white/70 md:py-8"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] transition-colors duration-300 group-hover:bg-[#5c0f1c] group-hover:text-white">
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="text-base font-serif font-bold text-[#3b0912] md:text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 font-light">{item.desc}</p>
                  </div>
                  <span className="text-2xl font-black text-gray-200 transition-colors duration-300 group-hover:text-[#5c0f1c]/20 font-serif">
                    0{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — CTA */}
        <section className="mx-auto max-w-5xl px-4 pb-20 pt-4 sm:px-6 sm:pb-24 font-sans">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#5c0f1c] via-[#6b1220] to-[#3a0911] p-10 text-center shadow-2xl shadow-[#5c0f1c]/25 md:p-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
                <FontAwesomeIcon icon={faQuoteLeft} className="h-3 w-3" />
                {t.ctaBadge}
              </span>

              <h2 className="text-3xl font-serif font-bold leading-tight tracking-tight text-white md:text-4xl">
                {t.ctaTitle}
              </h2>

              <p className="text-sm leading-relaxed text-white/70 md:text-base font-light">
                {t.ctaDesc}
              </p>

              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <Link
                  href="/katalog"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#5c0f1c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {t.explore}
                  <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-white/60 hover:bg-white/15"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
                  <span>{t.chat}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}