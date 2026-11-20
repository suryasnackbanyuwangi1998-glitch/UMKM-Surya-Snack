// src/app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BannerManagementSection from "@/components/BannerManagementSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faFloppyDisk,
  faSpinner,
  faStore,
  faImage,
  faSliders,
  faStar,
  faXmark,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import type { Product } from "@/types";

interface StoreInfo {
  store_name: string;
  store_label: string;
  store_logo_url: string;
}

const DEFAULT_LOGO_PREVIEW = "/logo.jpeg";
const UPLOAD_TIMEOUT_MS = 12000;

function normalizeDriveImageUrl(url?: string): string {
  const trimmed = (url || "").trim();
  if (!trimmed) return DEFAULT_LOGO_PREVIEW;
  if (trimmed.startsWith("blob:")) return trimmed;

  const lh3Match = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match?.[1]) return `https://lh3.googleusercontent.com/d/${lh3Match[1]}`;

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;

  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes("drive.google.com") && queryMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${queryMatch[1]}`;
  }

  return trimmed;
}

function extractUploadedUrl(result: any): string {
  const raw =
    result?.url ||
    result?.publicUrl ||
    result?.imageUrl ||
    result?.viewLink ||
    result?.webViewLink ||
    result?.webContentLink ||
    result?.data?.url ||
    result?.data?.publicUrl ||
    (result?.fileId ? `https://lh3.googleusercontent.com/d/${result.fileId}` : "") ||
    (result?.id && typeof result.id === "string" && result.id.length > 15
      ? `https://lh3.googleusercontent.com/d/${result.id}`
      : "");

  return typeof raw === "string" ? normalizeDriveImageUrl(raw) : "";
}

