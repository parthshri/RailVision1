"use client";

import { X } from "lucide-react";

import type {
  AffiliateCommissionStatus,
  OrderStatus,
  PaymentStatus,
} from "@/lib/firestoreActions";

import { formatCurrency } from "@/lib/products";

import type {
  AdminOrder,
} from "@/components/admin/types";

type OrderDetailsProps = {
  order: AdminOrder;
  onClose: () => void;
};

export function OrderDetails({
  order,
  onClose,
}: OrderDetailsProps) {
  const address = [
    order.shippingAddress?.house,
    order.shippingAddress?.street,
    order.shippingAddress?.area,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.pinCode,
    order.shippingAddress?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="section">
      <div
        className="panel"
        style={{
          position: "relative",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          className="icon-link"
          aria-label="Close order details"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <X size={18} />
        </button>

        <h2>Order Details</h2>

        <p>
          <strong>Order ID:</strong>{" "}
          {order.id}
        </p>

        <hr />

        <h3>Customer Details</h3>

        <p>
          <strong>Name:</strong>{" "}
          {order.customerInfo?.fullName ||
            "-"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {order.customerInfo?.email ||
            "-"}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {order.customerInfo?.phone ||
            "-"}
        </p>

        {order.customerInfo
          ?.alternatePhone ? (
          <p>
            <strong>
              Alternate phone:
            </strong>{" "}
            {
              order.customerInfo
                .alternatePhone
            }
          </p>
        ) : null}

        <hr />

        <h3>Shipping Address</h3>

        <p>{address || "-"}</p>

        <hr />

        <h3>Products</h3>

        {order.products?.length ? (
          order.products.map(
            (product, index) => (
              <div
                key={
                  product.productId ||
                  `${product.name}-${index}`
                }
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 16,
                  marginBottom: 12,
                }}
              >
                <span>
                  {product.name} ×{" "}
                  {product.quantity}
                </span>

                <strong>
                  {formatCurrency(
                    product.price *
                      product.quantity
                  )}
                </strong>
              </div>
            )
          )
        ) : (
          <p>
            No product details found.
          </p>
        )}

        <hr />

        <h3>Payment Details</h3>

        <p>
          <strong>Method:</strong>{" "}
          {formatPaymentMethod(
            order.paymentMethod
          )}
        </p>

        <p>
          <strong>
            Payment status:
          </strong>{" "}
          {formatPaymentStatus(
            order.paymentStatus
          )}
        </p>

        {order.transactionReference ? (
          <p>
            <strong>
              UTR / Transaction ID:
            </strong>{" "}
            {order.transactionReference}
          </p>
        ) : null}

        <p>
          <strong>Order status:</strong>{" "}
          {formatOrderStatus(
            order.orderStatus
          )}
        </p>

        {order.affiliateCode ? (
          <>
            <hr />

            <h3>Affiliate Details</h3>

            <p>
              <strong>Code:</strong>{" "}
              {order.affiliateCode}
            </p>

            <p>
              <strong>Creator:</strong>{" "}
              {order.affiliateName || "-"}
            </p>

            <p>
              <strong>Commission:</strong>{" "}
              {formatCurrency(
                Number(
                  order.affiliateCommission ||
                    0
                )
              )}
            </p>

            <p>
              <strong>
                Commission status:
              </strong>{" "}
              {formatAffiliateStatus(
                order.affiliateStatus
              )}
            </p>
          </>
        ) : null}

        <h3>
          Total:{" "}
          {formatCurrency(
            Number(order.total || 0)
          )}
        </h3>

        <button
          type="button"
          className="button secondary"
          onClick={onClose}
          style={{
            marginTop: 18,
          }}
        >
          Close
        </button>
      </div>
    </section>
  );
}

function formatPaymentMethod(
  method: AdminOrder["paymentMethod"]
) {
  if (method === "UPI_MANUAL") {
    return "UPI — Manual Verification";
  }

  if (method === "COD") {
    return "Cash on Delivery";
  }

  if (method === "ONLINE") {
    return "Online Payment";
  }

  return "-";
}

function formatPaymentStatus(
  status: PaymentStatus | undefined
) {
  if (
    status === "AWAITING_VERIFICATION"
  ) {
    return "Awaiting Verification";
  }

  if (status === "PAID") {
    return "Verified — Paid";
  }

  if (status === "FAILED") {
    return "Failed / Not Received";
  }

  return "Pending";
}

function formatOrderStatus(
  status: OrderStatus | undefined
) {
  if (status === "PROCESSING") {
    return "Processing";
  }

  if (status === "SHIPPED") {
    return "Shipped";
  }

  if (status === "DELIVERED") {
    return "Delivered";
  }

  if (status === "CANCELLED") {
    return "Cancelled";
  }

  return "Placed";
}

function formatAffiliateStatus(
  status:
    | AffiliateCommissionStatus
    | undefined
) {
  if (status === "APPROVED") {
    return "Approved";
  }

  if (status === "PAID") {
    return "Paid";
  }

  if (status === "REJECTED") {
    return "Rejected";
  }

  return "Pending";
}