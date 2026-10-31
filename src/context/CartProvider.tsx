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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('surya_snack_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Gagal memuat keranjang:', e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('surya_snack_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Memasukkan ke keranjang dengan membedakan ID dan Varian (selectedVariant)
  const addToCart = (product: CartItemProduct, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          String(item.product.id) === String(product.id) &&
          (item.product.selectedVariant || 'Produk Utama') === (product.selectedVariant || 'Produk Utama')
      );

      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
        return updatedCart;
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
            (item.product.selectedVariant || 'Produk Utama') === (selectedVariant || 'Produk Utama')
          )
      )
    );
  };

  // Update kuantitas berdasarkan ID dan Varian tertentu
  const updateQuantity = (productId: string | number, quantity: number, selectedVariant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        String(item.product.id) === String(productId) &&
        (item.product.selectedVariant || 'Produk Utama') === (selectedVariant || 'Produk Utama')
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
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