// src/components/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useStoreContact } from '@/context/ContactProvider';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer(): React.ReactElement {
  const { getWaLink, instagram } = useStoreContact();
  const { lang } = useLanguage();

  const waUrl = getWaLink();
  const igHandle = instagram ? instagram.replace('@', '') : 'suryasnack.banyuwangi';
  const igUrl = `https://www.instagram.com/${igHandle}`;

  const t = {
    id: {
      desc: "Menghadirkan kelezatan jajanan tradisional Banyuwangi dengan kualitas terbaik sejak bertahun-tahun.",
      navTitle: "Navigasi",
      infoTitle: "Informasi",
      followTitle: "Ikuti Kami",
      home: "Home",
      products: "Produk",
      about: "Tentang Kami",
      contact: "Kontak",
      terms: "Syarat & Ketentuan",
      privacy: "Kebijakan Privasi",
      rights: "© 2026 Surya Snack. Authentic Indonesian Heritage.",
    },
    en: {
      desc: "Bringing you the delicious taste of Banyuwangi traditional snacks with the highest quality for years.",
      navTitle: "Navigation",
      infoTitle: "Information",
      followTitle: "Follow Us",
      home: "Home",
      products: "Products",
      about: "About Us",
      contact: "Contact",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      rights: "© 2026 Surya Snack. Authentic Indonesian Heritage.",
    },
  }[lang];

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/katalog', label: t.products },
    { href: '/tentang', label: t.about },
    { href: '/kontak', label: t.contact },
  ];

  const infoLinks = [
    { href: '#', label: t.terms },
    { href: '#', label: t.privacy },
  ];

  return (
    <footer className="bg-[#3B0912] text-[#F5EFE6]/80 font-sans text-xs border-t-4 border-[#9A5D0A]">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-6 lg:px-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Kolom 1: Brand & Deskripsi */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-base font-serif font-bold text-amber-300 tracking-wide">
              Surya Snack
            </h3>
            <p className="text-[#F5EFE6]/75 text-xs leading-relaxed max-w-md text-justify">
              {t.desc}
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
              {t.navTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#F5EFE6]/75 hover:text-amber-300 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Informasi */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
              {t.infoTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {infoLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-[#F5EFE6]/75 hover:text-amber-300 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
              {t.followTitle}
            </h4>
            <div className="flex gap-3 pt-1">
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Surya Snack"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#F5EFE6] transition hover:bg-amber-400 hover:text-[#3B0912]"
              >
                <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Surya Snack"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#F5EFE6] transition hover:bg-[#18C95A] hover:text-white"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bagian Bawah Copyright */}
        <div className="border-t border-white/10 pt-6 mt-8 text-center">
          <p className="text-[#F5EFE6]/55 text-[11px]">
            {t.rights}
          </p>
        </div>

      </div>
    </footer>
  );
}