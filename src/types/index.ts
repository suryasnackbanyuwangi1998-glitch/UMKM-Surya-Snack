export interface Product {
  id: string; // Menggunakan string (UUID)
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  price: number | null;
  image_url: string | null;
  images: string[] | null;
  badge: string | null;
  category: string | null;
  weight: string | null;
  ingredients: string | null;
  stock: number;
  sales: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}