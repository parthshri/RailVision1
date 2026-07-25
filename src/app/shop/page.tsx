"use client";

import {
  FormEvent,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  BellRing,
  CheckCircle2,
  FileText,
  ShoppingCart,
  X,
} from "lucide-react";

import { AffiliateTracker } from "@/components/AffiliateTracker";
import { CheckoutButton } from "@/components/CheckoutButton";
import { ProductVisual } from "@/components/ProductVisual";
import { Skeleton } from "@/components/Skeleton";

import { useCart } from "@/contexts/CartContext";
import { useProductCatalog } from "@/hooks/useProductCatalog";

import {
  addNotificationSignup,
} from "@/lib/firestoreActions";

import {
  formatCurrency,
  Product,
} from "@/lib/products";

export default function ShopPage() {
  const {
    catalog,
    loading,
  } = useProductCatalog();

  const cart = useCart();

  const [
    notifyLoading,
    setNotifyLoading,
  ] = useState(false);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<Product | null>(null);

  async function notify(
    event: FormEvent<HTMLFormElement>,
    productId: string
  ) {
    event.preventDefault();

    setNotifyLoading(true);

    const form = new FormData(
      event.currentTarget
    );

    try {
      await addNotificationSignup({
        productId,
        email: form.get("email"),
      });

      event.currentTarget.reset();

      toast.success(
        "You are on the RailVision Pro notify list."
      );
    } catch (error) {
      console.error(
        "Notification signup failed:",
        error
      );

      toast.error(
        "Could not save email. Please try again."
      );
    } finally {
      setNotifyLoading(false);
    }
  }

  return (
    <>
      <AffiliateTracker />

      <div
        style={{
          width: "100%",
          background:
            "linear-gradient(90deg, #ff7a18, #ffb347)",
          color: "#ffffff",
          textAlign: "center",
          padding: "12px 20px",
          fontWeight: 700,
          fontSize: "15px",
          letterSpacing: "0.4px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,.15)",
        }}
      >
        🎉{" "}
        <strong>
          Launch Offer!
        </strong>{" "}
        Exclusive discounts for our{" "}
        <strong>
          first 100 customers
        </strong>
        . Limited-time introductory pricing —
        Order yours today!
      </div>

      <section className="subhero">
        <span className="eyebrow">
          RailVision shop
        </span>

        <h1>
          Explore railway innovation and
          STEM project kits for students,
          schools, and young makers.
        </h1>

        <p>
          Discover railway safety projects,
          robotics kits, drone learning kits,
          and enterprise railway technology.
        </p>
      </section>

      <section className="section shop-grid">
        {loading
          ? [1, 2, 3].map((item) => (
              <Skeleton
                className="shop-skeleton"
                key={item}
              />
            ))
          : catalog.map((product) => (
              <article
                className="shop-card"
                key={product.id}
              >
                <div className="badge">
                  {product.status ===
                  "available"
                    ? product.badge ||
                      "Available"
                    : "Coming Soon"}
                </div>

                <ProductVisual
                  label={product.name}
                  imageUrl={
                    product.imageUrl
                  }
                  variant={
                    product.id.includes(
                      "pro"
                    )
                      ? "pro"
                      : "kit"
                  }
                />

                <h2>
                  {product.name}
                </h2>

                <p>
                  {product.summary}
                </p>

                {product.status ===
                "available" ? (
                  <ProductPrice
                    product={product}
                    align="center"
                  />
                ) : (
                  <strong className="price">
                    Coming Soon
                  </strong>
                )}

                <button
                  type="button"
                  className="button secondary"
                  style={{
                    width: "100%",
                    marginBottom: 12,
                  }}
                  onClick={() =>
                    setSelectedProduct(
                      product
                    )
                  }
                >
                  View Details
                </button>

                {product.status ===
                "available" ? (
                  <div className="button-row">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => {
                        cart.addItem(
                          product
                        );

                        toast.success(
                          `${product.name} added to cart.`
                        );
                      }}
                    >
                      <ShoppingCart
                        size={18}
                      />
                      Add to Cart
                    </button>

                    <CheckoutButton
                      product={product}
                      label="Buy Now"
                    />
                  </div>
                ) : (
                  <form
                    className="notify-form"
                    onSubmit={(event) =>
                      notify(
                        event,
                        product.id
                      )
                    }
                  >
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="Email for launch updates"
                    />

                    <button
                      type="submit"
                      className="button primary"
                      disabled={
                        notifyLoading
                      }
                    >
                      <BellRing
                        size={18}
                      />

                      {notifyLoading
                        ? "Saving..."
                        : "Notify Me"}
                    </button>
                  </form>
                )}
              </article>
            ))}
      </section>

      {selectedProduct ? (
        <ProductDetailsModal
          product={
            selectedProduct
          }
          onClose={() =>
            setSelectedProduct(null)
          }
          onAddToCart={() => {
            cart.addItem(
              selectedProduct
            );

            toast.success(
              `${selectedProduct.name} added to cart.`
            );
          }}
        />
      ) : null}
    </>
  );
}

