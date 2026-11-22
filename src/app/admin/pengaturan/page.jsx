// src/app/admin/pengaturan/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import TabBeranda from "@/components/admin/pengaturan/TabBeranda";
import TabProduk from "@/components/admin/pengaturan/TabProduk";
import TabTentangKami from "@/components/admin/pengaturan/TabTentangKami";
import TabKontak from "@/components/admin/pengaturan/TabKontak";

const INITIAL_FORM = {
  // Beranda (store_settings)
  store_label: "Oleh-Oleh Khas Banyuwangi",
  store_label_en: "Authentic Banyuwangi Delicacies",
  hero_title: "Cita Rasa Legendaris Khas Banyuwangi",
  hero_title_en: "Timeless Taste of Banyuwangi",
  hero_desc:
    "Mengangkat kelezatan resep pusaka leluhur tanah Blambangan, disajikan khusus dalam balutan kualitas artisan yang renyah dan penuh kenangan.",
  hero_desc_en:
    "Bringing heritage recipes from Blambangan to life with artisan quality that is crispy and full of nostalgia.",
  hero_image_url: "/hero-background.jpg",
  quote_text:
    "Resep boleh diwariskan, namun ketulusan rasa adalah rahasia yang tidak pernah berubah sejak 1998.",
  quote_text_en:
    "Recipes may be passed down, yet sincerity of taste is the secret that has never changed since 1998.",
  quote_author: "— SURYA SNACK",
  quote_author_en: "— SURYA SNACK",
  heritage_subtitle: "✦ Sejarah & Dedikasi ✦",
  heritage_subtitle_en: "✦ Heritage & Dedication ✦",
  heritage_title: "Menjaga Tradisi, Memahat Cita Rasa",
  heritage_title_en: "Honoring Tradition, Crafting Flavor",
  heritage_desc:
    "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
  heritage_desc_en:
    "Starting from a home kitchen in Banyuwangi, Surya Snack grew by holding firmly to the authenticity of ancestral recipes.",
  heritage_image_url: "",

  // Produk & Katalog (store_settings)
  catalog_subtitle: "✦ Koleksi Lengkap ✦",
  catalog_subtitle_en: "✦ Full Collection ✦",
  catalog_title: "Katalog Produk Surya Snack",
  catalog_title_en: "Surya Snack Product Catalog",
  catalog_desc:
    "Temukan berbagai pilihan camilan makanan dan minuman khas Banyuwangi yang renyah, higienis, dan cocok untuk buah tangan.",
  catalog_desc_en:
    "Discover authentic Banyuwangi food and beverage snacks, crispy, hygienic, and perfect as gifts.",
  catalog_banner_url: "",
  catalog_search_title: "Cari Produk",
  catalog_search_title_en: "Search Product",
  catalog_category_title: "Kategori Pilihan",
  catalog_category_title_en: "Categories",
  catalog_all_label: "Semua Produk",
  catalog_all_label_en: "All Products",
  catalog_food_label: "Makanan",
  catalog_food_label_en: "Food",
  catalog_beverage_label: "Minuman",
  catalog_beverage_label_en: "Beverages",
  catalog_empty_title: "Produk Tidak Ditemukan",
  catalog_empty_title_en: "Products Not Found",
  catalog_empty_desc:
    "Maaf, tidak ada produk makanan atau minuman yang cocok dengan pencarian Anda.",
  catalog_empty_desc_en:
    "Sorry, no food or beverage products match your search criteria.",
  catalog_empty_btn: "Tampilkan Semua Produk",
  catalog_empty_btn_en: "Show All Products",

  // Tentang Kami (about_content)
  subtitle: "★ EST. 1998 ★ TENTANG SURYA SNACK",
  title: "Menjaga Resep Leluhur, Menghadirkan Kehangatan Banyuwangi",
  description:
    "Berawal dari dapur sederhana di Banyuwangi pada tahun 1998, kami mendedikasikan diri untuk menghadirkan camilan tradisional berkualitas tinggi dengan resep pusaka leluhur.",
  vision_text:
    "Menjadi pusat oleh-oleh khas Banyuwangi terdepan dan terpercaya dengan menjunjung tinggi kualitas rasa tradisional serta kearifan lokal.",
  about_image: "/foto-depan.jpeg",
  photo_badge: "SEJAK 1998",
  photo_quote:
    "Konsistensi rasa otentik adalah resep utama kami bertahan hingga hari ini.",
  stats_items: [
    {
      label: "BERDIRI SEJAK",
      value: "1998",
      desc: "Dari dapur kecil di belakang rumah.",
      tone: "dark",
    },
    {
      label: "RESMI & LEGAL",
      value: "2000",
      desc: "Toko depan rumah & sertifikat lengkap.",
      tone: "light",
    },
    {
      label: "TAHUN PENGALAMAN",
      value: "25+",
      desc: "Resep dijaga lintas generasi.",
      tone: "light",
    },
    {
      label: "PELANGGAN PUAS",
      value: "10rb+",
      desc: "Dikirim ke berbagai kota di Indonesia.",
      tone: "amber",
    },
  ],
  timeline: [
    {
      year: "1998",
      title: "Awal yang Sederhana",
      desc: "Surya Snack dirintis sebagai usaha rumahan berskala kecil di bagian belakang rumah.",
    },
    {
      year: "2000",
      title: "Toko Resmi & Perizinan Lengkap",
      desc: "Langkah besar diambil dengan membuka toko di bagian depan rumah.",
    },
    {
      year: "SEKARANG",
      title: "Tumbuh di Era Digital",
      desc: "Kini Surya Snack melayani pemesanan online dan pengiriman ke berbagai kota.",
    },
  ],
  pilar_misi: [
    {
      num: "01",
      title: "Kualitas Rasa",
      desc: "Mengembangkan resep otentik dengan prinsip produksi tradisional untuk menghadirkan cita rasa terbaik.",
    },
    {
      num: "02",
      title: "Mutu & Kualitas",
      desc: "Menggunakan bahan baku alami pilihan tanpa pengawet tambahan agar produk aman dikonsumsi.",
    },
    {
      num: "03",
      title: "Pemberdayaan Lokal",
      desc: "Bermitra dengan UMKM dan petani lokal Banyuwangi dalam proses produksi untuk tumbuh bersama.",
    },
    {
      num: "04",
      title: "Kepuasan Pelanggan",
      desc: "Menghadirkan pelayanan hangat dan produk segar dengan konsistensi kualitas yang selalu terjaga.",
    },
  ],
  nilai_items: [
    {
      title: "Integritas & Kejujuran",
      desc: "Transparansi penuh dalam setiap bahan baku dan proses pembuatan produk.",
    },
    {
      title: "Komitmen Mutu",
      desc: "Konsistensi rasa otentik yang selalu dijaga dari generasi ke generasi.",
    },
    {
      title: "Keberlanjutan",
      desc: "Kepedulian terhadap lingkungan dan kolaborasi erat bersama masyarakat lokal.",
    },
  ],

  // Kontak (store_settings)
  store_name: "Surya Snack Banyuwangi",
  whatsapp_number: "6281249609957",
  whatsapp_message:
    "Halo Admin Surya Snack, saya ingin bertanya tentang produk oleh-oleh.",
  tiktok_shop_url: "",
  instagram_url: "",
  email_address: "",
  store_address:
    "Jalan Barong, Lingkungan Gaplek, Bakungan, Banyuwangi, Jawa Timur",
  open_hours: "Senin - Minggu: 08.00 - 21.00 WIB",
  google_maps_embed: "",
};

