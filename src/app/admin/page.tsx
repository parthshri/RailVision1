"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  BarChart3,
  Mail,
  Package,
  UsersRound,
  X,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { formatCurrency } from "@/lib/products";

import {
  OrderStatus,
  PaymentStatus,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "@/lib/firestoreActions";

type FirestoreDoc = Record<string, unknown> & {
  id: string;
};

type AdminOrder = FirestoreDoc & {
  userId?: string;

  customerInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    alternatePhone?: string;
  };

  shippingAddress?: {
    house?: string;
    street?: string;
    area?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country?: string;
  };

  products?: {
    productId?: string;
    name: string;
    quantity: number;
    price: number;
  }[];

  total?: number;

  paymentMethod?:
    | "COD"
    | "UPI_MANUAL"
    | "ONLINE";

  paymentStatus?: PaymentStatus;

  orderStatus?: OrderStatus;

  transactionReference?: string;
};

export default function AdminPage() {
  const {
    user,
    isAdmin,
    loading,
  } = useAuth();

  const [orders, setOrders] =
    useState<AdminOrder[]>([]);

  const [contacts, setContacts] =
    useState<FirestoreDoc[]>([]);

  const [inquiries, setInquiries] =
    useState<FirestoreDoc[]>([]);

  const [customers, setCustomers] =
    useState<FirestoreDoc[]>([]);

  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [
    updatingOrderStatusId,
    setUpdatingOrderStatusId,
  ] = useState<string | null>(null);

  const [
    updatingPaymentStatusId,
    setUpdatingPaymentStatusId,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin || !db) {
      return;
    }

    const unsubscribers = [
      onSnapshot(
        query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        ),
        (snapshot) => {
          setOrders(
            snapshot.docs.map(
              (document) =>
                ({
                  id: document.id,
                  ...document.data(),
                }) as AdminOrder
            )
          );
        },
        (error) => {
          console.error(
            "Failed to load orders:",
            error
          );

          toast.error(
            "Could not load orders."
          );
        }
      ),

      onSnapshot(
        query(
          collection(db, "contacts"),
          orderBy("createdAt", "desc")
        ),
        (snapshot) => {
          setContacts(
            snapshot.docs.map(
              (document) => ({
                id: document.id,
                ...document.data(),
              })
            )
          );
        },
        (error) => {
          console.error(
            "Failed to load contacts:",
            error
          );
        }
      ),

      onSnapshot(
        query(
          collection(db, "proInquiries"),
          orderBy("createdAt", "desc")
        ),
        (snapshot) => {
          setInquiries(
            snapshot.docs.map(
              (document) => ({
                id: document.id,
                ...document.data(),
              })
            )
          );
        },
        (error) => {
          console.error(
            "Failed to load inquiries:",
            error
          );
        }
      ),

      onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          setCustomers(
            snapshot.docs.map(
              (document) => ({
                id: document.id,
                ...document.data(),
              })
            )
          );
        },
        (error) => {
          console.error(
            "Failed to load users:",
            error
          );
        }
      ),
    ];

    return () => {
      unsubscribers.forEach(
        (unsubscribe) => unsubscribe()
      );
    };
  }, [isAdmin]);

  const revenue = useMemo(
    () =>
      orders.reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      ),
    [orders]
  );

  async function changeOrderStatus(
    orderId: string,
    status: OrderStatus
  ) {
    setUpdatingOrderStatusId(orderId);

    try {
      await updateOrderStatus(
        orderId,
        status
      );

      toast.success(
        "Order status updated."
      );
    } catch (error) {
      console.error(
        "Order status update failed:",
        error
      );

      toast.error(
        "Failed to update order status."
      );
    } finally {
      setUpdatingOrderStatusId(null);
    }
  }

  async function changePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus
  ) {
    setUpdatingPaymentStatusId(orderId);

    try {
      await updateOrderPaymentStatus(
        orderId,
        paymentStatus
      );

      toast.success(
        paymentStatus === "PAID"
          ? "Payment marked as verified."
          : "Payment status updated."
      );
    } catch (error) {
      console.error(
        "Payment status update failed:",
        error
      );

      toast.error(
        "Failed to update payment status."
      );
    } finally {
      setUpdatingPaymentStatusId(null);
    }
  }

  if (loading) {
    return (
      <section className="auth-screen">
        <div className="skeleton profile-skeleton" />
      </section>
    );
  }

  if (!user || !isAdmin) {
    return (
      <section className="auth-screen">
        <div className="panel empty-state">
          <h1>
            Admin access required.
          </h1>

          <p>
            Login with an email listed in
            NEXT_PUBLIC_ADMIN_EMAILS.
          </p>

          <Link
            className="button primary"
            href="/auth"
          >
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="subhero">
        <span className="eyebrow">
          Admin dashboard
        </span>

        <h1>
          Operate RailVision commerce,
          inquiries, customers, and analytics.
        </h1>

        <p>
          Manage orders, payment verification,
          customers, inquiries, and delivery
          status.
        </p>
      </section>

      <section className="section analytics-grid">
        {[
          {
            icon: BarChart3,
            label: "Sales",
            value: formatCurrency(revenue),
          },
          {
            icon: Package,
            label: "Orders",
            value: String(orders.length),
          },
          {
            icon: UsersRound,
            label: "Customers",
            value: String(customers.length),
          },
          {
            icon: Mail,
            label: "Pro inquiries",
            value: String(inquiries.length),
          },
        ].map((metric) => (
          <div
            className="stat-card"
            key={metric.label}
          >
            <metric.icon size={28} />
            <span>{metric.value}</span>
            <p>{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="section admin-tables">
        <OrderAdminList
          orders={orders}
          onStatusChange={
            changeOrderStatus
          }
          onPaymentStatusChange={
            changePaymentStatus
          }
          onSelectOrder={
            setSelectedOrder
          }
          updatingOrderStatusId={
            updatingOrderStatusId
          }
          updatingPaymentStatusId={
            updatingPaymentStatusId
          }
        />

        <AdminList
          title="Customers"
          items={customers}
          fields={["email", "name"]}
        />

        <AdminList
          title="RailVision Pro inquiries"
          items={inquiries}
          fields={[
            "email",
            "company",
            "fleetSize",
          ]}
        />

        <AdminList
          title="Contact messages"
          items={contacts}
          fields={[
            "email",
            "subject",
            "message",
          ]}
        />
      </section>

      {selectedOrder ? (
        <OrderDetails
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
        />
      ) : null}
    </>
  );
}

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

  onSelectOrder: (
    order: AdminOrder
  ) => void;

  updatingOrderStatusId:
    | string
    | null;

  updatingPaymentStatusId:
    | string
    | null;
};

function OrderAdminList({
  orders,
  onStatusChange,
  onPaymentStatusChange,
  onSelectOrder,
  updatingOrderStatusId,
  updatingPaymentStatusId,
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
              {order.customerInfo
                ?.email || "-"}
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

            {orderUpdating ||
            paymentUpdating ? (
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

function OrderDetails({
  order,
  onClose,
}: {
  order: AdminOrder;
  onClose: () => void;
}) {
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
          <p>No product details found.</p>
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

function AdminList({
  title,
  items,
  fields,
}: {
  title: string;
  items: FirestoreDoc[];
  fields: string[];
}) {
  return (
    <article className="admin-list">
      <h2>{title}</h2>

      {items.length === 0 ? (
        <p>No records yet.</p>
      ) : null}

      {items
        .slice(0, 8)
        .map((item) => (
          <div
            className="admin-row"
            key={item.id}
          >
            <strong>
              {item.id.slice(0, 8)}
            </strong>

            {fields.map((field) => (
              <span key={field}>
                {String(
                  item[field] ?? "-"
                )}
              </span>
            ))}
          </div>
        ))}
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