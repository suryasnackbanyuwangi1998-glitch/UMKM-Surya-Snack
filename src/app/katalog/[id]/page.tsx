// src/app/katalog/[id]/page.tsx
import Link from 'next/link';
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

  // 2. Jika tidak ditemukan lewat slug, coba cari berdasarkan kolom 'id'
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
      <div className="min-h-[75vh] bg-[#F5EFE6] flex items-center justify-center px-4 pt-28 pb-20">
        <div className="max-w-lg w-full bg-[#FAF7F0] border border-[#5A0A14]/15 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <span className="inline-block text-[10px] font-sans font-extrabold uppercase tracking-[0.24em] text-[#9A5D0A]">
            Surya Snack Banyuwangi
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5A0A14]">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-[#5f524a] font-sans text-xs sm:text-sm leading-relaxed">
            Maaf, data produk yang Anda cari tidak tersedia di database atau tautan sudah tidak valid.
          </p>
          <div className="pt-2">
            <Link
              href="/katalog"
              className="inline-block bg-[#5A0A14] hover:bg-[#46070F] text-amber-200 px-7 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition shadow-sm"
            >
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Ambil data produk lainnya (untuk rekomendasi di bagian bawah)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .neq('id', product.id)
    .limit(4);

  // Mapping variant_products ke variants agar cocok dengan Client Component
  const formattedProduct = {
    ...product,
    variants: product.variant_products || [],
  };

  return (
    <ProductDetailClient
      product={formattedProduct}
      relatedProducts={relatedProducts || []}
    />
  );
}