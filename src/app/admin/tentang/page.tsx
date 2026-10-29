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
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabase";

export default function AdminTentangPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Konten Utama
  const [subtitle, setSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visionText, setVisionText] = useState("");

  // 4 Kartu Statistik
  const [s1Label, setS1Label] = useState("");
  const [s1Value, setS1Value] = useState("");
  const [s1Desc, setS1Desc] = useState("");

  const [s2Label, setS2Label] = useState("");
  const [s2Value, setS2Value] = useState("");
  const [s2Desc, setS2Desc] = useState("");

  const [s3Label, setS3Label] = useState("");
  const [s3Value, setS3Value] = useState("");
  const [s3Desc, setS3Desc] = useState("");

  const [s4Label, setS4Label] = useState("");
  const [s4Value, setS4Value] = useState("");
  const [s4Desc, setS4Desc] = useState("");

  // Timeline Sejarah
  const [timeline, setTimeline] = useState<any[]>([]);

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

        setS1Label(data.stat1_label || "BERDIRI SEJAK");
        setS1Value(data.stat1_value || "1998");
        setS1Desc(data.stat1_desc || "Dari dapur kecil di belakang rumah.");

        setS2Label(data.stat2_label || "RESMI & LEGAL");
        setS2Value(data.stat2_value || "2000");
        setS2Desc(data.stat2_desc || "Toko depan rumah & sertifikat lengkap.");

        setS3Label(data.stat3_label || "TAHUN PENGALAMAN");
        setS3Value(data.stat3_value || "25+");
        setS3Desc(data.stat3_desc || "Resep dijaga lintas generasi.");

        setS4Label(data.stat4_label || "PELANGGAN PUAS");
        setS4Value(data.stat4_value || "10rb+");
        setS4Desc(data.stat4_desc || "Dikirim ke berbagai kota di Indonesia.");

        setTimeline(
          data.timeline || [
            {
              year: "1998",
              title: "Awal yang Sederhana",
              desc: "Surya Snack dirintis sebagai usaha rumahan berskala kecil di bagian belakang rumah.",
            },
            {
              year: "2000",
              title: "Toko Resmi & Perizinan Lengkap",
              desc: "Langkah besar diambil dengan membuka toko di bagian depan rumah serta melengkapi perizinan.",
            },
            {
              year: "SEKARANG",
              title: "Tumbuh di Era Digital",
              desc: "Kini Surya Snack melayani pemesanan online dan pengiriman ke berbagai kota.",
            },
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

  const handleTimelineChange = (index: number, field: string, value: string) => {
    const updated = [...timeline];
    updated[index][field] = value;
    setTimeline(updated);
  };

  const handleAddTimeline = () => {
    setTimeline([...timeline, { year: "", title: "", desc: "" }]);
  };

  const handleRemoveTimeline = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

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
        stat1_label: s1Label,
        stat1_value: s1Value,
        stat1_desc: s1Desc,
        stat2_label: s2Label,
        stat2_value: s2Value,
        stat2_desc: s2Desc,
        stat3_label: s3Label,
        stat3_value: s3Value,
        stat3_desc: s3Desc,
        stat4_label: s4Label,
        stat4_value: s4Value,
        stat4_desc: s4Desc,
        timeline,
        updated_at: new Date(),
      });

      if (error) throw error;

      setSuccessMsg("Konten, Statistik, & Timeline Jejak Langkah berhasil diperbarui!");
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
      
      {/* Header Halaman */}
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
            Atur teks utama, visi, 4 statistik, dan riwayat timeline jejak langkah perusahaan.
          </p>
        </div>
      </div>

      {/* Notifikasi Sukses */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 shadow-sm">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* KOTAK 1: KONTEN UTAMA */}
        <div className="bg-white border border-[#EBE3D5] p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#EBE3D5]">
            <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
              <FontAwesomeIcon icon={faStore} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#3b0912]">Pengaturan Konten Teks Utama</h2>
              <p className="text-[11px] text-gray-500 font-light">Atur judul, deskripsi, dan visi perusahaan.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2">
                Sub Judul / Badge Atas
              </label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2">
                Judul Utama Halaman
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2">
                Deskripsi / Paragraf Pengantar
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c0f1c] mb-2">
                Teks Visi Utama Perusahaan
              </label>
              <textarea
                rows={3}
                required
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-4 py-3 text-xs md:text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-none"
              />
            </div>
          </div>
        </div>

        {/* KOTAK 2: 4 KARTU STATISTIK */}
        <div className="bg-white border border-[#EBE3D5] p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#EBE3D5]">
            <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
              <FontAwesomeIcon icon={faChartColumn} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#3b0912]">Pengaturan 4 Kartu Statistik</h2>
              <p className="text-[11px] text-gray-500 font-light">Atur label, angka/tahun, dan keterangan pada 4 kotak statistik.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stat 1 */}
            <div className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#5c0f1c] uppercase">Kartu Statistik 1</span>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Label</label>
                <input type="text" value={s1Label} onChange={(e) => setS1Label(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nilai / Angka</label>
                <input type="text" value={s1Value} onChange={(e) => setS1Value(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Keterangan</label>
                <input type="text" value={s1Desc} onChange={(e) => setS1Desc(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#5c0f1c] uppercase">Kartu Statistik 2</span>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Label</label>
                <input type="text" value={s2Label} onChange={(e) => setS2Label(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nilai / Angka</label>
                <input type="text" value={s2Value} onChange={(e) => setS2Value(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Keterangan</label>
                <input type="text" value={s2Desc} onChange={(e) => setS2Desc(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#5c0f1c] uppercase">Kartu Statistik 3</span>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Label</label>
                <input type="text" value={s3Label} onChange={(e) => setS3Label(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nilai / Angka</label>
                <input type="text" value={s3Value} onChange={(e) => setS3Value(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Keterangan</label>
                <input type="text" value={s3Desc} onChange={(e) => setS3Desc(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#5c0f1c] uppercase">Kartu Statistik 4</span>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Label</label>
                <input type="text" value={s4Label} onChange={(e) => setS4Label(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nilai / Angka</label>
                <input type="text" value={s4Value} onChange={(e) => setS4Value(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Keterangan</label>
                <input type="text" value={s4Desc} onChange={(e) => setS4Desc(e.target.value)} className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800" />
              </div>
            </div>

          </div>
        </div>

        {/* KOTAK 3: JEJAK LANGKAH (TIMELINE SEJARAH) */}
        <div className="bg-white border border-[#EBE3D5] p-6 md:p-10 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5c0f1c]/10 text-[#5c0f1c] flex items-center justify-center">
                <FontAwesomeIcon icon={faClockRotateLeft} className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-[#3b0912]">Pengaturan Jejak Langkah (Timeline)</h2>
                <p className="text-[11px] text-gray-500 font-light">Atur riwayat tahun, judul peristiwa, dan deskripsi sejarah perusahaan.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddTimeline}
              className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} /> Tambah Riwayat
            </button>
          </div>

          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="p-5 bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c0f1c] uppercase">Riwayat Timeline #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeline(idx)}
                    className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-rose-200 shadow-xs"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Hapus
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Tahun / Periode (Cth: 1998)</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => handleTimelineChange(idx, "year", e.target.value)}
                      className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Judul Peristiwa</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                      className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Deskripsi Lengkap Peristiwa</label>
                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) => handleTimelineChange(idx, "desc", e.target.value)}
                    className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 resize-none"
                  />
                </div>
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