// src/components/admin/pengaturan/TabLogin.jsx
"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faUpload,
  faSpinner,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_LOGIN_BG =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920";

export default function TabLogin({
  form,
  uploadingField,
  onChange,
  onBatchChange,
  onUpload,
}) {
  const isUploading = uploadingField === "login_bg_url";
  const previewSrc = form.login_bg_url?.trim() || DEFAULT_LOGIN_BG;

  const handleResetDefault = () => {
    if (!confirm("Kembalikan background halaman login ke gambar bawaan?")) return;
    if (onBatchChange) {
      onBatchChange({ login_bg_url: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#26060C]">
            1. Background Halaman Login Admin
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Unggah gambar latar belakang halaman masuk admin ke Google Drive, lalu klik <strong>Simpan Perubahan</strong>.
          </p>
        </div>

        {form.login_bg_url && (
          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer w-fit"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>
        )}
      </div>

      {/* Pratinjau Foto Background Bersih */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
          Pratinjau Foto Background
        </label>
        <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#6E1423]/20 bg-[#120c0a]">
          <img
            src={previewSrc}
            alt="Preview Background Login"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_LOGIN_BG;
            }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Input Link & Tombol Upload ke Google Drive */}
      <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#6E1423]/15 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#26060C]">
          <FontAwesomeIcon icon={faImage} className="mr-1.5 text-[#6E1423]" />
          Link / Upload Gambar Background (Google Drive)
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="login_bg_url"
            value={form.login_bg_url || ""}
            onChange={onChange}
            placeholder="Kosongkan untuk default, atau unggah gambar ke Google Drive..."
            className="flex-1 bg-white border border-[#6E1423]/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2B211B] focus:outline-none focus:border-[#6E1423]"
          />

          <label className="inline-flex items-center justify-center gap-2 bg-[#6E1423] hover:bg-[#5C0F1C] text-amber-300 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition shrink-0">
            {isUploading ? (
              <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5" />
            )}
            <span>{isUploading ? "Mengunggah..." : "Upload ke Drive"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload("login_bg_url", file);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <p className="text-[11px] text-gray-500">
          Gambar akan otomatis masuk ke folder <strong>login</strong> di Google Drive. Setelah selesai mengunggah, klik tombol <strong>Simpan Perubahan</strong> di bagian atas atau bawah halaman.
        </p>
      </div>
    </div>
  );
}