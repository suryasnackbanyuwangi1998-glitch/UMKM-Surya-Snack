// src/app/admin/produk/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faBoxOpen,
  faSpinner,
  faCheckCircle,
  faArrowLeft,
  faEdit,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import type { Product } from "@/types";

export default function AdminProdukPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Arahkan ke halaman tambah produk terpisah
  const handleOpenAddModal = () => {
    router.push("/admin/produk/tambah");
  };

  // Arahkan ke halaman edit produk dinamis berdasar ID (dengan pengamanan)
  const handleOpenEditModal = (item: any) => {
    if (!item || !item.id) {
      alert("ID produk tidak valid atau tidak ditemukan!");
      return;
    }
    router.push(`/admin/produk/edit/${item.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      alert("ID produk tidak valid.");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus produk: " + error.message);
    } else {
      setSuccessMsg(`Produk (${id}) berhasil dihapus.`);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.id && item.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
              placeholder="Cari nama, ID, / kategori..."
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
                    const displayImg = item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                    const variantCount = Array.isArray(item.variants) ? item.variants.length : 0;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img 
                              src={displayImg} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#3b0912] text-sm">{item.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono font-bold bg-amber-50 text-[#5c0f1c] px-1.5 py-0.5 rounded border border-amber-200/80">
                                ID: {item.id}
                              </span>
                              <span className="text-[11px] text-gray-400 line-clamp-1">{item.weight || "-"}</span>
                            </div>
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

    </div>
  );
}