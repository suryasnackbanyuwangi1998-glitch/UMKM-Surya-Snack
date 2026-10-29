// src/app/admin/layout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faBoxesStacked,
  faAddressBook,
  faStore,
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

  const isLoginPage = pathname === "/admin/login";

  const handleLogout = () => {
    // Nanti bisa dihubungkan dengan supabase.auth.signOut()
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 flex font-sans">
      
      {/* ===== SIDEBAR KIRI ===== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-[#3b0912] via-[#5c0f1c] to-[#26050b] border-r border-[#7a1425]/40 flex flex-col text-slate-100 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 shrink-0 shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo Title dengan Gambar Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Surya Snack Logo"
                width={42}
                height={42}
                className="w-10 h-10 object-cover rounded-xl border border-amber-400/40 shadow-md ring-2 ring-amber-400/20"
                priority
              />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider text-white font-serif">Surya Snack</h2>
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-amber-300 mt-0.5">Admin Control Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-amber-200 hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Navigasi dengan FontAwesome Icons */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-300/70 mb-2">
            Menu Utama
          </p>

          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              pathname === "/admin/dashboard"
                ? "bg-linear-to-r from-amber-400 to-amber-500 text-[#3b0912] shadow-lg shadow-amber-500/20 font-extrabold"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FontAwesomeIcon icon={faChartPie} className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/produk"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              pathname === "/admin/produk"
                ? "bg-linear-to-r from-amber-400 to-amber-500 text-[#3b0912] shadow-lg shadow-amber-500/20 font-extrabold"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FontAwesomeIcon icon={faBoxesStacked} className="w-4 h-4 shrink-0" />
            <span>Kelola Produk</span>
          </Link>

          {/* MENU BARU: KELOLA TENTANG KAMI */}
          <Link
            href="/admin/tentang"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              pathname === "/admin/tentang"
                ? "bg-linear-to-r from-amber-400 to-amber-500 text-[#3b0912] shadow-lg shadow-amber-500/20 font-extrabold"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FontAwesomeIcon icon={faStore} className="w-4 h-4 shrink-0" />
            <span>Kelola Tentang</span>
          </Link>

          <Link
            href="/admin/kontak"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              pathname === "/admin/kontak"
                ? "bg-linear-to-r from-amber-400 to-amber-500 text-[#3b0912] shadow-lg shadow-amber-500/20 font-extrabold"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FontAwesomeIcon icon={faAddressBook} className="w-4 h-4 shrink-0" />
            <span>Kontak</span>
          </Link>
        </nav>

        {/* Footer Sidebar / Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition mb-2"
          >
            <FontAwesomeIcon icon={faGlobe} className="w-3.5 h-3.5 text-amber-300" />
            <span>Lihat Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-200 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5 h-3.5 text-rose-400" />
            <span>Keluar Sistem</span>
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
            className="bg-white/10 text-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15"
          >
            <FontAwesomeIcon icon={faBars} className="mr-1.5" /> Menu
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