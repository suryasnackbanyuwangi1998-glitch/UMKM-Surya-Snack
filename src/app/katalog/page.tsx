// src/app/katalog/page.tsx
import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';

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

  // Mengambil daftar kategori unik secara dinamis langsung dari produk di database
  const uniqueCategoryNames = Array.from(
    new Set(
      allProducts
        .map((p) => p.category?.trim())
        .filter((cat): cat is string => Boolean(cat && cat !== ''))
    )
  ).sort((a, b) => {
    // Menempatkan kategori seperti 'Lainnya' atau 'Other' di urutan paling bawah
    if (a.toLowerCase() === 'lainnya' || a.toLowerCase() === 'other') return 1;
    if (b.toLowerCase() === 'lainnya' || b.toLowerCase() === 'other') return -1;
    return a.localeCompare(b); // Urutkan abjad A-Z untuk kategori lainnya
  });

  const categories = [
    { id: 'semua', label: 'Semua Produk', count: allProducts.length },
    ...uniqueCategoryNames.map((catName) => ({
      id: catName,
      label: catName,
      count: allProducts.filter((p) => p.category?.trim() === catName).length,
    })),
  ];

  // 1. Filter produk berdasarkan pencarian & kategori yang dipilih
  let filteredProducts = allProducts;
  if (query) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }
  
  if (activeCategory && activeCategory !== 'semua') {
    filteredProducts = filteredProducts.filter((p) => {
      const cat = p.category?.trim() || '';
      return cat.toLowerCase() === activeCategory.toLowerCase();
    });
  }

  // 2. Hitung Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100 antialiased pt-24 pb-24">
      
      {/* ================= UTAMA: SIDEBAR & GRID PRODUK ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ================= SIDEBAR KIRI ================= */}
          <aside className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left duration-700">
            
            {/* Kotak Pencarian di Sidebar */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-amber-900/10 shadow-sm font-sans space-y-3 transition-all duration-300 hover:shadow-md">
              <h3 className="font-serif font-bold text-sm text-[#3b0912] uppercase tracking-wider">
                Cari Produk
              </h3>
              <form action="/katalog" method="GET" className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ''}
                  placeholder="Ketik nama camilan..."
                  className="w-full bg-white text-gray-900 text-xs placeholder:text-gray-400 pl-3 pr-9 py-2.5 rounded-xl border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#5c0f1c] transition-all"
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5c0f1c] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Daftar Kategori Sidebar (Dinamis sesuai Database) */}
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
            
            {/* Info Filter Aktif */}
            {(query || (activeCategory && activeCategory !== 'semua')) && (
              <div className="flex items-center justify-between bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 font-sans text-xs sm:text-sm shadow-sm transition-all">
                <p className="text-gray-600">
                  Menampilkan hasil untuk{' '}
                  {query && <span className="font-bold text-[#3b0912]">&ldquo;{search}&rdquo;</span>}
                  {activeCategory && activeCategory !== 'semua' && (
                    <span> kategori <span className="font-bold text-[#3b0912]">{categories.find((c) => c.id.toLowerCase() === activeCategory.toLowerCase())?.label || activeCategory}</span></span>
                  )}
                  {' '}(<span className="font-bold text-[#3b0912]">{totalProducts} produk</span>)
                </p>
                <Link href="/katalog" className="text-xs font-bold text-[#5c0f1c] hover:underline uppercase tracking-wider transition-opacity hover:opacity-75">
                  Reset Filter ✕
                </Link>
              </div>
            )}

            {/* Grid Produk */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-[#FAF7F0] rounded-3xl p-12 text-center border-2 border-dashed border-amber-900/25 space-y-4 font-sans shadow-sm">
                <h3 className="text-lg font-serif font-bold text-[#3b0912]">Produk Tidak Ditemukan</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Maaf, tidak ada produk yang cocok dengan kriteria pencarian atau kategori yang Anda pilih.
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