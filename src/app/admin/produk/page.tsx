"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faBoxOpen,
  faImage,
  faSpinner,
  faCheckCircle,
  faXmark,
  faArrowLeft,
  faEdit,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import type { Product } from "@/types";

// Inisialisasi Klien Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // State untuk Search Bar
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Makanan Ringan");
  const [weight, setWeight] = useState("250 gram");
  const [stock, setStock] = useState("50");
  const [badge, setBadge] = useState("Best Seller");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Ambil data produk dari Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal memuat produk:", error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset ke halaman 1 saat pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle Pilih File Gambar & Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Helper Slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  // Buka Modal Tambah
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setName("");
    setPrice("");
    setCategory("Makanan Ringan");
    setWeight("250 gram");
    setStock("50");
    setBadge("Best Seller");
    setDescription("");
    setLongDescription("");
    setIngredients("");
    setIsPopular(false);
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setIsModalOpen(true);
  };

  // Buka Modal Edit
  const handleOpenEditModal = (item: Product & { images?: string[] | string | null; is_popular?: boolean }) => {
    setIsEditMode(true);
    setCurrentId(item.id);
    setName(item.name || "");
    setPrice(item.price !== null ? String(item.price) : "");
    setCategory(item.category || "Makanan Ringan");
    setWeight(item.weight || "250 gram");
    setStock(item.stock !== null ? String(item.stock) : "0");
    setBadge(item.badge || "Best Seller");
    setDescription(item.description || "");
    setLongDescription(item.long_description || "");
    setIngredients(item.ingredients || "");
    setIsPopular(item.is_popular || false);
    setImageFile(null);

    let activeImg = item.image_url;
    if (!activeImg && Array.isArray(item.images) && item.images.length > 0) {
      activeImg = item.images[0];
    } else if (!activeImg && typeof item.images === 'string') {
      activeImg = item.images;
    }

    setImagePreview(activeImg || null);
    setExistingImageUrl(activeImg || null);
    setIsModalOpen(true);
  };

  // Simpan Produk
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalImageUrl = existingImageUrl;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Gagal mengunggah gambar: " + uploadError.message);
        }

        const { data: publicURLData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        if (publicURLData && publicURLData.publicUrl) {
          finalImageUrl = publicURLData.publicUrl;
        }
      }

      const productPayload = {
        name,
        slug: generateSlug(name),
        price: price ? parseFloat(price) : null,
        category,
        weight,
        stock: parseInt(stock) || 0,
        badge,
        description,
        long_description: longDescription,
        ingredients,
        image_url: finalImageUrl,
        images: finalImageUrl ? [finalImageUrl] : [],
        is_active: true,
        is_popular: isPopular,
      };

      if (isEditMode && currentId !== null) {
        const { error: updateError } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", currentId);

        if (updateError) {
          throw new Error("Gagal memperbarui produk: " + updateError.message);
        }
        setSuccessMsg("Produk berhasil diperbarui!");
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert([productPayload]);

        if (insertError) {
          throw new Error("Gagal menyimpan ke database: " + insertError.message);
        }
        setSuccessMsg("Produk baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setExistingImageUrl(null);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus Produk
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus produk: " + error.message);
    } else {
      fetchProducts();
    }
  };

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Paginasi
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 md:p-10 space-y-8 bg-white min-h-screen text-[#2D241E] font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5 font-sans">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5c0f1c] hover:underline mb-1"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#3b0912]">
            Manajemen Produk
          </h1>
          <p className="text-xs text-gray-500">
            Kelola daftar produk, harga, dan ketersediaan stok Surya Snack secara real-time.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-xs font-bold px-5 py-3.5 rounded-xl transition shadow-md flex items-center gap-2 w-fit cursor-pointer uppercase tracking-widest"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5 text-amber-400" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Notifikasi Sukses */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 shadow-xs">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Tabel Daftar Produk */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-[#3b0912] flex items-center gap-2 font-serif">
            <FontAwesomeIcon icon={faBoxOpen} className="text-amber-600" />
            <span>Daftar Produk Aktif ({filteredProducts.length} dari {products.length})</span>
          </h2>
          
          {/* Kolom Pencarian */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama / kategori..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-[#5c0f1c]" />
            <p className="text-xs">Memuat data produk dari Supabase...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <p className="text-sm font-bold">Tidak ada produk yang cocok dengan pencarian.</p>
            <p className="text-xs">Coba gunakan kata kunci nama atau kategori yang lain.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50">
                    <th className="p-4">Nama Produk</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Harga (Rp)</th>
                    <th className="p-4">Stok</th>
                    <th className="p-4 text-center">Unggulan</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {currentProducts.map((item: any) => {
                    const displayImg = item.image_url || (Array.isArray(item.images) ? item.images[0] : null) || "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=200";
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img
                              src={displayImg}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#3b0912] text-sm">{item.name}</div>
                            <div className="text-[11px] text-gray-400 line-clamp-1">{item.weight || "-"}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-amber-100/70 text-[#3b0912] px-2.5 py-1 rounded-md text-[11px] font-bold">
                            {item.category || "Umum"}
                          </span>
                        </td>
                        <td className="p-4 font-black text-[#5c0f1c]">
                          {item.price ? `Rp ${item.price.toLocaleString("id-ID")}` : "Hubungi CS"}
                        </td>
                        <td className="p-4 font-bold text-gray-700">
                          {item.stock} pcs
                        </td>
                        <td className="p-4 text-center">
                          {item.is_popular ? (
                            <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                              Ya ✦
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl transition text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                          >
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginasi */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-gray-50">
                <span className="text-gray-500">
                  Menampilkan <strong className="text-[#3b0912]">{startIndex + 1}</strong> - <strong className="text-[#3b0912]">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</strong> dari <strong className="text-[#3b0912]">{filteredProducts.length}</strong> produk
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg font-bold border transition cursor-pointer ${
                        currentPage === page
                          ? "bg-[#3b0912] text-amber-200 border-[#3b0912]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs font-sans">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
                <FontAwesomeIcon icon={isEditMode ? faEdit : faPlus} className="text-amber-600" />
                <span>{isEditMode ? "Edit Produk & Ganti Gambar" : "Tambah Produk & Unggah Gambar"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Corndog Mozzarella Krispi"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Contoh: 15000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Contoh: Kue Kering"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                    Berat
                  </label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="250 gram"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Best Seller"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                  />
                </div>
              </div>

              {/* Checkbox Produk Unggulan */}
              <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-900/10 rounded-xl">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 text-[#3b0912] rounded border-gray-300 focus:ring-[#5c0f1c] cursor-pointer"
                />
                <label htmlFor="isPopular" className="text-xs font-bold text-[#3b0912] cursor-pointer select-none">
                  Jadikan Produk Unggulan (Tampil di Halaman Utama)
                </label>
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  {isEditMode ? "Ganti Gambar Produk (Opsional)" : "Unggah Gambar Produk"}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed border-gray-300 hover:border-[#5c0f1c] rounded-xl p-4 text-center transition">
                    <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c] text-xl mb-1" />
                    <span className="block text-xs text-gray-600 font-bold">Pilih file gambar baru</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-xs">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat produk..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  Komposisi / Bahan
                </label>
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Contoh: Tepung, Gula, Garam, Rempah pilihan"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition text-xs uppercase tracking-widest cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-3.5 rounded-xl transition text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-amber-300" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{isEditMode ? "Perbarui Produk" : "Simpan Produk"}</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}