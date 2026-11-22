// src/app/katalog/page.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';
import KatalogSearchInput from '@/components/KatalogSearchInput';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

const DEFAULT_LABELS = {
  id: {
    searchTitle: 'Cari Produk',
    catTitle: 'Kategori Pilihan',
    allProd: 'Semua Produk',
    food: 'Makanan',
    beverage: 'Minuman',
    reset: 'Reset Filter',
    noResultTitle: 'Produk Tidak Ditemukan',
    noResultDesc:
      'Maaf, tidak ada produk makanan atau minuman yang cocok dengan pencarian Anda.',
    resetBtn: 'Tampilkan Semua Produk',
  },
  en: {
    searchTitle: 'Search Product',
    catTitle: 'Categories',
    allProd: 'All Products',
    food: 'Food',
    beverage: 'Beverages',
    reset: 'Reset Filter',
    noResultTitle: 'Products Not Found',
    noResultDesc:
      'Sorry, no food or beverage products match your search criteria.',
    resetBtn: 'Show All Products',
  },
};

function mergeCatalogLabels(settings: Record<string, any> | null | undefined) {
  if (!settings) return DEFAULT_LABELS;

  const pick = (dbVal: any, fallback: string) =>
    typeof dbVal === 'string' && dbVal.trim() !== '' ? dbVal.trim() : fallback;

  return {
    id: {
      searchTitle: pick(
        settings.catalog_search_title,
        DEFAULT_LABELS.id.searchTitle
      ),
      catTitle: pick(
        settings.catalog_category_title,
        DEFAULT_LABELS.id.catTitle
      ),
      allProd: pick(settings.catalog_all_label, DEFAULT_LABELS.id.allProd),
      food: pick(settings.catalog_food_label, DEFAULT_LABELS.id.food),
      beverage: pick(
        settings.catalog_beverage_label,
        DEFAULT_LABELS.id.beverage
      ),
      reset: pick(settings.catalog_reset_label, DEFAULT_LABELS.id.reset),
      noResultTitle: pick(
        settings.catalog_empty_title,
        DEFAULT_LABELS.id.noResultTitle
      ),
      noResultDesc: pick(
        settings.catalog_empty_desc,
        DEFAULT_LABELS.id.noResultDesc
      ),
      resetBtn: pick(settings.catalog_empty_btn, DEFAULT_LABELS.id.resetBtn),
    },
    en: {
      searchTitle: pick(
        settings.catalog_search_title_en,
        DEFAULT_LABELS.en.searchTitle
      ),
      catTitle: pick(
        settings.catalog_category_title_en,
        DEFAULT_LABELS.en.catTitle
      ),
      allProd: pick(
        settings.catalog_all_label_en,
        DEFAULT_LABELS.en.allProd
      ),
      food: pick(settings.catalog_food_label_en, DEFAULT_LABELS.en.food),
      beverage: pick(
        settings.catalog_beverage_label_en,
        DEFAULT_LABELS.en.beverage
      ),
      reset: pick(settings.catalog_reset_label_en, DEFAULT_LABELS.en.reset),
      noResultTitle: pick(
        settings.catalog_empty_title_en,
        DEFAULT_LABELS.en.noResultTitle
      ),
      noResultDesc: pick(
        settings.catalog_empty_desc_en,
        DEFAULT_LABELS.en.noResultDesc
      ),
      resetBtn: pick(
        settings.catalog_empty_btn_en,
        DEFAULT_LABELS.en.resetBtn
      ),
    },
  };
}

function KatalogContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const page = searchParams.get('page');

  const { lang } = useLanguage();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [catalogLabels, setCatalogLabels] = useState(DEFAULT_LABELS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCatalogData() {
      try {
        const [productsRes, settingsRes] = await Promise.allSettled([
          getAllProducts(),
          supabase
            .from('store_settings')
            .select('*')
            .eq('id', 'main')
            .maybeSingle(),
        ]);

        if (!isMounted) return;

        if (productsRes.status === 'fulfilled') {
          setAllProducts(productsRes.value || []);
        } else {
          console.error('Gagal memuat produk katalog:', productsRes.reason);
        }

        if (
          settingsRes.status === 'fulfilled' &&
          !settingsRes.value.error &&
          settingsRes.value.data
        ) {
          setCatalogLabels(mergeCatalogLabels(settingsRes.value.data));
        }
      } catch (err) {
        console.error('Gagal memuat data katalog:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCatalogData();

    const channel = supabase
      .channel('katalog-store-settings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings',
          filter: 'id=eq.main',
        },
        (payload) => {
          if (isMounted && payload.new) {
            setCatalogLabels(
              mergeCatalogLabels(payload.new as Record<string, any>)
            );
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const query = search?.toLowerCase().trim() || '';
  const activeCategory = category?.trim() || 'semua';
  const currentPage = Number(page) || 1;
  const itemsPerPage = 8;

  const t = catalogLabels[lang] || catalogLabels.id;

  const categories = [
    { id: 'semua', label: t.allProd, count: allProducts.length },
    {
      id: 'Makanan',
      label: t.food,
      count: allProducts.filter(
        (p) => p.category?.trim().toLowerCase() === 'makanan'
      ).length,
    },
    {
      id: 'Minuman',
      label: t.beverage,
      count: allProducts.filter(
        (p) => p.category?.trim().toLowerCase() === 'minuman'
      ).length,
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
    const isNumericQuery =
      !isNaN(Number(cleanQueryNumber)) && cleanQueryNumber !== '';

    filteredProducts = filteredProducts.filter((p) => {
      const name = p.name ? p.name.toLowerCase() : '';
      const rawPrice =
        p.price !== undefined && p.price !== null ? String(p.price) : '';
      const cleanPriceNumber = rawPrice.replace(/[.,]/g, '');

      const matchName = name.includes(query);
      const matchPrice =
        isNumericQuery &&
        (cleanPriceNumber === cleanQueryNumber ||
          cleanPriceNumber.includes(cleanQueryNumber));

      return matchName || matchPrice;
    });
  }

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const isFiltered = Boolean(
    query || (activeCategory && activeCategory !== 'semua')
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] font-sans">
        <p className="text-xs font-bold text-[#5A0A14] animate-pulse">
          {lang === 'en' ? 'Loading Catalog...' : 'Memuat Katalog...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2B211B] font-serif selection:bg-[#5A0A14] selection:text-amber-100 antialiased pt-14 sm:pt-20 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-5">
        {/* 1. HEADER EDITORIAL KATALOG */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#5A0A14]/15 pb-4">
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-sans font-extrabold uppercase tracking-[0.26em] text-[#9A5D0A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A0A14]" />
              {lang === 'en'
                ? 'Surya Snack Banyuwangi'
                : 'Koleksi Oleh-Oleh Khas Banyuwangi'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#5A0A14] tracking-tight">
              {lang === 'en' ? 'Product Catalog.' : 'Katalog Produk.'}
            </h1>
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#5f524a] max-w-md leading-relaxed">
            {lang === 'en'
              ? 'Explore our authentic Banyuwangi food and beverage selection, crafted with heritage recipes.'
              : 'Temukan pilihan camilan dan minuman khas Banyuwangi yang diolah dari resep warisan keluarga.'}
          </p>
        </div>

        {/* 2. HORIZONTAL TOOLBAR: PENCARIAN (KIRI) + TAB KATEGORI (KANAN) */}
        <div className="bg-[#FAF7F0] border border-[#5A0A14]/15 rounded-3xl md:rounded-full p-3.5 sm:px-5 sm:py-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 font-sans">
          {/* Input Pencarian di Sisi Kiri */}
          <div className="w-full md:w-80 lg:w-96 shrink-0">
            <KatalogSearchInput />
          </div>

          {/* Tab Kategori di Sisi Kanan dengan Jarak Lega & Tanpa Scrollbar */}
          <div className="flex flex-wrap items-center gap-2 pt-3.5 border-t border-[#5A0A14]/10 md:pt-0 md:border-t-0 md:justify-end">
            {categories.map((cat) => {
              const isCatActive =
                activeCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <Link
                  key={cat.id}
                  href={`/katalog?category=${encodeURIComponent(cat.id)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isCatActive
                      ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                      : 'bg-white/70 md:bg-transparent text-[#2B211B] border border-[#5A0A14]/12 md:border-transparent hover:bg-[#EFE6D5] hover:text-[#5A0A14]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isCatActive
                        ? 'bg-amber-300/20 text-amber-200'
                        : 'bg-[#EFE6D5] text-[#5A0A14]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </Link>
              );
            })}

            {isFiltered && (
              <Link
                href="/katalog"
                className="px-3 py-2 text-[11px] font-bold text-[#9A5D0A] hover:text-[#5A0A14] whitespace-nowrap transition"
              >
                {t.reset} ✕
              </Link>
            )}
          </div>
        </div>

        {/* 3. GRID PRODUK LEGA FULL-WIDTH (4 KOLOM DESKTOP, 2 KOLOM HP) */}
        {paginatedProducts.length === 0 ? (
          <div className="bg-[#FAF7F0] rounded-3xl p-12 sm:p-16 text-center border border-dashed border-[#5A0A14]/25 space-y-4 font-sans">
            <h3 className="text-xl font-serif font-bold text-[#5A0A14]">
              {t.noResultTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#6b5a50] max-w-md mx-auto leading-relaxed">
              {t.noResultDesc}
            </p>
            <div className="pt-2">
              <Link
                href="/katalog"
                className="bg-[#5A0A14] hover:bg-[#46070F] text-amber-200 font-bold px-7 py-3 rounded-full text-xs uppercase tracking-wider inline-block shadow-sm transition"
              >
                {t.resetBtn}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* 4. PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8 font-sans">
            {currentPage > 1 && (
              <Link
                href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${encodeURIComponent(search)}` : ''}&page=${currentPage - 1}`}
                className="px-4 py-2 rounded-full bg-[#FAF7F0] border border-[#5A0A14]/20 text-xs font-bold text-[#5A0A14] hover:bg-[#5A0A14] hover:text-amber-200 transition-all shadow-xs"
              >
                ← Prev
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                const isPageActive = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${encodeURIComponent(search)}` : ''}&page=${pageNum}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                      isPageActive
                        ? 'bg-[#5A0A14] text-amber-200 border border-[#5A0A14] scale-105'
                        : 'bg-[#FAF7F0] text-[#2B211B] border border-[#5A0A14]/15 hover:bg-[#EFE6D5]'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              }
            )}

            {currentPage < totalPages && (
              <Link
                href={`/katalog?category=${encodeURIComponent(activeCategory)}${search ? `&search=${encodeURIComponent(search)}` : ''}&page=${currentPage + 1}`}
                className="px-4 py-2 rounded-full bg-[#FAF7F0] border border-[#5A0A14]/20 text-xs font-bold text-[#5A0A14] hover:bg-[#5A0A14] hover:text-amber-200 transition-all shadow-xs"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] font-sans">
          <p className="text-xs font-bold text-[#5A0A14] animate-pulse">
            Memuat Katalog...
          </p>
        </div>
      }
    >
      <KatalogContent />
    </Suspense>
  );
}