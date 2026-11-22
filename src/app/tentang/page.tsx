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

  const t = {
    id: {
      subtitle: 'EST. 1998 • TENTANG SURYA SNACK',
      titlePart1: 'Warisan Cita Rasa,',
      titlePart2: 'Menjaga Rasa Asli.',
      description:
        'Berawal dari dapur sederhana di Banyuwangi pada tahun 1998, kami mendedikasikan diri untuk menghadirkan camilan tradisional berkualitas tinggi dengan resep pusaka leluhur.',
      photoBadge: 'SEJAK 1998',
      photoQuote:
        'Konsistensi rasa otentik adalah resep utama kami bertahan hingga hari ini.',
      timelineHeader: 'Perjalanan Waktu',
      timelineTitle: 'Jejak Langkah Surya Snack',
      visionBadge: 'Visi Utama',
      visionText:
        'Menjadi pusat oleh-oleh khas Banyuwangi terdepan dan terpercaya dengan menjunjung tinggi kualitas rasa tradisional serta kearifan lokal.',
      valuesHeader: 'Kearifan Lokal',
      valuesTitle: 'Nilai yang Kami Jaga',
      valuesDesc:
        'Pilar moral dan etika kerja yang dipegang teguh oleh seluruh tim Surya Snack — dari dapur produksi hingga sampai ke tangan Anda dengan penuh kepuasan.',
      ctaBadge: 'Cita Rasa Khas Banyuwangi',
      ctaTitle: 'Siap Menikmati Kelezatan Produk Kami?',
      ctaDesc:
        'Temukan berbagai pilihan camilan renyah dan gurih berkualitas tinggi yang siap melengkapi momen santai dan kebersamaan Anda.',
      explore: 'Jelajahi Katalog',
      chat: 'Chat Admin',
      stats: [
        {
          label: 'BERDIRI SEJAK',
          value: '1998',
          desc: 'Dari dapur kecil di belakang rumah.',
          tone: 'dark',
        },
        {
          label: 'RESMI & LEGAL',
          value: '2000',
          desc: 'Toko depan rumah & sertifikat lengkap.',
          tone: 'light',
        },
        {
          label: 'TAHUN PENGALAMAN',
          value: '25+',
          desc: 'Resep dijaga lintas generasi.',
          tone: 'light',
        },
        {
          label: 'PELANGGAN PUAS',
          value: '10rb+',
          desc: 'Dikirim ke berbagai kota di Indonesia.',
          tone: 'amber',
        },
      ],
      timeline: [
        {
          year: '1998',
          title: 'Awal yang Sederhana',
          desc: 'Surya Snack dirintis sebagai usaha rumahan berskala kecil di bagian belakang rumah.',
        },
        {
          year: '2000',
          title: 'Toko Resmi & Perizinan Lengkap',
          desc: 'Langkah besar diambil dengan membuka toko di bagian depan rumah.',
        },
        {
          year: 'SEKARANG',
          title: 'Tumbuh di Era Digital',
          desc: 'Kini Surya Snack melayani pemesanan online dan pengiriman ke berbagai kota.',
        },
      ],
      pilarMisi: [
        {
          num: '01',
          title: 'Kualitas Rasa',
          desc: 'Mengembangkan resep otentik dengan prinsip produksi tradisional untuk menghadirkan cita rasa terbaik.',
        },
        {
          num: '02',
          title: 'Mutu & Kualitas',
          desc: 'Menggunakan bahan baku alami pilihan tanpa pengawet tambahan agar produk aman dikonsumsi.',
        },
        {
          num: '03',
          title: 'Pemberdayaan Lokal',
          desc: 'Bermitra dengan UMKM dan petani lokal Banyuwangi dalam proses produksi untuk tumbuh bersama.',
        },
        {
          num: '04',
          title: 'Kepuasan Pelanggan',
          desc: 'Menghadirkan pelayanan hangat dan produk segar dengan konsistensi kualitas yang selalu terjaga.',
        },
      ],
      nilaiItems: [
        {
          title: 'Integritas & Kejujuran',
          desc: 'Transparansi penuh dalam setiap bahan baku dan proses pembuatan produk.',
        },
        {
          title: 'Komitmen Mutu',
          desc: 'Konsistensi rasa otentik yang selalu dijaga dari generasi ke generasi.',
        },
        {
          title: 'Keberlanjutan',
          desc: 'Kepedulian terhadap lingkungan dan kolaborasi erat bersama masyarakat lokal.',
        },
      ],
      heroChips: [
        { label: '100% Halal' },
        { label: 'Tanpa Pengawet' },
        { label: 'UMKM Lokal' },
      ],
    },
    en: {
      subtitle: 'EST. 1998 • ABOUT SURYA SNACK',
      titlePart1: 'Heritage of Taste,',
      titlePart2: 'Preserving Original Flavor.',
      description:
        'Starting from a humble kitchen in Banyuwangi in 1998, we are dedicated to bringing high-quality traditional snacks with ancestral heritage recipes.',
      photoBadge: 'SINCE 1998',
      photoQuote:
        'Authentic taste consistency is our main recipe for surviving until today.',
      timelineHeader: 'Timeline',
      timelineTitle: 'The Journey of Surya Snack',
      visionBadge: 'Core Vision',
      visionText:
        'To be the leading and trusted Banyuwangi souvenir center by upholding traditional taste quality and local wisdom.',
      valuesHeader: 'Local Wisdom',
      valuesTitle: 'Values We Uphold',
      valuesDesc:
        'Moral pillars and work ethics strictly held by the entire Surya Snack team — from the production kitchen to your hands with full satisfaction.',
      ctaBadge: 'Authentic Banyuwangi Flavor',
      ctaTitle: 'Ready to Enjoy Our Products?',
      ctaDesc:
        'Discover various choices of high-quality crispy and savory snacks ready to complete your relaxing and togetherness moments.',
      explore: 'Explore Catalog',
      chat: 'Chat Admin',
      stats: [
        {
          label: 'ESTABLISHED',
          value: '1998',
          desc: 'From a small backyard kitchen.',
          tone: 'dark',
        },
        {
          label: 'OFFICIAL & LEGAL',
          value: '2000',
          desc: 'Store front & full certification.',
          tone: 'light',
        },
        {
          label: 'YEARS EXPERIENCE',
          value: '25+',
          desc: 'Recipes preserved across generations.',
          tone: 'light',
        },
        {
          label: 'SATISFIED CLIENTS',
          value: '10k+',
          desc: 'Shipped to various cities in Indonesia.',
          tone: 'amber',
        },
      ],
      timeline: [
        {
          year: '1998',
          title: 'A Humble Beginning',
          desc: 'Surya Snack started as a small-scale home business in the backyard.',
        },
        {
          year: '2000',
          title: 'Official Store & Licensing',
          desc: 'A big step taken by opening a store in front of the house.',
        },
        {
          year: 'NOW',
          title: 'Growing in the Digital Era',
          desc: 'Now Surya Snack serves online orders and nationwide shipping.',
        },
      ],
      pilarMisi: [
        {
          num: '01',
          title: 'Taste Quality',
          desc: 'Developing authentic recipes with traditional production principles to deliver the best taste.',
        },
        {
          num: '02',
          title: 'Quality & Mutu',
          desc: 'Using selected natural raw materials without artificial preservatives for safe consumption.',
        },
        {
          num: '03',
          title: 'Local Empowerment',
          desc: 'Partnering with local MSMEs and farmers in Banyuwangi to grow together.',
        },
        {
          num: '04',
          title: 'Customer Satisfaction',
          desc: 'Providing warm service and fresh products with consistent quality.',
        },
      ],
      nilaiItems: [
        {
          title: 'Integrity & Honesty',
          desc: 'Full transparency in every raw material and product manufacturing process.',
        },
        {
          title: 'Quality Commitment',
          desc: 'Authentic taste consistency preserved from generation to generation.',
        },
        {
          title: 'Sustainability',
          desc: 'Environmental care and close collaboration with local communities.',
        },
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
    <div className="min-h-screen bg-[#F5EFE6] text-[#2B211B] font-serif selection:bg-[#5A0A14] selection:text-amber-100 antialiased pt-14 sm:pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-14 sm:space-y-20">
        {/* HERO — SELARAS DENGAN HEADER BERANDA & KATALOG */}
        <section className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#5A0A14]/15 pb-8">
            <div className="space-y-2 max-w-3xl">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-sans font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
                {t.subtitle}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#5A0A14] tracking-tight leading-[1.08]">
                {t.titlePart1}{' '}
                <span className="italic font-normal text-[#9A5D0A]">
                  {t.titlePart2}
                </span>
              </h1>
            </div>

            <div className="space-y-4 max-w-md font-sans">
              <p className="text-xs sm:text-sm text-[#5f524a] leading-relaxed">
                {t.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {t.heroChips.map((chip, idx) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#5A0A14]/15 bg-[#FAF7F0] px-3.5 py-1.5 text-xs font-bold text-[#5A0A14] shadow-2xs"
                  >
                    <FontAwesomeIcon
                      icon={heroChipIcons[idx]}
                      className="h-3 w-3 text-[#9A5D0A]"
                    />
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* STATISTIK DALAM KARTU EDITORIAL */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 font-sans">
            {t.stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between space-y-2.5 rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 ${
                  stat.tone === 'dark'
                    ? 'bg-[#5A0A14] text-amber-100 shadow-sm'
                    : stat.tone === 'amber'
                      ? 'border border-[#9A5D0A]/25 bg-[#EFE6D5] shadow-2xs'
                      : 'border border-[#5A0A14]/15 bg-[#FAF7F0] shadow-2xs'
                }`}
              >
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${
                    stat.tone === 'dark'
                      ? 'text-amber-300'
                      : stat.tone === 'amber'
                        ? 'text-[#9A5D0A]'
                        : 'text-[#5A0A14]'
                  }`}
                >
                  {stat.label}
                </span>
                <p
                  className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
                    stat.tone === 'dark' ? 'text-white' : 'text-[#5A0A14]'
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-xs leading-relaxed ${
                    stat.tone === 'dark' ? 'text-amber-100/80' : 'text-[#5f524a]'
                  }`}
                >
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 1 — TIMELINE & FOTO TOKO */}
        <section className="font-sans">
          <div className="grid items-stretch overflow-hidden rounded-3xl border border-[#5A0A14]/15 bg-[#FAF7F0] shadow-xs lg:grid-cols-12">
            <div className="relative min-h-72 sm:min-h-96 lg:col-span-5 lg:min-h-0">
              <Image
                src={aboutImage}
                alt="Toko Surya Snack Banyuwangi"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#2B1607]/85 via-[#2B1607]/15 to-transparent" />
              <span className="absolute left-6 top-6 rounded-full bg-[#5A0A14] border border-amber-300/30 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-amber-200 shadow-sm">
                {t.photoBadge}
              </span>
              <p className="absolute inset-x-6 bottom-6 text-sm font-serif italic leading-relaxed text-amber-50 sm:text-base">
                &ldquo;{t.photoQuote}&rdquo;
              </p>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 md:p-12 lg:col-span-7">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
                  {t.timelineHeader}
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#5A0A14] md:text-3xl">
                  {t.timelineTitle}
                </h2>
              </div>

              <div className="relative mt-8 space-y-8">
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 left-2.25 top-2 w-0.5 bg-[#5A0A14]/15"
                />
                {t.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-10">
                    <span className="absolute left-0 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#5A0A14] bg-[#FAF7F0] shadow-2xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#9A5D0A]" />
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#9A5D0A]">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-base font-serif font-bold text-[#2B211B] md:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5f524a]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — VISI & PILAR MISI */}
        <section className="space-y-8 font-sans">
          <div className="relative overflow-hidden rounded-3xl bg-[#5A0A14] p-8 text-amber-50 shadow-sm md:p-14 border border-[#5A0A14]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(#fde68a 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="relative z-10 mx-auto max-w-3xl space-y-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-amber-300/25 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-200">
                <FontAwesomeIcon icon={faBullseye} className="h-3.5 w-3.5" />
                {t.visionBadge}
              </span>
              <FontAwesomeIcon
                icon={faQuoteLeft}
                className="mx-auto h-6 w-6 text-amber-300/60"
              />
              <blockquote className="font-serif text-xl italic leading-relaxed text-amber-50 md:text-2xl">
                &ldquo;{t.visionText}&rdquo;
              </blockquote>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pilarMisi.map((item: any) => (
              <div
                key={item.num}
                className="group relative flex flex-col justify-between space-y-4 overflow-hidden rounded-3xl border border-[#5A0A14]/15 bg-[#FAF7F0] p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#5A0A14]/35 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFE6D5] text-[#5A0A14] transition-colors duration-300 group-hover:bg-[#5A0A14] group-hover:text-amber-200">
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  </div>
                  <span className="text-2xl font-bold text-[#5A0A14]/20 transition-colors duration-300 group-hover:text-[#9A5D0A]/45 font-serif">
                    {item.num}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-serif font-bold text-[#5A0A14]">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#5f524a]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — NILAI YANG KAMI JAGA */}
        <section className="font-sans">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 bg-[#FAF7F0] rounded-3xl border border-[#5A0A14]/15 p-7 sm:p-10 md:p-12 shadow-2xs">
            <div className="lg:col-span-4">
              <div className="space-y-3 lg:sticky lg:top-28">
                <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
                  {t.valuesHeader}
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#5A0A14] md:text-3xl">
                  {t.valuesTitle}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-[#5f524a]">
                  {t.valuesDesc}
                </p>
                <div className="hidden h-1 w-14 rounded-full bg-[#5A0A14] lg:block" />
              </div>
            </div>

            <div className="divide-y divide-[#5A0A14]/12 border-y border-[#5A0A14]/12 lg:col-span-8">
              {nilaiItems.map((item: any, idx: number) => (
                <div
                  key={item.title}
                  className="group flex items-start gap-4 sm:gap-5 px-2 py-6 transition-colors duration-300 hover:bg-white/60 rounded-2xl"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFE6D5] text-[#5A0A14] transition-colors duration-300 group-hover:bg-[#5A0A14] group-hover:text-amber-200">
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-serif font-bold text-[#2B211B] group-hover:text-[#5A0A14] transition-colors md:text-lg">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#5f524a]">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-[#5A0A14]/20 transition-colors duration-300 group-hover:text-[#9A5D0A]/50 font-serif">
                    0{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — CTA */}
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
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-amber-300/25 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-200">
                <FontAwesomeIcon icon={faQuoteLeft} className="h-3 w-3" />
                {t.ctaBadge}
              </span>

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
                  {t.explore}
                  <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/35 bg-white/10 px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-amber-100 transition-all duration-300 hover:border-amber-200 hover:bg-white/15"
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