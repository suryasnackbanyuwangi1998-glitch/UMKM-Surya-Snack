// src/components/PromoPopupModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface PromoBanner {
  id?: string | number;
  title?: string;
  image_url?: string;
  imageUrl?: string;
  url?: string;
  banner_number?: number;
}

const FALLBACK_BANNER_IMAGE = "/logo.jpeg";

function resolveBannerImageUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return FALLBACK_BANNER_IMAGE;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return FALLBACK_BANNER_IMAGE;
  }

  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }

  const driveOpenMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes("drive.google.com") && driveOpenMatch && driveOpenMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export default function PromoPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from("store_banners")
          .select("*")
          .order("banner_number", { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          setBanners(data as PromoBanner[]);
        }
      } catch (err) {
        console.error("Gagal memuat banner pop-up:", err);
      }
    }

    fetchBanners();
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (banners.length === 0) return;

    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, [banners.length]);

  const handleClose = () => {
    setIsOpen(false);

    if (currentIndex + 1 < banners.length) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsOpen(true);
      }, 3000);
    }
  };

  if (!isOpen || banners.length === 0) return null;

  const currentBanner: PromoBanner = banners[currentIndex] || {};
  const rawImageField =
    currentBanner.image_url || currentBanner.imageUrl || currentBanner.url || "";
  const resolvedUrl = resolveBannerImageUrl(rawImageField);
  const displayImageUrl = imgError ? FALLBACK_BANNER_IMAGE : resolvedUrl;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl overflow-hidden border border-amber-900/20">
        
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition cursor-pointer shadow-md"
          aria-label="Tutup"
        >
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
        </button>

        <div className="relative w-full h-auto min-h-75 max-h-112.5 flex items-center justify-center rounded-2xl overflow-hidden bg-amber-50/50">
          <img
            key={`${currentBanner.id || currentIndex}-${displayImageUrl}`}
            src={displayImageUrl}
            alt={currentBanner.title || "Banner Promosi"}
            loading="eager"
            onError={() => {
              if (!imgError) {
                setImgError(true);
              }
            }}
            className="w-full h-auto max-h-112.5 object-contain rounded-2xl brightness-110"
          />
        </div>

        <div className="text-center mt-3 text-xs text-gray-400 font-sans">
          Banner {currentIndex + 1} dari {banners.length}
        </div>

      </div>
    </div>
  );
}