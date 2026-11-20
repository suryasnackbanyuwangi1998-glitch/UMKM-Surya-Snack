"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faImage } from "@fortawesome/free-solid-svg-icons";

function extractDriveId(url = "") {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";

  const lh3Match = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match?.[1]) return lh3Match[1];

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch?.[1]) return queryMatch[1];

  return "";
}

function buildFallbackUrl(currentUrl) {
  const id = extractDriveId(currentUrl);
  if (!id) return "";

  const trimmed = String(currentUrl || "").trim();
  if (trimmed.includes("lh3.googleusercontent.com")) {
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  if (trimmed.includes("drive.google.com/uc")) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
  }
  return `https://lh3.googleusercontent.com/d/${id}`;
}

export default function SettingsImageField({
  label,
  name,
  value,
  placeholder,
  uploadingField,
  onChange,
  onUpload,
}) {
  const isUploading = uploadingField === name;
  const [imgSrc, setImgSrc] = useState(value || "");
  const [triedFallback, setTriedFallback] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setImgSrc(value || "");
    setTriedFallback(false);
    setLoadFailed(false);
  }, [value]);

  const handleImgError = () => {
    if (!triedFallback) {
      const fallback = buildFallbackUrl(imgSrc || value);
      if (fallback && fallback !== imgSrc) {
        setTriedFallback(true);
        setImgSrc(fallback);
        return;
      }
    }
    setLoadFailed(true);
  };

  return (
    <div className="space-y-3 bg-[#FAF7F0] p-4 rounded-xl border border-[#6E1423]/15">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#6E1423]">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6E1423]"
        />

        <label className="inline-flex items-center justify-center gap-2 bg-[#6E1423] hover:bg-[#5C0F1C] text-amber-300 font-semibold px-4 py-2.5 rounded-lg text-xs cursor-pointer transition shrink-0">
          <FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5" />
          <span>{isUploading ? "Mengunggah..." : "Upload Foto"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onUpload(name, file);
              }
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {value ? (
        <div className="relative w-full h-44 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
          {!loadFailed ? (
            <img
              key={imgSrc}
              src={imgSrc}
              alt={label}
              referrerPolicy="no-referrer"
              onError={handleImgError}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-4 text-center space-y-1">
              <p className="text-xs font-bold text-[#6E1423]">
                Preview gambar belum bisa dimuat
              </p>
              <p className="text-[11px] text-gray-500">
                Pastikan izin file di Google Drive sudah diatur ke &ldquo;Anyone with the link&rdquo; (Viewer).
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
          <FontAwesomeIcon icon={faImage} />
          <span>Belum ada gambar dipilih.</span>
        </div>
      )}
    </div>
  );
}