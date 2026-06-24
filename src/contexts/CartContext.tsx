"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Product, formatCurrency, getProduct } from "@/lib/products";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce((sum, item) => {
      const product = getProduct(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    return {
      items,
      total,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem(product, quantity = 1) {
        if (product.status !== "available") {
          toast.error("This product is not available yet.");
          return;
        }

        setItems((current) => {
          const existing = current.find((item) => item.productId === product.id);
          if (existing) {
            return current.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...current, { productId: product.id, quantity }];
        });
        toast.success(`${product.name} added to cart (${formatCurrency(product.price)})`);
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          setItems((current) => current.filter((item) => item.productId !== productId));
          return;
        }
        setItems((current) =>
          current.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        );
      },
      clearCart() {
        setItems([]);
      }
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