const getFolderNameByField = (fieldName) => {
  if (fieldName === "hero_image_url") return "beranda";
  if (fieldName === "heritage_image_url") return "heritage";
  if (fieldName === "catalog_banner_url") return "produk";
  if (fieldName === "about_image") return "tentang";
  return "pengaturan";
};

function stripEnglishKeys(obj) {
  const cleaned = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (!k.endsWith("_en")) {
      cleaned[k] = v;
    }
  });
  return cleaned;
}

async function upsertWithFallback(tableName, payload) {
  const { error } = await supabase.from(tableName).upsert(payload);
  if (!error) return { error: null, strippedEn: false };

  const fallbackPayload = stripEnglishKeys(payload);
  const { error: retryErr } = await supabase.from(tableName).upsert(fallbackPayload);
  if (!retryErr) {
    return { error: null, strippedEn: true };
  }

  return { error: retryErr, strippedEn: false };
}

export default function AdminPengaturanPage() {
  const [activeTab, setActiveTab] = useState("beranda");
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllSettings() {
      try {
        const [
          { data: storeData, error: storeErr },
          { data: aboutData, error: aboutErr },
        ] = await Promise.all([
          supabase
            .from("store_settings")
            .select("*")
            .eq("id", "main")
            .maybeSingle(),
          supabase
            .from("about_content")
            .select("*")
            .eq("id", "main")
            .maybeSingle(),
        ]);

        if (!isMounted) return;
        if (storeErr) console.warn("Info store_settings:", storeErr);
        if (aboutErr) console.warn("Info about_content:", aboutErr);

        setForm((prev) => {
          const merged = { ...prev };

          if (storeData) {
            Object.keys(prev).forEach((key) => {
              if (
                key in storeData &&
                storeData[key] !== null &&
                storeData[key] !== undefined &&
                storeData[key] !== ""
              ) {
                merged[key] = storeData[key];
              }
            });
          }

          if (aboutData) {
            merged.subtitle = aboutData.subtitle ?? prev.subtitle;
            merged.title = aboutData.title ?? prev.title;
            merged.description = aboutData.description ?? prev.description;
            merged.vision_text = aboutData.vision_text ?? prev.vision_text;
            merged.about_image = aboutData.about_image ?? prev.about_image;
            merged.photo_badge = aboutData.photo_badge ?? prev.photo_badge;
            merged.photo_quote = aboutData.photo_quote ?? prev.photo_quote;

            const rawStats =
              Array.isArray(aboutData.stats_items) && aboutData.stats_items.length > 0
                ? aboutData.stats_items
                : Array.isArray(aboutData.stats) && aboutData.stats.length > 0
                ? aboutData.stats
                : null;

            if (rawStats) merged.stats_items = rawStats;
            if (Array.isArray(aboutData.timeline) && aboutData.timeline.length > 0) {
              merged.timeline = aboutData.timeline;
            }
            if (Array.isArray(aboutData.pilar_misi) && aboutData.pilar_misi.length > 0) {
              merged.pilar_misi = aboutData.pilar_misi;
            }
            if (Array.isArray(aboutData.nilai_items) && aboutData.nilai_items.length > 0) {
              merged.nilai_items = aboutData.nilai_items;
            }
          }

          return merged;
        });
      } catch (err) {
        console.error("Gagal memuat pengaturan:", err);
        if (isMounted) {
          setStatusMsg({
            type: "error",
            text: "Gagal memuat data pengaturan dari database.",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAllSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBatchChange = useCallback((updates) => {
    if (!updates || typeof updates !== "object") return;
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleArrayChange = useCallback((fieldName, index, key, value) => {
    setForm((prev) => {
      const list = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      list[index] = { ...(list[index] || {}), [key]: value };
      return { ...prev, [fieldName]: list };
    });
  }, []);

  const handleAddArrayItem = useCallback((fieldName, newItem) => {
    setForm((prev) => {
      const list = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      return { ...prev, [fieldName]: [...list, newItem] };
    });
  }, []);

  const handleRemoveArrayItem = useCallback((fieldName, index) => {
    setForm((prev) => {
      const list = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      return { ...prev, [fieldName]: list.filter((_, i) => i !== index) };
    });
  }, []);

  const handleImageUpload = async (fieldName, file) => {
    if (!file) return;

    setUploadingField(fieldName);
    setStatusMsg(null);

    try {
      const folderName = getFolderNameByField(fieldName);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folderName);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.imageUrl) {
        throw new Error(result.error || "Gagal mengunggah gambar ke Google Drive.");
      }

      setForm((prev) => ({
        ...prev,
        [fieldName]: result.imageUrl,
      }));

      setStatusMsg({
        type: "success",
        text: `Gambar berhasil diunggah ke folder Google Drive "${folderName}"! Jangan lupa klik Simpan Perubahan.`,
      });
    } catch (err) {
      console.error("Upload gambar ke Google Drive gagal:", err);
      setStatusMsg({
        type: "error",
        text: err?.message || "Gagal mengunggah gambar ke Google Drive.",
      });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setStatusMsg(null);

    try {
      const nowIso = new Date().toISOString();

      const aboutPayload = {
        id: "main",
        subtitle: form.subtitle,
        title: form.title,
        description: form.description,
        vision_text: form.vision_text,
        about_image: form.about_image,
        photo_badge: form.photo_badge,
        photo_quote: form.photo_quote,
        stats_items: form.stats_items,
        timeline: form.timeline,
        pilar_misi: form.pilar_misi,
        nilai_items: form.nilai_items,
        updated_at: nowIso,
      };

      const storePayload = {
        id: "main",
        store_label: form.store_label,
        store_label_en: form.store_label_en,
        hero_title: form.hero_title,
        hero_title_en: form.hero_title_en,
        hero_desc: form.hero_desc,
        hero_desc_en: form.hero_desc_en,
        hero_image_url: form.hero_image_url,
        quote_text: form.quote_text,
        quote_text_en: form.quote_text_en,
        quote_author: form.quote_author,
        quote_author_en: form.quote_author_en,
        heritage_subtitle: form.heritage_subtitle,
        heritage_subtitle_en: form.heritage_subtitle_en,
        heritage_title: form.heritage_title,
        heritage_title_en: form.heritage_title_en,
        heritage_desc: form.heritage_desc,
        heritage_desc_en: form.heritage_desc_en,
        heritage_image_url: form.heritage_image_url,
        catalog_subtitle: form.catalog_subtitle,
        catalog_subtitle_en: form.catalog_subtitle_en,
        catalog_title: form.catalog_title,
        catalog_title_en: form.catalog_title_en,
        catalog_desc: form.catalog_desc,
        catalog_desc_en: form.catalog_desc_en,
        catalog_banner_url: form.catalog_banner_url,
        catalog_search_title: form.catalog_search_title,
        catalog_search_title_en: form.catalog_search_title_en,
        catalog_category_title: form.catalog_category_title,
        catalog_category_title_en: form.catalog_category_title_en,
        catalog_all_label: form.catalog_all_label,
        catalog_all_label_en: form.catalog_all_label_en,
        catalog_food_label: form.catalog_food_label,
        catalog_food_label_en: form.catalog_food_label_en,
        catalog_beverage_label: form.catalog_beverage_label,
        catalog_beverage_label_en: form.catalog_beverage_label_en,
        catalog_empty_title: form.catalog_empty_title,
        catalog_empty_title_en: form.catalog_empty_title_en,
        catalog_empty_desc: form.catalog_empty_desc,
        catalog_empty_desc_en: form.catalog_empty_desc_en,
        catalog_empty_btn: form.catalog_empty_btn,
        catalog_empty_btn_en: form.catalog_empty_btn_en,
        store_name: form.store_name,
        whatsapp_number: form.whatsapp_number,
        whatsapp_message: form.whatsapp_message,
        tiktok_shop_url: form.tiktok_shop_url,
        instagram_url: form.instagram_url,
        email_address: form.email_address,
        store_address: form.store_address,
        open_hours: form.open_hours,
        google_maps_embed: form.google_maps_embed,
        updated_at: nowIso,
      };

      const [{ error: aboutErr }, { error: storeErr, strippedEn }] =
        await Promise.all([
          supabase.from("about_content").upsert(aboutPayload),
          upsertWithFallback("store_settings", storePayload),
        ]);

      if (aboutErr) {
        throw new Error(
          aboutErr.message ||
            aboutErr.details ||
            aboutErr.hint ||
            "Gagal menyimpan about_content"
        );
      }

      if (storeErr) {
        throw new Error(
          storeErr.message ||
            storeErr.details ||
            storeErr.hint ||
            "Gagal menyimpan store_settings"
        );
      }

      setStatusMsg({
        type: "success",
        text: strippedEn
          ? "Tulisan berhasil disimpan! (Catatan: sebagian kolom *_en belum ada di tabel store_settings, jadi teks bahasa Indonesia sudah tersimpan aman)."
          : "Semua pengaturan berhasil disimpan dan langsung diperbarui!",
      });
    } catch (err) {
      console.error("Gagal menyimpan pengaturan:", err?.message || err);
      setStatusMsg({
        type: "error",
        text: err?.message || "Terjadi kesalahan saat menyimpan pengaturan.",
      });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "beranda", label: "Beranda" },
    { key: "produk", label: "Produk" },
    { key: "tentang", label: "Tentang Kami" },
    { key: "kontak", label: "Kontak" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#6E1423] font-semibold">
        Memuat pengaturan tampilan website...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#2B211B] py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#6E1423]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E1423]">
              Panel Kontrol Tampilan
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#26060C] mt-1">
              Pengaturan Halaman Website
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Ubah tulisan, foto banner, cerita usaha, dan kontak untuk setiap halaman Surya Snack.
            </p>
          </div>

          <button
            type="submit"
            form="store-settings-form"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2.5 bg-[#6E1423] hover:bg-[#5C0F1C] disabled:opacity-60 text-amber-300 font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md transition cursor-pointer shrink-0"
          >
            {saving ? (
              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faFloppyDisk} className="w-4 h-4" />
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>

        {statusMsg && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <FontAwesomeIcon
              icon={
                statusMsg.type === "success"
                  ? faCheckCircle
                  : faExclamationCircle
              }
              className="w-4 h-4 shrink-0"
            />
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="inline-flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-[#6E1423]/15 shadow-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-[#6E1423] text-amber-300 shadow-xs"
                    : "text-[#2B211B] hover:bg-[#FAF7F0]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <form
          id="store-settings-form"
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#6E1423]/15 space-y-8"
        >
          {activeTab === "beranda" && (
            <TabBeranda
              form={form}
              uploadingField={uploadingField}
              onChange={handleChange}
              onBatchChange={handleBatchChange}
              onUpload={handleImageUpload}
            />
          )}

          {activeTab === "produk" && (
            <TabProduk
              form={form}
              uploadingField={uploadingField}
              onChange={handleChange}
              onBatchChange={handleBatchChange}
              onUpload={handleImageUpload}
            />
          )}

          {activeTab === "tentang" && (
            <TabTentangKami
              form={form}
              uploadingField={uploadingField}
              onChange={handleChange}
              onBatchChange={handleBatchChange}
              onUpload={handleImageUpload}
              onArrayChange={handleArrayChange}
              onAddArrayItem={handleAddArrayItem}
              onRemoveArrayItem={handleRemoveArrayItem}
            />
          )}

          {activeTab === "kontak" && (
            <TabKontak form={form} onChange={handleChange} />
          )}

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2.5 bg-[#6E1423] hover:bg-[#5C0F1C] disabled:opacity-60 text-amber-300 font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md transition cursor-pointer"
            >
              {saving ? (
                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faFloppyDisk} className="w-4 h-4" />
              )}
              <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}