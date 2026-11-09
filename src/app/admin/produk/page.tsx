// src/app/admin/produk/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
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
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import type { Product } from "@/types";

interface ProductVariant {
  name: string;
  price: string;
  stock: string;
  weight: string;
  origin: string;
  image_url: string;
  imageFile?: File | null;
  description?: string;
  ingredients?: string;
  key_features?: string;
  packaging_standard?: string;
  is_popular?: boolean;
}

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form State Utama Produk
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [weight, setWeight] = useState("250 gram");
  const [origin, setOrigin] = useState("Banyuwangi");
  const [stock, setStock] = useState("50"); 
  const [badge, setBadge] = useState("Best Seller");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [packagingStandard, setPackagingStandard] = useState("Mika Plastik Transparan Eksklusif");
  const [keyFeatures, setKeyFeatures] = useState(
    "Tanpa Bahan Pengawet.\nResep Warisan Leluhur.\nGurih & Renyah."
  );
  const [isPopular, setIsPopular] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*, variants:variant_products(*)")
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants, 
      { 
        name: "", 
        price: "", 
        stock: "10", 
        weight: "250 gram",
        origin: "Banyuwangi",
        image_url: "", 
        imageFile: null,
        description: "",
        ingredients: "",
        key_features: "",
        packaging_standard: "",
        is_popular: false
      }
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleVariantImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      const updated = [...variants];
      updated[index] = { 
        ...updated[index], 
        imageFile: file, 
        image_url: previewUrl 
      };
      setVariants(updated);
    }
  };

  const uploadToStorage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error("Gagal mengunggah gambar: " + uploadError.message);
    }

    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setName("");
    setPrice("");
    setCategory("Makanan");
    setWeight("250 gram");
    setOrigin("Banyuwangi");
    setStock("50");
    setBadge("Best Seller");
    setDescription("");
    setIngredients("");
    setPackagingStandard("Mika Plastik Transparan Eksklusif");
    setKeyFeatures("Tanpa Pengawet.\nResep Asli Banyuwangi.\nRenyah & Gurih.");
    setIsPopular(false);
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setVariants([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setIsEditMode(true);
    setCurrentId(item.id);
    setName(item.name || "");
    setPrice(item.price !== null && item.price !== undefined ? String(item.price) : "");
    const matchCat = item.category?.trim();
    setCategory(matchCat === "Minuman" ? "Minuman" : "Makanan");
    
    setWeight(item.weight || "250 gram");
    setOrigin(item.origin || item.asal || "Banyuwangi");
    setStock(item.stock !== null && item.stock !== undefined ? String(item.stock) : "50");
    setBadge(item.badge || "Best Seller");
    setDescription(item.description || item.long_description || "");
    setIngredients(item.ingredients || "");
    setPackagingStandard(item.packaging_standard || "Mika Plastik Transparan Eksklusif");
    
    let formattedFeatures = item.key_features;
    if (Array.isArray(formattedFeatures)) {
      formattedFeatures = formattedFeatures.join("\n");
    } else if (!formattedFeatures) {
      formattedFeatures = "";
    }
    setKeyFeatures(formattedFeatures);

    setIsPopular(item.is_popular || false);
    setImageFile(null);

    let activeImg = item.image_url;
    if (!activeImg && Array.isArray(item.images) && item.images.length > 0) {
      activeImg = item.images[0];
    }

    setImagePreview(activeImg || null);
    setExistingImageUrl(activeImg || null);

    if (Array.isArray(item.variants)) {
      setVariants(item.variants.map((v: any) => ({
        name: v.name || "",
        price: v.price ? String(v.price) : "",
        stock: v.stock !== null && v.stock !== undefined ? String(v.stock) : "0",
        weight: v.weight || "250 gram",
        origin: v.origin || "Banyuwangi",
        image_url: v.image_url || "",
        imageFile: null,
        description: v.description || "",
        ingredients: v.ingredients || "",
        key_features: v.key_features || "",
        packaging_standard: v.packaging_standard || "",
        is_popular: v.is_popular || false
      })));
    } else {
      setVariants([]);
    }

    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalImageUrl = existingImageUrl || "";
      if (imageFile) {
        finalImageUrl = await uploadToStorage(imageFile, "main");
      }

      const processedVariants = await Promise.all(
        variants.map(async (v) => {
          let variantImgUrl = v.image_url;
          if (v.imageFile) {
            variantImgUrl = await uploadToStorage(v.imageFile, "variants");
          }
          return {
            name: v.name,
            price: v.price ? parseFloat(v.price) : 0,
            stock: parseInt(v.stock) || 0,
            weight: v.weight || "250 gram",
            origin: v.origin || "Banyuwangi",
            image_url: variantImgUrl || "",
            description: v.description || "",
            ingredients: v.ingredients || "",
            key_features: v.key_features || "",
            packaging_standard: v.packaging_standard || "",
            is_popular: v.is_popular || false,
          };
        })
      );

      const formData = new FormData();
      if (isEditMode && currentId) {
        formData.append("id", currentId);
      }
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("weight", weight);
      formData.append("origin", origin);
      formData.append("stock", stock);
      formData.append("badge", badge);
      formData.append("description", description);
      formData.append("ingredients", ingredients);
      formData.append("packaging_standard", packagingStandard);
      formData.append("key_features", keyFeatures);
      formData.append("is_popular", String(isPopular));
      formData.append("image_url", finalImageUrl);
      formData.append("variants", JSON.stringify(processedVariants));

      const res = await fetch("/api/products", {
        method: isEditMode ? "PUT" : "POST",
        body: formData,
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Gagal menyimpan produk.");
      }

      setSuccessMsg(isEditMode ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setExistingImageUrl(null);
      setVariants([]);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus produk: " + error.message);
    } else {
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            Manajemen Produk & Varian
          </h1>
          <p className="text-xs text-gray-500">
            Kelola informasi lengkap produk utama UMKM Surya Snack beserta varian rasanya.
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
            <span>Daftar Produk Aktif ({filteredProducts.length} total)</span>
          </h2>
          
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              id="searchQuery"
              name="search_query"
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
        ) : currentProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <p className="text-sm font-bold">Tidak ada produk yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50">
                    <th className="p-4">Nama Produk</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Harga Dasar</th>
                    <th className="p-4">Stok Utama</th>
                    <th className="p-4">Varian</th>
                    <th className="p-4 text-center">Unggulan</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {currentProducts.map((item: any) => {
                    const displayImg = item.image_url || "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=200";
                    const variantCount = Array.isArray(item.variants) ? item.variants.length : 0;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img src={displayImg} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-[#3b0912] text-sm">{item.name}</div>
                            <div className="text-[11px] text-gray-400 line-clamp-1">{item.weight || "-"}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            item.category === 'Minuman' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100/70 text-[#3b0912]'
                          }`}>
                            {item.category || "Makanan"}
                          </span>
                        </td>
                        <td className="p-4 font-black text-[#5c0f1c]">
                          {item.price !== null && item.price !== undefined ? `Rp ${item.price.toLocaleString("id-ID")}` : "Cek Varian"}
                        </td>
                        <td className="p-4 font-bold text-gray-700">
                          {item.stock ?? 0} pcs
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                            {variantCount} Varian
                          </span>
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

            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-xs text-gray-500">
                  Menampilkan halaman <strong className="text-[#3b0912]">{currentPage}</strong> dari <strong className="text-[#3b0912]">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentPage === pageNumber
                          ? "bg-[#3b0912] text-amber-200 shadow-sm"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Next <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
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
          <div className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-serif font-bold text-[#3b0912] flex items-center gap-2">
                <FontAwesomeIcon icon={isEditMode ? faEdit : faPlus} className="text-amber-600" />
                <span>{isEditMode ? "Edit Produk & Varian" : "Tambah Produk & Varian"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div>
                <label htmlFor="productName" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Nama Produk</label>
                <input
                  type="text"
                  id="productName"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Bagiak Susu Super Banyuwangi"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                />
              </div>

              {/* Harga Dasar & Kategori (Grid 2 Kolom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productPrice" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Harga Dasar (Rp)</label>
                  <input
                    type="number"
                    id="productPrice"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Contoh: 25000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                  />
                </div>
                <div>
                  <label htmlFor="productCategory" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Kategori</label>
                  <select
                    id="productCategory"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition cursor-pointer font-bold"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>
              </div>

              {/* BERAT & ASAL PRODUK UTAMA (Grid 2 Kolom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productWeight" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Berat Produk</label>
                  <input
                    type="text"
                    id="productWeight"
                    name="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Contoh: 250 gram / 500 gram"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                  />
                </div>
                <div>
                  <label htmlFor="productOrigin" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Asal Produk</label>
                  <input
                    type="text"
                    id="productOrigin"
                    name="origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Contoh: Banyuwangi"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                  />
                </div>
              </div>

              {/* STOK UTAMA PRODUK */}
              <div>
                <label htmlFor="productStock" className="block text-[11px] font-bold uppercase tracking-widest text-[#3b0912] mb-1.5">
                  📦 Stok Utama Produk
                </label>
                <input
                  type="number"
                  id="productStock"
                  name="stock"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Contoh: 50"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-xl px-4 py-3 text-xs text-[#3b0912] focus:outline-none focus:border-[#5c0f1c] transition font-extrabold"
                />
              </div>

              {/* Informasi & Deskripsi Produk Utama */}
              <div className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#3b0912]">Informasi & Deskripsi Produk Utama</h4>

                <div>
                  <label htmlFor="productDescription" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Deskripsi Produk (Pendek / Panjang)</label>
                  <textarea
                    rows={4}
                    id="productDescription"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tuliskan keterangan lengkap atau singkat mengenai produk ini..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition resize-y"
                  />
                </div>

                <div>
                  <label htmlFor="productKeyFeatures" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Keunggulan Utama (Pisahkan dengan baris baru / Enter)</label>
                  <textarea
                    rows={3}
                    id="productKeyFeatures"
                    name="key_features"
                    value={keyFeatures}
                    onChange={(e) => setKeyFeatures(e.target.value)}
                    placeholder="Contoh:&#10;Tanpa Bahan Pengawet.&#10;Resep Asli Banyuwangi.&#10;Renyah & Gurih."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition resize-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="productIngredients" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Komposisi / Bahan Utama</label>
                    <textarea
                      rows={2}
                      id="productIngredients"
                      name="ingredients"
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="Contoh: Tepung tapioka, santan kelapa, gula..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition resize-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="productPackaging" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Standar Kemasan</label>
                    <input
                      type="text"
                      id="productPackaging"
                      name="packaging_standard"
                      value={packagingStandard}
                      onChange={(e) => setPackagingStandard(e.target.value)}
                      placeholder="Mika Plastik Transparan Eksklusif"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Varian Produk */}
              <div className="border border-amber-900/10 bg-amber-50/30 p-4 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#3b0912] flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-amber-600" />
                    <span>Varian Produk & Keterangan Khusus</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-[10px] font-bold px-3 py-2 rounded-xl transition uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Tambah Varian
                  </button>
                </div>

                {variants.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Belum ada varian ditambahkan.</p>
                ) : (
                  <div className="space-y-4">
                    {variants.map((variant, index) => (
                      <div key={index} className="bg-white border border-gray-200 p-4 rounded-xl space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Varian #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            className="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Hapus Varian
                          </button>
                        </div>

                        {/* Baris 1 Varian: Nama, Harga, Stok */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            id={`variantName-${index}`}
                            name={`variant_name_${index}`}
                            placeholder="Nama Varian (Cth: Rasa Keju)"
                            value={variant.name}
                            onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                          />
                          <input
                            type="number"
                            id={`variantPrice-${index}`}
                            name={`variant_price_${index}`}
                            placeholder="Harga Varian (Rp)"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                          />
                          <input
                            type="number"
                            id={`variantStock-${index}`}
                            name={`variant_stock_${index}`}
                            min="0"
                            placeholder="Stok Varian"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#3b0912] focus:outline-none focus:border-[#5c0f1c] font-bold"
                          />
                        </div>

                        {/* Baris 2 Varian: Berat & Asal Varian */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            id={`variantWeight-${index}`}
                            name={`variant_weight_${index}`}
                            placeholder="Berat Varian (Cth: 250 gram)"
                            value={variant.weight}
                            onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                          />
                          <input
                            type="text"
                            id={`variantOrigin-${index}`}
                            name={`variant_origin_${index}`}
                            placeholder="Asal Varian (Cth: Banyuwangi)"
                            value={variant.origin}
                            onChange={(e) => handleVariantChange(index, "origin", e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
                          />
                        </div>

                        {/* Checkbox Produk Unggulan KHUSUS VARIAN INI */}
                        <div className="flex items-center gap-2.5 pt-1">
                          <input
                            type="checkbox"
                            id={`variantPopular-${index}`}
                            name={`variant_popular_${index}`}
                            checked={variant.is_popular || false}
                            onChange={(e) => handleVariantChange(index, "is_popular", e.target.checked)}
                            className="w-3.5 h-3.5 text-[#3b0912] rounded border-gray-300 focus:ring-[#5c0f1c] cursor-pointer"
                          />
                          <label htmlFor={`variantPopular-${index}`} className="text-[11px] font-bold text-[#3b0912] cursor-pointer select-none">
                            Jadikan Varian Ini Sebagai Unggulan ✦
                          </label>
                        </div>

                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            id={`variantDesc-${index}`}
                            name={`variant_desc_${index}`}
                            placeholder="Deskripsi khusus varian ini..."
                            value={variant.description || ""}
                            onChange={(e) => handleVariantChange(index, "description", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-y"
                          />
                          <textarea
                            rows={2}
                            id={`variantIng-${index}`}
                            name={`variant_ing_${index}`}
                            placeholder="Komposisi khusus varian ini..."
                            value={variant.ingredients || ""}
                            onChange={(e) => handleVariantChange(index, "ingredients", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-y"
                          />
                        </div>

                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            id={`variantFeat-${index}`}
                            name={`variant_feat_${index}`}
                            placeholder="Keunggulan varian ini..."
                            value={variant.key_features || ""}
                            onChange={(e) => handleVariantChange(index, "key_features", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-y"
                          />
                          <textarea
                            rows={2}
                            id={`variantPack-${index}`}
                            name={`variant_pack_${index}`}
                            placeholder="Standar kemasan khusus varian ini..."
                            value={variant.packaging_standard || ""}
                            onChange={(e) => handleVariantChange(index, "packaging_standard", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c] resize-y"
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <label className="cursor-pointer bg-gray-50 border border-dashed border-gray-300 hover:border-[#5c0f1c] px-3 py-2 rounded-lg text-xs text-gray-600 font-bold inline-flex items-center gap-2">
                            <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c]" />
                            <span>{variant.image_url ? "Ganti Gambar Varian" : "Upload Gambar Varian"}</span>
                            <input
                              type="file"
                              id={`variantImageFile-${index}`}
                              name={`variant_image_file_${index}`}
                              accept="image/*"
                              onChange={(e) => handleVariantImageChange(index, e)}
                              className="hidden"
                            />
                          </label>
                          {variant.image_url && (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                              <img src={variant.image_url} alt="Variant preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkbox Produk Unggulan Utama */}
              <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-900/10 rounded-xl">
                <input
                  type="checkbox"
                  id="isPopular"
                  name="is_popular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 text-[#3b0912] rounded border-gray-300 focus:ring-[#5c0f1c] cursor-pointer"
                />
                <label htmlFor="isPopular" className="text-xs font-bold text-[#3b0912] cursor-pointer select-none">
                  Jadikan Produk Utama Unggulan (Tampil di Halaman Utama)
                </label>
              </div>

              {/* Upload Gambar Utama */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  {isEditMode ? "Ganti Gambar Utama Produk (Opsional)" : "Unggah Gambar Utama Produk"}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed border-gray-300 hover:border-[#5c0f1c] rounded-xl p-4 text-center transition">
                    <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c] text-xl mb-1" />
                    <span className="block text-xs text-gray-600 font-bold">Pilih file gambar utama</span>
                    <input 
                      type="file" 
                      id="mainImageFile" 
                      name="image" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-xs">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
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
                      <span>Menyimpan ke Storage...</span>
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