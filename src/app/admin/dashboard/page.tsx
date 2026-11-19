// src/app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BannerManagementSection from "@/components/BannerManagementSection";
import AdminFeaturesManager from "@/components/AdminFeaturesManager"; // Komponen terpisah untuk 4 pilar kualitas
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faFloppyDisk,
  faSpinner,
  faBookOpenReader,
  faPenFancy,
  faQuoteRight,
  faStore,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_HERITAGE_IMAGE =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600";

function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") {
    return DEFAULT_HERITAGE_IMAGE;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return DEFAULT_HERITAGE_IMAGE;
  }

  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }

  const driveOpenMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes("drive.google.com") && driveOpenMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  return DEFAULT_HERITAGE_IMAGE;
}

interface StoreInfo {
  store_name: string;
  store_label: string;
  hero_title: string;
  hero_desc: string;
  quote_text: string;
  quote_author: string;
  heritage_title: string;
  heritage_subtitle: string;
  heritage_desc: string;
  heritage_image_url: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingStore, setSavingStore] = useState<boolean>(false);
  const [savingHero, setSavingHero] = useState<boolean>(false);
  const [savingQuote, setSavingQuote] = useState<boolean>(false);
  const [savingHeritage, setSavingHeritage] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    store_name: "Surya Snack",
    store_label: "Oleh - Oleh Khas Banyuwangi",
    hero_title: "Kelezatan Tradisional Kelas Artisan",
    hero_desc: "Menghadirkan camilan dan jajanan khas berkualitas tinggi dengan resep pusaka leluhur, diolah penuh dedikasi untuk Anda.",
    quote_text: "Kualitas sejati tidak pernah berkompromi pada rasa. Setiap gigitan adalah cerita tentang tradisi dan ketulusan.",
    quote_author: "— SURYA SNACK ARTISAN KITCHEN",
    heritage_title: "Menjaga Tradisi, Memahat Cita Rasa",
    heritage_subtitle: "✦ Sejarah & Dedikasi ✦",
    heritage_desc: "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
    heritage_image_url: DEFAULT_HERITAGE_IMAGE,
  });

  const [heritageImageFile, setHeritageImageFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!heritageImageFile) {
      setLocalPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(heritageImageFile);
    setLocalPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [heritageImageFile]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        const { data: productData } = await supabase.from("products").select("*");
        if (productData) {
          setTotalProducts(productData.length);
          const uniqueCategories = new Set(
            productData.map((item: any) => item.category || item.kategori).filter(Boolean)
          );
          setTotalCategories(uniqueCategories.size);
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
            hero_title: storeData.hero_title || "Kelezatan Tradisional Kelas Artisan",
            hero_desc: storeData.hero_desc || "Menghadirkan camilan dan jajanan khas berkualitas tinggi dengan resep pusaka leluhur, diolah penuh dedikasi untuk Anda.",
            quote_text: storeData.quote_text || "Kualitas sejati tidak pernah berkompromi pada rasa. Setiap gigitan adalah cerita tentang tradisi dan ketulusan.",
            quote_author: storeData.quote_author || "— SURYA SNACK ARTISAN KITCHEN",
            heritage_title: storeData.heritage_title || "Menjaga Tradisi, Memahat Cita Rasa",
            heritage_subtitle: storeData.heritage_subtitle || "✦ Sejarah & Dedikasi ✦",
            heritage_desc: storeData.heritage_desc || "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
            heritage_image_url: normalizeImageUrl(storeData.heritage_image_url),
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

  const handleSaveStore = async () => {
    setSavingStore(true);
    try {
      const { error } = await supabase
        .from("store_settings")
        .upsert({
          id: "main",
          store_name: "Surya Snack",
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

  const handleSaveHero = async () => {
    setSavingHero(true);
    try {
      const { error } = await supabase
        .from("store_settings")
        .upsert({
          id: "main",
          store_name: "Surya Snack",
          store_label: storeInfo.store_label || "Oleh - Oleh Khas Banyuwangi",
          hero_title: storeInfo.hero_title,
          hero_desc: storeInfo.hero_desc,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setNotification("Berhasil memperbarui Teks Utama Beranda (Hero)!");
      setTimeout(() => setNotification(""), 4000);
    } catch (error: any) {
      alert("Gagal menyimpan teks hero: " + error.message);
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveQuote = async () => {
    setSavingQuote(true);
    try {
      const { error } = await supabase
        .from("store_settings")
        .upsert({
          id: "main",
          store_name: "Surya Snack",
          store_label: storeInfo.store_label || "Oleh - Oleh Khas Banyuwangi",
          quote_text: storeInfo.quote_text,
          quote_author: storeInfo.quote_author,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setNotification("Berhasil memperbarui Kutipan / Quote Beranda!");
      setTimeout(() => setNotification(""), 4000);
    } catch (error: any) {
      alert("Gagal menyimpan kutipan: " + error.message);
    } finally {
      setSavingQuote(false);
    }
  };

  const handleSaveHeritage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHeritage(true);
    try {
      let imageUrl = normalizeImageUrl(storeInfo.heritage_image_url);

      if (heritageImageFile) {
        const formData = new FormData();
        formData.append("imageFile", heritageImageFile);

        const resUpload = await fetch("/api/settings/heritage-upload", {
          method: "POST",
          body: formData,
        });
        const uploadResult = await resUpload.json();

        if (!uploadResult.success) {
          throw new Error(uploadResult.message || "Gagal mengunggah gambar ke Google Drive");
        }
        imageUrl = normalizeImageUrl(uploadResult.imageUrl);
      }

      const { error } = await supabase
        .from("store_settings")
        .upsert({
          id: "main",
          store_name: "Surya Snack",
          store_label: storeInfo.store_label || "Oleh - Oleh Khas Banyuwangi",
          heritage_title: storeInfo.heritage_title,
          heritage_subtitle: storeInfo.heritage_subtitle,
          heritage_desc: storeInfo.heritage_desc,
          heritage_image_url: imageUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setStoreInfo((prev) => ({
        ...prev,
        store_name: "Surya Snack",
        heritage_image_url: imageUrl,
      }));
      setHeritageImageFile(null);
      setLocalPreviewUrl(null);
      router.refresh();
      setNotification("Berhasil memperbarui bagian Sejarah & Dedikasi ke Google Drive!");
      setTimeout(() => setNotification(""), 4000);
    } catch (error: any) {
      alert("Gagal menyimpan bagian sejarah: " + error.message);
    } finally {
      setSavingHeritage(false);
    }
  };

  const previewSrc = useMemo(() => {
    if (localPreviewUrl) return localPreviewUrl;
    return normalizeImageUrl(storeInfo.heritage_image_url);
  }, [localPreviewUrl, storeInfo.heritage_image_url]);

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
            Kelola informasi toko, teks beranda, kutipan, bagian sejarah, komitmen kualitas, dan banner promosi website utama Anda.
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

      {/* INFORMASI TOKO */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
              <FontAwesomeIcon icon={faStore} className="text-[#5c0f1c]" />
              Informasi Toko
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

      {/* KELOLA TEKS UTAMA BERANDA (HERO SECTION) */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
              <FontAwesomeIcon icon={faPenFancy} className="text-[#5c0f1c]" />
              Kelola Teks Utama Beranda
            </h2>
            <p className="text-xs text-gray-500">Ubah judul besar dan deskripsi singkat yang tampil di bagian atas halaman beranda.</p>
          </div>
          <button
            onClick={handleSaveHero}
            disabled={savingHero}
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50 uppercase tracking-wider"
          >
            {savingHero ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
            Simpan Teks Beranda
          </button>
        </div>

        <div className="p-5 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Judul Utama Beranda</label>
            <input
              type="text"
              value={storeInfo.hero_title}
              onChange={(e) => setStoreInfo({ ...storeInfo, hero_title: e.target.value })}
              className="w-full bg-white border border-amber-900/20 rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912]"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Deskripsi / Paragraf Beranda</label>
            <textarea
              rows={3}
              value={storeInfo.hero_desc}
              onChange={(e) => setStoreInfo({ ...storeInfo, hero_desc: e.target.value })}
              className="w-full bg-white border border-amber-900/20 rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912] resize-none"
            />
          </div>
        </div>
      </div>

      {/* KELOLA KUTIPAN / QUOTE STATEMENT */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-5 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
              <FontAwesomeIcon icon={faQuoteRight} className="text-[#5c0f1c]" />
              Kelola Kutipan Filosofi (Quote Statement)
            </h2>
            <p className="text-xs text-gray-500">Ubah kata-kata kutipan filosofi dan nama pembuatnya yang tampil di tengah beranda.</p>
          </div>
          <button
            onClick={handleSaveQuote}
            disabled={savingQuote}
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50 uppercase tracking-wider"
          >
            {savingQuote ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
            Simpan Kutipan
          </button>
        </div>

        <div className="p-5 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Isi Kutipan / Quote</label>
            <textarea
              rows={3}
              value={storeInfo.quote_text}
              onChange={(e) => setStoreInfo({ ...storeInfo, quote_text: e.target.value })}
              className="w-full bg-white border border-amber-900/20 rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912] resize-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Pembuat / Atribusi Kutipan</label>
            <input
              type="text"
              value={storeInfo.quote_author}
              onChange={(e) => setStoreInfo({ ...storeInfo, quote_author: e.target.value })}
              className="w-full bg-white border border-amber-900/20 rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:outline-none focus:border-[#3b0912]"
            />
          </div>
        </div>
      </div>

      {/* KELOLA BAGIAN SEJARAH & DEDIKASI (HERITAGE STORY) */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpenReader} className="text-[#5c0f1c]" />
              Kelola Bagian Sejarah & Dedikasi
            </h2>
            <p className="text-xs text-gray-500">
              Ubah teks, judul, dan foto pada bagian cerita sejarah di beranda website (tersimpan ke Google Drive).
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveHeritage} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Sub Judul / Tag (Atas)</label>
              <input
                type="text"
                required
                value={storeInfo.heritage_subtitle}
                onChange={(e) => setStoreInfo({ ...storeInfo, heritage_subtitle: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-amber-900/20 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Judul Utama</label>
              <input
                type="text"
                required
                value={storeInfo.heritage_title}
                onChange={(e) => setStoreInfo({ ...storeInfo, heritage_title: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-amber-900/20 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Deskripsi / Paragraf Cerita</label>
            <textarea
              rows={3}
              required
              value={storeInfo.heritage_desc}
              onChange={(e) => setStoreInfo({ ...storeInfo, heritage_desc: e.target.value })}
              className="w-full bg-[#FDFBF7] border border-amber-900/20 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912] resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Foto Samping Sejarah (Google Drive)</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl">
              <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-gray-100 border shrink-0">
                <img
                  key={previewSrc}
                  src={previewSrc}
                  alt="Heritage Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_HERITAGE_IMAGE;
                  }}
                />
              </div>
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setHeritageImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3b0912] file:text-amber-200 hover:file:bg-[#5c0f1c] cursor-pointer"
                />
                <p className="text-[10px] text-gray-400">Pilih file foto baru dari perangkat Anda untuk disimpan ke Google Drive.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingHeritage}
              className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingHeritage ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
              Simpan Perubahan Sejarah
            </button>
          </div>
        </form>
      </div>

      {/* KELOLA KOMITMEN KUALITAS (4 PILAR) - KOMPONEN TERPISAH */}
      <AdminFeaturesManager />

      {/* SECTION BANNER PROMOSI (POSISI DI BAWAH SENDIRI) */}
      <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 font-sans">
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c] text-lg" />
          <h2 className="text-lg font-serif font-bold text-[#3b0912]">Kelola Banner Promosi</h2>
        </div>
        <BannerManagementSection />
      </div>

    </div>
  );
}