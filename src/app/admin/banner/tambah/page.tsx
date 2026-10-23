// src/app/admin/banner/tambah/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCloudArrowUp, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function TambahBannerPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Tangani pemilihan file gambar dari komputer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageFile) {
      alert("Mohon lengkapi judul, deskripsi, dan pilih file gambar banner!");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload file gambar ke Supabase Storage (Bucket: banners)
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Ambil Public URL dari gambar yang di-upload
      const { data: publicUrlData } = supabase.storage
        .from("banners")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Simpan data teks & URL gambar ke tabel store_banners
      const { count } = await supabase.from("store_banners").select("*", { count: "exact", head: true });
      const nextNumber = (count || 0) + 1;

      const { error: dbError } = await supabase.from("store_banners").insert([
        {
          banner_number: nextNumber,
          title,
          description,
          image_url: imageUrl,
        },
      ]);

      if (dbError) throw dbError;

      alert("Banner baru berhasil ditambahkan!");
      router.push("/admin/dashboard");
    } catch (err: any) {
      alert("Gagal menambahkan banner: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2D241E] p-6 md:p-10 font-serif">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3b0912]">Tambah Banner Baru</h1>
            <p className="text-xs text-gray-500 font-sans mt-1">Unggah gambar langsung dari perangkat Anda untuk beranda.</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition font-sans"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Kembali</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Box Upload Gambar */}
            <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Unggah Gambar Banner</h3>
              <div className="border-2 border-dashed border-amber-900/30 rounded-2xl p-6 text-center space-y-3 bg-[#FAF7F0]">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-lg" />
                  </div>
                )}
                <div className="text-xs text-gray-600">
                  <span className="font-bold text-[#3b0912]">Pilih file gambar</span> dari perangkat komputer
                </div>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3b0912] file:text-amber-200 hover:file:bg-[#5c0f1c] cursor-pointer"
                />
              </div>
            </div>

            {/* Detail Promosi */}
            <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Detail Promosi</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Judul Banner</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan judul promosi..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Deskripsi Singkat</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tambahkan deskripsi singkat..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912] resize-none"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <div className="bg-white border border-amber-900/15 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Tindakan</h3>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-[#1a0306] font-extrabold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                )}
                <span>Simpan Banner</span>
              </button>
              <Link
                href="/admin/dashboard"
                className="w-full block text-center border-2 border-[#3b0912] text-[#3b0912] hover:bg-[#3b0912] hover:text-white font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider"
              >
                Batal
              </Link>
            </div>
          </div>

        </form>

      </div>
    </main>
  );
}