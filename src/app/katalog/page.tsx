// src/app/katalog/page.tsx
import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';
import KatalogSearchInput from '@/components/KatalogSearchInput';

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function KatalogPage({ searchParams }: PageProps) {
  const { search, category, page } = await searchParams;
  const allProducts = await getAllProducts();

  // Query search & category
  const query = search?.toLowerCase().trim() || '';
  const activeCategory = category?.trim() || 'semua';
  const currentPage = Number(page) || 1;
  const itemsPerPage = 8; 

  // Kategori dibatasi secara tetap (fix) hanya Makanan dan Minuman
  const categories = [
    { id: 'semua', label: 'Semua Produk', count: allProducts.length },
    { 
      id: 'Makanan', 
      label: 'Makanan', 
      count: allProducts.filter((p) => p.category?.trim().toLowerCase() === 'makanan').length 
    },
    { 
      id: 'Minuman', 
      label: 'Minuman', 
      count: allProducts.filter((p) => p.category?.trim().toLowerCase() === 'minuman').length 
    },
  ];

  // 1. Filter produk berdasarkan kategori terlebih dahulu (jika ada kategori aktif)
  let filteredProducts = allProducts;
  if (activeCategory && activeCategory !== 'semua') {
    filteredProducts = filteredProducts.filter((p) => {
      const cat = p.category?.trim() || '';
      return cat.toLowerCase() === activeCategory.toLowerCase();
    });
  }

  // 2. Filter berdasarkan pencarian HANYA pada NAMA PRODUK saja secara spesifik
  if (query) {
    filteredProducts = filteredProducts.filter((p) => {
      const name = p.name ? p.name.toLowerCase() : '';
      return name.includes(query);
    });
  }

  // 3. Hitung Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const isFiltered = query || (activeCategory && activeCategory !== 'semua');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100 antialiased pt-24 pb-24">
      
      {/* ================= UTAMA: SIDEBAR & GRID PRODUK ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ================= SIDEBAR KIRI ================= */}
          <aside className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left duration-700">
            
            {/* Kotak Pencarian di Sidebar (Dilengkapi Tombol Reset Filter di Sini) */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-amber-900/10 shadow-sm font-sans space-y-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#3b0912] uppercase tracking-wider">
                  Cari Produk
                </h3>
                {isFiltered && (
                  <Link 
                    href="/katalog" 
                    className="text-[11px] font-bold text-[#5c0f1c] hover:underline uppercase tracking-wider transition-opacity hover:opacity-75"
                  >
                    Reset Filter ✕
                  </Link>
                )}
              </div>

              {/* Memanggil Client Component untuk pencarian instan tanpa Enter */}
              <KatalogSearchInput />
            </div>

            {/* Daftar Kategori Sidebar (Makanan & Minuman) */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-amber-900/10 shadow-sm font-sans space-y-3 transition-all duration-300 hover:shadow-md">
              <h3 className="font-serif font-bold text-sm text-[#3b0912] uppercase tracking-wider border-b border-amber-900/10 pb-2">
                Kategori Pilihan
              </h3>
              <ul className="space-y-1.5 text-xs max-h-100 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isCatActive = activeCategory.toLowerCase() === cat.id.toLowerCase();
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/katalog?category=${encodeURIComponent(cat.id)}${search ? `&search=${search}` : ''}`}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 transform hover:translate-x-1 ${
                          isCatActive
                            ? 'bg-[#3b0912] text-amber-200 font-bold shadow-md scale-[1.02]'
                            : 'text-gray-700 hover:bg-amber-100/60 hover:text-[#3b0912]'
                        }`}
                      >
                        <span className="truncate mr-2">{cat.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full transition-colors shrink-0 ${isCatActive ? 'bg-amber-400/20 text-amber-300' : 'bg-gray-200 text-gray-600'}`}>
                          {cat.count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

          </aside>

          {/* ================= KONTEN KANAN (GRID & PAGINATION) ================= */}
          <div className="lg:col-span-3 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Info Filter Ringkas di Atas Grid */}
            {isFiltered && (
              <div className="bg-[#FAF7F0] px-4 py-3 rounded-2xl border border-amber-900/10 font-sans text-xs shadow-sm flex items-center justify-between">
                <p className="text-gray-600">
                  Menampilkan hasil {query && <span>untuk <span className="font-bold text-[#3b0912]">&ldquo;{search}&rdquo;</span></span>}
                  {activeCategory && activeCategory !== 'semua' && <span> di kategori <span className="font-bold text-[#3b0912]">{activeCategory}</span></span>}
                  {' '}(<span className="font-bold text-[#3b0912]">{totalProducts} produk</span>)
                </p>
              </div>
            )}

            {/* Grid Produk */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-[#FAF7F0] rounded-3xl p-12 text-center border-2 border-dashed border-amber-900/25 space-y-4 font-sans shadow-sm">
                <h3 className="text-lg font-serif font-bold text-[#3b0912]">Produk Tidak Ditemukan</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Maaf, tidak ada produk makanan atau minuman yang cocok dengan kriteria pencarian atau kategori yang Anda pilih.
                </p>
                <div>
                  <Link href="/katalog" className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 inline-block shadow-md hover:scale-105 active:scale-95">
                    Tampilkan Semua Produk
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="transition-all duration-500 hover:-translate-y-1.5">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10 font-sans">
                {currentPage > 1 && (
                  <Link
                    href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${search}` : ''}&page=${currentPage - 1}`}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-amber-900/20 text-xs font-bold text-gray-700 hover:bg-[#3b0912] hover:text-white transition-all duration-300 shadow-sm hover:scale-105"
                  >
                    ← Prev
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isPageActive = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${search}` : ''}&page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 shadow-sm ${
                        isPageActive
                          ? 'bg-[#3b0912] text-amber-300 border border-[#3b0912] scale-105 shadow-md'
                          : 'bg-[#FAF7F0] text-gray-700 border border-amber-900/20 hover:bg-amber-100/80 hover:scale-105'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${search}` : ''}&page=${currentPage + 1}`}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-amber-900/20 text-xs font-bold text-gray-700 hover:bg-[#3b0912] hover:text-white transition-all duration-300 shadow-sm hover:scale-105"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}