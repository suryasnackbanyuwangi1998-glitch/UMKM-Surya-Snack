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

// Ambil semua produk aktif beserta variannya
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:variant_products(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data produk:", error.message);
    return [];
  }

  return data || [];
}

// Ambil produk unggulan untuk halaman utama (featured products) beserta variannya
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:variant_products(*)")
    .eq("is_active", true)
    .eq("is_popular", true) // Memfilter produk yang dicentang sebagai unggulan di admin
    .limit(limit);

  if (error) {
    console.error("Gagal mengambil produk unggulan:", error.message);
    return [];
  }

  return data || [];
}

// Ambil detail produk berdasarkan slug beserta variannya
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:variant_products(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Gagal mengambil detail produk:", error.message);
    return null;
  }

  return data;
}

// Ambil detail produk berdasarkan ID beserta variannya
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:variant_products(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gagal mengambil detail produk berdasarkan ID:", error.message);
    return null;
  }

  return data;
}