type ProductPriceProps = {
  product: Product;
  align?:
    | "center"
    | "flex-start";
};

function ProductPrice({
  product,
  align = "center",
}: ProductPriceProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        justifyContent: "center",
        gap: 4,
        margin: "18px 0",
        textAlign:
          align === "center"
            ? "center"
            : "left",
      }}
    >
      {product.originalPrice >
      product.price ? (
        <span
          style={{
            color:
              "var(--muted)",
            fontSize: "1rem",
            textDecoration:
              "line-through",
          }}
        >
          {formatCurrency(
            product.originalPrice
          )}
        </span>
      ) : null}

      <strong
        style={{
          color:
            "var(--green)",
          fontSize: "1.65rem",
          fontWeight: 900,
        }}
      >
        {formatCurrency(
          product.price
        )}
      </strong>
    </div>
  );
}

type ProductDetailsModalProps = {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
};

function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "grid",
        placeItems: "center",
        padding: 18,
        background:
          "rgba(0, 0, 0, 0.78)",
        backdropFilter:
          "blur(10px)",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        className="panel"
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          position: "relative",
          width:
            "min(920px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 28,
        }}
      >
        <button
          type="button"
          aria-label="Close product details"
          className="icon-link"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28,
            alignItems: "start",
          }}
        >
          <ProductVisual
            label={product.name}
            imageUrl={
              product.imageUrl
            }
            variant={
              product.id.includes(
                "pro"
              )
                ? "pro"
                : "kit"
            }
          />

          <div>
            {product.badge ? (
              <span className="badge">
                {product.badge}
              </span>
            ) : null}

            <h2 id="product-details-title">
              {product.name}
            </h2>

            <p>
              {product.description}
            </p>

            {product.status ===
            "available" ? (
              <ProductPrice
                product={product}
                align="flex-start"
              />
            ) : (
              <strong
                className="price"
                style={{
                  display: "block",
                  marginBottom: 22,
                }}
              >
                Coming Soon
              </strong>
            )}

            <h3>
              Key Features
            </h3>

            <ul className="check-list">
              {product.features.map(
                (feature) => (
                  <li key={feature}>
                    <CheckCircle2
                      size={18}
                    />
                    {feature}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <hr
          style={{
            margin: "28px 0",
            borderColor:
              "var(--line)",
          }}
        />

        <h3>
          Materials Included
        </h3>

        <ul className="check-list">
          {product.materialsIncluded.map(
            (material) => (
              <li key={material}>
                <CheckCircle2
                  size={18}
                />
                {material}
              </li>
            )
          )}
        </ul>

        {!product.codAvailable &&
        product.status ===
          "available" ? (
          <div
            style={{
              marginTop: 22,
              padding: 18,
              border:
                "1px solid rgba(246, 184, 75, 0.36)",
              borderRadius: 8,
              background:
                "rgba(246, 184, 75, 0.07)",
            }}
          >
            <h3
              style={{
                color:
                  "var(--amber)",
              }}
            >
              Prepaid Orders Only
            </h3>

            <p
              style={{
                marginBottom: 0,
              }}
            >
              Cash on Delivery is not
              available for this product.
              Advance payment is required
              before the order is prepared.
            </p>
          </div>
        ) : null}

        <div
          className="panel"
          style={{
            marginTop: 26,
            boxShadow: "none",
          }}
        >
          <FileText size={26} />

          <h3
            style={{
              marginTop: 12,
            }}
          >
            Tutorials and PDF Support
          </h3>

          <p>
            For tutorial videos, circuit
            diagrams, source code, assembly
            instructions, or project PDFs,
            contact RailVision Support after
            placing your order. Include your
            order ID when contacting support.
          </p>
        </div>

        <div
          style={{
            marginTop: 22,
            padding: 18,
            border:
              "1px solid rgba(246, 184, 75, 0.36)",
            borderRadius: 8,
            background:
              "rgba(246, 184, 75, 0.07)",
          }}
        >
          <h3
            style={{
              color:
                "var(--amber)",
            }}
          >
            Product Disclaimer
          </h3>

          <p
            style={{
              marginBottom: 0,
            }}
          >
            Product packaging, component
            colours, brands, shapes, and
            arrangement may differ from
            those shown in the product
            images. Equivalent compatible
            components may be supplied
            depending on availability,
            without affecting the intended
            functionality of the product.
          </p>
        </div>

        {product.status ===
        "available" ? (
          <div
            className="button-row"
            style={{
              marginTop: 24,
            }}
          >
            <button
              type="button"
              className="button secondary"
              onClick={onAddToCart}
            >
              <ShoppingCart
                size={18}
              />
              Add to Cart
            </button>

            <CheckoutButton
              product={product}
              label="Buy Now"
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}