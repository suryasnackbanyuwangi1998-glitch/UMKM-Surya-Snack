// src/app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
// Impor fungsi getFeaturedProducts dari lib/products agar sinkron dengan beranda
import { getFeaturedProducts } from "@/lib/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faTags,
  faCircleCheck,
  faArrowRight,
  faStore,
  faFloppyDisk,
  faPlus,
  faPen,
  faTrashCan,
  faSpinner,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

interface StoreInfo {
  store_name: string;
  store_id_label: string;
}

interface Banner {
  id: number;
  banner_number: number;
  title: string;
  description: string;
}

export default function AdminDashboardPage() {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingStore, setSavingStore] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    store_name: "Surya Snack Store",
    store_id_label: "#SNK-001234",
  });

  // State untuk produk unggulan
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, banner_number: 1, title: "Diskon 50% Hari Ini!", description: "Keripik Singkong Pedas - Rasa Pedas Nendang" },
    { id: 2, banner_number: 2, title: "Beli 2 Gratis 1!", description: "Kacang Telur Spesial - Renyah & Gurih" },
    { id: 3, banner_number: 3, title: "Produk Baru!", description: "Keripik Pisang Cokelat - Manis & Lumer" },
  ]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // 1. Ambil data produk untuk statistik total
        const { data: productData, error: productError } = await supabase.from("products").select("*");
        
        if (!productError && productData) {
          setTotalProducts(productData.length);
          
          const uniqueCategories = new Set(
            productData.map((item: any) => item.category || item.kategori).filter(Boolean)
          );
          setTotalCategories(uniqueCategories.size);
        }

        // 2. Ambil produk unggulan menggunakan fungsi yang sama persis dengan beranda
        const featured = await getFeaturedProducts(10); // Ambil maksimal 10 produk unggulan
        setFeaturedProducts(featured);

        // 3. Ambil data informasi toko menggunakan .maybeSingle() agar aman dari error 406
        const { data: storeData, error: storeError } = await supabase
          .from("store_info")
          .select("*")
          .eq("id", "main")
          .maybeSingle();
        
        if (!storeError && storeData) {
          setStoreInfo({
            store_name: storeData.store_name || "Surya Snack Store",
            store_id_label: storeData.store_id_label || "#SNK-001234",
          });
        }
      } catch (err: unknown) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleSaveStore = async () => {
    setSavingStore(true);
    try {
      const { error } = await supabase
        .from("store_info")
        .upsert({
          id: "main",
          store_name: storeInfo.store_name,
          store_id_label: storeInfo.store_id_label,
        });

      if (error) throw error;

      setNotification("Berhasil menyimpan Informasi Toko ke Database!");
      setTimeout(() => setNotification(""), 3000);
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Gagal menyimpan: " + errMessage);
    } finally {
      setSavingStore(false);
    }
  };

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

      {/* Notifikasi Sukses */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-sans font-semibold shadow-sm">
          {notification}
        </div>
      )}

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

      {/* DATA PRODUK UNGGULAN YANG DI SINKRONKAN DENGAN BERANDA */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-serif font-bold text-[#3b0912] flex items-center gap-2 uppercase tracking-wider">
            <FontAwesomeIcon icon={faStar} className="text-amber-600" />
            <span>Produk Unggulan </span>
          </h2>
          <Link href="/admin/produk" className="text-xs font-bold text-[#5c0f1c] hover:underline">
            Kelola di Halaman Produk &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-xs text-gray-400 py-3 text-center">Memuat produk unggulan...</p>
          ) : featuredProducts.length === 0 ? (
            <div className="p-4 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl text-center space-y-1">
              <p className="text-xs font-bold text-gray-600">Belum ada produk unggulan yang disetujui.</p>
              <p className="text-[11px] text-gray-400">Pastikan ada produk di menu Kelola Produk yang status unggulannya disetujui (Ya).</p>
            </div>
          ) : (
            featuredProducts.map((item, index) => {
              const productName = item.name || item.nama_produk || "Tanpa Nama";
              const productCategory = item.category || item.kategori || "-";
              const productPrice = item.price || item.harga || 0;

              return (
                <div key={item.id} className="flex items-center justify-between p-4 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
                      #{index + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#2D241E] block">{productName}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{productCategory}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Ya ✨
                    </span>
                    <span className="text-xs font-bold text-[#5c0f1c] bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/50">
                      Rp {Number(productPrice).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* INFORMASI TOKO */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-serif font-bold text-[#3b0912] flex items-center gap-2 uppercase tracking-wider">
              <FontAwesomeIcon icon={faStore} className="text-amber-600" />
              <span>Informasi Toko</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Kelola nama dan label identitas toko Anda.</p>
          </div>
          <button
            onClick={handleSaveStore}
            disabled={savingStore}
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50 uppercase tracking-wider"
          >
            {savingStore ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
            Simpan
          </button>
        </div>

        <div className="p-5 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#3b0912] shrink-0 overflow-hidden shadow-inner border border-amber-400/30">
            <Image src="/logo.jpeg" alt="Logo" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <div className="w-full space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Nama Toko</label>
              <input
                type="text"
                value={storeInfo.store_name}
                onChange={(e) => setStoreInfo({ ...storeInfo, store_name: e.target.value })}
                className="w-full bg-white border border-amber-900/20 rounded-xl px-3 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">ID Label Toko</label>
              <input
                type="text"
                value={storeInfo.store_id_label}
                onChange={(e) => setStoreInfo({ ...storeInfo, store_id_label: e.target.value })}
                className="w-full bg-white border border-amber-900/20 rounded-xl px-3 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BANNER PROMOSI */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-serif font-bold text-[#3b0912] flex items-center gap-2 uppercase tracking-wider">
              <FontAwesomeIcon icon={faStore} className="text-amber-600" />
              <span>Banner Promosi</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Kelola 3 banner promosi utama toko.</p>
          </div>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-sm uppercase tracking-wider">
            <FontAwesomeIcon icon={faPlus} /> Tambah Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {banners.map((banner) => (
            <div key={banner.id} className="border border-amber-900/15 rounded-2xl p-5 bg-[#FDFBF7] flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-200/60 text-amber-900 px-2.5 py-1 rounded-lg">
                  Banner {banner.banner_number}
                </span>
                <h3 className="text-xs font-bold text-[#3b0912] mt-3 font-serif">{banner.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{banner.description}</p>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-amber-900/10">
                <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <FontAwesomeIcon icon={faPen} /> Edit
                </button>
                <button className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 px-3.5 py-2 rounded-xl text-xs transition cursor-pointer" title="Hapus">
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}