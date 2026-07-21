"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

import {
  Banknote,
  Copy,
  QrCode,
} from "lucide-react";

import {
  getAffiliateCode,
  removeAffiliateCode,
} from "@/lib/affiliateTracking";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCheckout } from "@/contexts/CheckoutContext";

import {
  createOrder,
  getValidAffiliate,
} from "@/lib/firestoreActions";

import {
  formatCurrency,
  getProduct,
  Product,
} from "@/lib/products";

type PaymentStepProps = {
  directProduct?: Product | null;
};

type CheckoutItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

const COD_CHARGE = 100;
const DISPLAY_DISCOUNT = 200;

export default function PaymentStep({
  directProduct,
}: PaymentStepProps) {
  const {
    customerInfo,
    shippingAddress,
    paymentMethod,
    setPaymentMethod,
    setCheckoutStep,
  } = useCheckout();

  const { user } = useAuth();
  const cart = useCart();
  const router = useRouter();

  const [
    transactionReference,
    setTransactionReference,
  ] = useState("");

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);

  const upiId =
    process.env.NEXT_PUBLIC_UPI_ID || "";

  const upiName =
    process.env.NEXT_PUBLIC_UPI_NAME ||
    "RailVision";

  const orderItems =
    useMemo<CheckoutItem[]>(() => {
      if (directProduct) {
        return [
          {
            productId: directProduct.id,
            name: directProduct.name,
            quantity: 1,
            price: directProduct.price,
          },
        ];
      }

      return cart.items
        .map((item) => {
          const product = getProduct(
            item.productId
          );

          if (!product) {
            return null;
          }

          return {
            productId: product.id,
            name: product.name,
            quantity: item.quantity,
            price: product.price,
          };
        })
        .filter(
          (
            item
          ): item is CheckoutItem =>
            item !== null
        );
    }, [cart.items, directProduct]);

  const productTotal = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) =>
          sum +
          item.price * item.quantity,
        0
      ),
    [orderItems]
  );

  const codAllowed = useMemo(() => {
    if (directProduct) {
      return (
        directProduct.codAvailable !==
        false
      );
    }

    return cart.items.every((item) => {
      const product = getProduct(
        item.productId
      );

      return (
        product?.codAvailable !== false
      );
    });
  }, [cart.items, directProduct]);

  useEffect(() => {
    if (
      !codAllowed &&
      paymentMethod === "COD"
    ) {
      setPaymentMethod("");
    }
  }, [
    codAllowed,
    paymentMethod,
    setPaymentMethod,
  ]);

  const codCharge =
    paymentMethod === "COD"
      ? COD_CHARGE
      : 0;

  const payableTotal =
    productTotal + codCharge;

  const upiAmount = productTotal;

  const orderReference = useMemo(
    () =>
      `RV${Date.now()
        .toString()
        .slice(-10)}`,
    []
  );

  const upiLink =
    upiId && upiAmount > 0
      ? [
          "upi://pay",
          `?pa=${encodeURIComponent(
            upiId
          )}`,
          `&pn=${encodeURIComponent(
            upiName
          )}`,
          `&am=${upiAmount.toFixed(2)}`,
          "&cu=INR",
          `&tr=${encodeURIComponent(
            orderReference
          )}`,
          `&tn=${encodeURIComponent(
            `RailVision order ${orderReference}`
          )}`,
        ].join("")
      : "";

  async function copyUpiId() {
    if (!upiId) {
      toast.error(
        "UPI ID is not configured."
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        upiId
      );

      toast.success("UPI ID copied.");
    } catch {
      toast.error(
        "Could not copy the UPI ID."
      );
    }
  }

  function validateUpiReference() {
    const reference =
      transactionReference.trim();

    if (!reference) {
      toast.error(
        "Enter your UPI transaction ID or UTR."
      );
      return false;
    }

    if (
      reference.length < 8 ||
      reference.length > 50
    ) {
      toast.error(
        "Enter a valid transaction reference."
      );
      return false;
    }

    if (
      !/^[a-zA-Z0-9_-]+$/.test(
        reference
      )
    ) {
      toast.error(
        "The reference can only contain letters, numbers, hyphens, or underscores."
      );
      return false;
    }

    return true;
  }

  async function placeOrder() {
    if (!user) {
      toast.error(
        "Please login before placing an order."
      );

      router.push("/auth");
      return;
    }

    if (!paymentMethod) {
      toast.error(
        "Select a payment method."
      );
      return;
    }

    if (
      paymentMethod === "COD" &&
      !codAllowed
    ) {
      toast.error(
        "Cash on Delivery is unavailable for this order."
      );
      return;
    }

    if (
      orderItems.length === 0 ||
      productTotal <= 0
    ) {
      toast.error(
        "Your order does not contain any valid products."
      );
      return;
    }

    if (
      paymentMethod === "UPI_MANUAL" &&
      !validateUpiReference()
    ) {
      return;
    }

    setPlacingOrder(true);

    try {
      const savedAffiliateCode =
        getAffiliateCode();

      const validAffiliate =
        savedAffiliateCode
          ? await getValidAffiliate(
              savedAffiliateCode
            )
          : null;

      const affiliateCommission =
        validAffiliate
          ? Math.round(
              (productTotal *
                validAffiliate.commissionRate) /
                100
            )
          : 0;

      const affiliateData =
        validAffiliate
          ? {
              affiliateCode:
                validAffiliate.code,

              affiliateName:
                validAffiliate.name,

              affiliateCommission,

              affiliateStatus:
                "PENDING" as const,
            }
          : {};

      const baseOrder = {
        userId: user.uid,

        customerInfo,

        shippingAddress,

        products: orderItems,

        total: payableTotal,

        paymentStatus:
          paymentMethod ===
          "UPI_MANUAL"
            ? ("AWAITING_VERIFICATION" as const)
            : ("PENDING" as const),

        orderStatus:
          "PLACED" as const,

        ...affiliateData,
      };

      const orderDocument =
        paymentMethod === "UPI_MANUAL"
          ? await createOrder({
              ...baseOrder,

              paymentMethod:
                "UPI_MANUAL",

              transactionReference:
                transactionReference.trim(),
            })
          : await createOrder({
              ...baseOrder,

              paymentMethod: "COD",
            });

      if (
        savedAffiliateCode &&
        !validAffiliate
      ) {
        removeAffiliateCode();
      }

      const successQuery =
        new URLSearchParams({
          method: paymentMethod,
          orderId: orderDocument.id,
        });

      if (
        paymentMethod ===
        "UPI_MANUAL"
      ) {
        toast.success(
          "Order submitted for payment verification."
        );
      } else {
        toast.success(
          "Cash on Delivery order placed successfully."
        );
      }

      router.push(
        `/order-success?${successQuery.toString()}`
      );
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      toast.error(
        "Could not place your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <div className="panel">
      <h2>
        Payment & Order Summary
      </h2>

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <h3>Customer Details</h3>

        <p>
          <strong>Name:</strong>{" "}
          {customerInfo.fullName}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {customerInfo.email}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {customerInfo.phone}
        </p>

        {customerInfo.alternatePhone ? (
          <p>
            <strong>
              Alternate phone:
            </strong>{" "}
            {
              customerInfo.alternatePhone
            }
          </p>
        ) : null}

        <h3
          style={{
            marginTop: 20,
          }}
        >
          Shipping Address
        </h3>

        <p>
          {[
            shippingAddress.house,
            shippingAddress.street,
            shippingAddress.area,
            shippingAddress.city,
            shippingAddress.state,
            shippingAddress.pinCode,
            shippingAddress.country,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      </div>

      <hr />

      <h3>Products</h3>

      <div
        style={{
          display: "grid",
          gap: 14,
        }}
      >
        {orderItems.map((item) => {
          const finalPrice =
            item.price *
            item.quantity;

          const crossedPrice =
            (item.price +
              DISPLAY_DISCOUNT) *
            item.quantity;

          return (
            <div
              key={item.productId}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(0, 1fr) auto",
                alignItems: "center",
                gap: 16,
                padding: 14,
                border:
                  "1px solid var(--line)",
                borderRadius: 8,
                background:
                  "rgba(255,255,255,0.025)",
              }}
            >
              <div>
                <strong>
                  {item.name}
                </strong>

                <small
                  style={{
                    display: "block",
                    marginTop: 5,
                    color:
                      "var(--muted)",
                  }}
                >
                  Quantity:{" "}
                  {item.quantity}
                </small>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color:
                      "var(--muted)",
                    textDecoration:
                      "line-through",
                    fontSize:
                      "0.9rem",
                  }}
                >
                  {formatCurrency(
                    crossedPrice
                  )}
                </span>

                <strong
                  style={{
                    color:
                      "var(--green)",
                    fontSize:
                      "1.25rem",
                  }}
                >
                  {formatCurrency(
                    finalPrice
                  )}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 18,
          border:
            "1px solid var(--line)",
          borderRadius: 8,
          background:
            "rgba(255,255,255,0.025)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 16,
            marginBottom: 10,
          }}
        >
          <span>Products total</span>

          <strong>
            {formatCurrency(
              productTotal
            )}
          </strong>
        </div>

        {paymentMethod === "COD" ? (
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: 16,
              marginBottom: 12,
              color:
                "var(--amber)",
            }}
          >
            <span>
              Cash on Delivery charge
            </span>

            <strong>
              +{" "}
              {formatCurrency(
                COD_CHARGE
              )}
            </strong>
          </div>
        ) : null}

        <hr />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 16,
            marginTop: 14,
          }}
        >
          <strong>
            Final amount
          </strong>

          <strong
            style={{
              color: "var(--green)",
              fontSize: "1.65rem",
              textAlign: "center",
            }}
          >
            {formatCurrency(
              payableTotal
            )}
          </strong>
        </div>
      </div>

      <h3
        style={{
          marginTop: 28,
        }}
      >
        Select Payment Method
      </h3>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          padding: 16,
          border:
            paymentMethod === "COD"
              ? "1px solid var(--cyan)"
              : "1px solid var(--line)",
          borderRadius: 8,
          background:
            paymentMethod === "COD"
              ? "rgba(85,230,255,0.06)"
              : "rgba(255,255,255,0.02)",
          cursor: codAllowed
            ? "pointer"
            : "not-allowed",
          opacity: codAllowed
            ? 1
            : 0.65,
        }}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={
            paymentMethod === "COD"
          }
          disabled={!codAllowed}
          onChange={() => {
            if (codAllowed) {
              setPaymentMethod("COD");
            }
          }}
          style={{
            width: 20,
            minHeight: 20,
          }}
        />

        <span>
          <strong
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Banknote size={19} />
            Cash on Delivery
          </strong>

          <small
            style={{
              display: "block",
              marginTop: 5,
              color: "var(--muted)",
            }}
          >
            Pay when the order is
            delivered.
          </small>
        </span>
      </label>

      {!codAllowed ? (
        <div
          style={{
            marginBottom: 16,
            padding: 15,
            border:
              "1px solid rgba(246,184,75,0.35)",
            borderRadius: 8,
            background:
              "rgba(246,184,75,0.07)",
          }}
        >
          <strong
            style={{
              color: "var(--amber)",
            }}
          >
            Cash on Delivery is
            unavailable for this order.
          </strong>

          <p
            style={{
              marginTop: 7,
              marginBottom: 0,
            }}
          >
            This order contains a
            high-value or made-to-order
            product. Advance payment is
            required before purchasing
            raw materials and preparing
            the product.
          </p>
        </div>
      ) : null}

      {paymentMethod === "COD" ? (
        <div
          style={{
            marginBottom: 16,
            padding: 15,
            border:
              "1px solid rgba(246,184,75,0.35)",
            borderRadius: 8,
            background:
              "rgba(246,184,75,0.07)",
          }}
        >
          <strong
            style={{
              color: "var(--amber)",
            }}
          >
            ₹100 Cash on Delivery
            charge applies.
          </strong>

          <p
            style={{
              marginTop: 7,
              marginBottom: 0,
            }}
          >
            Pay through UPI to avoid
            the additional COD handling
            charge.
          </p>
        </div>
      ) : null}

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 16,
          border:
            paymentMethod ===
            "UPI_MANUAL"
              ? "1px solid var(--cyan)"
              : "1px solid var(--line)",
          borderRadius: 8,
          background:
            paymentMethod ===
            "UPI_MANUAL"
              ? "rgba(85,230,255,0.06)"
              : "rgba(255,255,255,0.02)",
          cursor: "pointer",
        }}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={
            paymentMethod ===
            "UPI_MANUAL"
          }
          onChange={() =>
            setPaymentMethod(
              "UPI_MANUAL"
            )
          }
          style={{
            width: 20,
            minHeight: 20,
          }}
        />

        <span>
          <strong
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <QrCode size={19} />
            UPI Payment
          </strong>

          <small
            style={{
              display: "block",
              marginTop: 5,
              color: "var(--muted)",
            }}
          >
            No additional payment
            handling charge.
          </small>
        </span>
      </label>

      {paymentMethod ===
      "UPI_MANUAL" ? (
        <div
          className="panel"
          style={{
            marginTop: 20,
            boxShadow: "none",
          }}
        >
          <h3>Scan and pay</h3>

          <p>
            Pay exactly{" "}
            <strong
              style={{
                color: "var(--green)",
              }}
            >
              {formatCurrency(
                upiAmount
              )}
            </strong>
            .
          </p>

          {upiLink ? (
            <div
              style={{
                width:
                  "min(280px, 100%)",
                margin: "20px auto",
                padding: 16,
                borderRadius: 8,
                background: "#ffffff",
              }}
            >
              <QRCodeSVG
                value={upiLink}
                size={248}
                level="M"
                includeMargin
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          ) : (
            <p
              style={{
                color: "var(--rose)",
              }}
            >
              UPI payment is not
              configured yet.
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              flexWrap: "wrap",
              gap: 12,
              padding: 14,
              border:
                "1px solid var(--line)",
              borderRadius: 8,
            }}
          >
            <div>
              <small
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                UPI ID
              </small>

              <strong
                style={{
                  display: "block",
                  marginTop: 4,
                }}
              >
                {upiId ||
                  "Not configured"}
              </strong>
            </div>

            <button
              type="button"
              className="button secondary"
              onClick={copyUpiId}
              disabled={!upiId}
            >
              <Copy size={17} />
              Copy
            </button>
          </div>

          {upiLink ? (
            <a
              href={upiLink}
              className="button primary"
              style={{
                width: "100%",
                marginTop: 14,
              }}
            >
              Open UPI App
            </a>
          ) : null}

          <label
            style={{
              marginTop: 20,
            }}
          >
            Payment transaction ID /
            UTR

            <input
              type="text"
              value={
                transactionReference
              }
              onChange={(event) =>
                setTransactionReference(
                  event.target.value
                )
              }
              placeholder="Enter UPI transaction ID"
              maxLength={50}
              autoComplete="off"
            />
          </label>

          <div
            style={{
              marginTop: 16,
              padding: 16,
              border:
                "1px solid rgba(246,184,75,0.35)",
              borderRadius: 8,
              background:
                "rgba(246,184,75,0.07)",
            }}
          >
            <strong
              style={{
                color: "var(--amber)",
              }}
            >
              Verification may take up
              to 12 hours.
            </strong>

            <p
              style={{
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              Your order will be
              processed only after the
              complete payment is
              confirmed in the receiving
              account. Entering a
              transaction ID does not
              automatically confirm
              payment.
            </p>
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 28,
        }}
      >
        <button
          type="button"
          className="button secondary"
          onClick={() =>
            setCheckoutStep(2)
          }
          disabled={placingOrder}
        >
          Back
        </button>

        <button
          type="button"
          className="button primary"
          onClick={placeOrder}
          disabled={
            placingOrder ||
            !paymentMethod ||
            productTotal <= 0 ||
            (paymentMethod ===
              "UPI_MANUAL" &&
              !upiId) ||
            (paymentMethod === "COD" &&
              !codAllowed)
          }
        >
          {placingOrder
            ? "Placing Order..."
            : paymentMethod ===
                "UPI_MANUAL"
              ? "Submit Payment Details"
              : "Place COD Order"}
        </button>
      </div>
    </div>
  );
}