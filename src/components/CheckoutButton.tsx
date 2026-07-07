"use client";

import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/products";

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
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const cart = useCart();
  const router = useRouter();

  async function checkout() {
    if (!user) {
      toast.error("Please login before checkout.");
      router.push("/auth");
      return;
    }

    setLoading(true);

    try {
      if (product) {
        router.push(`/checkout?product=${product.id}`);
        return;
      }

      if (cart.items.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      router.push("/checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`button primary ${className}`}
      onClick={checkout}
      disabled={loading}
    >
      <CreditCard size={18} />
      {loading ? "Preparing..." : label}
    </button>
  );
}