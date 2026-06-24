"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem, useCart } from "@/contexts/CartContext";
import { db } from "@/lib/firebase";
import { loadRazorpayScript } from "@/lib/razorpay";
import { Product, formatCurrency, getProduct } from "@/lib/products";

type CheckoutButtonProps = {
  product?: Product;
  label?: string;
  className?: string;
};

export function CheckoutButton({ product, label = "Checkout", className = "" }: CheckoutButtonProps) {
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

    const checkoutItems: CartItem[] = product
      ? [{ productId: product.id, quantity: 1 }]
      : cart.items;

    const enrichedItems = checkoutItems
      .map((item) => ({ item, product: getProduct(item.productId) }))
      .filter((entry) => entry.product?.status === "available");

    const total = enrichedItems.reduce(
      (sum, entry) => sum + (entry.product?.price || 0) * entry.item.quantity,
      0
    );

    if (!total) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error("Payment gateway failed to load.");
      }

      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, receipt: `rv_${Date.now()}` })
      });

      const order = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(order.error || "Could not create payment order.");
      }

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "RailVision",
        description: `RailVision order - ${formatCurrency(total)}`,
        order_id: order.id,
        prefill: {
          name: user.displayName,
          email: user.email
        },
        theme: { color: "#55e6ff" },
        handler: async (response) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });

          if (!verifyResponse.ok) {
            toast.error("Payment verification failed.");
            return;
          }

          if (!db) {
            toast.error("Firebase is not configured, so the order cannot be saved yet.");
            return;
          }

          await addDoc(collection(db, "orders"), {
            userId: user.uid,
            customerEmail: user.email,
            customerName: user.displayName || "",
            items: enrichedItems.map((entry) => ({
              productId: entry.item.productId,
              name: entry.product?.name,
              price: entry.product?.price,
              quantity: entry.item.quantity
            })),
            total,
            payment: response,
            status: "paid",
            createdAt: serverTimestamp()
          });

          if (!product) {
            cart.clearCart();
          }
          toast.success("Order confirmed. Thank you for choosing RailVision.");
          router.push("/profile");
        },
        modal: {
          ondismiss: () => toast("Checkout closed.")
        }
      });

      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className={`button primary ${className}`} onClick={checkout} disabled={loading}>
      <CreditCard size={18} />
      {loading ? "Preparing..." : label}
    </button>
  );
  console.log("Razorpay Key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
}
