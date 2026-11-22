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
    <header className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pointer-events-none">
      <div ref={navContainerRef} className="max-w-7xl mx-auto relative pointer-events-auto">
        {/* ================= KAPSUL NAVBAR MENGAMBANG (PUTIH BERSIH & LEBIH BESAR) ================= */}
        <div
          className={`flex items-center justify-between rounded-full px-5 sm:px-8 py-3 sm:py-3.5 transition-all duration-300 border ${
            isScrolled || isMobileMenuOpen
              ? 'bg-white/95 backdrop-blur-md border-[#5A0A14]/20 shadow-[0_12px_32px_-8px_rgba(90,10,20,0.18)]'
              : 'bg-white/92 backdrop-blur-md border-[#5A0A14]/15 shadow-[0_10px_28px_-8px_rgba(90,10,20,0.12)]'
          }`}
        >
          {/* Logo & Nama Brand */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="group flex items-center gap-3 sm:gap-3.5 pl-0.5"
          >
            <img
              src={storeLogo}
              alt={`${storeName} Logo`}
              referrerPolicy="no-referrer"
              onError={handleLogoError}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border border-[#5A0A14]/25 shadow-xs transition-transform duration-300 group-hover:scale-105 bg-white"
            />

            <div className="flex flex-col leading-none">
              <span className="text-base sm:text-xl font-black tracking-tight text-[#5A0A14] font-serif">
                {storeName}
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.18em] uppercase mt-1 text-[#9A5D0A]">
                {storeLabel}
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center gap-6 font-sans">
            <nav className="flex items-center gap-2">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                      active
                        ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                        : 'text-[#2B211B] hover:text-[#5A0A14] hover:bg-neutral-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pl-4 border-l border-[#5A0A14]/15">
              <LanguageToggle />
            </div>
          </div>

          {/* Kontrol Mobile: Bahasa + Tombol Toggle Dropdown */}
          <div className="md:hidden flex items-center gap-2">
            <div className="scale-95 origin-right">
              <LanguageToggle />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
              aria-expanded={isMobileMenuOpen}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                isMobileMenuOpen
                  ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                  : 'bg-neutral-100 text-[#5A0A14] border border-[#5A0A14]/15'
              }`}
            >
              <div className="w-4 h-3 relative flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full rounded-full transition-all duration-300 ${
                    isMobileMenuOpen
                      ? 'bg-amber-200 translate-y-1.25 rotate-45'
                      : 'bg-[#5A0A14]'
                  }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full transition-all duration-300 ${
                    isMobileMenuOpen
                      ? 'bg-amber-200 -translate-y-1.25 -rotate-45'
                      : 'bg-[#5A0A14]'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ================= FLOATING DROPDOWN CARD (KHUSUS HP) ================= */}
        <div
          className={`md:hidden mt-2.5 origin-top transition-all duration-200 ease-out font-sans ${
            isMobileMenuOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="bg-white/98 backdrop-blur-md rounded-2xl border border-[#5A0A14]/20 shadow-[0_18px_40px_-10px_rgba(90,10,20,0.22)] p-3 space-y-2.5">
            {/* Daftar Menu Ringkas */}
            <nav className="grid grid-cols-1 gap-1.5">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                        : 'text-[#2B211B] hover:bg-neutral-100 hover:text-[#5A0A14]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className={`w-3 h-3 ${
                        active ? 'text-amber-300' : 'text-[#5A0A14]/40'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Bar Kontak Cepat */}
            <div className="pt-2.5 border-t border-[#5A0A14]/12 grid grid-cols-2 gap-2">
              <a
                href={getWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#18C95A] hover:bg-[#15b550] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'WhatsApp' : 'WhatsApp'}</span>
              </a>
              <a
                href={`https://www.instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 hover:bg-neutral-200 text-[#5A0A14] border border-[#5A0A14]/15 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
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