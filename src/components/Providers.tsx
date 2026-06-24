"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#08111f",
              border: "1px solid rgba(97, 232, 255, 0.22)",
              color: "#f8fbff"
            }
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
