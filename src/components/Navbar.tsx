// src/components/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { supabase } from '@/lib/supabase';
import { useStoreContact } from '@/context/ContactProvider';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

const DEFAULT_LOGO_URL = '/logo.jpeg';

function extractDriveId(url: string): string | null {
  const lh3Match = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match?.[1]) return lh3Match[1];

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (
    (url.includes('drive.google.com') || url.includes('docs.google.com')) &&
    queryMatch?.[1]
  ) {
    return queryMatch[1];
  }

  return null;
}

function normalizeLogoUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return DEFAULT_LOGO_URL;
  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_LOGO_URL;

  const driveId = extractDriveId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  return DEFAULT_LOGO_URL;
}

export default function Navbar(): React.ReactElement {
  const { getWaLink, instagram } = useStoreContact();
  const { t, lang } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navContainerRef = useRef<HTMLDivElement>(null);

  const [storeName, setStoreName] = useState('Surya Snack');
  const [storeLabel, setStoreLabel] = useState('Khas Banyuwangi');
  const [storeLogo, setStoreLogo] = useState(DEFAULT_LOGO_URL);
  const [rawLogoSource, setRawLogoSource] = useState('');

  const igHandle = instagram ? instagram.replace('@', '') : 'suryasnack.banyuwangi';

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    let isMounted = true;

    const applyStoreData = (data: Record<string, any> | null | undefined) => {
      if (!data || !isMounted) return;
      if (data.store_name) setStoreName(data.store_name);
      if (data.store_label) setStoreLabel(data.store_label);
      const rawLogo =
        data.store_logo_url || data.logo_url || data.brand_logo_url || '';
      setRawLogoSource(rawLogo);
      setStoreLogo(normalizeLogoUrl(rawLogo));
    };

    async function fetchStoreInfo() {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 'main')
          .maybeSingle();

        if (!error && data) {
          applyStoreData(data);
        }
      } catch (err) {
        console.error('Gagal memuat informasi toko:', err);
      }
    }

    fetchStoreInfo();

    const channel = supabase
      .channel('navbar-store-settings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings',
          filter: 'id=eq.main',
        },
        (payload) => {
          applyStoreData(payload.new as Record<string, any>);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Tutup dropdown otomatis jika klik di luar area navbar mengambang
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const menuItems = [
    { href: '/', label: t('navHome') || 'Beranda' },
    { href: '/katalog', label: t('navProducts') || 'Produk' },
    { href: '/tentang', label: t('navAbout') || 'Tentang' },
    { href: '/kontak', label: t('navContact') || 'Kontak' },
  ];

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const driveId = extractDriveId(rawLogoSource || img.src);
    const thumbUrl = driveId
      ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w512`
      : '';

    if (thumbUrl && !img.dataset.triedThumb) {
      img.dataset.triedThumb = 'true';
      img.src = thumbUrl;
      return;
    }

    if (img.src !== window.location.origin + DEFAULT_LOGO_URL) {
      img.src = DEFAULT_LOGO_URL;
    }
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3.5 sm:px-6 lg:px-10 pointer-events-none">
      <div ref={navContainerRef} className="max-w-7xl mx-auto relative pointer-events-auto">
        {/* ================= KAPSUL NAVBAR MENGAMBANG ================= */}
        <div
          className={`flex items-center justify-between rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 transition-all duration-300 border ${
            isScrolled || isMobileMenuOpen
              ? 'bg-[#FAF7F0]/95 backdrop-blur-md border-[#5A0A14]/20 shadow-[0_10px_28px_-8px_rgba(90,10,20,0.22)]'
              : 'bg-[#FAF7F0]/88 backdrop-blur-md border-[#5A0A14]/15 shadow-[0_8px_24px_-8px_rgba(90,10,20,0.16)]'
          }`}
        >
          {/* Logo & Nama Brand */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="group flex items-center gap-2.5 pl-0.5"
          >
            <img
              src={storeLogo}
              alt={`${storeName} Logo`}
              referrerPolicy="no-referrer"
              onError={handleLogoError}
              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border border-[#5A0A14]/25 shadow-xs transition-transform duration-300 group-hover:scale-105 bg-[#FAF7F0]"
            />

            <div className="flex flex-col leading-none">
              <span className="text-sm sm:text-base font-black tracking-tight text-[#5A0A14] font-serif">
                {storeName}
              </span>
              <span className="text-[8px] sm:text-[9px] font-sans font-bold tracking-[0.16em] uppercase mt-0.5 text-[#9A5D0A]">
                {storeLabel}
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center gap-5 font-sans">
            <nav className="flex items-center gap-1">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                        : 'text-[#2B211B] hover:text-[#5A0A14] hover:bg-[#EFE6D5]/70'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pl-3 border-l border-[#5A0A14]/15">
              <LanguageToggle />
            </div>
          </div>

          {/* Kontrol Mobile: Bahasa + Tombol Toggle Dropdown */}
          <div className="md:hidden flex items-center gap-1.5">
            <div className="scale-90 origin-right">
              <LanguageToggle />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
              aria-expanded={isMobileMenuOpen}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                isMobileMenuOpen
                  ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                  : 'bg-[#EFE6D5] text-[#5A0A14] border border-[#5A0A14]/15'
              }`}
            >
              <div className="w-3.5 h-2.5 relative flex flex-col justify-between">
                <span
                  className={`block h-[1.5px] w-full rounded-full transition-all duration-300 ${
                    isMobileMenuOpen
                      ? 'bg-amber-200 translate-y-[4.25px] rotate-45'
                      : 'bg-[#5A0A14]'
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full rounded-full transition-all duration-300 ${
                    isMobileMenuOpen
                      ? 'bg-amber-200 translate-y-[-4.25px] -rotate-45'
                      : 'bg-[#5A0A14]'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ================= FLOATING DROPDOWN CARD (KHUSUS HP, RINGKAS) ================= */}
        <div
          className={`md:hidden mt-2 origin-top transition-all duration-200 ease-out font-sans ${
            isMobileMenuOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="bg-[#FAF7F0]/98 backdrop-blur-md rounded-2xl border border-[#5A0A14]/20 shadow-[0_18px_40px_-10px_rgba(90,10,20,0.28)] p-2.5 space-y-2">
            {/* Daftar Menu Ringkas */}
            <nav className="grid grid-cols-1 gap-1">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                        : 'text-[#2B211B] hover:bg-[#EFE6D5] hover:text-[#5A0A14]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className={`w-2.5 h-2.5 ${
                        active ? 'text-amber-300' : 'text-[#5A0A14]/40'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Bar Kontak Cepat */}
            <div className="pt-2 border-t border-[#5A0A14]/12 grid grid-cols-2 gap-2">
              <a
                href={getWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#18C95A] hover:bg-[#15b550] text-white text-[11px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'WhatsApp' : 'WhatsApp'}</span>
              </a>
              <a
                href={`https://www.instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#EFE6D5] hover:bg-[#e5d9c3] text-[#5A0A14] border border-[#5A0A14]/15 text-[11px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}