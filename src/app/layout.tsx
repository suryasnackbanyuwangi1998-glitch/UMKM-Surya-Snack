// src/app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import MainLayout from '@/components/MainLayout';
import { CartProvider } from '@/context/CartProvider';

export const metadata: Metadata = {
  title: 'Surya Snack - Camilan Khas UMKM',
  description: 'Website resmi katalog dan pemesanan Surya Snack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-[#FDFBF7] min-h-screen font-sans antialiased" suppressHydrationWarning>
        <CartProvider>
          <MainLayout>{children}</MainLayout>
        </CartProvider>
      </body>
    </html>
  );
}