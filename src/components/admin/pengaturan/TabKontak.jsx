"use client";

import React from "react";

export default function TabKontak({ form, onChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-serif font-bold text-[#6E1423] border-b pb-2">
        Pengaturan Kontak, Tautan Belanja & Lokasi Toko
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Nama Toko
          </label>
          <input
            type="text"
            name="store_name"
            value={form.store_name || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Nomor WhatsApp Admin (Awali 62, tanpa +)
          </label>
          <input
            type="text"
            name="whatsapp_number"
            value={form.whatsapp_number || ""}
            onChange={onChange}
            placeholder="6281249609957"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Template Pesan Otomatis WhatsApp
        </label>
        <input
          type="text"
          name="whatsapp_message"
          value={form.whatsapp_message || ""}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Link TikTok Shop
          </label>
          <input
            type="url"
            name="tiktok_shop_url"
            value={form.tiktok_shop_url || ""}
            onChange={onChange}
            placeholder="https://www.tiktok.com/@..."
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Link Instagram
          </label>
          <input
            type="url"
            name="instagram_url"
            value={form.instagram_url || ""}
            onChange={onChange}
            placeholder="https://instagram.com/..."
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Email Toko (Opsional)
          </label>
          <input
            type="email"
            name="email_address"
            value={form.email_address || ""}
            onChange={onChange}
            placeholder="suryasnack@gmail.com"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Alamat Lengkap Toko
          </label>
          <textarea
            rows={3}
            name="store_address"
            value={form.store_address || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Jam Operasional
          </label>
          <textarea
            rows={3}
            name="open_hours"
            value={form.open_hours || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Link Embed Google Maps (src dari iframe Maps)
        </label>
        <input
          type="text"
          name="google_maps_embed"
          value={form.google_maps_embed || ""}
          onChange={onChange}
          placeholder="https://www.google.com/maps/embed?pb=..."
          className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>
    </div>
  );
}