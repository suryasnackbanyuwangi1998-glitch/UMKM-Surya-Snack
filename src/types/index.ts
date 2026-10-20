export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  category?: string;
  weight?: string;
  stock?: number;
  sales?: number; // <-- Tambahkan ini agar tidak error
  badge?: string;
  description?: string;
  long_description?: string;
  ingredients?: string;
  packaging_standard?: string;
  key_features?: string[] | string;
  image_url?: string | null;
  images?: string[] | string | null;
  is_active?: boolean;
  is_popular?: boolean;
  created_at?: string;
}