// src/components/PromoPopupModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function PromoPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Ambil data banner dari database
  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from("store_banners")
          .select("*")
          .order("banner_number", { ascending: true });

        if (!error && data && data.length > 0) {
          setBanners(data);
        }
      } catch (err) {
        console.error("Gagal memuat banner pop-up:", err);
      }
    }

    fetchBanners();
  }, []);

  // 2. Saat pertama kali buka website, tunggu 3 detik untuk memunculkan banner pertama
  useEffect(() => {
    if (banners.length === 0) return;

    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, [banners.length]);

  // Fungsi saat pelanggan menekan tombol close (X)
  const handleClose = () => {
    setIsOpen(false);

    // Cek apakah masih ada banner berikutnya
    if (currentIndex + 1 < banners.length) {
      // Jika masih ada, tunggu 3 detik lagi setelah ditutup, lalu tampilkan banner berikutnya
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsOpen(true);
      }, 3000);
    }
  };

  if (!isOpen || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const imageUrl = currentBanner.image_url && currentBanner.image_url.trim() !== ""
    ? currentBanner.image_url
    : "/hero-background.jpg";

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl overflow-hidden border border-amber-900/20">
        
        {/* Tombol Close (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition cursor-pointer shadow-md"
          aria-label="Tutup"
        >
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
        </button>

        {/* Menampilkan banner tunggal satu per satu */}
        <div className="relative w-full h-auto min-h-75 max-h-112.5 flex items-center justify-center rounded-2xl overflow-hidden bg-amber-50/50">
          <img
            src={imageUrl}
            alt={currentBanner.title || "Banner Promosi"}
            // Ditambahkan filter brightness-110 agar gambarnya sedikit lebih terang
            className="w-full h-auto max-h-112.5 object-contain rounded-2xl brightness-110"
          />
        </div>

        {/* Keterangan urutan banner */}
        <div className="text-center mt-3 text-xs text-gray-400 font-sans">
          Banner {currentIndex + 1} dari {banners.length}
        </div>

      </div>
    </div>
  );
}