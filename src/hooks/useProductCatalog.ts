"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { Product, products } from "@/lib/products";

export function useProductCatalog() {
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const overrides = new Map<string, Partial<Product>>();
        snapshot.forEach((document) => {
          overrides.set(document.id, document.data() as Partial<Product>);
        });

        setCatalog(
          products.map((product) => ({
            ...product,
            ...overrides.get(product.id)
          }))
        );
        setLoading(false);
      },
      () => {
        setCatalog(products);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { catalog, loading };
}
