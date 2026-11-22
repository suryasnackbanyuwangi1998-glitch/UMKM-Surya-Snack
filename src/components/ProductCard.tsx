// src/components/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatRupiah } from '@/lib/products';
import { useLanguage } from '@/context/LanguageContext';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product & { images?: string[] | string | null };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLanguage();

  let displayImage = product.image_url;
  if (!displayImage && Array.isArray(product.images) && product.images.length > 0) {
    displayImage = product.images[0];
  } else if (!displayImage && typeof product.images === 'string') {
    displayImage = product.images;
  }

  const finalImage =
    displayImage ||
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=400';

  const productIdentifier = product.slug || product.id;

  return (
    <div className="group bg-[#FAF7F0] rounded-2xl border border-[#5A0A14]/15 overflow-hidden hover:shadow-[0_14px_30px_-10px_rgba(90,10,20,0.18)] hover:border-[#5A0A14]/35 transition-all duration-300 flex flex-col font-sans">

      {/* Gambar Produk */}
      <Link
        href={`/katalog/${productIdentifier}`}
        className="relative w-full aspect-square overflow-hidden bg-[#EFE6D5] block"
      >
        <Image
          src={finalImage}
          alt={product.name || 'Produk'}
          fill
          unoptimized
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-[#5A0A14] text-amber-200 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-amber-300/30">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Informasi Produk & Tombol Detail */}
      <div className="p-4 flex flex-col grow gap-3 bg-white">
        <h3 className="font-semibold text-[#2B211B] group-hover:text-[#5A0A14] transition-colors text-sm line-clamp-2 leading-snug min-h-10">
          {product.name}
        </h3>

        <p className="text-[#5A0A14] font-bold text-base mt-auto">
          {formatRupiah(product.price)}
        </p>

        <div className="pt-2 border-t border-[#5A0A14]/10">
          <Link
            href={`/katalog/${productIdentifier}`}
            className="w-full text-center border border-[#5A0A14] text-[#5A0A14] hover:bg-[#5A0A14] hover:text-amber-200 font-bold py-2 rounded-xl text-xs transition-all duration-300 block"
          >
            {lang === 'en' ? 'Details' : 'Detail'}
          </Link>
        </div>
      </div>
    </div>
  );
}