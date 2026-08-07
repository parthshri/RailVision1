"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Package,
  RefreshCcw,
  Search,
  Truck,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import toast from "react-hot-toast";

import {
  formatCurrency,
} from "@/lib/products";

type TrackedProduct = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type TrackedOrder = {
  id: string;

  orderStatus:
    | "PLACED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  paymentMethod: string;
  paymentStatus: string;

  total: number;

  products: TrackedProduct[];

  estimatedDelivery: string;

  createdAt: string | null;
};

export default function TrackOrderPage() {
  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const [
    orderId,
    setOrderId,
  ] = useState(
    searchParams.get(
      "orderId"
    ) || ""
  );

  const [
    emailOrPhone,
    setEmailOrPhone,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    order,
    setOrder,
  ] =
    useState<TrackedOrder | null>(
      null
    );

  const buyAgain =
    searchParams.get(
      "buyAgain"
    ) === "1";

  async function trackOrder(
    event: FormEvent
  ) {
    event.preventDefault();

    const cleanOrderId =
      orderId.trim();

    const entered =
      emailOrPhone.trim();

    if (!cleanOrderId) {
      toast.error(
        "Enter your Order ID."
      );

      return;
    }

    if (!entered) {
      toast.error(
        "Enter your order email or phone number."
      );

      return;
    }

    setLoading(true);

    try {
      const isEmail =
        entered.includes("@");

      const response =
  await fetch(
    "/api/orders/track",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          orderId:
            cleanOrderId,

          email:
            isEmail
              ? entered.toLowerCase()
              : "",

          phone:
            isEmail
              ? ""
              : entered.replace(
                  /\D/g,
                  ""
                ),
        }),
    }
  
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not find the order."
        );
      }

      setOrder(
        data.order
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not track order."
      );
    } finally {
      setLoading(false);
    }
  }

  function buyAgainNow() {
  if (!order) {
    return;
  }

  if (order.products.length === 0) {
    toast.error(
      "This order does not contain any products."
    );

    return;
  }

  const reorderItems =
    order.products.map(
      (product) => ({
        productId:
          product.productId,

        quantity:
          Math.max(
            1,
            product.quantity
          ),
      })
    );

  sessionStorage.setItem(
    "railvisionReorder",
    JSON.stringify(
      reorderItems
    )
  );

  router.push(
    "/checkout?reorder=1"
  );
}

  return (
    <section className="section">
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <span className="eyebrow">
          Order Tracking
        </span>

        <h1>
          Track Your Order
        </h1>

        <p
          style={{
            color:
              "var(--muted)",
          }}
        >
          Enter your Order ID and
          the email or phone number
          used during checkout.
        </p>

        {!order ? (
          <form
            className="panel"
            onSubmit={
              trackOrder
            }
            style={{
              marginTop: 28,
            }}
          >
            <label>
              Order ID

              <input
                type="text"
                value={
                  orderId
                }
                onChange={(
                  event
                ) =>
                  setOrderId(
                    event.target
                      .value
                  )
                }
                placeholder="Enter Order ID"
                autoComplete="off"
              />
            </label>

            <label>
              Email or Phone
              Number

              <input
                type="text"
                value={
                  emailOrPhone
                }
                onChange={(
                  event
                ) =>
                  setEmailOrPhone(
                    event.target
                      .value
                  )
                }
                placeholder="Email or 10-digit mobile number"
                autoComplete="off"
              />
            </label>

            <button
              type="submit"
              className="button primary"
              style={{
                marginTop: 18,
              }}
              disabled={
                loading
              }
            >
              <Search
                size={18}
              />

              {loading
                ? "Checking..."
                : "Track Order"}
            </button>
          </form>
        ) : (
          <div
            className="panel"
            style={{
              marginTop: 28,
            }}
          >
            <div
              style={{
                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                gap: 16,

                flexWrap:
                  "wrap",
              }}
            >
              <div>
                <small
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  Order ID
                </small>

                <strong
                  style={{
                    display:
                      "block",

                    marginTop: 3,

                    wordBreak:
                      "break-word",
                  }}
                >
                  {order.id}
                </strong>
              </div>

              <strong
                style={{
                  color:
                    order.orderStatus ===
                    "CANCELLED"
                      ? "var(--rose)"
                      : "var(--green)",
                }}
              >
                {formatOrderStatus(
                  order.orderStatus
                )}
              </strong>
            </div>

            <OrderProgress
              status={
                order.orderStatus
              }
            />

            <div
              style={{
                marginTop: 25,

                padding: 17,

                border:
                  "1px solid var(--line)",

                borderRadius: 12,

                background:
                  "rgba(255,255,255,0.025)",
              }}
            >
              <strong>
                Estimated Delivery
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  color:
                    "var(--muted)",
                }}
              >
                {
                  order.estimatedDelivery
                }
              </p>
            </div>

            <div
              style={{
                marginTop: 18,

                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",

                gap: 10,
              }}
            >
              <div
                style={{
                  padding: 14,

                  border:
                    "1px solid var(--line)",

                  borderRadius: 10,
                }}
              >
                <small
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  Payment Method
                </small>

                <strong
                  style={{
                    display:
                      "block",

                    marginTop: 4,
                  }}
                >
                  {formatPaymentMethod(
                    order.paymentMethod
                  )}
                </strong>
              </div>

              <div
                style={{
                  padding: 14,

                  border:
                    "1px solid var(--line)",

                  borderRadius: 10,
                }}
              >
                <small
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  Payment Status
                </small>

                <strong
                  style={{
                    display:
                      "block",

                    marginTop: 4,
                  }}
                >
                  {formatOrderStatus(
                    order.paymentStatus
                  )}
                </strong>
              </div>
            </div>

            <h3
              style={{
                marginTop: 28,
              }}
            >
              Products
            </h3>

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {order.products.map(
                (
                  product
                ) => (
                  <div
                    key={
                      product.productId
                    }
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      gap: 16,

                      padding: 14,

                      border:
                        "1px solid var(--line)",

                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <strong>
                        {
                          product.name
                        }
                      </strong>

                      <small
                        style={{
                          display:
                            "block",

                          color:
                            "var(--muted)",

                          marginTop: 4,
                        }}
                      >
                        Qty:{" "}
                        {
                          product.quantity
                        }
                      </small>
                    </div>

                    <strong>
                      {formatCurrency(
                        product.price *
                          product.quantity
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                gap: 20,

                marginTop: 22,

                paddingTop: 18,

                borderTop:
                  "1px solid var(--line)",

                fontSize:
                  "1.15rem",
              }}
            >
              <strong>
                Total
              </strong>

              <strong
                style={{
                  color:
                    "var(--green)",
                }}
              >
                {formatCurrency(
                  order.total
                )}
              </strong>
            </div>

            <div
              className="button-row"
              style={{
                marginTop: 28,
              }}
            >
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setOrder(
                    null
                  );
                }}
              >
                <Search
                  size={18}
                />

                Track Another
              </button>

              <button
                type="button"
                className="button primary"
                onClick={
                  buyAgainNow
                }
                disabled={
                  order.orderStatus ===
                    "CANCELLED" ||
                  order.products
                    .length === 0
                }
              >
                <RefreshCcw
                  size={18}
                />

                Buy Again
              </button>
            </div>

            {buyAgain ? (
              <p
                style={{
                  marginTop: 16,

                  color:
                    "var(--muted)",

                  fontSize:
                    "0.85rem",
                }}
              >
                Verify your order
                above, then select
                Buy Again.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function OrderProgress({
  status,
}: {
  status: string;
}) {
  const steps = [
    {
      value:
        "PLACED",

      label:
        "Placed",

      icon:
        CheckCircle2,
    },

    {
      value:
        "PROCESSING",

      label:
        "Processing",

      icon:
        Clock3,
    },

    {
      value:
        "SHIPPED",

      label:
        "Shipped",

      icon:
        Truck,
    },

    {
      value:
        "DELIVERED",

      label:
        "Delivered",

      icon:
        Package,
    },
  ];

  const statusIndex =
    steps.findIndex(
      (step) =>
        step.value ===
        status
    );

  if (
    status ===
    "CANCELLED"
  ) {
    return (
      <div
        style={{
          marginTop: 25,

          padding: 16,

          border:
            "1px solid rgba(255, 100, 100, 0.3)",

          borderRadius: 12,

          color:
            "var(--rose)",

          background:
            "rgba(255,100,100,0.05)",
        }}
      >
        This order has been
        cancelled.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(4, 1fr)",

        gap: 8,

        marginTop: 28,
      }}
    >
      {steps.map(
        (
          step,
          index
        ) => {
          const Icon =
            step.icon;

          const reached =
            index <=
            statusIndex;

          return (
            <div
              key={
                step.value
              }
              style={{
                padding: 12,

                textAlign:
                  "center",

                border:
                  reached
                    ? "1px solid rgba(82,217,150,.35)"
                    : "1px solid var(--line)",

                borderRadius: 12,

                background:
                  reached
                    ? "rgba(82,217,150,0.05)"
                    : "transparent",

                color:
                  reached
                    ? "var(--green)"
                    : "var(--muted)",
              }}
            >
              <Icon
                size={20}
              />

              <small
                style={{
                  display:
                    "block",

                  marginTop: 5,
                }}
              >
                {
                  step.label
                }
              </small>
            </div>
          );
        }
      )}
    </div>
  );
}

function formatOrderStatus(
  status: string
) {
  return status
    .toLowerCase()
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        character
      ) =>
        character.toUpperCase()
    );
}

function formatPaymentMethod(
  method: string
) {
  if (
    method ===
    "UPI_MANUAL"
  ) {
    return "UPI";
  }

  if (
    method === "COD"
  ) {
    return "Cash on Delivery";
  }

  return method || "—";
}