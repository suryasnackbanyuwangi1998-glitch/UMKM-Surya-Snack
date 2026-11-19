// src/components/AdminFeaturesManager.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faSpinner, faListCheck } from "@fortawesome/free-solid-svg-icons";

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon_type: string;
  order_index: number;
}

export default function AdminFeaturesManager() {
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    async function fetchFeatures() {
      const { data } = await supabase
        .from("home_features")
        .select("*")
        .order("order_index", { ascending: true });

      if (data && data.length > 0) {
        setFeatures(data);
      } else {
        setFeatures([
          { id: 1, title: 'Resep Warisan Autentik', description: 'Diwariskan dari generasi ke generasi sejak tahun 1998, menjaga keaslian rasa tradisional Banyuwangi.', icon_type: 'award', order_index: 1 },
          { id: 2, title: 'Bahan Pilihan Premium', description: 'Hanya menggunakan hasil bumi pilihan tanpa pengawet buatan, diolah secara higienis setiap hari.', icon_type: 'leaf', order_index: 2 },
          { id: 3, title: 'Dipanggang & Digoreng Sempurna', description: 'Tekstur renyah di luar, empuk dan gurih di dalam dengan standar kualitas artisan.', icon_type: 'fire', order_index: 3 },
          { id: 4, title: 'Layanan Pelanggan Personal', description: 'Pemesanan transparan dan konfirmasi langsung dengan respon hangat melalui WhatsApp.', icon_type: 'phone', order_index: 4 },
        ]);
      }
    }
    fetchFeatures();
  }, []);

  const handleSaveFeatures = async () => {
    setSaving(true);
    try {
      for (const item of features) {
        const { error } = await supabase
          .from("home_features")
          .upsert({
            id: item.id,
            title: item.title,
            description: item.description,
            icon_type: item.icon_type,
            order_index: item.order_index,
          });
        if (error) throw error;
      }
      setNotification("Berhasil memperbarui Komitmen Kualitas Kami!");
      setTimeout(() => setNotification(""), 4000);
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-amber-900/15 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
            <FontAwesomeIcon icon={faListCheck} className="text-[#5c0f1c]" />
            Kelola Komitmen Kualitas Kami (4 Pilar)
          </h2>
          <p className="text-xs text-gray-500">
            Ubah judul dan isi keterangan dari 4 pilar keunggulan yang tampil di halaman beranda.
          </p>
        </div>
        <button
          onClick={handleSaveFeatures}
          disabled={saving}
          className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50 uppercase tracking-wider"
        >
          {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
          Simpan Komitmen
        </button>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold">
          {notification}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {features.map((item, index) => (
          <div key={item.id} className="p-5 bg-[#FDFBF7] border border-amber-900/10 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c0f1c]">
              Pilar ke-{index + 1} ({item.icon_type})
            </span>
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Judul Pilar</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const updated = [...features];
                  updated[index].title = e.target.value;
                  setFeatures(updated);
                }}
                className="w-full bg-white border border-amber-900/20 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 mb-1 block">Deskripsi / Keterangan</label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => {
                  const updated = [...features];
                  updated[index].description = e.target.value;
                  setFeatures(updated);
                }}
                className="w-full bg-white border border-amber-900/20 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#3b0912] resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}