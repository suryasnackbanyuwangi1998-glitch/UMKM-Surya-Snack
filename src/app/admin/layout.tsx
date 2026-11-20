// src/app/admin/layout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faStore,
  faBook,
  faAddressBook,
  faGear,
  faGlobe,
  faRightFromBracket,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const handleLogout = () => {
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { href: "/admin/dashboard", label: "Beranda", icon: faHouse },
    { href: "/admin/produk", label: "Kelola Produk", icon: faStore },
    { href: "/admin/kontak", label: "Kontak", icon: faAddressBook },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: faGear },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 flex font-sans">

      {/* ===== SIDEBAR KIRI ===== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-linear-to-b from-[#3b0912] via-[#5c0f1c] to-[#26050b] border-r border-[#7a1425]/40 flex flex-col text-slate-100 transition-all duration-300 md:sticky md:top-0 md:h-screen shrink-0 shadow-2xl ${
          isCollapsed ? "md:w-20" : "md:w-64"
        } ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand / Logo & Tombol Toggle */}
        <div className={`p-4 border-b border-white/10 ${isCollapsed ? "md:flex md:flex-col md:items-center md:gap-3.5" : "flex items-center justify-between"}`}>
          <div className={`flex items-center gap-3.5 overflow-hidden ${isCollapsed ? "md:hidden" : "block"}`}>
            <div className="relative shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Surya Snack Logo"
                width={44}
                height={44}
                className="w-11 h-11 object-cover rounded-xl border border-amber-400/40 shadow-md ring-2 ring-amber-400/20"
                priority
              />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wider text-white font-serif">Surya Snack</h2>
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-300">ADMIN PANEL</p>
            </div>
          </div>

          {/* Tombol Toggle */}
          <div className={`${isCollapsed ? "w-full pb-3.5 flex justify-center" : "flex items-center"}`}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Perluas Sidebar" : "Kecilkan Sidebar"}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 flex items-center justify-center transition cursor-pointer shadow-xs shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="2" />
                {isCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10l3 2-3 2" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 10l-3 2 3 2" />
                )}
              </svg>
            </button>
          </div>

          {/* Tombol Tutup (Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`${isCollapsed ? "hidden" : "md:hidden"} text-amber-200 hover:text-white p-1`}
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto mt-1">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-300/70 mb-2">
              Menu Utama
            </p>
          )}

          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold transition group relative ${
                  active
                    ? "bg-linear-to-r from-amber-400 to-amber-500 text-[#3b0912] shadow-lg shadow-amber-500/20 font-extrabold"
                    : "text-gray-200 hover:bg-white/10 hover:text-white"
                } ${isCollapsed ? "md:justify-center px-0" : ""}`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5 shrink-0" />
                <span className={`${isCollapsed ? "md:hidden" : "block"} truncate`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar / Logout */}
        <div className="p-3 border-t border-white/10 bg-black/25 space-y-2">
          <Link
            href="/"
            target="_blank"
            title="Lihat Website"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition ${
              isCollapsed ? "md:justify-center px-0" : ""
            }`}
          >
            <FontAwesomeIcon icon={faGlobe} className="w-5 h-5 text-amber-300 shrink-0" />
            <span className={`${isCollapsed ? "md:hidden" : "block"}`}>Lihat Website</span>
          </Link>
          <button
            onClick={handleLogout}
            title="Keluar Sistem"
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold text-rose-200 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 transition cursor-pointer ${
              isCollapsed ? "md:justify-center px-0" : ""
            }`}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 text-rose-400 shrink-0" />
            <span className={`${isCollapsed ? "md:hidden" : "block"}`}>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* ===== KONTEN UTAMA DI KANAN ===== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar Mobile Trigger */}
        <header className="md:hidden bg-[#3b0912] border-b border-[#7a1425]/40 p-4 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpeg" alt="Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-sm">Surya Snack Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-white/10 text-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 cursor-pointer"
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5 mr-1.5" /> Menu
          </button>
        </header>

        {/* Area isi halaman */}
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>

    </div>
  );
}