// src/components/BannerManagementSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrashCan,
  faXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

interface Banner {
  id: number;
  banner_number: number;
  title: string;
  image_url: string;
}

export default function BannerManagementSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [updatingBanner, setUpdatingBanner] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("store_banners")
        .select("*")
        .order("banner_number", { ascending: true });

      if (error) throw error;
      if (data) {
        setBanners(data);
      }
    } catch (err) {
      console.error("Gagal memuat banner:", err);
    } finally {
      setLoading(false);
    }
  }

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
      const formData = new FormData();
      formData.append("id", selectedBanner.id.toString());
      formData.append("banner_number", selectedBanner.banner_number.toString());
      formData.append("title", selectedBanner.title);
      
      if (newImageFile) {
        formData.append("imageFile", newImageFile);
      }

      const res = await fetch("/api/banners", {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Gagal mengupdate banner.");

      setIsEditModalOpen(false);
      setNotification("Banner berhasil diperbarui!");
      setTimeout(() => setNotification(""), 4000);
      fetchBanners();
    } catch (error: any) {
      alert("Gagal mengupdate banner: " + error.message);
    } finally {
      setUpdatingBanner(false);
    }
  };

  return (
    <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#3b0912]">Banner Promosi</h2>
          <p className="text-xs text-gray-500">Kelola banner promosi toko Anda.</p>
        </div>
        <Link
          href="/admin/banner/tambah"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 w-fit cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Tambah Banner</span>
        </Link>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold">
          {notification}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-400 text-xs">Memuat banner...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs">
          Belum ada banner promosi.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((banner, index) => {
            const imageUrl = banner.image_url && banner.image_url.trim() !== "" 
              ? banner.image_url 
              : "/hero-background.jpg";

            return (
              <div key={banner.id} className="border border-amber-900/15 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                
                {/* Menggunakan tag <img> standar agar gambar Google Drive langsung tampil utuh tanpa error */}
                <div className="relative h-44 bg-[#3b0912]/5 flex items-center justify-center p-2">
                  <img
                    src={imageUrl}
                    alt={banner.title || "Banner"}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute top-3 left-3 bg-[#3b0912] text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow z-10">
                    Banner {index + 1}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-serif font-bold text-[#3b0912] truncate">{banner.title || `Banner ${index + 1}`}</h3>
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
            );
          })}
        </div>
      )}

      {/* POP-UP MODAL EDIT BANNER */}
      {isEditModalOpen && selectedBanner && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
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

            <form onSubmit={handleUpdateBannerSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Judul / Nama Banner (Internal)</label>
                <input
                  type="text"
                  required
                  value={selectedBanner.title}
                  onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Ganti Gambar Banner (Opsional)</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 border flex items-center justify-center">
                    <img 
                      src={newImageFile ? URL.createObjectURL(newImageFile) : (selectedBanner.image_url || "/hero-background.jpg")} 
                      alt="Current" 
                      className="w-full h-full object-contain" 
                    />
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