async function compressLogoImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxSize = 512;
      let { width, height } = img;

      if (width > maxSize || height > maxSize) {
        if (width >= height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          resolve(
            new File([blob], `${baseName}-logo.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
        },
        "image/jpeg",
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export default function AdminDashboardPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingStore, setSavingStore] = useState<boolean>(false);
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");

  const blobPreviewRef = useRef<string | null>(null);

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    store_name: "Surya Snack",
    store_label: "Oleh - Oleh Khas Banyuwangi",
    store_logo_url: DEFAULT_LOGO_PREVIEW,
  });

  useEffect(() => {
    return () => {
      if (blobPreviewRef.current) {
        URL.revokeObjectURL(blobPreviewRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        const { data: productData } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (productData) {
          setTotalProducts(productData.length);
          const uniqueCategories = new Set(
            productData
              .map((item: any) => item.category || item.kategori)
              .filter(Boolean)
          );
          setTotalCategories(uniqueCategories.size);

          const onlyFeatured = (productData as any[]).filter((item) =>
            Boolean(item.is_popular)
          );
          setFeaturedProducts(onlyFeatured as Product[]);
        }

        const { data: storeData } = await supabase
          .from("store_settings")
          .select("*")
          .eq("id", "main")
          .maybeSingle();

        if (storeData) {
          setStoreInfo({
            store_name: storeData.store_name || "Surya Snack",
            store_label: storeData.store_label || "Oleh - Oleh Khas Banyuwangi",
            store_logo_url: normalizeDriveImageUrl(
              storeData.store_logo_url || storeData.logo_url || DEFAULT_LOGO_PREVIEW
            ),
          });
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleRemoveFeatured = async (product: any) => {
    if (!product?.id) return;
    setRemovingId(product.id);

    try {
      const { error } = await supabase
        .from("products")
        .update({ is_popular: false })
        .eq("id", product.id);

      if (error) throw error;

      setFeaturedProducts((prev) =>
        prev.filter((item: any) => item.id !== product.id)
      );

      setNotification(
        `"${product.name}" dikeluarkan dari daftar Produk Unggulan.`
      );
      setTimeout(() => setNotification(""), 3500);
    } catch (err: any) {
      alert("Gagal memperbarui produk unggulan: " + (err?.message || err));
    } finally {
      setRemovingId(null);
    }
  };

  const handleUploadLogo = async (file?: File) => {
    if (!file) return;

    const previousUrl = storeInfo.store_logo_url;
    const instantBlobUrl = URL.createObjectURL(file);
    if (blobPreviewRef.current) {
      URL.revokeObjectURL(blobPreviewRef.current);
    }
    blobPreviewRef.current = instantBlobUrl;

    setStoreInfo((prev) => ({
      ...prev,
      store_logo_url: instantBlobUrl,
    }));
    setUploadingLogo(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

    try {
      const optimizedFile = await compressLogoImage(file);
      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("image", optimizedFile);
      formData.append("folder", "store-logo");
      formData.append("target", "google-drive");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const result = await res.json().catch(() => ({}));
      const uploadedUrl = extractUploadedUrl(result);

      if (!res.ok || !uploadedUrl) {
        throw new Error(
          result?.error || result?.message || "Gagal mengunggah logo ke Google Drive."
        );
      }

      if (blobPreviewRef.current) {
        URL.revokeObjectURL(blobPreviewRef.current);
        blobPreviewRef.current = null;
      }

      setStoreInfo((prev) => ({
        ...prev,
        store_logo_url: uploadedUrl,
      }));

      setNotification(
        "Logo berhasil diunggah ke Google Drive! Klik Simpan untuk menerapkan ke navbar."
      );
      setTimeout(() => setNotification(""), 4000);
    } catch (err: any) {
      if (blobPreviewRef.current) {
        URL.revokeObjectURL(blobPreviewRef.current);
        blobPreviewRef.current = null;
      }
      setStoreInfo((prev) => ({
        ...prev,
        store_logo_url: previousUrl,
      }));

      const message =
        err?.name === "AbortError"
          ? "Upload terlalu lama (timeout). Coba kompres foto atau tempel link Google Drive langsung."
          : err?.message || err;
      alert("Gagal mengunggah logo: " + message);
    } finally {
      clearTimeout(timeoutId);
      setUploadingLogo(false);
    }
  };

  const handleSaveStore = async () => {
    if (storeInfo.store_logo_url.startsWith("blob:")) {
      alert("Tunggu proses upload logo ke Google Drive selesai terlebih dahulu.");
      return;
    }

    setSavingStore(true);
    try {
      const normalizedLogo = normalizeDriveImageUrl(
        storeInfo.store_logo_url || DEFAULT_LOGO_PREVIEW
      );

      const basePayload: Record<string, any> = {
        id: "main",
        store_name: storeInfo.store_name || "Surya Snack",
        store_label: storeInfo.store_label,
      };

      let { error } = await supabase
        .from("store_settings")
        .upsert({ ...basePayload, store_logo_url: normalizedLogo });

      if (error && error.message?.toLowerCase().includes("column")) {
        const retry = await supabase.from("store_settings").upsert(basePayload);
        error = retry.error;
        if (!error) {
          alert(
            "Nama & label tersimpan, tapi kolom 'store_logo_url' belum ada di tabel store_settings. Tambahkan kolom store_logo_url (text) di Supabase agar logo tersimpan."
          );
        }
      }

      if (error) {
        throw new Error(`${error.message} (${error.code || "400"})`);
      }

      setStoreInfo((prev) => ({
        ...prev,
        store_logo_url: normalizedLogo,
      }));

      setNotification("Berhasil menyimpan Informasi Toko & Logo!");
      setTimeout(() => setNotification(""), 4000);
    } catch (error: any) {
      alert("Gagal menyimpan: " + (error?.message || error));
    } finally {
      setSavingStore(false);
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
            Ringkasan katalog produk, produk unggulan aktif, informasi toko, dan pengelolaan banner promosi website utama Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-sans">
          <Link
            href="/admin/pengaturan"
            className="bg-white hover:bg-[#FAF7F0] text-[#3b0912] border border-[#3b0912]/25 text-xs font-bold px-4 py-3.5 rounded-xl transition flex items-center gap-2 w-fit uppercase tracking-widest cursor-pointer"
          >
            <FontAwesomeIcon icon={faSliders} className="w-3.5 h-3.5 text-[#5c0f1c]" />
            <span>Pengaturan Halaman</span>
          </Link>

          <Link
            href="/admin/produk"
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-5 py-3.5 rounded-xl transition shadow-md flex items-center gap-2 w-fit uppercase tracking-widest cursor-pointer"
          >
            <span>Kelola Produk</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-amber-400" />
          </Link>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-sans font-semibold shadow-sm">
          {notification}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Total Produk
          </p>
          <h3 className="text-3xl font-serif font-black text-[#3b0912] mt-2">
            {loading ? "..." : totalProducts}
          </h3>
        </div>
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Produk Unggulan
          </p>
          <h3 className="text-3xl font-serif font-black text-[#5c0f1c] mt-2">
            {loading ? "..." : featuredProducts.length}
          </h3>
        </div>
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Kategori Produk
          </p>
          <h3 className="text-3xl font-serif font-black text-[#3b0912] mt-2">
            {loading ? "..." : totalCategories}
          </h3>
        </div>
        <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Status Sistem
          </p>
          <h3 className="text-3xl font-serif font-black text-emerald-700 mt-2">
            Normal
          </h3>
        </div>
      </div>

      {/* PRODUK UNGGULAN AKTIF (SCROLL KE SAMPING) */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
              <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              Produk Unggulan ({featuredProducts.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Geser ke samping untuk melihat produk unggulan yang sedang tampil di beranda.
            </p>
          </div>
          <Link
            href="/admin/produk"
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-[#3b0912] transition w-fit shrink-0"
          >
            Atur di Kelola Produk →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[#5c0f1c]" />
            <span>Memuat produk unggulan...</span>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-xs bg-[#FDFBF7] rounded-2xl border border-amber-900/10">
            Belum ada produk unggulan aktif. Aktifkan di menu Kelola Produk.
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#5c0f1c]/35 scrollbar-track-amber-100/50">
            {featuredProducts.map((item: any) => {
              const isBusy = removingId === item.id;
              const imgSrc =
                item.image_url ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

              return (
                <div
                  key={item.id}
                  className="min-w-64 sm:min-w-72 snap-start shrink-0 p-3.5 rounded-2xl border border-[#5c0f1c]/20 bg-[#FAF7F0] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-200 bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#3b0912] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {item.category || "Makanan"}
                        {item.price !== null && item.price !== undefined
                          ? ` • Rp ${Number(item.price).toLocaleString("id-ID")}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleRemoveFeatured(item)}
                    title="Keluarkan dari produk unggulan"
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition shrink-0 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    {isBusy ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin w-3 h-3" />
                    ) : (
                      <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                    )}
                    <span>Lepas</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INFORMASI TOKO */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
              <FontAwesomeIcon icon={faStore} className="text-[#5c0f1c]" />
              Informasi Toko &amp; Logo Navbar
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola nama, label, dan logo toko (tersimpan di Google Drive) yang tampil di navbar website.
            </p>
          </div>
          <button
            onClick={handleSaveStore}
            disabled={savingStore || uploadingLogo}
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50 uppercase tracking-wider"
          >
            {savingStore ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faFloppyDisk} />
            )}
            Simpan
          </button>
        </div>

        <div className="p-5 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">
                Nama Toko
              </label>
              <input
                type="text"
                value={storeInfo.store_name}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, store_name: e.target.value })
                }
                className="w-full bg-white border border-amber-900/20 rounded-xl px-3 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">
                Label / Sub-Teks Toko
              </label>
              <input
                type="text"
                value={storeInfo.store_label}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, store_label: e.target.value })
                }
                className="w-full bg-white border border-amber-900/20 rounded-xl px-3 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-amber-900/10 flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={normalizeDriveImageUrl(storeInfo.store_logo_url)}
              alt="Preview Logo Toko"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_LOGO_PREVIEW;
              }}
              className="w-14 h-14 rounded-2xl object-cover border border-amber-900/20 bg-white shrink-0 shadow-xs"
            />

            <div className="flex-1 space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 block">
                Logo Toko (Upload ke Google Drive atau Tempel Link Drive)
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={storeInfo.store_logo_url}
                  onChange={(e) =>
                    setStoreInfo({
                      ...storeInfo,
                      store_logo_url: e.target.value,
                    })
                  }
                  placeholder="/logo.jpeg atau link Google Drive"
                  className="flex-1 bg-white border border-amber-900/20 rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912]"
                />
                <label className="inline-flex items-center justify-center gap-2 bg-[#5c0f1c] hover:bg-[#3b0912] text-amber-200 font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer transition shrink-0">
                  {uploadingLogo ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="w-3.5 h-3.5 animate-spin"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingLogo ? "Mengunggah..." : "Upload ke Drive"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadLogo(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION BANNER PROMOSI */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 font-sans">
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c] text-lg" />
          <h2 className="text-lg font-serif font-bold text-[#3b0912]">
            Kelola Banner Promosi
          </h2>
        </div>
        <BannerManagementSection />
      </div>
    </div>
  );
}