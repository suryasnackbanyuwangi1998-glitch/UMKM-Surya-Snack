// src/app/admin/kontak/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faFloppyDisk,
  faTrashCan,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabase";

interface ContactsState {
  whatsapp1: string;
  whatsapp2: string;
  instagram: string;
  alamat: string;
  tiktok: string;
}

export default function AdminKontakPage() {
  const [contacts, setContacts] = useState<ContactsState>({
    whatsapp1: "",
    whatsapp2: "",
    instagram: "",
    alamat: "",
    tiktok: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>("");

  // Ambil data kontak dari tabel "contacts" di Supabase saat halaman dimuat
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", "informasi_utama")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContacts({
          whatsapp1: data.whatsapp1 || "",
          whatsapp2: data.whatsapp2 || "",
          instagram: data.instagram || "",
          alamat: data.alamat || "",
          tiktok: data.tiktok || "",
        });
      }
    } catch (error: any) {
      console.error("Gagal memuat kontak:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ContactsState, value: string) => {
    setContacts((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async (fieldsToClear: (keyof ContactsState)[]) => {
    setContacts((prev) => {
      const updated = { ...prev };
      fieldsToClear.forEach((field) => {
        updated[field] = "";
      });
      return updated;
    });

    try {
      const clearData: any = {};
      fieldsToClear.forEach((field) => {
        clearData[field] = "";
      });

      // Update tabel "contacts" di Supabase untuk mengosongkan kolom
      const { error } = await supabase
        .from("contacts")
        .update({ ...clearData })
        .eq("id", "informasi_utama");

      if (error) throw error;

      setNotification("Berhasil mengosongkan dan menyimpan data!");
      setTimeout(() => setNotification(""), 3000);
    } catch (error: any) {
      alert("Gagal menghapus data: " + error.message);
    }
  };

  const handleSave = async (sectionName: string) => {
    setSavingSection(sectionName);
    try {
      // Simpan/upsert data ke tabel "contacts" dengan id "informasi_utama"
      const { error } = await supabase.from("contacts").upsert({
        id: "informasi_utama",
        whatsapp1: contacts.whatsapp1,
        whatsapp2: contacts.whatsapp2,
        instagram: contacts.instagram,
        alamat: contacts.alamat,
        tiktok: contacts.tiktok,
      });

      if (error) throw error;

      setNotification(`Berhasil menyimpan data ${sectionName} ke Database!`);
      setTimeout(() => setNotification(""), 3000);
    } catch (error: any) {
      const errMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Gagal menyimpan: " + errMessage);
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-500 text-xs">
        Memuat data kontak...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto bg-gray-50 min-h-screen text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600">
            <FontAwesomeIcon icon={faAddressBook} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-serif">Kelola Kontak & Informasi</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur tautan dan informasi kontak yang tampil di website utama Surya Snack.
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-semibold shadow-sm">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* WhatsApp */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">WhatsApp</h3>
                <p className="text-[10px] text-slate-500">Nomor Utama & Cadangan</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Nomor 1</label>
                <input
                  type="text"
                  value={contacts.whatsapp1}
                  onChange={(e) => handleChange("whatsapp1", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Nomor 2</label>
                <input
                  type="text"
                  value={contacts.whatsapp2}
                  onChange={(e) => handleChange("whatsapp2", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => handleSave("WhatsApp")}
              disabled={savingSection === "WhatsApp"}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {savingSection === "WhatsApp" ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faFloppyDisk} />
              )}
              Simpan
            </button>
            <button
              onClick={() => handleDelete(["whatsapp1", "whatsapp2"])}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Kosongkan"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        {/* Instagram */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Instagram</h3>
                <p className="text-[10px] text-slate-500">Username Akun</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Username / Link</label>
              <input
                type="text"
                value={contacts.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => handleSave("Instagram")}
              disabled={savingSection === "Instagram"}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {savingSection === "Instagram" ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faFloppyDisk} />
              )}
              Simpan
            </button>
            <button
              onClick={() => handleDelete(["instagram"])}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Kosongkan"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        {/* Alamat */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Alamat</h3>
                <p className="text-[10px] text-slate-500">Lokasi Toko Fisik</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Alamat Toko</label>
              <textarea
                rows={3}
                value={contacts.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => handleSave("Alamat")}
              disabled={savingSection === "Alamat"}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {savingSection === "Alamat" ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faFloppyDisk} />
              )}
              Simpan
            </button>
            <button
              onClick={() => handleDelete(["alamat"])}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Kosongkan"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        {/* TikTok */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">TikTok Shop</h3>
                <p className="text-[10px] text-slate-500">Tautan TikTok Toko</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Username / Link TikTok</label>
              <input
                type="text"
                value={contacts.tiktok}
                onChange={(e) => handleChange("tiktok", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => handleSave("TikTok")}
              disabled={savingSection === "TikTok"}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {savingSection === "TikTok" ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faFloppyDisk} />
              )}
              Simpan
            </button>
            <button
              onClick={() => handleDelete(["tiktok"])}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Kosongkan"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}