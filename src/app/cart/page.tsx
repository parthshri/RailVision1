"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency, getProduct } from "@/lib/products";

export default function CartPage() {
  const cart = useCart();

  return (
    <>
      <section className="subhero">
        <span className="eyebrow">Cart and checkout</span>
        <h1>Review your RailVision order.</h1>
        <p>Add, remove, update quantity, and complete secure checkout with Razorpay.</p>
      </section>

      <section className="section cart-layout">
        <div className="cart-list">
          {cart.items.length === 0 ? (
            <div className="panel empty-state">
              <h2>Your cart is empty.</h2>
              <p>RailVision Junior is ready in the shop.</p>
              <Link className="button primary" href="/shop">Go to Shop</Link>
            </div>
          ) : (
            cart.items.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              return (
                <article className="cart-item" key={item.productId}>
                  <div>
                    <h2>{product.name}</h2>
                    <p>{formatCurrency(product.price)} each</p>
                  </div>
                  <div className="quantity-control">
                    <button onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity">
                      <Plus size={16} />
                    </button>
                  </div>
                  <strong>{formatCurrency(product.price * item.quantity)}</strong>
                  <button className="icon-danger" onClick={() => cart.removeItem(item.productId)} aria-label="Remove item">
                    <Trash2 size={18} />
                  </button>
                </article>
              );
            })
          )}
        </div>

        <aside className="summary-card">
          <h2>Order summary</h2>
          <div>
            <span>Items</span>
            <strong>{cart.itemCount}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{formatCurrency(cart.total)}</strong>
          </div>
          <CheckoutButton label="Secure Checkout" />
        </aside>
      </section>
    </>
  );
}
