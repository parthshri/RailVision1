"use client";

import {
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  BellRing,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  AffiliateTracker,
} from "@/components/AffiliateTracker";

import {
  CheckoutButton,
} from "@/components/CheckoutButton";

import {
  ProductVisual,
} from "@/components/ProductVisual";

import {
  Skeleton,
} from "@/components/Skeleton";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  useCart,
} from "@/contexts/CartContext";

import {
  useProductCatalog,
} from "@/hooks/useProductCatalog";

import {
  addNotificationSignup,
} from "@/lib/firestoreActions";

import {
  formatCurrency,
  Product,
} from "@/lib/products";

type SortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "discount"
  | "name";

export default function ShopPage() {
  const {
    catalog,
    loading,
  } = useProductCatalog();

  const {
    user,
  } = useAuth();

  const cart =
    useCart();

  const router =
    useRouter();

  const [
    notifyLoading,
    setNotifyLoading,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    sortBy,
    setSortBy,
  ] = useState<SortOption>(
    "recommended"
  );

  async function notify(
    event: FormEvent<HTMLFormElement>,
    productId: string
  ) {
    event.preventDefault();
    event.stopPropagation();

    setNotifyLoading(true);

    const form =
      new FormData(
        event.currentTarget
      );

    try {
      await addNotificationSignup({
        productId,
        email:
          form.get("email"),
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

  const filteredCatalog =
    useMemo(() => {
      let items =
        [...catalog];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        items =
          items.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              product.summary
                .toLowerCase()
                .includes(
                  query
                ) ||
              product.description
                .toLowerCase()
                .includes(
                  query
                ) ||
              product.features.some(
                (feature) =>
                  feature
                    .toLowerCase()
                    .includes(
                      query
                    )
              )
          );
      }

      if (
        sortBy ===
        "price-low"
      ) {
        items.sort(
          (a, b) => {
            if (
              a.status ===
              "coming-soon"
            ) {
              return 1;
            }

            if (
              b.status ===
              "coming-soon"
            ) {
              return -1;
            }

            return (
              a.price -
              b.price
            );
          }
        );
      }

      if (
        sortBy ===
        "price-high"
      ) {
        items.sort(
          (a, b) => {
            if (
              a.status ===
              "coming-soon"
            ) {
              return 1;
            }

            if (
              b.status ===
              "coming-soon"
            ) {
              return -1;
            }

            return (
              b.price -
              a.price
            );
          }
        );
      }

      if (
        sortBy ===
        "discount"
      ) {
        items.sort(
          (a, b) =>
            getDiscountPercentage(
              b
            ) -
            getDiscountPercentage(
              a
            )
        );
      }

      if (
        sortBy ===
        "name"
      ) {
        items.sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );
      }

      return items;
    }, [
      catalog,
      search,
      sortBy,
    ]);

  const flagship =
    filteredCatalog.find(
      (product) =>
        product.id ===
        "railvision-junior"
    );

  const budgetProducts =
    filteredCatalog.filter(
      (product) =>
        product.status ===
          "available" &&
        product.price > 0 &&
        product.price <
          1000 &&
        product.id !==
          "railvision-junior"
    );

  const advancedProducts =
    filteredCatalog.filter(
      (product) =>
        product.status ===
          "available" &&
        product.price >=
          1000 &&
        product.id !==
          "railvision-junior"
    );

  const comingSoonProducts =
    filteredCatalog.filter(
      (product) =>
        product.status ===
        "coming-soon"
    );

  function openProduct(
    product: Product
  ) {
    router.push(
      `/shop/${product.slug}`
    );
  }

  function addProductToCart(
    product: Product
  ) {
    /*
     * CART REQUIRES LOGIN
     */

    if (!user) {
      toast.error(
        "Please sign in to use your cart."
      );

      const returnUrl =
        `/shop/${product.slug}`;

      router.push(
        `/auth?redirect=${encodeURIComponent(
          returnUrl
        )}`
      );

      return;
    }

    cart.addItem(
      product
    );

    toast.success(
      `${product.name} added to cart.`
    );
  }

  const defaultView =
    sortBy ===
      "recommended" &&
    search.trim() === "";

  return (
    <>
      <AffiliateTracker />

      <div className="launch-banner">
        🎉{" "}
        <strong>
          Launch Offer!
        </strong>{" "}
        Exclusive introductory
        pricing for our first
        customers — order yours
        today!
      </div>

      <section className="subhero">
        <span className="eyebrow">
          RailVision Shop
        </span>

        <h1>
          Build. Learn.
          Innovate.
        </h1>

        <p>
          Explore electronics,
          robotics, railway safety,
          Arduino and science
          exhibition projects for
          students and young makers.
        </p>

        <div className="shop-points">
          <div>
            <strong>
              From ₹349
            </strong>

            <span>
              Affordable STEM kits
            </span>
          </div>

          <div>
            <strong>
              Beginner to Advanced
            </strong>

            <span>
              Projects for every
              level
            </span>
          </div>

          <div>
            <strong>
              Hands-On Learning
            </strong>

            <span>
              Build real working
              projects
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shop-toolbar">
          <div className="shop-search">
            <Search
              size={18}
            />

            <input
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              placeholder="Search Arduino, robot, railway..."
            />

            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() =>
                  setSearch(
                    ""
                  )
                }
              >
                <X
                  size={16}
                />
              </button>
            ) : null}
          </div>

          <select
            className="shop-sort"
            value={
              sortBy
            }
            onChange={(
              event
            ) =>
              setSortBy(
                event.target
                  .value as SortOption
              )
            }
          >
            <option value="recommended">
              Recommended
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="discount">
              Biggest Discount
            </option>

            <option value="name">
              A–Z
            </option>
          </select>
        </div>

        {loading ? (
          <div className="shop-grid">
            {[
              1,
              2,
              3,
              4,
            ].map(
              (item) => (
                <Skeleton
                  className="shop-skeleton"
                  key={
                    item
                  }
                />
              )
            )}
          </div>
        ) : filteredCatalog.length ===
          0 ? (
          <div className="empty-shop">
            <Search
              size={36}
            />

            <h2>
              No matching kits
              found
            </h2>

            <p>
              Try another search or
              reset the sorting.
            </p>

            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setSearch(
                  ""
                );

                setSortBy(
                  "recommended"
                );
              }}
            >
              Reset
            </button>
          </div>
        ) : defaultView ? (
          <>
            {flagship ? (
              <ShopSection
                eyebrow="RailVision Flagship"
                title="🚂 RailVision Junior"
                description="Our flagship railway STEM experience for students exploring railway engineering, sensors, automation and safety."
              >
                <div className="featured-product">
                  <ProductCard
                    product={
                      flagship
                    }
                    index={0}
                    featured
                    onOpen={() =>
                      openProduct(
                        flagship
                      )
                    }
                    onAdd={() =>
                      addProductToCart(
                        flagship
                      )
                    }
                    notify={
                      notify
                    }
                    notifyLoading={
                      notifyLoading
                    }
                  />
                </div>
              </ShopSection>
            ) : null}

            {budgetProducts.length >
            0 ? (
              <ShopSection
                eyebrow="Affordable STEM"
                title="💰 Start Building Under ₹1000"
                description="Affordable electronics and Arduino projects that make it easy for beginners to start building."
              >
                <ProductGrid
                  products={
                    budgetProducts
                  }
                  onOpen={
                    openProduct
                  }
                  onAdd={
                    addProductToCart
                  }
                  notify={
                    notify
                  }
                  notifyLoading={
                    notifyLoading
                  }
                />
              </ShopSection>
            ) : null}

            {advancedProducts.length >
            0 ? (
              <ShopSection
                eyebrow="Built to Impress"
                title="🏆 Science Exhibition & Innovation Projects"
                description="Advanced STEM, robotics and railway projects suitable for exhibitions, competitions, engineering demonstrations and innovation showcases."
              >
                <ProductGrid
                  products={
                    advancedProducts
                  }
                  onOpen={
                    openProduct
                  }
                  onAdd={
                    addProductToCart
                  }
                  notify={
                    notify
                  }
                  notifyLoading={
                    notifyLoading
                  }
                />
              </ShopSection>
            ) : null}

            {comingSoonProducts.length >
            0 ? (
              <ShopSection
                eyebrow="Future Technology"
                title="🚀 Coming Soon"
                description="Upcoming RailVision technologies and advanced innovation products."
              >
                <ProductGrid
                  products={
                    comingSoonProducts
                  }
                  onOpen={
                    openProduct
                  }
                  onAdd={
                    addProductToCart
                  }
                  notify={
                    notify
                  }
                  notifyLoading={
                    notifyLoading
                  }
                />
              </ShopSection>
            ) : null}
          </>
        ) : (
          <ShopSection
            eyebrow={`${filteredCatalog.length} products`}
            title="Explore Products"
            description="Products matching your current search and sorting preferences."
          >
            <ProductGrid
              products={
                filteredCatalog
              }
              onOpen={
                openProduct
              }
              onAdd={
                addProductToCart
              }
              notify={
                notify
              }
              notifyLoading={
                notifyLoading
              }
            />
          </ShopSection>
        )}
      </section>

      <style jsx global>{`
        .launch-banner {
          width: 100%;
          background:
            linear-gradient(
              90deg,
              #ff7a18,
              #ffb347
            );
          color: white;
          text-align: center;
          padding: 12px 20px;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.3px;
          box-shadow:
            0 4px 16px
            rgba(
              0,
              0,
              0,
              0.12
            );
        }

        .shop-points {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .shop-points > div {
          flex: 1 1 150px;
          max-width: 220px;
          padding: 14px 16px;

          border:
            1px solid
            var(--line);

          border-radius:
            14px;

          background:
            rgba(
              255,
              255,
              255,
              0.035
            );
        }

        .shop-points strong {
          display: block;
          margin-bottom: 3px;
        }

        .shop-points span {
          color:
            var(--muted);

          font-size:
            0.82rem;
        }

        .shop-toolbar {
          position: sticky;
          top: 0;
          z-index: 15;

          display: flex;
          align-items: center;
          gap: 12px;

          margin-bottom:
            38px;

          padding:
            12px 0;

          backdrop-filter:
            blur(14px);
        }

        .shop-search {
          flex: 1;

          display: flex;
          align-items: center;
          gap: 10px;

          min-width: 0;

          padding:
            0 14px;

          border:
            1px solid
            var(--line);

          border-radius:
            13px;

          background:
            rgba(
              255,
              255,
              255,
              0.04
            );

          transition:
            border-color
              0.2s ease,
            box-shadow
              0.2s ease;
        }

        .shop-search:focus-within {
          border-color:
            var(--green);

          box-shadow:
            0 0 0 3px
            rgba(
              82,
              217,
              150,
              0.08
            );
        }

        .shop-search input {
          flex: 1;

          width: 100%;

          border: none;
          outline: none;

          padding:
            14px 0;

          background:
            transparent;

          color:
            inherit;

          font: inherit;
        }

        .shop-search button {
          display: grid;
          place-items: center;

          border: none;

          background:
            transparent;

          color:
            var(--muted);

          cursor: pointer;
        }

        .shop-sort {
          padding: 14px;

          border:
            1px solid
            var(--line);

          border-radius:
            13px;

          background:
            var(
              --background,
              #07100d
            );

          color: inherit;

          cursor: pointer;
        }

        .shop-section {
          margin-bottom:
            72px;
        }

        .shop-section-header {
          margin-bottom:
            25px;
        }

        .shop-section-header h2 {
          margin:
            7px 0 8px;

          font-size:
            clamp(
              1.6rem,
              4vw,
              2.35rem
            );
        }

        .shop-section-header p {
          max-width:
            720px;

          margin: 0;

          color:
            var(--muted);
        }

        .featured-product {
          max-width:
            720px;
        }

        .shop-card {
          position: relative;

          overflow: hidden;

          isolation: isolate;

          cursor: pointer;

          animation:
            productReveal
            0.48s ease both;

          transition:
            transform
              0.25s ease,
            box-shadow
              0.25s ease,
            border-color
              0.25s ease;
        }

        .shop-card::before {
          content: "";

          position: absolute;

          inset: 0;

          z-index: -1;

          opacity: 0;

          pointer-events: none;

          background:
            radial-gradient(
              circle at
                top right,
              rgba(
                82,
                217,
                150,
                0.13
              ),
              transparent
                45%
            );

          transition:
            opacity
              0.25s ease;
        }

        .shop-card:hover {
          transform:
            translateY(
              -7px
            );

          border-color:
            rgba(
              82,
              217,
              150,
              0.3
            );

          box-shadow:
            0 24px 58px
            rgba(
              0,
              0,
              0,
              0.18
            );
        }

        .shop-card:hover::before {
          opacity: 1;
        }

        .shop-card.featured {
          border:
            1px solid
            rgba(
              82,
              217,
              150,
              0.38
            );

          box-shadow:
            0 18px 60px
            rgba(
              82,
              217,
              150,
              0.07
            );
        }

        .discount-chip {
          position: absolute;

          top: 15px;
          right: 15px;

          z-index: 5;

          padding:
            7px 10px;

          border-radius:
            999px;

          background:
            linear-gradient(
              135deg,
              #ff7a18,
              #ffb347
            );

          color: white;

          font-size:
            12px;

          font-weight:
            900;

          box-shadow:
            0 8px 18px
            rgba(
              255,
              122,
              24,
              0.25
            );
        }

        .price-saving {
          color:
            var(--green);

          font-size:
            12px;

          font-weight:
            750;
        }

        .card-details-link {
          width: 100%;
          margin-bottom: 12px;

          cursor: pointer;
        }

        .empty-shop {
          display: grid;

          place-items:
            center;

          gap: 8px;

          padding:
            70px 20px;

          text-align:
            center;

          border:
            1px dashed
            var(--line);

          border-radius:
            20px;
        }

        .empty-shop p {
          color:
            var(--muted);
        }

        @keyframes productReveal {
          from {
            opacity: 0;

            transform:
              translateY(
                18px
              )
              scale(
                0.985
              );
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }

        @media (
          max-width:
            700px
        ) {
          .shop-toolbar {
            flex-direction:
              column;

            align-items:
              stretch;
          }

          .shop-sort {
            width: 100%;
          }

          .shop-card:hover {
            transform: none;
          }

          .shop-points > div {
            max-width: none;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .shop-card {
            animation: none;

            transition: none;
          }
        }
      `}</style>
    </>
  );
}

function ShopSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="shop-section">
      <div className="shop-section-header">
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h2>
          {title}
        </h2>

        <p>
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function ProductGrid({
  products,
  onOpen,
  onAdd,
  notify,
  notifyLoading,
}: {
  products: Product[];

  onOpen: (
    product: Product
  ) => void;

  onAdd: (
    product: Product
  ) => void;

  notify: (
    event: FormEvent<HTMLFormElement>,
    productId: string
  ) => Promise<void>;

  notifyLoading: boolean;
}) {
  return (
    <div className="shop-grid">
      {products.map(
        (
          product,
          index
        ) => (
          <ProductCard
            key={
              product.id
            }
            product={
              product
            }
            index={
              index
            }
            onOpen={() =>
              onOpen(
                product
              )
            }
            onAdd={() =>
              onAdd(
                product
              )
            }
            notify={
              notify
            }
            notifyLoading={
              notifyLoading
            }
          />
        )
      )}
    </div>
  );
}

function ProductCard({
  product,
  index,
  featured = false,
  onOpen,
  onAdd,
  notify,
  notifyLoading,
}: {
  product: Product;

  index: number;

  featured?: boolean;

  onOpen: () => void;

  onAdd: () => void;

  notify: (
    event: FormEvent<HTMLFormElement>,
    productId: string
  ) => Promise<void>;

  notifyLoading: boolean;
}) {
  const discount =
    getDiscountPercentage(
      product
    );

  return (
    <article
      className={`shop-card ${
        featured
          ? "featured"
          : ""
      }`}
      onClick={
        onOpen
      }
      onKeyDown={(
        event
      ) => {
        if (
          event.key ===
            "Enter" ||
          event.key ===
            " "
        ) {
          event.preventDefault();

          onOpen();
        }
      }}
      role="link"
      tabIndex={0}
      style={{
        animationDelay: `${Math.min(
          index * 60,
          360
        )}ms`,
      }}
    >
      {discount > 0 &&
      product.status ===
        "available" ? (
        <span className="discount-chip">
          {discount}% OFF
        </span>
      ) : null}

      <div className="badge">
        {product.status ===
        "available"
          ? product.badge ||
            "Available"
          : "Coming Soon"}
      </div>

      <ProductVisual
        label={
          product.name
        }
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
          product={
            product
          }
        />
      ) : (
        <strong className="price">
          Coming Soon
        </strong>
      )}

      <button
        type="button"
        className="button secondary card-details-link"
        onClick={(
          event
        ) => {
          event.stopPropagation();

          onOpen();
        }}
      >
        View Product
      </button>

      {product.status ===
      "available" ? (
        <div className="button-row">
          <button
            type="button"
            className="button secondary"
            onClick={(
              event
            ) => {
              /*
               * IMPORTANT:
               * Don't open product page.
               */

              event.stopPropagation();

              onAdd();
            }}
          >
            <ShoppingCart
              size={18}
            />

            Add to Cart
          </button>

          <div
            onClick={(
              event
            ) => {
              /*
               * IMPORTANT:
               * Buy Now should checkout,
               * not open product page.
               */

              event.stopPropagation();
            }}
            onKeyDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <CheckoutButton
              product={
                product
              }
              label="Buy Now"
            />
          </div>
        </div>
      ) : (
        <form
          className="notify-form"
          onClick={(
            event
          ) =>
            event.stopPropagation()
          }
          onSubmit={(
            event
          ) =>
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
  );
}

function ProductPrice({
  product,
  align = "center",
}: {
  product: Product;

  align?:
    | "center"
    | "flex-start";
}) {
  const saving =
    product.originalPrice >
    product.price
      ? product.originalPrice -
        product.price
      : 0;

  return (
    <div
      style={{
        display: "flex",

        flexDirection:
          "column",

        alignItems:
          align,

        justifyContent:
          "center",

        gap: 4,

        margin:
          "18px 0",

        textAlign:
          align ===
          "center"
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

            fontSize:
              "1rem",

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

          fontSize:
            "1.65rem",

          fontWeight:
            900,
        }}
      >
        {formatCurrency(
          product.price
        )}
      </strong>

      {saving > 0 ? (
        <span className="price-saving">
          You save{" "}
          {formatCurrency(
            saving
          )}
        </span>
      ) : null}
    </div>
  );
}

function getDiscountPercentage(
  product: Product
) {
  if (
    product.price <= 0 ||
    product.originalPrice <=
      product.price
  ) {
    return 0;
  }

  return Math.round(
    ((product.originalPrice -
      product.price) /
      product.originalPrice) *
      100
  );
}