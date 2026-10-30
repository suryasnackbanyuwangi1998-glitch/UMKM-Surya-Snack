// src/app/admin/tentang/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFloppyDisk,
  faSpinner,
  faCheckCircle,
  faStore,
  faChartColumn,
  faClockRotateLeft,
  faBullseye,
  faListCheck,
  faPlus,
  faTrash,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabase";

export default function AdminTentangPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Konten Utama, Foto & Teks pada Foto
  const [subtitle, setSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visionText, setVisionText] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [photoBadge, setPhotoBadge] = useState("");
  const [photoQuote, setPhotoQuote] = useState("");

  // Statistik (Dibuat dinamis agar bisa tambah/hapus)
  const [stats, setStats] = useState<any[]>([]);

  // Timeline Sejarah
  const [timeline, setTimeline] = useState<any[]>([]);

  // 4 Pilar Misi
  const [pilarMisi, setPilarMisi] = useState<any[]>([]);

  // Nilai yang Kami Jaga
  const [nilaiItems, setNilaiItems] = useState<any[]>([]);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSubtitle(data.subtitle || "");
        setTitle(data.title || "");
        setDescription(data.description || "");
        setVisionText(data.vision_text || "");
        setAboutImage(data.about_image || "/foto-depan.jpeg");
        setPhotoBadge(data.photo_badge || "SEJAK 1998");
        setPhotoQuote(data.photo_quote || "Konsistensi rasa otentik adalah resep utama kami bertahan hingga hari ini.");

        // Statistik Dinamis (Fallback ke 4 data awal jika belum ada)
        setStats(
          data.stats_items || [
            { label: data.stat1_label || "BERDIRI SEJAK", value: data.stat1_value || "1998", desc: data.stat1_desc || "Dari dapur kecil di belakang rumah.", tone: "dark" },
            { label: data.stat2_label || "RESMI & LEGAL", value: data.stat2_value || "2000", desc: data.stat2_desc || "Toko depan rumah & sertifikat lengkap.", tone: "light" },
            { label: data.stat3_label || "TAHUN PENGALAMAN", value: data.stat3_value || "25+", desc: data.stat3_desc || "Resep dijaga lintas generasi.", tone: "light" },
            { label: data.stat4_label || "PELANGGAN PUAS", value: data.stat4_value || "10rb+", desc: data.stat4_desc || "Dikirim ke berbagai kota di Indonesia.", tone: "amber" },
          ]
        );

        setTimeline(
          data.timeline || [
            { year: "1998", title: "Awal yang Sederhana", desc: "Surya Snack dirintis sebagai usaha rumahan berskala kecil di bagian belakang rumah." },
            { year: "2000", title: "Toko Resmi & Perizinan Lengkap", desc: "Langkah besar diambil dengan membuka toko di bagian depan rumah." },
            { year: "SEKARANG", title: "Tumbuh di Era Digital", desc: "Kini Surya Snack melayani pemesanan online dan pengiriman ke berbagai kota." },
          ]
        );

        setPilarMisi(
          data.pilar_misi || [
            { num: "01", title: "Kualitas Rasa", desc: "Mengembangkan resep otentik dengan prinsip produksi tradisional untuk menghadirkan cita rasa terbaik." },
            { num: "02", title: "Mutu & Kualitas", desc: "Menggunakan bahan baku alami pilihan tanpa pengawet tambahan agar produk aman dikonsumsi." },
            { num: "03", title: "Pemberdayaan Lokal", desc: "Bermitra dengan UMKM dan petani lokal Banyuwangi dalam proses produksi untuk tumbuh bersama." },
            { num: "04", title: "Kepuasan Pelanggan", desc: "Menghadirkan pelayanan hangat dan produk segar dengan konsistensi kualitas yang selalu terjaga." },
          ]
        );

        setNilaiItems(
          data.nilai_items || [
            { title: "Integritas & Kejujuran", desc: "Transparansi penuh dalam setiap bahan baku dan proses pembuatan produk." },
            { title: "Komitmen Mutu", desc: "Konsistensi rasa otentik yang selalu dijaga dari generasi ke generasi." },
            { title: "Keberlanjutan", desc: "Kepedulian terhadap lingkungan dan kolaborasi erat bersama masyarakat lokal." },
          ]
        );
      }
    } catch (err: any) {
      console.error("Gagal memuat data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSubmitting(true);
      const fileName = `about-${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicURLData } = supabase.storage
        .from("images")
        .getPublicUrl(data.path);

      setAboutImage(publicURLData.publicUrl);
      setSubmitting(false);
      setSuccessMsg("Foto berhasil diunggah! Jangan lupa klik 'Simpan Seluruh Perubahan'.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Gagal mengupload gambar: " + err.message);
      setSubmitting(false);
    }
  };

  // Handler Statistik
  const handleStatChange = (index: number, field: string, value: string) => {
    const updated = [...stats];
    updated[index][field] = value;
    setStats(updated);
  };
  const handleAddStat = () => setStats([...stats, { label: "", value: "", desc: "", tone: "light" }]);
  const handleRemoveStat = (index: number) => setStats(stats.filter((_, i) => i !== index));

  // Handler Timeline
  const handleTimelineChange = (index: number, field: string, value: string) => {
    const updated = [...timeline];
    updated[index][field] = value;
    setTimeline(updated);
  };
  const handleAddTimeline = () => setTimeline([...timeline, { year: "", title: "", desc: "" }]);
  const handleRemoveTimeline = (index: number) => setTimeline(timeline.filter((_, i) => i !== index));

  // Handler Pilar Misi
  const handlePilarChange = (index: number, field: string, value: string) => {
    const updated = [...pilarMisi];
    updated[index][field] = value;
    setPilarMisi(updated);
  };
  const handleAddPilar = () => {
    const nextNum = String(pilarMisi.length + 1).padStart(2, "0");
    setPilarMisi([...pilarMisi, { num: nextNum, title: "", desc: "" }]);
  };
  const handleRemovePilar = (index: number) => setPilarMisi(pilarMisi.filter((_, i) => i !== index));

  // Handler Nilai-nilai
  const handleNilaiChange = (index: number, field: string, value: string) => {
    const updated = [...nilaiItems];
    updated[index][field] = value;
    setNilaiItems(updated);
  };
  const handleAddNilai = () => setNilaiItems([...nilaiItems, { title: "", desc: "" }]);
  const handleRemoveNilai = (index: number) => setNilaiItems(nilaiItems.filter((_, i) => i !== index));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");

    try {
      const { error } = await supabase.from("about_content").upsert({
        id: "main",
        subtitle,
        title,
        description,
        vision_text: visionText,
        about_image: aboutImage,
        photo_badge: photoBadge,
        photo_quote: photoQuote,
        stats_items: stats,
        timeline,
        pilar_misi: pilarMisi,
        nilai_items: nilaiItems,
        updated_at: new Date(),
      });

      if (error) throw error;

      setSuccessMsg("Seluruh konten halaman Tentang berhasil diperbarui!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-[#5c0f1c] font-serif text-sm">
        Memuat panel admin...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#FAF8F5] min-h-screen text-[#2D241E] font-sans">
      <div className="bg-white border border-[#EBE3D5] p-6 md:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5c0f1c] hover:underline mb-1"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#3b0912]">
            Kelola Halaman Tentang Kami
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Atur teks utama, unggah foto, statistik, timeline, pilar misi, dan nilai-nilai perusahaan.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 shadow-sm">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. KONTEN UTAMA, FOTO & TEKS FOTO */}
        <div className="bg-white border border-[#EBE3D5] p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#EBE3D5]">
            <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
              <FontAwesomeIcon icon={faStore} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#3b0912]">1. Konten Teks Utama, Foto Toko & Visi</h2>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2">Sub Judul / Badge Atas Halaman</label>
              <input type="text" required value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2">Judul Utama Halaman</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2">Deskripsi / Paragraf Pengantar</label>
              <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-none" />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c]" />
                Foto Toko Tampak Depan
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl">
                {aboutImage && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#EBE3D5] shrink-0 bg-gray-100 shadow-xs">
                    <img src={aboutImage} alt="Preview Foto Toko" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#3b0912] file:text-amber-200 hover:file:bg-[#5c0f1c] file:cursor-pointer transition cursor-pointer bg-white border border-[#EBE3D5] rounded-xl p-2"
                  />
                  <p className="text-[10px] text-gray-400">Pilih file gambar dari perangkat Anda.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-1">Teks Badge di Pojok Foto</label>
                <input type="text" value={photoBadge} onChange={(e) => setPhotoBadge(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-1">Teks Kutipan di Bawah Foto</label>
                <input type="text" value={photoQuote} onChange={(e) => setPhotoQuote(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2">Teks Visi Utama Perusahaan</label>
              <textarea rows={3} required value={visionText} onChange={(e) => setVisionText(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-none" />
            </div>
          </div>
        </div>

        {/* 2. KARTU STATISTIK (DENGAN TOMBOL HAPUS & TAMBAH) */}
        <div className="bg-white border border-[#EBE3D5] p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
                <FontAwesomeIcon icon={faChartColumn} className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-[#3b0912]">2. Pengaturan Kartu Statistik</h2>
                <p className="text-[11px] text-gray-500 font-light">Atur, tambah, atau hapus kartu statistik.</p>
              </div>
            </div>
            <button type="button" onClick={handleAddStat} className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
              <FontAwesomeIcon icon={faPlus} /> Tambah Statistik
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c0f1c] uppercase">Statistik #{idx + 1}</span>
                  <button type="button" onClick={() => handleRemoveStat(idx)} className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200">
                    <FontAwesomeIcon icon={faTrash} /> Hapus
                  </button>
                </div>
                <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Label</label><input type="text" value={stat.label} onChange={(e) => handleStatChange(idx, "label", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" /></div>
                <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nilai</label><input type="text" value={stat.value} onChange={(e) => handleStatChange(idx, "value", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold" /></div>
                <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Keterangan</label><input type="text" value={stat.desc} onChange={(e) => handleStatChange(idx, "desc", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" /></div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Warna Tema (dark / light / amber)</label>
                  <select value={stat.tone || "light"} onChange={(e) => handleStatChange(idx, "tone", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800">
                    <option value="light">Putih (Light)</option>
                    <option value="dark">Merah Tua (Dark)</option>
                    <option value="amber">Kuning Emas (Amber)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TIMELINE SEJARAH */}
        <div className="bg-white border border-[#EBE3D5] p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
                <FontAwesomeIcon icon={faClockRotateLeft} className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-[#3b0912]">3. Jejak Langkah (Timeline)</h2>
              </div>
            </div>
            <button type="button" onClick={handleAddTimeline} className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
              <FontAwesomeIcon icon={faPlus} /> Tambah Riwayat
            </button>
          </div>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c0f1c] uppercase">Timeline #{idx + 1}</span>
                  <button type="button" onClick={() => handleRemoveTimeline(idx)} className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200">
                    <FontAwesomeIcon icon={faTrash} /> Hapus
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Tahun / Periode</label><input type="text" value={item.year} onChange={(e) => handleTimelineChange(idx, "year", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold" /></div>
                  <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Judul Peristiwa</label><input type="text" value={item.title} onChange={(e) => handleTimelineChange(idx, "title", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" /></div>
                </div>
                <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi Lengkap</label><textarea rows={2} value={item.desc} onChange={(e) => handleTimelineChange(idx, "desc", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 resize-none" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 4 PILAR MISI */}
        <div className="bg-white border border-[#EBE3D5] p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
                <FontAwesomeIcon icon={faBullseye} className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-[#3b0912]">4. Pengaturan 4 Pilar Misi</h2>
              </div>
            </div>
            <button type="button" onClick={handleAddPilar} className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
              <FontAwesomeIcon icon={faPlus} /> Tambah Pilar
            </button>
          </div>
          <div className="space-y-4">
            {pilarMisi.map((item, idx) => (
              <div key={idx} className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c0f1c] uppercase">Pilar #{item.num}</span>
                  <button type="button" onClick={() => handleRemovePilar(idx)} className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200">
                    <FontAwesomeIcon icon={faTrash} /> Hapus
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nomor (Cth: 01)</label><input type="text" value={item.num} onChange={(e) => handlePilarChange(idx, "num", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold" /></div>
                  <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Judul Pilar</label><input type="text" value={item.title} onChange={(e) => handlePilarChange(idx, "title", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" /></div>
                </div>
                <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi Pilar</label><input type="text" value={item.desc} onChange={(e) => handlePilarChange(idx, "desc", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. NILAI YANG KAMI JAGA */}
        <div className="bg-white border border-[#EBE3D5] p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
                <FontAwesomeIcon icon={faListCheck} className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-[#3b0912]">5. Pengaturan Nilai yang Kami Jaga</h2>
              </div>
            </div>
            <button type="button" onClick={handleAddNilai} className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
              <FontAwesomeIcon icon={faPlus} /> Tambah Nilai
            </button>
          </div>
          <div className="space-y-4">
            {nilaiItems.map((item, idx) => (
              <div key={idx} className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c0f1c] uppercase">Nilai #{idx + 1}</span>
                  <button type="button" onClick={() => handleRemoveNilai(idx)} className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200">
                    <FontAwesomeIcon icon={faTrash} /> Hapus
                  </button>
                </div>
                <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Judul Nilai</label><input type="text" value={item.title} onChange={(e) => handleNilaiChange(idx, "title", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold" /></div>
                <div><label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi Nilai</label><input type="text" value={item.desc} onChange={(e) => handleNilaiChange(idx, "desc", e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-8 py-3.5 rounded-xl transition text-xs uppercase tracking-widest shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-amber-300" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faFloppyDisk} />
                <span>Simpan Seluruh Perubahan</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}