"use client";

import Link from "next/link";

import {
  useSearchParams,
} from "next/navigation";

import {
  CheckCircle2,
  Clock3,
  Copy,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  Search,
  ShoppingBag,
} from "lucide-react";

import toast from "react-hot-toast";

export default function OrderSuccessPage() {
  const searchParams =
    useSearchParams();

  const method =
    searchParams.get(
      "method"
    );

  const orderId =
    searchParams.get(
      "orderId"
    );

  const instagramId =
    process.env
      .NEXT_PUBLIC_SUPPORT_INSTAGRAM ||
    "";

  const supportEmail =
    process.env
      .NEXT_PUBLIC_SUPPORT_EMAIL ||
    "";

  const isUpi =
    method ===
    "UPI_MANUAL";

  const trackingHref =
    orderId
      ? `/track-order?orderId=${encodeURIComponent(
          orderId
        )}`
      : "/track-order";

  async function copyOrderId() {
    if (!orderId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        orderId
      );

      toast.success(
        "Order ID copied."
      );
    } catch {
      toast.error(
        "Could not copy Order ID."
      );
    }
  }

  return (
    <section className="section">
      <div
        className="panel order-success-card"
        style={{
          maxWidth: 780,
          margin: "0 auto",
        }}
      >
        <div className="success-icon-wrap">
          <CheckCircle2
            size={54}
          />
        </div>

        <span className="eyebrow">
          Order Confirmed
        </span>

        <h1 className="success-heading">
          {isUpi
            ? "Payment submitted for verification"
            : "Order placed successfully"}
        </h1>

        {orderId ? (
          <>
            <div className="order-id-box">
              <div>
                <span>
                  Order ID
                </span>

                <strong>
                  {orderId}
                </strong>
              </div>

              <button
                type="button"
                className="button secondary"
                onClick={
                  copyOrderId
                }
              >
                <Copy
                  size={17}
                />

                Copy
              </button>
            </div>

            <p className="order-id-help">
              Save this Order ID.
              You'll need it along
              with your checkout
              email or phone number
              to track your order.
            </p>
          </>
        ) : null}

        {isUpi ? (
          <>
            <p className="success-description">
              We have received
              your order and UPI
              transaction
              reference. Your
              payment will now be
              verified manually.
            </p>

            <div className="status-notice amber">
              <Clock3
                size={21}
              />

              <div>
                <strong>
                  Payment verification
                  may take up to 12
                  hours.
                </strong>

                <p>
                  Your order will
                  move to processing
                  after the complete
                  payment is
                  confirmed.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="success-description">
              Your Cash on
              Delivery order has
              been received
              successfully.
            </p>

            <div className="status-notice green">
              <PackageCheck
                size={21}
              />

              <div>
                <strong>
                  Your order is now
                  placed.
                </strong>

                <p>
                  Our team will
                  prepare it for
                  dispatch.
                </p>
              </div>
            </div>
          </>
        )}

        <div className="delivery-card">
          <MapPin
            size={23}
          />

          <div>
            <strong>
              Estimated Delivery
            </strong>

            <p>
              To be updated after
              your order is
              reviewed.
            </p>
          </div>
        </div>

        <div className="next-actions">
          <Link
            href={trackingHref}
            className="button primary"
          >
            <Search
              size={18}
            />

            Track Order
          </Link>

          {orderId ? (
            <Link
              href={`/track-order?orderId=${encodeURIComponent(
                orderId
              )}&buyAgain=1`}
              className="button secondary"
            >
              <RefreshCcw
                size={18}
              />

              Buy Again
            </Link>
          ) : null}

          <Link
            href="/shop"
            className="button secondary"
          >
            <ShoppingBag
              size={18}
            />

            Continue Shopping
          </Link>
        </div>

        <hr className="success-divider" />

        <div className="help-section">
          <h2>
            Need help?
          </h2>

          <p>
            Contact RailVision
            Support and mention
            your Order ID.
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
                <Instagram
                  size={18}
                />

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
                <Mail
                  size={18}
                />

                Email Support
              </a>
            ) : null}

            <Link
              href="/contact"
              className="button secondary"
            >
              <MessageCircle
                size={18}
              />

              Contact Page
            </Link>
          </div>
        </div>

        <style jsx global>{`
          .order-success-card {
            text-align: center;
            padding: 34px;
          }

          .success-icon-wrap {
            width: 82px;
            height: 82px;
            margin: 0 auto 20px;

            display: grid;
            place-items: center;

            border-radius: 50%;

            color: var(--green);

            background:
              rgba(
                82,
                217,
                150,
                0.09
              );

            border:
              1px solid
              rgba(
                82,
                217,
                150,
                0.24
              );
          }

          .success-heading {
            margin:
              10px auto 16px;

            max-width:
              680px;

            font-size:
              clamp(
                2rem,
                5vw,
                3.6rem
              );

            line-height:
              1.05;
          }

          .success-description {
            max-width:
              620px;

            margin:
              16px auto 0;

            color:
              var(--muted);

            line-height:
              1.65;
          }

          .order-id-box {
            width:
              min(
                520px,
                100%
              );

            margin:
              24px auto 8px;

            padding:
              14px 18px;

            display: flex;
            align-items: center;
            justify-content:
              space-between;

            gap: 16px;

            border:
              1px solid
              var(--line);

            border-radius:
              12px;

            background:
              rgba(
                255,
                255,
                255,
                0.025
              );

            text-align:
              left;
          }

          .order-id-box
            > div {
            min-width: 0;
          }

          .order-id-box span {
            display: block;

            color:
              var(--muted);

            font-size:
              0.8rem;

            margin-bottom:
              4px;
          }

          .order-id-box strong {
            display: block;

            word-break:
              break-all;
          }

          .order-id-help {
            width:
              min(
                520px,
                100%
              );

            margin:
              0 auto;

            color:
              var(--muted);

            font-size:
              0.83rem;

            line-height:
              1.5;
          }

          .status-notice,
          .delivery-card {
            width:
              min(
                640px,
                100%
              );

            margin:
              22px auto 0;

            padding:
              18px;

            display: flex;
            align-items:
              flex-start;

            gap: 13px;

            border-radius:
              14px;

            text-align:
              left;
          }

          .status-notice.amber {
            border:
              1px solid
              rgba(
                246,
                184,
                75,
                0.35
              );

            background:
              rgba(
                246,
                184,
                75,
                0.07
              );
          }

          .status-notice.amber
            > svg,
          .status-notice.amber
            strong {
            color:
              var(--amber);
          }

          .status-notice.green {
            border:
              1px solid
              rgba(
                82,
                217,
                150,
                0.3
              );

            background:
              rgba(
                82,
                217,
                150,
                0.06
              );
          }

          .status-notice.green
            > svg,
          .status-notice.green
            strong {
            color:
              var(--green);
          }

          .status-notice p,
          .delivery-card p {
            margin:
              6px 0 0;

            color:
              var(--muted);

            line-height:
              1.55;
          }

          .delivery-card {
            border:
              1px solid
              var(--line);

            background:
              rgba(
                255,
                255,
                255,
                0.025
              );
          }

          .delivery-card
            > svg {
            flex-shrink: 0;

            color:
              var(--cyan);
          }

          .next-actions {
            display: flex;
            justify-content:
              center;
            flex-wrap:
              wrap;

            gap: 12px;

            margin-top:
              28px;
          }

          .success-divider {
            margin:
              34px 0;

            border: 0;

            border-top:
              1px solid
              var(--line);
          }

          .help-section p {
            color:
              var(--muted);
          }

          .help-section
            .button-row {
            justify-content:
              center;
          }

          @media (
            max-width:
              650px
          ) {
            .order-success-card {
              padding:
                24px 18px;
            }

            .order-id-box {
              flex-direction:
                column;

              align-items:
                stretch;
            }

            .order-id-box
              .button {
              width: 100%;
            }

            .next-actions {
              flex-direction:
                column;
            }

            .next-actions
              > * {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </section>
  );
}