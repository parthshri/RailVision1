"use client";

import type {
  AffiliateCommissionStatus,
  OrderStatus,
  PaymentStatus,
} from "@/lib/firestoreActions";

import { formatCurrency } from "@/lib/products";

import type {
  AdminOrder,
} from "@/components/admin/types";

type OrderAdminListProps = {
  orders: AdminOrder[];

  onStatusChange: (
    orderId: string,
    status: OrderStatus
  ) => Promise<void>;

  onPaymentStatusChange: (
    orderId: string,
    status: PaymentStatus
  ) => Promise<void>;

  onAffiliateStatusChange: (
    orderId: string,
    status: AffiliateCommissionStatus
  ) => Promise<void>;

  onSelectOrder: (
    order: AdminOrder
  ) => void;

  updatingOrderStatusId:
    | string
    | null;

  updatingPaymentStatusId:
    | string
    | null;

  updatingAffiliateOrderId:
    | string
    | null;
};

export function OrderAdminList({
  orders,
  onStatusChange,
  onPaymentStatusChange,
  onAffiliateStatusChange,
  onSelectOrder,
  updatingOrderStatusId,
  updatingPaymentStatusId,
  updatingAffiliateOrderId,
}: OrderAdminListProps) {
  return (
    <article className="admin-list">
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : null}

      {orders.map((order) => {
        const orderUpdating =
          updatingOrderStatusId ===
          order.id;

        const paymentUpdating =
          updatingPaymentStatusId ===
          order.id;

        const affiliateUpdating =
          updatingAffiliateOrderId ===
          order.id;

        return (
          <div
            className="admin-row"
            key={order.id}
            onClick={() =>
              onSelectOrder(order)
            }
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <strong>
              Order #
              {order.id
                .slice(0, 8)
                .toUpperCase()}
            </strong>

            <span>
              Customer:{" "}
              {order.customerInfo?.email ||
                "-"}
            </span>

            <span>
              Total:{" "}
              {formatCurrency(
                Number(order.total || 0)
              )}
            </span>

            <span>
              Payment method:{" "}
              {formatPaymentMethod(
                order.paymentMethod
              )}
            </span>

            {order.transactionReference ? (
              <span>
                UTR / Transaction ID:{" "}
                <strong>
                  {order.transactionReference}
                </strong>
              </span>
            ) : null}

            <label
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              Order status

              <select
                value={
                  order.orderStatus ||
                  "PLACED"
                }
                disabled={orderUpdating}
                onClick={(event) =>
                  event.stopPropagation()
                }
                onChange={(event) =>
                  onStatusChange(
                    order.id,
                    event.target
                      .value as OrderStatus
                  )
                }
              >
                <option value="PLACED">
                  New Order
                </option>

                <option value="PROCESSING">
                  Processing
                </option>

                <option value="SHIPPED">
                  Shipped
                </option>

                <option value="DELIVERED">
                  Delivered
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </label>

            <label
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              Payment verification

              <select
                value={
                  order.paymentStatus ||
                  "PENDING"
                }
                disabled={paymentUpdating}
                onClick={(event) =>
                  event.stopPropagation()
                }
                onChange={(event) =>
                  onPaymentStatusChange(
                    order.id,
                    event.target
                      .value as PaymentStatus
                  )
                }
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="AWAITING_VERIFICATION">
                  Awaiting Verification
                </option>

                <option value="PAID">
                  Verified — Paid
                </option>

                <option value="FAILED">
                  Failed / Not Received
                </option>
              </select>
            </label>

            {order.affiliateCode ? (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  padding: 14,
                  border:
                    "1px solid var(--line)",
                  borderRadius: 8,
                  background:
                    "rgba(255,255,255,0.025)",
                }}
              >
                <span>
                  Affiliate code:{" "}
                  <strong>
                    {order.affiliateCode}
                  </strong>
                </span>

                <span>
                  Creator:{" "}
                  {order.affiliateName ||
                    "-"}
                </span>

                <span>
                  Commission:{" "}
                  <strong>
                    {formatCurrency(
                      Number(
                        order.affiliateCommission ||
                          0
                      )
                    )}
                  </strong>
                </span>

                <label
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  Affiliate commission

                  <select
                    value={
                      order.affiliateStatus ||
                      "PENDING"
                    }
                    disabled={
                      affiliateUpdating
                    }
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                    onChange={(event) =>
                      onAffiliateStatusChange(
                        order.id,
                        event.target
                          .value as AffiliateCommissionStatus
                      )
                    }
                  >
                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="APPROVED">
                      Approved
                    </option>

                    <option value="PAID">
                      Paid
                    </option>

                    <option value="REJECTED">
                      Rejected
                    </option>
                  </select>
                </label>
              </div>
            ) : null}

            {orderUpdating ||
            paymentUpdating ||
            affiliateUpdating ? (
              <small
                style={{
                  color: "var(--muted)",
                }}
              >
                Updating order...
              </small>
            ) : null}
          </div>
        );
      })}
    </article>
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