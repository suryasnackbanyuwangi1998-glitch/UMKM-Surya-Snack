// src/app/admin/banner/tambah/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faImage, faSpinner, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function TambahBannerPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [bannerNumber, setBannerNumber] = useState("1");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Silakan pilih gambar banner terlebih dahulu!");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("imageFile", imageFile); // Kirim file mentah agar di-upload ke Google Drive di backend
      formData.append("banner_number", bannerNumber);

      const res = await fetch("/api/banners", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Gagal menyimpan banner.");

      setSuccessMsg("Banner berhasil disimpan ke Google Drive & aktif di website!");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 bg-[#FAF7F0] min-h-screen text-[#2D241E] font-sans">
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#3b0912]">Tambah Banner Baru (Google Drive)</h1>
          <p className="text-xs text-gray-500 mt-1">Unggah gambar poster promosi yang akan langsung disimpan ke Google Drive.</p>
        </div>
        <Link href="/admin/dashboard" className="bg-white border border-amber-900/20 text-[#3b0912] hover:bg-amber-50 text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5">
          <FontAwesomeIcon icon={faArrowLeft} /> Kembali
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-xs space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#3b0912]">Pilih Gambar Banner</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full flex-1 cursor-pointer bg-amber-50/40 border-2 border-dashed border-amber-900/20 rounded-xl p-8 text-center hover:bg-amber-50/70 transition">
                <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c] text-3xl mb-2" />
                <span className="block text-xs text-gray-700 font-bold">Pilih file gambar dari komputer</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview && (
                <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#3b0912] mb-2">Nomor Urut Banner</label>
            <input
              type="number"
              value={bannerNumber}
              onChange={(e) => setBannerNumber(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#5c0f1c]"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-xs space-y-4 sticky top-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#3b0912] border-b border-gray-100 pb-3">Tindakan</h3>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-[#3b0912] font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition"
            >
              {submitting ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <span>Simpan ke Drive</span>}
            </button>
            <Link
              href="/admin/dashboard"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition"
            >
              Batal
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}