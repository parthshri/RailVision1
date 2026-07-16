"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  BarChart3,
  ImageUp,
  Mail,
  Package,
  UsersRound,
  X,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";

import {
  formatCurrency,
  products,
} from "@/lib/products";

import {
  PaymentStatus,
  OrderStatus,
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

  const [uploading, setUploading] =
    useState(false);
  const [uploadProgress, setUploadProgress] =
  useState(0);
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

 async function uploadImage(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const formElement = event.currentTarget;
  const form = new FormData(formElement);

  const productId = String(
    form.get("productId") || ""
  );

  const file = form.get("image");

  if (!productId) {
    toast.error("Select a product.");
    return;
  }

  if (!(file instanceof File) || file.size === 0) {
    toast.error("Choose an image first.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("Only image files are allowed.");
    return;
  }

  const maximumSize = 5 * 1024 * 1024;

  if (file.size > maximumSize) {
    toast.error(
      "The image must be smaller than 5 MB."
    );
    return;
  }

  if (!db || !storage) {
    toast.error(
      "Firebase Storage is not configured."
    );
    return;
  }

  setUploading(true);
  setUploadProgress(0);

  try {
    const safeFileName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    const imageReference = ref(
      storage,
      `product-images/${productId}/${Date.now()}-${safeFileName}`
    );

    const uploadTask = uploadBytesResumable(
      imageReference,
      file,
      {
        contentType: file.type,
        customMetadata: {
          productId,
        },
      }
    );

    const snapshot = await new Promise<
      Awaited<ReturnType<typeof uploadTask.then>>
    >((resolve, reject) => {
      uploadTask.on(
        "state_changed",

        (currentSnapshot) => {
          const progress =
            (currentSnapshot.bytesTransferred /
              currentSnapshot.totalBytes) *
            100;

          setUploadProgress(
            Math.round(progress)
          );
        },

        (error) => {
          reject(error);
        },

        () => {
          resolve(uploadTask.snapshot);
        }
      );
    });

    const imageUrl = await getDownloadURL(
      snapshot.ref
    );

    await setDoc(
      doc(db, "products", productId),
      {
        imageUrl,
        imagePath: snapshot.ref.fullPath,
        updatedAt: new Date(),
      },
      {
        merge: true,
      }
    );

    formElement.reset();
    setUploadProgress(100);

    toast.success(
      "Product image updated successfully."
    );
  } catch (error: unknown) {
    console.error(
      "Product image upload failed:",
      error
    );

    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? String(error.code)
        : "";

    if (
      errorCode ===
      "storage/unauthorized"
    ) {
      toast.error(
        "Firebase Storage denied the upload. Check your Storage security rules."
      );
    } else if (
      errorCode ===
      "storage/bucket-not-found"
    ) {
      toast.error(
        "Firebase Storage bucket was not found. Check NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET."
      );
    } else if (
      errorCode ===
      "storage/canceled"
    ) {
      toast.error("Upload was cancelled.");
    } else if (
      errorCode ===
      "storage/retry-limit-exceeded"
    ) {
      toast.error(
        "Upload timed out. Check your internet connection and try again."
      );
    } else {
      toast.error(
        "Image upload failed. Check the browser console for the exact Firebase error."
      );
    }
  } finally {
    setUploading(false);
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
          Manage products, customers, orders,
          payment verification, and delivery
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

      <section className="section split">
        <div>
          <span className="eyebrow">
            Manage products
          </span>

          <h2>
            Upload replaceable product images.
          </h2>

          <p>
            Images are stored in Firebase
            Storage and linked to the relevant
            product document.
          </p>
        </div>

        <form
          className="panel form-grid single"
          onSubmit={uploadImage}
        >
          <label>
            Product

            <select name="productId">
              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Product image

            <input
              required
              type="file"
              name="image"
              accept="image/*"
            />
          </label>

          <button
            className="button primary"
            disabled={uploading}
          >
            <ImageUp size={18} />

            {uploading
              ? "Uploading..."
              : "Upload Image"}
          </button>
        </form>
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
        const updatingOrderStatus =
          updatingOrderStatusId ===
          order.id;

        const updatingPaymentStatus =
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
                disabled={
                  updatingOrderStatus
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
                  updatingPaymentStatus
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

            {updatingOrderStatus ||
            updatingPaymentStatus ? (
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