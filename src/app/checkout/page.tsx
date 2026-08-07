"use client";

import Link from "next/link";
import {
  useEffect,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  useCheckout,
} from "@/contexts/CheckoutContext";

import {
  useCart,
} from "@/contexts/CartContext";

import CustomerStep from "@/components/checkout/CustomerStep";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";

import {
  getProduct,
} from "@/lib/products";

export default function CheckoutPage() {
  const searchParams =
    useSearchParams();

  const cart =
    useCart();

  const reorder =
    searchParams.get("reorder") ===
    "1";

  const productId =
    searchParams.get(
      "product"
    );

  const directProduct =
    productId
      ? getProduct(
          productId
        )
      : null;

  const {
    checkoutStep,
  } = useCheckout();

  useEffect(() => {
    if (
      !reorder ||
      typeof window ===
        "undefined"
    ) {
      return;
    }

    const raw =
      sessionStorage.getItem(
        "railvisionReorder"
      );

    if (!raw) {
      return;
    }

    try {
      const items =
        JSON.parse(raw);

      cart.clearCart();

      items.forEach(
        (
          item: {
            productId: string;
            quantity: number;
          }
        ) => {
          const product =
            getProduct(
              item.productId
            );

          if (!product) {
            return;
          }

          cart.addItem(
            product,
            item.quantity
          );
        }
      );

      sessionStorage.removeItem(
        "railvisionReorder"
      );
    } catch {
      sessionStorage.removeItem(
        "railvisionReorder"
      );
    }
  }, [reorder]);

  return (
    <section className="section">
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <span className="eyebrow">
            Secure Checkout
          </span>

          <h1
            style={{
              marginTop: 8,
            }}
          >
            Complete Your Order
          </h1>

          <p
            style={{
              color:
                "var(--muted)",
              maxWidth: 650,
            }}
          >
            Enter your details,
            delivery address and
            preferred payment
            method to place your
            RailVision order.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            gap: 12,
            margin:
              "30px 0",
            flexWrap:
              "wrap",
          }}
        >
          <StepIndicator
            number={1}
            label="Customer"
            active={
              checkoutStep ===
              1
            }
            complete={
              checkoutStep >
              1
            }
          />

          <StepIndicator
            number={2}
            label="Address"
            active={
              checkoutStep ===
              2
            }
            complete={
              checkoutStep >
              2
            }
          />

          <StepIndicator
            number={3}
            label="Payment"
            active={
              checkoutStep ===
              3
            }
            complete={false}
          />
        </div>

        <div
          style={{
            maxWidth: 900,
            margin: "auto",
            padding: 24,
            border:
              "1px solid var(--line)",
            borderRadius:
              18,
            background:
              "rgba(255,255,255,.025)",
          }}
        >
          {checkoutStep ===
            1 && (
            <CustomerStep />
          )}

          {checkoutStep ===
            2 && (
            <AddressStep />
          )}

          {checkoutStep ===
            3 && (
            <PaymentStep
              directProduct={
                directProduct
              }
            />
          )}
        </div>

        <div
          style={{
            marginTop: 20,
            textAlign:
              "center",
            color:
              "var(--muted)",
            fontSize:
              ".85rem",
          }}
        >
          Secure checkout •
          UPI and Cash on
          Delivery where
          available
        </div>
      </div>
    </section>
  );
}

function StepIndicator({
  number,
  label,
  active,
  complete,
}: {
  number: number;
  label: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems:
          "center",
        gap: 8,
        padding:
          "10px 16px",
        border: active
          ? "1px solid var(--cyan)"
          : complete
          ? "1px solid var(--green)"
          : "1px solid var(--line)",
        borderRadius:
          999,
        background: active
          ? "rgba(85,230,255,.12)"
          : complete
          ? "rgba(82,217,150,.08)"
          : "rgba(255,255,255,.03)",
        color: active
          ? "var(--cyan)"
          : complete
          ? "var(--green)"
          : "var(--muted)",
        fontWeight: 800,
      }}
    >
      {complete
        ? "✓"
        : number}
      . {label}
    </div>
  );
}