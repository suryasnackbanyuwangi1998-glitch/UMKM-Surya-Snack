'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const isHomePage = pathname === '/';

  return (
    <>
      <Navbar />
      <main className={`flex-grow ${isHomePage ? 'pt-0' : 'pt-24'}`}>{children}</main>
      <Footer />
    </>
  );
}