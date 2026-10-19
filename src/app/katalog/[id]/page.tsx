// src/app/katalog/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ProductDetailClient from '@/components/ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import { getAllProducts, getProductBySlug } from '@/lib/products';
import type { Product } from '@/types';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

const formatIDR = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'Harga hubungi CS';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    return {
      title: 'Produk tidak ditemukan | Surya Snack',
      description: 'Produk yang kamu cari tidak tersedia atau sudah tidak aktif.',
    };
  }

  const activeCategory = product.category?.trim();
  const priceLabel = formatIDR(product.price);
  const pageTitle = `${product.name} | Surya Snack`;
  const pageDescription =
    product.description?.trim() ||
    `Lihat detail ${product.name}${activeCategory ? ` kategori ${activeCategory}` : ''}. ${priceLabel}. Oleh-oleh khas Banyuwangi dari Surya Snack.`;
  const ogImages = product.image_url?.startsWith('http')
    ? [{ url: product.image_url }]
    : undefined;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: { title: pageTitle, description: pageDescription, type: 'website', images: ogImages },
    twitter: { card: 'summary_large_image', title: pageTitle, description: pageDescription, images: ogImages },
  };
}

export default async function DetailProdukPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) notFound();

  const allProducts = await getAllProducts();
  const activeCategory = product.category?.trim();

  const relatedProducts: Product[] = [];
  const addedIds = new Set<Product['id']>([product.id]);

  if (activeCategory) {
    for (const item of allProducts) {
      if (relatedProducts.length >= 4) break;
      if (!addedIds.has(item.id) && item.category?.trim() === activeCategory) {
        relatedProducts.push(item);
        addedIds.add(item.id);
      }
    }
  }
  for (const item of allProducts) {
    if (relatedProducts.length >= 4) break;
    if (!addedIds.has(item.id)) {
      relatedProducts.push(item);
      addedIds.add(item.id);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-serif selection:bg-[#5c0f1c] selection:text-amber-100 antialiased overflow-x-hidden pt-28 pb-16">
      
      {/* ===== KONTEN UTAMA DENGAN ANIMASI FADE-IN ELEGAN ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Detail Produk Client Component dengan Sentuhan Bingkai Mewah */}
        <div className="bg-[#FAF7F0] rounded-3xl border border-amber-900/15 p-6 sm:p-10 shadow-md transition-all duration-300 hover:shadow-lg">
          <ProductDetailClient product={product} />
        </div>

        {/* Rekomendasi Produk Lainnya */}
        {relatedProducts.length > 0 && (
          <section className="space-y-8 pt-8 border-t border-amber-900/15 font-sans animate-in fade-in duration-1000">
            
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="text-[#5c0f1c] text-xs font-bold tracking-[0.25em] uppercase">
                  ✦ Pilihan Lainnya ✦
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3b0912] mt-1">
                  Rekomendasi Lainnya
                </h2>
              </div>
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#5c0f1c] hover:text-[#3b0912] transition-colors duration-200 group"
              >
                <span>Lihat Semua Katalog</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item, index) => (
                <div 
                  key={item.id} 
                  className="h-full transition-all duration-500 hover:-translate-y-1.5"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>

          </section>
        )}

      </div>
    </main>
  );
}