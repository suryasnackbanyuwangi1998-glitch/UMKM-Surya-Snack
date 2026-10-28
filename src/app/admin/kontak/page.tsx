// src/app/admin/kontak/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faFloppyDisk,
  faTrashCan,
  faSpinner,
  faClock,
  faCircleQuestion,
  faPlus,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { supabase } from "@/lib/supabase";

interface ContactsState {
  whatsapp1: string;
  whatsapp2: string;
  instagram: string;
  alamat: string;
  tiktok: string;
  jam_operasional_senin_sabtu: string;
  jam_operasional_minggu: string;
}

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export default function AdminKontakPage() {
  const [contacts, setContacts] = useState<ContactsState>({
    whatsapp1: "",
    whatsapp2: "",
    instagram: "",
    alamat: "",
    tiktok: "",
    jam_operasional_senin_sabtu: "08.00 – 21.30 WIB",
    jam_operasional_minggu: "08.30 – 21.00 WIB",
  });

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: contactData } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", "informasi_utama")
        .maybeSingle();

      if (contactData) {
        setContacts({
          whatsapp1: contactData.whatsapp1 || "",
          whatsapp2: contactData.whatsapp2 || "",
          instagram: contactData.instagram || "",
          alamat: contactData.alamat || "",
          tiktok: contactData.tiktok || "",
          jam_operasional_senin_sabtu: contactData.jam_operasional_senin_sabtu || "08.00 – 21.30 WIB",
          jam_operasional_minggu: contactData.jam_operasional_minggu || "08.30 – 21.00 WIB",
        });
      }

      const { data: faqData } = await supabase
        .from("faqs")
        .select("*")
        .order("created_at", { ascending: true });

      if (faqData && faqData.length > 0) {
        setFaqs(faqData);
      } else {
        setFaqs([
          { 
            question: "Apakah bisa pesan untuk dikirim ke luar kota?", 
            answer: "Tentu! Kami melayani pengiriman ke seluruh Indonesia via ekspedisi JNE, J&T, SiCepat, dan Pos Indonesia. Kemasan kami sudah food-grade dan dirancang khusus agar camilan tetap utuh sampai tujuan." 
          },
          { 
            question: "Berapa lama waktu produksi pesanan?", 
            answer: "Pesanan diproses dalam 1x24 jam pada hari kerja. Produk dibuat fresh dari dapur produksi kami di hari yang sama sebelum dikemas dan dikirim." 
          },
          { 
            question: "Apakah ada minimum order untuk pengiriman?", 
            answer: "Tidak ada minimum order khusus untuk pembelian retail. Untuk pembelian grosir atau reseller, silakan chat admin untuk penawaran harga khusus." 
          },
          { 
            question: "Bisakah saya mengunjungi toko langsung?", 
            answer: "Bisa banget! Toko kami buka setiap hari. Silakan datang langsung ke alamat pusat kami. Tersedia area parkir yang luas." 
          },
          { 
            question: "Metode pembayaran apa saja yang tersedia?", 
            answer: "Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (OVO, DANA, GoPay, ShopeePay), QRIS, serta COD untuk area Banyuwangi." 
          }
        ]);
      }
    } catch (error: any) {
      console.error("Gagal memuat data kontak:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ContactsState, value: string) => {
    setContacts((prev) => ({ ...prev, [field]: value }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleDeleteFaq = async (index: number, id?: string) => {
    if (id) {
      await supabase.from("faqs").delete().eq("id", id);
    }
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
    setNotification("Pertanyaan Umum (FAQ) berhasil dihapus!");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSaveContact = async (sectionName: string) => {
    setSavingSection(sectionName);
    try {
      const { error } = await supabase.from("contacts").upsert({
        id: "informasi_utama",
        ...contacts,
      });

      if (error) throw error;
      setNotification(`Berhasil menyimpan data ${sectionName} ke Database!`);
      setTimeout(() => setNotification(""), 3000);
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setSavingSection(null);
    }
  };

  // Fungsi khusus untuk mengosongkan field tertentu di database
  const handleDeleteFields = async (fieldsToClear: (keyof ContactsState)[], sectionName: string) => {
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

      const { error } = await supabase
        .from("contacts")
        .update({ ...clearData })
        .eq("id", "informasi_utama");

      if (error) throw error;

      setNotification(`Berhasil mengosongkan data ${sectionName}!`);
      setTimeout(() => setNotification(""), 3000);
    } catch (error: any) {
      alert("Gagal menghapus data: " + error.message);
    }
  };

  const handleSaveFaqs = async () => {
    setSavingSection("FAQ");
    try {
      for (const faq of faqs) {
        if (!faq.question.trim()) continue;

        if (faq.id) {
          const { error } = await supabase
            .from("faqs")
            .update({ question: faq.question, answer: faq.answer })
            .eq("id", faq.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("faqs")
            .insert({ question: faq.question, answer: faq.answer });

          if (error) throw error;
        }
      }

      setNotification("Berhasil menyimpan seluruh Perubahan FAQ ke Database!");
      setTimeout(() => setNotification(""), 3000);
      await fetchData();
    } catch (error: any) {
      alert("Gagal menyimpan FAQ: " + error.message);
      console.error("Error detail:", error);
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-[#5c0f1c] font-serif text-sm">
        Memuat panel admin kontak...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto bg-[#FAF8F5] min-h-screen text-gray-800 font-sans">
      
      {/* Header Halaman Admin */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#EBE3D5] pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#5c0f1c]/10 border border-[#5c0f1c]/20 rounded-2xl text-[#5c0f1c]">
            <FontAwesomeIcon icon={faAddressBook} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#3b0912]">Kelola Kontak & Informasi Toko</h1>
            <p className="text-xs text-gray-500 mt-1 font-light">
              Sesuaikan nomor layanan, media sosial, alamat, jam operasional, dan FAQ yang tampil di halaman website utama.
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl text-xs font-semibold shadow-sm flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {notification}
        </div>
      )}

      {/* Grid Kartu Pengaturan Kontak */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* WhatsApp */}
        <div className="bg-white border border-[#EBE3D5] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-[#5c0f1c]/30 transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-serif font-bold text-gray-900">WhatsApp</h3>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1 block">Nomor Utama (Admin 1)</label>
                <input
                  type="text"
                  value={contacts.whatsapp1}
                  onChange={(e) => handleChange("whatsapp1", e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1 block">Nomor Cadangan (Admin 2)</label>
                <input
                  type="text"
                  value={contacts.whatsapp2}
                  onChange={(e) => handleChange("whatsapp2", e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveContact("WhatsApp")}
              disabled={savingSection === "WhatsApp"}
              className="flex-1 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              {savingSection === "WhatsApp" ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
              Simpan
            </button>
            <button
              onClick={() => handleDeleteFields(["whatsapp1", "whatsapp2"], "WhatsApp")}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Kosongkan WhatsApp"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        {/* Instagram */}
        <div className="bg-white border border-[#EBE3D5] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-[#5c0f1c]/30 transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shadow-inner">
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-serif font-bold text-gray-900">Instagram</h3>
            </div>
            <div className="mb-5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1 block">Username / Link</label>
              <input
                type="text"
                value={contacts.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveContact("Instagram")}
              disabled={savingSection === "Instagram"}
              className="flex-1 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              {savingSection === "Instagram" ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
              Simpan
            </button>
            <button
              onClick={() => handleDeleteFields(["instagram"], "Instagram")}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Kosongkan Instagram"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        {/* TikTok */}
        <div className="bg-white border border-[#EBE3D5] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-[#5c0f1c]/30 transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-black shadow-inner">
                <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-serif font-bold text-gray-900">TikTok Shop</h3>
            </div>
            <div className="mb-5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1 block">Username / Link</label>
              <input
                type="text"
                value={contacts.tiktok}
                onChange={(e) => handleChange("tiktok", e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveContact("TikTok")}
              disabled={savingSection === "TikTok"}
              className="flex-1 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              {savingSection === "TikTok" ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
              Simpan
            </button>
            <button
              onClick={() => handleDeleteFields(["tiktok"], "TikTok")}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Kosongkan TikTok"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        {/* Jam Operasional */}
        <div className="bg-white border border-[#EBE3D5] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-[#5c0f1c]/30 transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-serif font-bold text-gray-900">Jam Operasional</h3>
            </div>
            <div className="space-y-2 mb-5">
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-400">Senin – Sabtu</label>
                <input
                  type="text"
                  value={contacts.jam_operasional_senin_sabtu}
                  onChange={(e) => handleChange("jam_operasional_senin_sabtu", e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-400">Minggu</label>
                <input
                  type="text"
                  value={contacts.jam_operasional_minggu}
                  onChange={(e) => handleChange("jam_operasional_minggu", e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveContact("Jam Operasional")}
              disabled={savingSection === "Jam Operasional"}
              className="flex-1 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              {savingSection === "Jam Operasional" ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
              Simpan
            </button>
            <button
              onClick={() => handleDeleteFields(["jam_operasional_senin_sabtu", "jam_operasional_minggu"], "Jam Operasional")}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Kosongkan Jam Operasional"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

      </div>

      {/* Alamat Lengkap Toko */}
      <div className="bg-white border border-[#EBE3D5] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-gray-900">Alamat Lengkap Toko & Titik Maps</h3>
          </div>
          <textarea
            rows={2}
            value={contacts.alamat}
            onChange={(e) => handleChange("alamat", e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#EBE3D5] rounded-2xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-none"
          />
        </div>
        <div className="flex items-center gap-2 h-fit self-end md:self-center">
          <button
            onClick={() => handleSaveContact("Alamat")}
            disabled={savingSection === "Alamat"}
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition cursor-pointer shadow-md flex items-center gap-2"
          >
            {savingSection === "Alamat" ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />} Simpan Alamat
          </button>
          <button
            onClick={() => handleDeleteFields(["alamat"], "Alamat")}
            className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-3.5 rounded-2xl text-xs transition cursor-pointer"
            title="Kosongkan Alamat"
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>

      {/* Kelola Pertanyaan Umum (FAQ) */}
      <div className="bg-white border border-[#EBE3D5] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EBE3D5] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200/50">
              <FontAwesomeIcon icon={faCircleQuestion} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#3b0912]">Kelola Pertanyaan Umum (FAQ)</h2>
              <p className="text-xs text-gray-500">Tambah, ubah, atau hapus daftar pertanyaan pelanggan di halaman kontak.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#EBE3D5] hover:border-[#5c0f1c] text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} /> Tambah Pertanyaan Baru
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id || index} className="p-5 rounded-2xl border border-[#EBE3D5] bg-[#FAF8F5]/50 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-serif font-bold text-[#5c0f1c]">Pertanyaan #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(index, faq.id)}
                  className="text-rose-600 hover:text-rose-700 text-xs p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer flex items-center gap-1.5 font-semibold"
                >
                  <FontAwesomeIcon icon={faTrashCan} /> Hapus
                </button>
              </div>
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  placeholder="Tuliskan pertanyaan pelanggan..."
                  className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  placeholder="Tuliskan jawaban yang informatif..."
                  className="w-full bg-white border border-[#EBE3D5] rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#5c0f1c] resize-none font-light"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveFaqs}
            disabled={savingSection === "FAQ"}
            className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-7 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {savingSection === "FAQ" ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
            Simpan Seluruh Perubahan FAQ
          </button>
        </div>
      </div>

    </div>
  );
}