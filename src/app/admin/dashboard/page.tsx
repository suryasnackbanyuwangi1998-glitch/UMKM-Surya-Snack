// src/app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getFeaturedProducts } from "@/lib/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faTags,
  faArrowRight,
  faStore,
  faFloppyDisk,
  faSpinner,
  faPen,
  faPlus,
  faTrashCan,
  faXmark,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

interface StoreInfo {
  store_name: string;
  store_label: string;
}

interface Banner {
  id: number;
  banner_number: number;
  title: string;
  description: string;
  image_url: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingStore, setSavingStore] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    store_name: "Surya Snack",
    store_label: "Khas Banyuwangi",
  });

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  // State untuk Pop-up Edit Banner
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [updatingBanner, setUpdatingBanner] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Ambil semua produk untuk statistik total
        const { data: productData } = await supabase.from("products").select("*");
        if (productData) {
          setTotalProducts(productData.length);
          const uniqueCategories = new Set(
            productData.map((item: any) => item.category || item.kategori).filter(Boolean)
          );
          setTotalCategories(uniqueCategories.size);
        }

        // Ambil produk unggulan menggunakan fungsi yang sama dengan beranda
        const featured = await getFeaturedProducts(20);
        if (featured) {
          setFeaturedProducts(featured);
        }

        const { data: storeData } = await supabase
          .from("store_settings")
          .select("*")
          .eq("id", "main")
          .maybeSingle();
        
        if (storeData) {
          setStoreInfo({
            store_name: storeData.store_name || "Surya Snack",
            store_label: storeData.store_label || "Khas Banyuwangi",
          });
        }

        const { data: bannerData } = await supabase
          .from("store_banners")
          .select("*")
          .order("banner_number", { ascending: true });
        
        if (bannerData) {
          setBanners(bannerData);
        }
      } catch (err) {
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
        .from("store_settings")
        .upsert({
          id: "main",
          store_name: storeInfo.store_name,
          store_label: storeInfo.store_label,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setNotification("Berhasil menyimpan Informasi Toko!");
      setTimeout(() => setNotification(""), 4000);
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setSavingStore(false);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;

    try {
      const { error } = await supabase.from("store_banners").delete().eq("id", id);
      if (error) throw error;

      setBanners(banners.filter((b) => b.id !== id));
      setNotification("Banner berhasil dihapus.");
      setTimeout(() => setNotification(""), 4000);
    } catch (error: any) {
      alert("Gagal menghapus banner: " + error.message);
    }
  };

  const handleOpenEditModal = (banner: Banner) => {
    setSelectedBanner({ ...banner });
    setNewImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;

    setUpdatingBanner(true);
    try {
      let imageUrl = selectedBanner.image_url;

      if (newImageFile) {
        const fileExt = newImageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("banners")
          .upload(fileName, newImageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("banners")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from("store_banners")
        .update({
          title: selectedBanner.title,
          description: selectedBanner.description,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedBanner.id);

      if (error) throw error;

      setBanners(banners.map((b) => (b.id === selectedBanner.id ? { ...selectedBanner, image_url: imageUrl } : b)));
      setIsEditModalOpen(false);
      setNotification("Banner berhasil diperbarui!");
      setTimeout(() => setNotification(""), 4000);
    } catch (error: any) {
      alert("Gagal mengupdate banner: " + error.message);
    } finally {
      setUpdatingBanner(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#FDFBF7] min-h-full text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100 relative">
      
      {/* Top Header */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5 font-sans">
          <span className="inline-block px-3 py-1 rounded-full bg-[#5c0f1c]/10 text-[#5c0f1c] text-xs font-bold mb-1">
            Panel Administrator
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#3b0912]">
            Dashboard Utama
          </h1>
          <p className="text-xs text-gray-500">
            Kelola informasi toko dan banner promosi website utama Anda.
          </p>
        </div>
        <Link
          href="/admin/produk"
          className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-5 py-3.5 rounded-xl transition shadow-md flex items-center gap-2 w-fit font-sans uppercase tracking-widest cursor-pointer"
        >
          <span>Kelola Produk</span>
          <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-amber-400" />
        </Link>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-sans font-semibold shadow-sm">
          {notification}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Produk</p>
          <h3 className="text-3xl font-serif font-black text-[#3b0912] mt-2">{loading ? "..." : totalProducts}</h3>
        </div>
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Kategori Snack</p>
          <h3 className="text-3xl font-serif font-black text-[#3b0912] mt-2">{loading ? "..." : totalCategories}</h3>
        </div>
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Status Sistem</p>
          <h3 className="text-3xl font-serif font-black text-emerald-700 mt-2">Normal</h3>
        </div>
      </div>

      {/* SECTION PREVIEW PRODUK UNGGULAN (DARI HALAMAN PRODUK) */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
              Daftar Produk Terlaris
            </h2>
            <p className="text-xs text-gray-500">
              Produk di bawah ini adalah produk yang sedang aktif tampil sebagai unggulan di beranda. Atur melalui menu Kelola Produk.
            </p>
          </div>
          <Link
            href="/admin/produk"
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            Atur di Kelola Produk →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs">
            Belum ada produk yang ditandai sebagai unggulan. Silakan centang produk di halaman Kelola Produk.
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-amber-600">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="min-w-55 max-w-55 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl p-4 flex flex-col justify-between shrink-0 shadow-xs"
              >
                <div>
                  <div className="relative h-28 rounded-xl overflow-hidden bg-gray-100 mb-3">
                    <img src={prod.image_url || "/placeholder.png"} alt={prod.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Unggulan
                    </span>
                  </div>
                  <h3 className="text-xs font-serif font-bold text-[#3b0912] line-clamp-1">{prod.name}</h3>
                  <p className="text-[11px] font-sans font-semibold text-amber-800 mt-1">
                    Rp {Number(prod.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INFORMASI TOKO */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-serif font-bold text-[#3b0912] flex items-center gap-2 uppercase tracking-wider">
              <span>Informasi Toko</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Kelola nama dan label identitas toko.</p>
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

        <div className="p-5 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl grid sm:grid-cols-2 gap-4">
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
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Label / Sub-Teks Toko</label>
            <input
              type="text"
              value={storeInfo.store_label}
              onChange={(e) => setStoreInfo({ ...storeInfo, store_label: e.target.value })}
              className="w-full bg-white border border-amber-900/20 rounded-xl px-3 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912]"
            />
          </div>
        </div>
      </div>

      {/* SECTION BANNER PROMOSI */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912]">Banner Promosi</h2>
            <p className="text-xs text-gray-500">Kelola banner promosi toko Anda[cite: 3].</p>
          </div>
          <Link
            href="/admin/banner/tambah"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 w-fit cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Tambah Banner</span>
          </Link>
        </div>

        {/* Grid Kartu Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <div key={banner.id} className="border border-amber-900/15 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
              
              <div className="relative h-40 bg-amber-200/50">
                <Image
                  src={banner.image_url || "/hero-background.jpg"}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#3b0912] text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                  Banner {index + 1}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-sm font-serif font-bold text-[#3b0912]">{banner.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{banner.description}</p>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                <button
                  onClick={() => handleOpenEditModal(banner)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FontAwesomeIcon icon={faPen} className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="w-3 h-3" /> Hapus
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* POP-UP MODAL EDIT BANNER DENGAN UPLOAD FILE */}
      {isEditModalOpen && selectedBanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-serif font-bold text-[#3b0912]">Edit Banner Promosi</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleUpdateBannerSubmit} className="space-y-4 font-sans">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Judul Banner</label>
                <input
                  type="text"
                  required
                  value={selectedBanner.title}
                  onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  required
                  value={selectedBanner.description}
                  onChange={(e) => setSelectedBanner({ ...selectedBanner, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912] resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Ganti Gambar Banner (Opsional)</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 border">
                    <img src={selectedBanner.image_url} alt="Current" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewImageFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3b0912] file:text-amber-200 hover:file:bg-[#5c0f1c] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updatingBanner}
                  className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {updatingBanner && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}