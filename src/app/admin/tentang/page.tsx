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
  faBullseye,
  faClock,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabase";

export default function AdminTentangPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // State Form yang disesuaikan dengan setiap bagian di website Tentang
  const [subtitle, setSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visionText, setVisionText] = useState("");
  
  // Statistik Utama
  const [stat1Value, setStat1Value] = useState("");
  const [stat1Desc, setStat1Desc] = useState("");
  const [stat2Value, setStat2Value] = useState("");
  const [stat2Desc, setStat2Desc] = useState("");

  // Ambil data dari Supabase saat halaman dimuat
  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("id", "main_content")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSubtitle(data.subtitle || "");
        setTitle(data.title || "");
        setDescription(data.description || "");
        setVisionText(data.vision_text || "");
        setStat1Value(data.stat1_value || "1998");
        setStat1Desc(data.stat1_desc || "Dari dapur kecil di belakang rumah.");
        setStat2Value(data.stat2_value || "25+");
        setStat2Desc(data.stat2_desc || "Resep dijaga lintas generasi.");
      }
    } catch (err: any) {
      console.error("Gagal memuat data Tentang Kami:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Simpan Perubahan ke Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");

    try {
      const { error } = await supabase.from("about_content").upsert({
        id: "main_content",
        subtitle,
        title,
        description,
        vision_text: visionText,
        stat1_value: stat1Value,
        stat1_desc: stat1Desc,
        stat2_value: stat2Value,
        stat2_desc: stat2Desc,
        updated_at: new Date(),
      });

      if (error) throw error;

      setSuccessMsg("Tampilan dan konten halaman Tentang Kami berhasil diselaraskan!");
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
        Memuat panel admin Tentang Kami...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-white min-h-screen text-[#2D241E] font-sans max-w-5xl mx-auto">
      
      {/* Header Halaman */}
      <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          <p className="text-xs text-gray-500">
            Sesuaikan bagian Hero, Visi, dan Statistik agar selaras dengan tampilan website publik.
          </p>
        </div>
      </div>

      {/* Notifikasi Sukses */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 shadow-xs">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Form Editor yang Dikelompokkan */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* BAGIAN 1: HERO & PENGANTAR UTAMA */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#3b0912] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <FontAwesomeIcon icon={faStore} className="text-amber-600" />
            <span>Bagian 1: Hero & Teks Pengantar Utama</span>
          </h2>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Sub Judul / Badge Atas
              </label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: Tentang Surya Snack"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Judul Utama Website
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Warisan Cita Rasa, Menjaga Rasa Asli"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Paragraf Deskripsi / Sejarah Singkat
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 2: VISI UTAMA */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#3b0912] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <FontAwesomeIcon icon={faBullseye} className="text-amber-600" />
            <span>Bagian 2: Visi Utama Perusahaan</span>
          </h2>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Teks Visi (Tampil di dalam kotak banner maroon)
            </label>
            <textarea
              rows={3}
              required
              value={visionText}
              onChange={(e) => setVisionText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition resize-none"
            />
          </div>
        </div>

        {/* BAGIAN 3: STATISTIK PADA HALAMAN */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#3b0912] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <FontAwesomeIcon icon={faAward} className="text-amber-600" />
            <span>Bagian 3: Ringkasan Statistik Kartu</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-[#3b0912]">Statistik 1 (Tahun Berdiri)</span>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nilai / Angka</label>
                <input
                  type="text"
                  value={stat1Value}
                  onChange={(e) => setStat1Value(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Keterangan Singkat</label>
                <input
                  type="text"
                  value={stat1Desc}
                  onChange={(e) => setStat1Desc(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-[#3b0912]">Statistik 2 (Pengalaman)</span>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nilai / Angka</label>
                <input
                  type="text"
                  value={stat2Value}
                  onChange={(e) => setStat2Value(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Keterangan Singkat</label>
                <input
                  type="text"
                  value={stat2Desc}
                  onChange={(e) => setStat2Desc(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi Simpan */}
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
                <span>Simpan Seluruh Perubahan Tentang</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}