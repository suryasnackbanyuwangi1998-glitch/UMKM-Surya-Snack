// src/app/katalog/page.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';
import KatalogSearchInput from '@/components/KatalogSearchInput';
import { useLanguage } from '@/context/LanguageContext';
import type { Product } from '@/types';

function KatalogContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const page = searchParams.get('page');

  const { lang } = useLanguage();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setAllProducts(data || []);
      } catch (err) {
        console.error('Gagal memuat produk katalog:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const query = search?.toLowerCase().trim() || '';
  const activeCategory = category?.trim() || 'semua';
  const currentPage = Number(page) || 1;
  const itemsPerPage = 8;

  // Kamus terjemahan untuk Sidebar Katalog
  const t = {
    id: {
      searchTitle: 'Cari Produk',
      catTitle: 'Kategori Pilihan',
      allProd: 'Semua Produk',
      food: 'Makanan',
      beverage: 'Minuman',
      reset: 'Reset ✕',
      noResultTitle: 'Produk Tidak Ditemukan',
      noResultDesc: 'Maaf, tidak ada produk makanan atau minuman yang cocok dengan pencarian Anda.',
      resetBtn: 'Tampilkan Semua Produk',
    },
    en: {
      searchTitle: 'Search Product',
      catTitle: 'Categories',
      allProd: 'All Products',
      food: 'Food',
      beverage: 'Beverages',
      reset: 'Reset ✕',
      noResultTitle: 'Products Not Found',
      noResultDesc: 'Sorry, no food or beverage products match your search criteria.',
      resetBtn: 'Show All Products',
    },
  }[lang] || {
    searchTitle: 'Cari Produk',
    catTitle: 'Kategori Pilihan',
    allProd: 'Semua Produk',
    food: 'Makanan',
    beverage: 'Minuman',
    reset: 'Reset ✕',
    noResultTitle: 'Produk Tidak Ditemukan',
    noResultDesc: 'Maaf, tidak ada produk makanan atau minuman yang cocok dengan pencarian Anda.',
    resetBtn: 'Tampilkan Semua Produk',
  };

  const categories = [
    { id: 'semua', label: t.allProd, count: allProducts.length },
    {
      id: 'Makanan',
      label: t.food,
      count: allProducts.filter((p) => p.category?.trim().toLowerCase() === 'makanan').length,
    },
    {
      id: 'Minuman',
      label: t.beverage,
      count: allProducts.filter((p) => p.category?.trim().toLowerCase() === 'minuman').length,
    },
  ];

  let filteredProducts = allProducts;
  if (activeCategory && activeCategory !== 'semua') {
    filteredProducts = filteredProducts.filter((p) => {
      const cat = p.category?.trim() || '';
      return cat.toLowerCase() === activeCategory.toLowerCase();
    });
  }

  if (query) {
    const cleanQueryNumber = query.replace(/[.,]/g, '');
    const isNumericQuery = !isNaN(Number(cleanQueryNumber)) && cleanQueryNumber !== '';

    filteredProducts = filteredProducts.filter((p) => {
      const name = p.name ? p.name.toLowerCase() : '';
      const rawPrice = p.price !== undefined && p.price !== null ? String(p.price) : '';
      const cleanPriceNumber = rawPrice.replace(/[.,]/g, '');

      const matchName = name.includes(query);
      const matchPrice =
        isNumericQuery &&
        (cleanPriceNumber === cleanQueryNumber || cleanPriceNumber.includes(cleanQueryNumber));

      return matchName || matchPrice;
    });
  }

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const isFiltered = Boolean(query || (activeCategory && activeCategory !== 'semua'));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] font-sans">
        <p className="text-xs font-bold text-gray-500 animate-pulse">
          {lang === 'en' ? 'Loading Catalog...' : 'Memuat Katalog...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100 antialiased pt-24 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR KIRI */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-amber-900/10 shadow-sm font-sans space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#3b0912] uppercase tracking-wider">
                  {t.searchTitle}
                </h3>
                {isFiltered && (
                  <Link
                    href="/katalog"
                    className="text-[11px] font-bold text-[#5c0f1c] hover:underline uppercase tracking-wider"
                  >
                    {t.reset}
                  </Link>
                )}
              </div>
              <KatalogSearchInput />
            </div>

            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-amber-900/10 shadow-sm font-sans space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#3b0912] uppercase tracking-wider border-b border-amber-900/10 pb-2">
                {t.catTitle}
              </h3>
              <ul className="space-y-1.5 text-xs max-h-100 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isCatActive = activeCategory.toLowerCase() === cat.id.toLowerCase();
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/katalog?category=${encodeURIComponent(cat.id)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 ${
                          isCatActive
                            ? 'bg-[#3b0912] text-amber-200 font-bold shadow-md scale-[1.02]'
                            : 'text-gray-700 hover:bg-amber-100/60 hover:text-[#3b0912]'
                        }`}
                      >
                        <span className="truncate mr-2">{cat.label}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                            isCatActive ? 'bg-amber-400/20 text-amber-300' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {cat.count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* KONTEN KANAN */}
          <div className="lg:col-span-3 space-y-6">
            {paginatedProducts.length === 0 ? (
              <div className="bg-[#FAF7F0] rounded-3xl p-12 text-center border-2 border-dashed border-amber-900/25 space-y-4 font-sans shadow-sm">
                <h3 className="text-lg font-serif font-bold text-[#3b0912]">{t.noResultTitle}</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">{t.noResultDesc}</p>
                <div>
                  <Link
                    href="/katalog"
                    className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest inline-block shadow-md"
                  >
                    {t.resetBtn}
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

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10 font-sans">
                {currentPage > 1 && (
                  <Link
                    href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${encodeURIComponent(search)}` : ''}&page=${currentPage - 1}`}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-amber-900/20 text-xs font-bold text-gray-700 hover:bg-[#3b0912] hover:text-white transition-all shadow-sm"
                  >
                    ← Prev
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isPageActive = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${encodeURIComponent(search)}` : ''}&page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isPageActive
                          ? 'bg-[#3b0912] text-amber-300 border border-[#3b0912] scale-105 shadow-md'
                          : 'bg-[#FAF7F0] text-gray-700 border border-amber-900/20 hover:bg-amber-100/80'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${encodeURIComponent(search)}` : ''}&page=${currentPage + 1}`}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-amber-900/20 text-xs font-bold text-gray-700 hover:bg-[#3b0912] hover:text-white transition-all shadow-sm"
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

export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] font-sans">
          <p className="text-xs font-bold text-gray-500 animate-pulse">Memuat Katalog...</p>
        </div>
      }
    >
      <KatalogContent />
    </Suspense>
  );
}