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
  const productId = resolvedParams.id;

  // Mengambil data produk beserta variannya menggunakan nama tabel 'variant_products'
  const { data: product, error } = await supabase
    .from('products')
    .select('*, variant_products(*)')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-28 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-serif font-bold text-[#3b0912]">Produk Tidak Ditemukan</h2>
        <p className="text-gray-600 text-sm">Maaf, data produk yang Anda cari tidak tersedia di database atau ID tidak valid.</p>
        <a
          href="/katalog"
          className="inline-block bg-[#5c0f1c] text-amber-200 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition hover:bg-[#3b0912]"
        >
          Kembali ke Katalog
        </a>
      </div>
    );
  }

  // Karena props di Client Component mengharapkan 'variants', kita mapping variant_products ke variants
  const formattedProduct = {
    ...product,
    variants: product.variant_products || [],
  };

  return <ProductDetailClient product={formattedProduct} />;
}