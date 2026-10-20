'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatRupiah } from '@/lib/products';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product & { images?: string[] | string | null };
}

export default function ProductCard({ product }: ProductCardProps) {
  let displayImage = product.image_url;
  if (!displayImage && Array.isArray(product.images) && product.images.length > 0) {
    displayImage = product.images[0];
  } else if (!displayImage && typeof product.images === 'string') {
    displayImage = product.images;
  }

  const finalImage =
    displayImage ||
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=400';

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col font-sans">
      
      {/* Gambar Produk */}
      <Link
        href={`/katalog/${product.slug}`}
        className="relative w-full aspect-square overflow-hidden bg-gray-50 block"
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
          <span className="absolute top-2 left-2 bg-[#3b0912] text-amber-300 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Informasi Produk & Tombol Detail */}
      <div className="p-4 flex flex-col flex-grow gap-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        <p className="text-[#5c0f1c] font-bold text-base mt-auto">
          {formatRupiah(product.price)}
        </p>

        <div className="pt-1 border-t border-gray-100">
          <Link
            href={`/katalog/${product.slug}`}
            className="w-full text-center border border-[#5c0f1c] text-[#5c0f1c] hover:bg-[#5c0f1c] hover:text-white font-bold py-2 rounded-lg text-xs transition-all duration-300 block"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}