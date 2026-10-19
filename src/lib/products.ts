// src/lib/products.ts
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types";

// Helper untuk format mata uang Rupiah
export function formatRupiah(price: number | null | undefined): string {
  if (price === null || price === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

// Ambil semua produk aktif
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data produk:", error.message);
    return [];
  }

  return data || [];
}

// Ambil produk unggulan untuk halaman utama (featured products)
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_popular", true) // Memfilter produk yang dicentang sebagai unggulan di admin
    .limit(limit);

  if (error) {
    console.error("Gagal mengambil produk unggulan:", error.message);
    return [];
  }

  return data || [];
}

// Ambil detail produk berdasarkan slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Gagal mengambil detail produk:", error.message);
    return null;
  }

  return data;
}