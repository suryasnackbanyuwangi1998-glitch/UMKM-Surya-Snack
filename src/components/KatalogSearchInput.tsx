// src/components/KatalogSearchInput.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function KatalogSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'semua';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim() !== '') {
      params.set('search', query);
    } else {
      params.delete('search');
    }

    if (currentCategory && currentCategory !== 'semua') {
      params.set('category', currentCategory);
    }

    // Reset ke halaman 1 saat mengetik
    params.delete('page');

    // Update URL secara instan tanpa reload halaman penuh
    router.push(`/katalog?${params.toString()}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        defaultValue={currentSearch}
        onChange={handleSearchChange}
        placeholder="Ketik nama makanan atau minuman..."
        className="w-full bg-white text-gray-900 text-xs placeholder:text-gray-400 pl-3 pr-9 py-2.5 rounded-xl border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#5c0f1c] transition-all"
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}