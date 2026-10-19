// src/components/MainLayout.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Cek apakah halaman saat ini diawali dengan /admin
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Jika halaman admin, tampilkan konten admin saja tanpa Navbar & Footer publik
    return <>{children}</>;
  }

  // Cek apakah sedang di halaman beranda
  const isHomePage = pathname === '/';

  // Jika halaman publik, tampilkan Navbar, konten, dan Footer
  return (
    <>
      <Navbar />
      {/* Jika di beranda, pt-0 agar warna hijau langsung mentok ke atas. Jika di halaman lain, gunakan pt-24 */}
      <main className={`flex-grow ${isHomePage ? 'pt-0' : 'pt-24'}`}>{children}</main>
      <Footer />
    </>
  );
}