// src/app/tentang/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Tentang Kami | Surya Snack',
  description:
    'Perjalanan Surya Snack sejak 1998: visi, misi, dan nilai yang menjaga cita rasa oleh-oleh khas Banyuwangi tetap autentik hingga hari ini.',
};

const waHref = `https://wa.me/6289509604700?text=${encodeURIComponent(
  'Halo Surya Snack, saya ingin bertanya tentang produk oleh-oleh khas Banyuwangi.'
)}`;

export default function TentangKamiPage(): React.ReactElement {
  const pilarMisi = [
    {
      num: '01',
      icon: faLeaf,
      title: 'Kualitas Rasa',
      desc: 'Mengembangkan resep otentik dengan prinsip produksi tradisional untuk menghadirkan cita rasa terbaik.',
    },
    {
      num: '02',
      icon: faAward,
      title: 'Mutu & Kualitas',
      desc: 'Menggunakan bahan baku alami pilihan tanpa pengawet tambahan agar produk aman dikonsumsi.',
    },
    {
      num: '03',
      icon: faHandshake,
      title: 'Pemberdayaan Lokal',
      desc: 'Bermitra dengan UMKM dan petani lokal Banyuwangi dalam proses produksi untuk tumbuh bersama.',
    },
    {
      num: '04',
      icon: faHeart,
      title: 'Kepuasan Pelanggan',
      desc: 'Menghadirkan pelayanan hangat dan produk segar dengan konsistensi kualitas yang selalu terjaga.',
    },
  ];

  const nilaiItems = [
    {
      icon: faScroll,
      title: 'Integritas & Kejujuran',
      desc: 'Transparansi penuh dalam setiap bahan baku dan proses pembuatan produk.',
    },
    {
      icon: faSeedling,
      title: 'Komitmen Mutu',
      desc: 'Konsistensi rasa otentik yang selalu dijaga dari generasi ke generasi.',
    },
    {
      icon: faUsers,
      title: 'Keberlanjutan',
      desc: 'Kepedulian terhadap lingkungan dan kolaborasi erat bersama masyarakat lokal.',
    },
  ];

  const stats = [
    {
      value: '1998',
      label: 'Berdiri Sejak',
      desc: 'Dari dapur kecil di belakang rumah.',
      tone: 'dark' as const,
    },
    {
      value: '2000',
      label: 'Resmi & Legal',
      desc: 'Toko depan rumah & sertifikat lengkap.',
      tone: 'light' as const,
    },
    {
      value: '25+',
      label: 'Tahun Pengalaman',
      desc: 'Resep dijaga lintas generasi.',
      tone: 'light' as const,
    },
    {
      value: '10rb+',
      label: 'Pelanggan Puas',
      desc: 'Dikirim ke berbagai kota di Indonesia.',
      tone: 'amber' as const,
    },
  ];

  const timeline = [
    {
      year: '1998',
      title: 'Awal yang Sederhana',
      desc: 'Surya Snack dirintis sebagai usaha rumahan berskala kecil di bagian belakang rumah. Tanpa sertifikat formal, fokus utama saat itu hanyalah menghadirkan cita rasa terbaik bagi para tetangga.',
    },
    {
      year: '2000',
      title: 'Toko Resmi & Perizinan Lengkap',
      desc: 'Langkah besar diambil dengan membuka toko di bagian depan rumah serta melengkapi seluruh perizinan dan sertifikasi usaha. Sejak saat itu, Surya Snack menjadi jujugan utama pusat oleh-oleh khas Banyuwangi.',
    },
    {
      year: 'Sekarang',
      title: 'Tumbuh di Era Digital',
      desc: 'Kini Surya Snack melayani pemesanan online dan pengiriman ke berbagai kota, tanpa pernah mengubah resep dan cara tradisional yang menjadi jiwa setiap produknya.',
    },
  ];

  const heroChips = [
    { icon: faCircleCheck, label: '100% Halal' },
    { icon: faLeaf, label: 'Tanpa Pengawet' },
    { icon: faStore, label: 'UMKM Lokal' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF8F5] font-sans text-gray-800 antialiased selection:bg-[#5c0f1c] selection:text-amber-100">
      
      {/* ============================================================
          BACKGROUND PREMIUM (konsisten dengan halaman detail)
          ============================================================ */}
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
        
        {/* ============================================================
            HERO: MAGAZINE SPLIT + STATS 2x2
            ============================================================ */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            
            {/* Kiri: Judul & Intro */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-400/40 bg-[#3b0912]/90 backdrop-blur-md shadow-xl">
                <span className="text-amber-400 text-xs tracking-widest font-serif">★ EST. 1998 ★</span>
                <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                <span className="text-amber-200 text-xs uppercase tracking-wider font-sans font-semibold">
                  Tentang Surya Snack
                </span>
              </div>

              <h1 className="text-4xl font-serif font-bold leading-[1.08] tracking-tight text-[#3b0912] sm:text-5xl md:text-6xl">
                Warisan Cita Rasa,{' '}
                <span className="italic font-normal text-[#5c0f1c]">
                  Menjaga Rasa Asli
                </span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-gray-600 md:text-lg font-sans font-light">
                Berawal dari dapur sederhana di Banyuwangi pada tahun 1998, kami
                mendedikasikan diri untuk menghadirkan camilan tradisional
                berkualitas tinggi dengan resep pusaka leluhur.
              </p>

              {/* Chips kepercayaan */}
              <div className="flex flex-wrap gap-2 pt-1 font-sans">
                {heroChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EBE3D5] bg-white/80 px-3.5 py-1.5 text-xs font-bold text-gray-600 shadow-sm"
                  >
                    <FontAwesomeIcon icon={chip.icon} className="h-3 w-3 text-[#5c0f1c]" />
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Kanan: Stats 2x2 */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-5 font-sans">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`flex flex-col justify-between space-y-2 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6 ${
                    stat.tone === 'dark'
                      ? 'bg-[#5c0f1c] text-white shadow-lg shadow-[#5c0f1c]/25'
                      : stat.tone === 'amber'
                      ? 'border border-amber-200/60 bg-amber-50 shadow-sm hover:shadow-md'
                      : 'border border-[#EBE3D5] bg-white shadow-sm hover:shadow-md'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest sm:text-xs ${
                      stat.tone === 'dark'
                        ? 'text-amber-300'
                        : stat.tone === 'amber'
                        ? 'text-amber-700'
                        : 'text-[#5c0f1c]'
                    }`}
                  >
                    {stat.label}
                  </span>
                  <p
                    className={`text-3xl font-serif font-extrabold tracking-tight sm:text-4xl ${
                      stat.tone === 'dark' ? 'text-white' : 'text-[#3b0912]'
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-[11px] leading-relaxed sm:text-xs font-light ${
                      stat.tone === 'dark' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 1 — SEJARAH (TIMELINE VERTIKAL)
            ============================================================ */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 font-sans">
          <div className="grid items-stretch overflow-hidden rounded-3xl border border-[#EBE3D5] bg-white shadow-xl lg:grid-cols-12">
            
            {/* Gambar + quote overlay */}
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:col-span-5 lg:min-h-0">
              <Image
                src="/foto-depan.jpeg"
                alt="Toko Surya Snack Banyuwangi"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute left-6 top-6 rounded-full bg-[#5c0f1c] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-md">
                Sejak 1998
              </span>
              <p className="absolute inset-x-6 bottom-6 text-sm font-serif italic leading-relaxed text-white sm:text-base">
                &ldquo;Konsistensi rasa otentik adalah resep utama kami bertahan hingga hari ini.&rdquo;
              </p>
            </div>

            {/* Timeline */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-7">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5c0f1c]">
                  Perjalanan Waktu
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#3b0912] md:text-3xl">
                  Jejak Langkah Surya Snack
                </h2>
              </div>

              <div className="relative mt-8 space-y-9">
                {/* Garis timeline */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 left-[9px] top-2 w-0.5 bg-[#EBE3D5]"
                />
                {timeline.map((item) => (
                  <div key={item.year} className="relative pl-10">
                    {/* Dot */}
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

        {/* ============================================================
            SECTION 2 — VISI & PILAR MISI
            ============================================================ */}
        <section className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 sm:py-16 font-sans">
          
          {/* Banner Visi */}
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
                Visi Utama
              </span>
              <FontAwesomeIcon
                icon={faQuoteLeft}
                className="mx-auto h-7 w-7 text-amber-300/50"
              />
              <blockquote className="font-serif text-xl italic leading-relaxed text-gray-100 md:text-2xl">
                &ldquo;Menjadi pusat oleh-oleh khas Banyuwangi terdepan dan terpercaya dengan menjunjung tinggi kualitas rasa tradisional serta kearifan lokal.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Grid Pilar Misi */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pilarMisi.map((item) => (
              <div
                key={item.num}
                className="group relative flex flex-col justify-between space-y-4 overflow-hidden rounded-2xl border border-[#EBE3D5] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#5c0f1c]/30 hover:shadow-xl"
              >
                {/* Garis aksen saat hover */}
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

        {/* ============================================================
            SECTION 3 — NILAI (EDITORIAL SPLIT, JUDUL STICKY)
            ============================================================ */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 font-sans">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            
            {/* Kiri: judul sticky */}
            <div className="lg:col-span-4">
              <div className="space-y-4 lg:sticky lg:top-28">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5c0f1c]">
                  Kearifan Lokal
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#3b0912] md:text-3xl">
                  Nilai yang Kami Jaga
                </h2>
                <p className="text-sm leading-relaxed text-gray-500 md:text-base font-light">
                  Pilar moral dan etika kerja yang dipegang teguh oleh seluruh
                  tim Surya Snack — dari dapur produksi hingga sampai ke tangan
                  Anda dengan penuh kepuasan.
                </p>
                <div className="hidden h-1 w-16 rounded-full bg-linear-to-r from-[#5c0f1c] to-amber-400 lg:block" />
              </div>
            </div>

            {/* Kanan: daftar nilai */}
            <div className="divide-y divide-[#EBE3D5] border-y border-[#EBE3D5] lg:col-span-8">
              {nilaiItems.map((item, idx) => (
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

        {/* ============================================================
            SECTION 4 — CTA GRADIEN MAROON
            ============================================================ */}
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
                Cita Rasa Khas Banyuwangi
              </span>

              <h2 className="text-3xl font-serif font-bold leading-tight tracking-tight text-white md:text-4xl">
                Siap Menikmati Kelezatan Tradisi Kami?
              </h2>

              <p className="text-sm leading-relaxed text-white/70 md:text-base font-light">
                Temukan berbagai pilihan camilan renyah dan gurih berkualitas tinggi yang
                siap melengkapi momen santai dan kebersamaan Anda.
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
                  href={waHref}
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