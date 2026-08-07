"use client";

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShoppingCart,
} from "lucide-react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import {
  CheckoutButton,
} from "@/components/CheckoutButton";

import {
  ProductVisual,
} from "@/components/ProductVisual";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  useCart,
} from "@/contexts/CartContext";

import {
  formatCurrency,
  getProduct,
} from "@/lib/products";

export default function ProductPage() {
  const router = useRouter();

  const params = useParams<{
    slug: string;
  }>();

  const { user } = useAuth();

  const cart = useCart();

  const slug = params.slug;

  const product = getProduct(slug);

  if (!product) {
    return (
      <section className="section">
        <div
          className="panel"
          style={{
            textAlign: "center",
            padding: 50,
          }}
        >
          <h1>
            Product not found
          </h1>

          <p
            style={{
              color: "var(--muted)",
            }}
          >
            This product may have been
            removed or the link may be
            incorrect.
          </p>

          <button
            type="button"
            className="button secondary"
            onClick={() =>
              router.push("/shop")
            }
          >
            <ArrowLeft size={18} />
            Back to Shop
          </button>
        </div>
      </section>
    );
  }

  function addToCart() {
    if (!user) {
      toast.error(
        "Please sign in to use your cart."
      );

      router.push(
        `/auth?redirect=${encodeURIComponent(
          `/shop/${product.slug}`
        )}`
      );

      return;
    }

    cart.addItem(product);

    toast.success(
      `${product.name} added to cart.`
    );
  }

  const saving =
    product.originalPrice >
    product.price
      ? product.originalPrice -
        product.price
      : 0;

  const discount =
    product.originalPrice >
      product.price &&
    product.price > 0
      ? Math.round(
          ((product.originalPrice -
            product.price) /
            product.originalPrice) *
            100
        )
      : 0;

  return (
    <>
      <section className="section product-page">
        <button
          type="button"
          className="product-back-button"
          onClick={() =>
            router.push("/shop")
          }
        >
          <ArrowLeft size={18} />
          Back to Shop
        </button>

        <div className="product-page-main">
          <div className="product-page-image">
            {discount > 0 ? (
              <span className="product-page-discount">
                {discount}% OFF
              </span>
            ) : null}

            <ProductVisual
              label={product.name}
              imageUrl={product.imageUrl}
              variant={
                product.id ===
                "railvision-pro"
                  ? "pro"
                  : "kit"
              }
            />
          </div>

          <div className="product-page-info">
            <span className="badge">
              {product.status ===
              "available"
                ? product.badge ||
                  "Available"
                : "Coming Soon"}
            </span>

            <h1>
              {product.name}
            </h1>

            <p className="product-page-summary">
              {product.summary}
            </p>

            {product.status ===
            "available" ? (
              <div className="product-page-price">
                {product.originalPrice >
                product.price ? (
                  <span className="product-page-original-price">
                    {formatCurrency(
                      product.originalPrice
                    )}
                  </span>
                ) : null}

                <strong>
                  {formatCurrency(
                    product.price
                  )}
                </strong>

                {saving > 0 ? (
                  <span className="product-page-saving">
                    You save{" "}
                    {formatCurrency(
                      saving
                    )}
                  </span>
                ) : null}
              </div>
            ) : (
              <strong className="price">
                Coming Soon
              </strong>
            )}

            <p>
              {product.description}
            </p>

            {product.status ===
            "available" ? (
              <div className="product-page-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={addToCart}
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

            {product.status ===
              "available" &&
            !product.codAvailable ? (
              <div className="product-warning">
                <strong>
                  Prepaid Orders Only
                </strong>

                <p>
                  Cash on Delivery is not
                  available for this
                  product.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <section className="product-info-section">
          <span className="eyebrow">
            Product Details
          </span>

          <h2>
            Key Features
          </h2>

          <ul className="check-list product-feature-grid">
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
        </section>

        <section className="product-info-section">
          <span className="eyebrow">
            Inside The Kit
          </span>

          <h2>
            Materials Included
          </h2>

          <ul className="check-list product-feature-grid">
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
        </section>

        <div className="product-support-card">
          <FileText size={28} />

          <div>
            <h3>
              Tutorials & Project
              Support
            </h3>

            <p>
              For available tutorials,
              circuit diagrams, source
              code, assembly
              instructions or project
              documentation, contact
              RailVision Support after
              ordering and include your
              order ID.
            </p>
          </div>
        </div>

        <div className="product-disclaimer">
          <h3>
            Product Disclaimer
          </h3>

          <p>
            Product packaging,
            component colours, brands,
            shapes and arrangement may
            differ from the images
            shown. Equivalent compatible
            components may be supplied
            depending on availability
            without affecting the
            intended functionality.
          </p>
        </div>
      </section>

      <style jsx global>{`
        .product-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .product-back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 28px;

          border: none;
          background: transparent;

          color: var(--muted);

          font: inherit;
          font-weight: 700;

          cursor: pointer;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .product-back-button:hover {
          color: var(--green);
          transform: translateX(-3px);
        }

        .product-page-main {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 50px;

          align-items: start;
        }

        .product-page-image {
          position: sticky;
          top: 100px;

          overflow: hidden;

          border:
            1px solid var(--line);

          border-radius: 22px;

          padding: 16px;

          background:
            rgba(
              255,
              255,
              255,
              0.025
            );

          box-shadow:
            0 20px 60px
            rgba(0, 0, 0, 0.12);
        }

        .product-page-discount {
          position: absolute;

          top: 18px;
          right: 18px;

          z-index: 5;

          padding: 8px 11px;

          border-radius: 999px;

          background:
            linear-gradient(
              135deg,
              #ff7a18,
              #ffb347
            );

          color: white;

          font-size: 0.78rem;
          font-weight: 900;

          box-shadow:
            0 8px 20px
            rgba(
              255,
              122,
              24,
              0.25
            );
        }

        .product-page-info h1 {
          margin: 18px 0 12px;

          font-size:
            clamp(
              2rem,
              5vw,
              3.7rem
            );

          line-height: 1.05;
        }

        .product-page-summary {
          color: var(--muted);

          font-size: 1.05rem;
          line-height: 1.7;
        }

        .product-page-price {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          gap: 4px;

          margin: 25px 0;
        }

        .product-page-original-price {
          color: var(--muted);

          font-size: 1.05rem;

          text-decoration:
            line-through;
        }

        .product-page-price strong {
          color: var(--green);

          font-size: 2.3rem;
          font-weight: 950;
        }

        .product-page-saving {
          color: var(--green);

          font-size: 0.85rem;
          font-weight: 800;
        }

        .product-page-actions {
          display: flex;
          flex-wrap: wrap;

          gap: 12px;

          margin-top: 28px;
        }

        .product-warning {
          margin-top: 22px;

          padding: 17px;

          border:
            1px solid
            rgba(
              246,
              184,
              75,
              0.36
            );

          border-radius: 12px;

          background:
            rgba(
              246,
              184,
              75,
              0.07
            );
        }

        .product-warning strong {
          color: var(--amber);
        }

        .product-warning p {
          margin: 5px 0 0;
        }

        .product-info-section {
          margin-top: 70px;

          padding: 32px;

          border:
            1px solid var(--line);

          border-radius: 22px;

          background:
            rgba(
              255,
              255,
              255,
              0.025
            );
        }

        .product-info-section h2 {
          margin: 7px 0 24px;
        }

        .product-feature-grid {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 12px 25px;
        }

        .product-support-card {
          display: flex;

          gap: 16px;

          margin-top: 28px;

          padding: 25px;

          border:
            1px solid var(--line);

          border-radius: 18px;

          background:
            rgba(
              82,
              217,
              150,
              0.04
            );
        }

        .product-support-card h3 {
          margin-top: 0;
        }

        .product-support-card p {
          margin-bottom: 0;

          color: var(--muted);
        }

        .product-disclaimer {
          margin-top: 28px;

          padding: 22px;

          border:
            1px solid
            rgba(
              246,
              184,
              75,
              0.28
            );

          border-radius: 16px;

          background:
            rgba(
              246,
              184,
              75,
              0.055
            );
        }

        .product-disclaimer h3 {
          color: var(--amber);
          margin-top: 0;
        }

        .product-disclaimer p {
          margin-bottom: 0;
        }

        @media (
          max-width: 800px
        ) {
          .product-page-main {
            grid-template-columns:
              1fr;

            gap: 30px;
          }

          .product-page-image {
            position: relative;
            top: auto;
          }

          .product-feature-grid {
            grid-template-columns:
              1fr;
          }

          .product-page-actions {
            flex-direction: column;
          }

          .product-page-actions
            > * {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}