// src/app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faTags,
  faCircleCheck,
  faArrowRight,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);

  // Ambil data statistik dari Supabase secara dinamis
  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.from("products").select("category");
      if (!error && data) {
        setTotalProducts(data.length);
        const uniqueCategories = new Set(data.map((item) => item.category).filter(Boolean));
        setTotalCategories(uniqueCategories.size);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#FDFBF7] min-h-full text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100">
      
      {/* Top Header Card */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5 font-sans">
          <span className="inline-block px-3 py-1 rounded-full bg-[#5c0f1c]/10 text-[#5c0f1c] text-xs font-bold mb-1">
            Panel Administrator
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#3b0912]">
            Dashboard Utama
          </h1>
          <p className="text-xs text-gray-500">
            Halo, selamat datang kembali di pusat kontrol Surya Snack.
          </p>
        </div>
        <Link
          href="/admin/produk"
          className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-5 py-3.5 rounded-xl transition shadow-md flex items-center gap-2 w-fit font-sans uppercase tracking-widest cursor-pointer"
        >
          <span>📦 Kelola Produk Sekarang</span>
          <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-amber-400" />
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
        
        {/* Card 1 */}
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm relative overflow-hidden group hover:border-[#5c0f1c]/40 transition">
          <div className="absolute right-5 top-5 w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg">
            <FontAwesomeIcon icon={faBoxesStacked} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Produk</p>
          <h3 className="text-3xl font-serif font-black text-[#3b0912] mt-2">
            {loading ? "..." : totalProducts}
          </h3>
          <p className="text-xs font-medium text-emerald-700 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Aktif di katalog publik
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm relative overflow-hidden group hover:border-[#5c0f1c]/40 transition">
          <div className="absolute right-5 top-5 w-12 h-12 rounded-2xl bg-rose-50 text-[#5c0f1c] flex items-center justify-center text-lg">
            <FontAwesomeIcon icon={faTags} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Kategori Snack</p>
          <h3 className="text-3xl font-serif font-black text-[#3b0912] mt-2">
            {loading ? "..." : totalCategories}
          </h3>
          <p className="text-xs font-medium text-gray-500 mt-2">
            Khas Tradisional Banyuwangi
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm relative overflow-hidden group hover:border-[#5c0f1c]/40 transition">
          <div className="absolute right-5 top-5 w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Status Sistem</p>
          <h3 className="text-3xl font-serif font-black text-emerald-700 mt-2">Normal</h3>
          <p className="text-xs font-medium text-gray-500 mt-2">
            Database & UI Sinkron
          </p>
        </div>

      </div>

      {/* Quick Access Shortcuts */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-4 font-sans">
        <h2 className="text-sm font-serif font-bold text-[#3b0912] flex items-center gap-2 uppercase tracking-wider">
          <FontAwesomeIcon icon={faStore} className="text-amber-600" />
          <span>Akses Pintar</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Link
            href="/admin/produk"
            className="p-5 rounded-2xl border border-amber-900/15 hover:border-[#5c0f1c] hover:bg-amber-50/20 transition group block"
          >
            <div className="text-xs font-bold text-[#3b0912] group-hover:text-[#5c0f1c] flex items-center justify-between mb-1">
              <span>Manajemen Katalog Produk</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#5c0f1c] transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-gray-500">Tambah produk baru, perbarui harga, atau hapus produk lama.</p>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-5 rounded-2xl border border-amber-900/15 hover:border-[#5c0f1c] hover:bg-amber-50/20 transition group block"
          >
            <div className="text-xs font-bold text-[#3b0912] group-hover:text-[#5c0f1c] flex items-center justify-between mb-1">
              <span>Pratinjau Website Publik</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#5c0f1c] transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-gray-500">Lihat hasil perubahan secara langsung di halaman utama pengunjung.</p>
          </Link>

        </div>
      </div>

    </div>
  );
}