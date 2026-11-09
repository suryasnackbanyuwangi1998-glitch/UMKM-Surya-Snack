// src/app/katalog/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import ProductDetailClient from '@/components/ProductDetailClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const paramValue = resolvedParams.id;

  // 1. Coba cari produk berdasarkan kolom 'slug' terlebih dahulu
  let { data: product, error } = await supabase
    .from('products')
    .select('*, variant_products(*)')
    .eq('slug', paramValue)
    .single();

  // 2. Jika tidak ditemukan lewat slug, coba cari berdasarkan kolom 'id' (untuk mengantisipasi jika URL pakai ID)
  if (error || !product) {
    const { data: productById, error: errorById } = await supabase
      .from('products')
      .select('*, variant_products(*)')
      .eq('id', paramValue)
      .single();

    if (!errorById && productById) {
      product = productById;
    }
  }

  // Jika tetap tidak ditemukan di kedua kolom
  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-28 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-serif font-bold text-[#3b0912]">Produk Tidak Ditemukan</h2>
        <p className="text-gray-600 text-sm">Maaf, data produk yang Anda cari tidak tersedia di database atau link tidak valid.</p>
        <a
          href="/katalog"
          className="inline-block bg-[#5c0f1c] text-amber-200 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition hover:bg-[#3b0912]"
        >
          Kembali ke Katalog
        </a>
      </div>
    );
  }

  // Mapping variant_products ke variants agar cocok dengan Client Component
  const formattedProduct = {
    ...product,
    variants: product.variant_products || [],
  };

  return <ProductDetailClient product={formattedProduct} />;
}