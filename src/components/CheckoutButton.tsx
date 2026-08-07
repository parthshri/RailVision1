"use client";

import {
  ShoppingBag,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  useCart,
} from "@/contexts/CartContext";

import {
  Product,
} from "@/lib/products";

type CheckoutButtonProps = {
  product?: Product;
  label?: string;
  className?: string;
};

export function CheckoutButton({
  product,
  label = "Checkout",
  className = "",
}: CheckoutButtonProps) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const cart =
    useCart();

  const router =
    useRouter();

  function checkout() {
    setLoading(true);

    try {
      // Direct product checkout
      // Guest checkout is allowed
      if (product) {
        router.push(
          `/checkout?product=${encodeURIComponent(
            product.id
          )}`
        );

        return;
      }

      // Cart checkout
      if (
        cart.items.length ===
        0
      ) {
        toast.error(
          "Your cart is empty."
        );

        return;
      }

      router.push(
        "/checkout"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={`button primary ${className}`}
      onClick={checkout}
      disabled={loading}
    >
      <ShoppingBag
        size={18}
      />

      {loading
        ? "Preparing..."
        : label}
    </button>
  );
}