"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { BellRing, ShoppingCart } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { ProductVisual } from "@/components/ProductVisual";
import { Skeleton } from "@/components/Skeleton";
import { useCart } from "@/contexts/CartContext";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { addNotificationSignup } from "@/lib/firestoreActions";
import { formatCurrency } from "@/lib/products";

export default function ShopPage() {
  const { catalog, loading } = useProductCatalog();
  const cart = useCart();
  const [notifyLoading, setNotifyLoading] = useState(false);

  async function notify(event: FormEvent<HTMLFormElement>, productId: string) {
    event.preventDefault();
    setNotifyLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await addNotificationSignup({
        productId,
        email: form.get("email")
      });
      event.currentTarget.reset();
      toast.success("You are on the RailVision Pro notify list.");
    } catch {
      toast.error("Could not save email. Please try again.");
    } finally {
      setNotifyLoading(false);
    }
  }

  return (
    <>
      <section className="subhero">
        <span className="eyebrow">RailVision shop</span>
        <h1>Explore railway innovation products for homes, schools, and enterprises.</h1>
        <p>
          RailVision Junior is available now. RailVision Pro is opening enterprise demo
          access soon.
        </p>
      </section>

      <section className="section shop-grid">
        {loading
          ? [1, 2].map((item) => <Skeleton className="shop-skeleton" key={item} />)
          : catalog.map((product) => (
              <article className="shop-card" key={product.id}>
                <div className="badge">{product.status === "available" ? "Available" : "Coming Soon"}</div>
                <ProductVisual
                  label={product.name}
                  imageUrl={product.imageUrl}
                  variant={product.id.includes("pro") ? "pro" : "kit"}
                />
                <h2>{product.name}</h2>
                <p>{product.summary}</p>
                <strong className="price">
                  {product.status === "available" ? formatCurrency(product.price) : "Coming Soon"}
                </strong>

                {product.status === "available" ? (
                  <div className="button-row">
                    <button className="button secondary" onClick={() => cart.addItem(product)}>
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                    <CheckoutButton product={product} label="Buy Now" />
                  </div>
                ) : (
                  <form className="notify-form" onSubmit={(event) => notify(event, product.id)}>
                    <input required type="email" name="email" placeholder="Email for launch updates" />
                    <button className="button primary" disabled={notifyLoading}>
                      <BellRing size={18} /> Notify Me
                    </button>
                  </form>
                )}
              </article>
            ))}
      </section>
    </>
  );
}
