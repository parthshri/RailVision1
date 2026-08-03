"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

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

type OrderSortOption =
  | "newest"
  | "oldest"
  | "total-high"
  | "total-low"
  | "pending-first"
  | "delivered-first";

const INITIAL_VISIBLE_COUNT = 8;

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
  const [showAll, setShowAll] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortBy, setSortBy] =
    useState<OrderSortOption>(
      "newest"
    );

  const filteredOrders =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const filtered =
        orders.filter((order) => {
          if (!search) {
            return true;
          }

          const productNames =
            order.products
              ?.map(
                (product) =>
                  product.name
              )
              .join(" ") || "";

          const searchableText = [
            order.id,
            order.customerInfo
              ?.fullName,
            order.customerInfo
              ?.email,
            order.customerInfo?.phone,
            order.orderStatus,
            order.paymentStatus,
            order.paymentMethod,
            order.transactionReference,
            order.affiliateCode,
            order.affiliateName,
            productNames,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            search
          );
        });

      return [...filtered].sort(
        (first, second) => {
          const firstTime =
            getTimestamp(
              first.createdAt
            );

          const secondTime =
            getTimestamp(
              second.createdAt
            );

          const firstTotal =
            Number(
              first.total || 0
            );

          const secondTotal =
            Number(
              second.total || 0
            );

          if (
            sortBy === "oldest"
          ) {
            return (
              firstTime - secondTime
            );
          }

          if (
            sortBy ===
            "total-high"
          ) {
            return (
              secondTotal - firstTotal
            );
          }

          if (
            sortBy ===
            "total-low"
          ) {
            return (
              firstTotal - secondTotal
            );
          }

          if (
            sortBy ===
            "pending-first"
          ) {
            return (
              getOrderStatusPriority(
                first,
                "PENDING"
              ) -
              getOrderStatusPriority(
                second,
                "PENDING"
              )
            );
          }

          if (
            sortBy ===
            "delivered-first"
          ) {
            return (
              getOrderStatusPriority(
                first,
                "DELIVERED"
              ) -
              getOrderStatusPriority(
                second,
                "DELIVERED"
              )
            );
          }

          return (
            secondTime - firstTime
          );
        }
      );
    }, [
      orders,
      searchTerm,
      sortBy,
    ]);

  const displayedOrders =
    showAll
      ? filteredOrders
      : filteredOrders.slice(
          0,
          INITIAL_VISIBLE_COUNT
        );

  useEffect(() => {
    setShowAll(false);
  }, [searchTerm, sortBy]);

  return (
    <article className="admin-list">
      <div>
        <h2
          style={{
            marginBottom: 4,
          }}
        >
          Orders
        </h2>

        <small
          style={{
            color: "var(--muted)",
          }}
        >
          {filteredOrders.length} of{" "}
          {orders.length} orders
        </small>
      </div>

      {orders.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) minmax(180px, 240px)",
            gap: 12,
            marginTop: 18,
            marginBottom: 18,
          }}
        >
          <label
            style={{
              position: "relative",
            }}
          >
            <span
              style={{
                position:
                  "absolute",
                left: 13,
                top: "50%",
                transform:
                  "translateY(-50%)",
                display: "grid",
                color:
                  "var(--muted)",
                pointerEvents:
                  "none",
              }}
            >
              <Search size={17} />
            </span>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search order, customer or affiliate"
              style={{
                paddingLeft: 40,
              }}
            />
          </label>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target
                  .value as OrderSortOption
              )
            }
            aria-label="Sort orders"
          >
            <option value="newest">
              Newest first
            </option>

            <option value="oldest">
              Oldest first
            </option>

            <option value="total-high">
              Highest total
            </option>

            <option value="total-low">
              Lowest total
            </option>

            <option value="pending-first">
              Pending first
            </option>

            <option value="delivered-first">
              Delivered first
            </option>
          </select>
        </div>
      ) : null}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : null}

      {orders.length > 0 &&
      filteredOrders.length === 0 ? (
        <p>
          No orders match your search.
        </p>
      ) : null}

      {displayedOrders.map(
        (order) => {
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
                flexDirection:
                  "column",
                alignItems:
                  "stretch",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <strong>
                  Order #
                  {order.id
                    .slice(0, 8)
                    .toUpperCase()}
                </strong>

                <small
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  {formatDate(
                    order.createdAt
                  )}
                </small>
              </div>

              <span>
                Customer:{" "}
                {order.customerInfo
                  ?.fullName ||
                  order.customerInfo
                    ?.email ||
                  "-"}
              </span>

              <span>
                Email:{" "}
                {order.customerInfo
                  ?.email || "-"}
              </span>

              <span>
                Total:{" "}
                <strong>
                  {formatCurrency(
                    Number(
                      order.total || 0
                    )
                  )}
                </strong>
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
                    {
                      order.transactionReference
                    }
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
                  disabled={
                    orderUpdating
                  }
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
                  disabled={
                    paymentUpdating
                  }
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
                      {
                        order.affiliateCode
                      }
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
                    color:
                      "var(--muted)",
                  }}
                >
                  Updating order...
                </small>
              ) : null}

              <small
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                Click outside the controls
                to view complete order
                details.
              </small>
            </div>
          );
        }
      )}

      {filteredOrders.length >
        INITIAL_VISIBLE_COUNT ||
      showAll ? (
        <button
          type="button"
          className="button secondary"
          onClick={() =>
            setShowAll(
              (current) =>
                !current
            )
          }
          style={{
            width: "100%",
            marginTop: 14,
          }}
        >
          {showAll ? (
            <>
              <ChevronUp size={18} />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown
                size={18}
              />
              Show All (
              {filteredOrders.length})
            </>
          )}
        </button>
      ) : null}
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

function getOrderStatusPriority(
  order: AdminOrder,
  preferred:
    | "PENDING"
    | "DELIVERED"
) {
  if (preferred === "DELIVERED") {
    return order.orderStatus ===
      "DELIVERED"
      ? 0
      : 1;
  }

  const isPending =
    order.orderStatus ===
      "PLACED" ||
    order.orderStatus ===
      "PROCESSING" ||
    order.paymentStatus ===
      "PENDING" ||
    order.paymentStatus ===
      "AWAITING_VERIFICATION";

  return isPending ? 0 : 1;
}

function getTimestamp(
  value: unknown
) {
  const date =
    convertToDate(value);

  return date
    ? date.getTime()
    : 0;
}

function formatDate(
  value: unknown
) {
  const date =
    convertToDate(value);

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }
  ).format(date);
}

function convertToDate(
  value: unknown
): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(
      value.getTime()
    )
      ? null
      : value;
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value
  ) {
    const timestamp = value as {
      toDate?: unknown;
    };

    if (
      typeof timestamp.toDate ===
      "function"
    ) {
      const date =
        timestamp.toDate();

      return date instanceof Date
        ? date
        : null;
    }
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }

  return null;
}