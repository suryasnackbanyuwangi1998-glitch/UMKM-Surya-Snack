'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faXmark,
  faChevronRight,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Navbar(): React.ReactElement {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { href: '/', label: 'Beranda' },
    { href: '/katalog', label: 'Produk' },
    { href: '/tentang', label: 'Tentang' },
    { href: '/kontak', label: 'Kontak' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/80 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="group flex items-center gap-3 hover:opacity-95 transition">
            <div className="relative shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Surya Snack Logo"
                width={44}
                height={44}
                className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-xl border border-gray-200/50 ring-2 ring-amber-400/30 shadow-sm transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
            </div>

            <div className="flex flex-col leading-none">
              <span
                className={`text-base sm:text-lg font-black tracking-wide transition-colors font-serif drop-shadow-xs ${
                  isScrolled || !isHomePage
                    ? 'text-gray-900 group-hover:text-[#5c0f1c]'
                    : 'text-white group-hover:text-amber-300'
                }`}
              >
                Surya Snack
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase mt-1 hidden xs:block transition-colors ${
                  isScrolled || !isHomePage ? 'text-[#5c0f1c]' : 'text-amber-300'
                }`}
              >
                Khas Banyuwangi
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-6 font-sans">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 text-xs font-bold transition-all duration-200 ${
                    active
                      ? isScrolled || !isHomePage
                        ? 'text-[#5c0f1c] font-black'
                        : 'text-amber-300 font-black'
                      : isScrolled || !isHomePage
                      ? 'text-gray-900 hover:text-[#5c0f1c]'
                      : 'text-gray-100 hover:text-amber-300'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-amber-400 shadow-xs" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Mobile Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Buka Menu"
              className={`w-10 h-10 rounded-xl backdrop-blur-sm border flex items-center justify-center shadow-xs active:scale-95 transition cursor-pointer ${
                isScrolled || !isHomePage
                  ? 'bg-white/90 border-gray-200 text-gray-900'
                  : 'bg-black/30 border-white/30 text-white'
              }`}
            >
              <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-xs z-50 transform transition-transform duration-300 ease-out md:hidden flex flex-col bg-[#FDFBF7] shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative bg-[#3b0912] p-6 text-white shrink-0 overflow-hidden shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="Surya Snack Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded-xl border-2 border-amber-400 shadow-md"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-black tracking-wide text-white font-serif">
                Surya Snack
              </span>
              <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-amber-300">
                Khas Banyuwangi
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Tutup Menu"
            className="w-9 h-9 rounded-xl bg-white/15 text-gray-200 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-6 font-sans">
          <div>
            <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Navigasi Utama
            </p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#5c0f1c] text-amber-200 shadow-sm'
                        : 'text-gray-900 hover:bg-amber-100/50 hover:text-[#5c0f1c]'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{item.label}</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className={`w-3 h-3 ${active ? 'text-amber-300' : 'text-gray-400'}`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#5c0f1c] font-bold text-xs">
              <FontAwesomeIcon icon={faStore} className="w-3.5 h-3.5 text-amber-600" />
              <span>Pusat Oleh-Oleh Banyuwangi</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Siap melayani pemesanan langsung & pengiriman ke seluruh Indonesia.
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href="https://wa.me/6289509604700"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/suryasnack.banyuwangi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[11px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-3.5 h-3.5" />
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 border-t border-gray-200 px-5 py-3.5 text-center font-sans">
          <p className="text-[10px] font-bold text-gray-500">
            © 2026 Surya Snack Banyuwangi
          </p>
        </div>
      </aside>
    </>
  );
}