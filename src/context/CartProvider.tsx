'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/types';

// Perluas tipe Product agar mendukung properti selectedVariant
export interface CartItemProduct extends Product {
  selectedVariant?: string;
}

export interface CartItem {
  product: CartItemProduct;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItemProduct, quantity?: number) => void;
  removeFromCart: (productId: string | number, selectedVariant?: string) => void;
  updateQuantity: (productId: string | number, quantity: number, selectedVariant?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'surya_snack_cart_session';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Muat keranjang hanya dari sessionStorage (otomatis hilang saat tab/aplikasi ditutup)
  useEffect(() => {
    try {
      // Hapus sisa data lama di localStorage jika sebelumnya pernah tersimpan
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('surya_snack_cart');
      }

      const savedCart = sessionStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Gagal memuat keranjang:', e);
    }
    setIsInitialized(true);
  }, []);

  // Simpan perubahan keranjang ke sessionStorage selama sesi aktif
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (cart.length === 0) {
        sessionStorage.removeItem(CART_STORAGE_KEY);
      } else {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    } catch (e) {
      console.error('Gagal menyimpan keranjang:', e);
    }
  }, [cart, isInitialized]);

  // Bersihkan sesi keranjang ketika pengguna menutup tab atau keluar dari aplikasi/browser
  useEffect(() => {
    const handleAppClose = () => {
      try {
        sessionStorage.removeItem(CART_STORAGE_KEY);
      } catch {
        // Abaikan error storage saat halaman ditutup
      }
    };

    window.addEventListener('beforeunload', handleAppClose);
    return () => {
      window.removeEventListener('beforeunload', handleAppClose);
    };
  }, []);

  // Memasukkan ke keranjang dengan membedakan ID dan Varian (selectedVariant)
  const addToCart = (product: CartItemProduct, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          String(item.product.id) === String(product.id) &&
          (item.product.selectedVariant || 'Produk Utama') ===
            (product.selectedVariant || 'Produk Utama')
      );

      if (existingIndex > -1) {
        return prevCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  // Hapus item berdasarkan ID dan Varian tertentu
  const removeFromCart = (productId: string | number, selectedVariant?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            String(item.product.id) === String(productId) &&
            (item.product.selectedVariant || 'Produk Utama') ===
              (selectedVariant || 'Produk Utama')
          )
      )
    );
  };

  // Update kuantitas berdasarkan ID dan Varian tertentu
  const updateQuantity = (
    productId: string | number,
    quantity: number,
    selectedVariant?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        String(item.product.id) === String(productId) &&
        (item.product.selectedVariant || 'Produk Utama') ===
          (selectedVariant || 'Produk Utama')
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      sessionStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Abaikan error storage
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.product.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      totalItems: 0,
      totalPrice: 0,
    };
  }
  return context;
}