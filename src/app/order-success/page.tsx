"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Instagram,
  Mail,
  MessageCircle,
} from "lucide-react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const method =
    searchParams.get("method");

  const orderId =
    searchParams.get("orderId");

  const instagramId =
    process.env
      .NEXT_PUBLIC_SUPPORT_INSTAGRAM ||
    "";

  const supportEmail =
    process.env
      .NEXT_PUBLIC_SUPPORT_EMAIL ||
    "";

  const isUpi =
    method === "UPI_MANUAL";

  return (
    <section className="section">
      <div
        className="panel"
        style={{
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <CheckCircle2
          size={52}
          style={{
            color: "var(--green)",
          }}
        />

        <h1
          style={{
            marginTop: 20,
            fontSize:
              "clamp(2rem, 5vw, 4rem)",
          }}
        >
          {isUpi
            ? "Payment submitted for verification"
            : "COD order placed successfully"}
        </h1>

        {orderId ? (
          <p>
            <strong>Order ID:</strong>{" "}
            {orderId}
          </p>
        ) : null}

        {isUpi ? (
          <>
            <p>
              We have received your order
              and payment reference. Your
              payment will be checked
              manually.
            </p>

            <div
              style={{
                marginTop: 20,
                padding: 18,
                border:
                  "1px solid rgba(246, 184, 75, 0.35)",
                borderRadius: 8,
                background:
                  "rgba(246, 184, 75, 0.07)",
              }}
            >
              <strong
                style={{
                  color: "var(--amber)",
                }}
              >
                Verification may take up to
                12 hours.
              </strong>

              <p
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                The order will move to
                processing after the complete
                payment is confirmed.
              </p>
            </div>
          </>
        ) : (
          <p>
            Your Cash on Delivery order has
            been received. Contact support if
            you need to correct your phone
            number or delivery address.
          </p>
        )}

        <hr
          style={{
            margin: "28px 0",
            borderColor: "var(--line)",
          }}
        />

        <h2>Need help?</h2>

        <p>
          Contact RailVision Support and
          mention your order ID.
        </p>

        <div className="button-row">
          {instagramId ? (
            <a
              href={`https://instagram.com/${instagramId.replace(
                "@",
                ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              <Instagram size={18} />
              {instagramId}
            </a>
          ) : null}

          {supportEmail ? (
            <a
              href={`mailto:${supportEmail}?subject=${encodeURIComponent(
                `RailVision order support ${
                  orderId || ""
                }`
              )}`}
              className="button secondary"
            >
              <Mail size={18} />
              Email Support
            </a>
          ) : null}

          <Link
            href="/contact"
            className="button primary"
          >
            <MessageCircle size={18} />
            Contact Page
          </Link>
        </div>

        <div
          className="button-row"
          style={{
            marginTop: 24,
          }}
        >
          <Link
            href="/profile"
            className="button secondary"
          >
            View My Orders
          </Link>

          <Link
            href="/shop"
            className="button secondary"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}