"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

import Link from "next/link";

import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Eye,
  Mail,
  Package,
  UsersRound,
  X,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { formatCurrency } from "@/lib/products";

import {
  type AffiliateCommissionStatus,
  type OrderStatus,
  type PaymentStatus,
  approveAffiliateApplication,
  rejectAffiliateApplication,
  updateAffiliateCommissionStatus,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "@/lib/firestoreActions";

import {
  OrderAdminList,
} from "@/components/admin/OrderAdminList";

import {
  OrderDetails,
} from "@/components/admin/OrderDetails";

import type {
  AdminOrder,
  AffiliateApplication,
  FirestoreDoc,
} from "@/components/admin/types";

const PREVIEW_LIMIT = 5;

type AffiliateSortOption =
  | "newest"
  | "oldest"
  | "followers"
  | "unapproved";

type DetailRecord = {
  title: string;
  subtitle?: string;
  data: Record<string, unknown>;
};

type ShowAllState = {
  orders: boolean;
  affiliates: boolean;
  customers: boolean;
  inquiries: boolean;
  contacts: boolean;
};

function getTimestampValue(
  value: unknown
): number {
  if (value instanceof Timestamp) {
    return value.toMillis();
  }

  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof (
      value as {
        toMillis?: unknown;
      }
    ).toMillis === "function"
  ) {
    return (
      value as {
        toMillis: () => number;
      }
    ).toMillis();
  }

  if (
    value &&
    typeof value === "object" &&
    "seconds" in value
  ) {
    const seconds = Number(
      (
        value as {
          seconds?: unknown;
        }
      ).seconds
    );

    if (Number.isFinite(seconds)) {
      return seconds * 1000;
    }
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    const parsedDate = new Date(
      value
    ).getTime();

    return Number.isNaN(parsedDate)
      ? 0
      : parsedDate;
  }

  return 0;
}

function formatDate(
  value: unknown
): string {
  const milliseconds =
    getTimestampValue(value);

  if (!milliseconds) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(milliseconds));
}

function formatFieldName(
  fieldName: string
): string {
  return fieldName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatFieldValue(
  value: unknown
): ReactNode {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return (
      <span style={{ opacity: 0.65 }}>
        Not provided
      </span>
    );
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (
    value instanceof Timestamp ||
    (
      typeof value === "object" &&
      value !== null &&
      (
        "toMillis" in value ||
        "seconds" in value
      )
    )
  ) {
    return formatDate(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <span style={{ opacity: 0.65 }}>
          Empty
        </span>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gap: "0.45rem",
        }}
      >
        {value.map((item, index) => (
          <div
            key={`${index}-${String(item)}`}
            style={{
              borderRadius: "10px",
              padding: "0.65rem",
              background:
                "rgba(255,255,255,0.05)",
            }}
          >
            {typeof item === "object" &&
            item !== null
              ? JSON.stringify(
                  item,
                  null,
                  2
                )
              : String(item)}
          </div>
        ))}
      </div>
    );
  }

  if (
    typeof value === "object"
  ) {
    return (
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          fontFamily: "inherit",
        }}
      >
        {JSON.stringify(
          value,
          null,
          2
        )}
      </pre>
    );
  }

  return String(value);
}

function getFollowerCount(
  value: unknown
): number {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : 0;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const cleanedValue = value
    .trim()
    .toLowerCase()
    .replace(/,/g, "");

  const numericValue = Number.parseFloat(
    cleanedValue
  );

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  if (cleanedValue.includes("m")) {
    return numericValue * 1_000_000;
  }

  if (cleanedValue.includes("k")) {
    return numericValue * 1_000;
  }

  return numericValue;
}

function isAffiliateApproved(
  application: AffiliateApplication
): boolean {
  const applicationData =
    application as AffiliateApplication &
      Record<string, unknown>;

  const status = String(
    applicationData.status || ""
  ).toUpperCase();

  return (
    applicationData.approved === true ||
    status === "APPROVED"
  );
}

function ShowAllButton({
  expanded,
  total,
  onClick,
}: {
  expanded: boolean;
  total: number;
  onClick: () => void;
}) {
  if (total <= PREVIEW_LIMIT) {
    return null;
  }

  return (
    <button
      type="button"
      className="button secondary"
      onClick={onClick}
      style={{
        width: "100%",
        marginTop: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.45rem",
      }}
    >
      {expanded ? (
        <>
          Show less
          <ChevronUp size={17} />
        </>
      ) : (
        <>
          Show all ({total})
          <ChevronDown size={17} />
        </>
      )}
    </button>
  );
}

function RecordSection({
  title,
  items,
  previewFields,
  expanded,
  onToggle,
  onSelect,
  emptyMessage,
}: {
  title: string;
  items: FirestoreDoc[];
  previewFields: string[];
  expanded: boolean;
  onToggle: () => void;
  onSelect: (
    item: FirestoreDoc
  ) => void;
  emptyMessage: string;
}) {
  const visibleItems = expanded
    ? items
    : items.slice(
        0,
        PREVIEW_LIMIT
      );

  return (
    <div className="panel">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            {title}
          </h2>

          <p
            style={{
              margin:
                "0.35rem 0 0",
              opacity: 0.7,
            }}
          >
            {items.length} record
            {items.length === 1
              ? ""
              : "s"}
          </p>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
          }}
        >
          {visibleItems.map(
            (item) => (
              <button
                key={String(item.id)}
                type="button"
                onClick={() =>
                  onSelect(item)
                }
                style={{
                  width: "100%",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  background:
                    "rgba(255,255,255,0.035)",
                  padding: "1rem",
                  color: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gap: "0.4rem",
                      minWidth: 0,
                    }}
                  >
                    {previewFields.map(
                      (field) => {
                        const value =
                          item[field];

                        if (
                          value ===
                            undefined ||
                          value === null ||
                          value === ""
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={field}
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "minmax(90px, 140px) 1fr",
                              gap: "0.75rem",
                              alignItems:
                                "start",
                            }}
                          >
                            <strong
                              style={{
                                opacity:
                                  0.72,
                              }}
                            >
                              {formatFieldName(
                                field
                              )}
                            </strong>

                            <span
                              style={{
                                overflowWrap:
                                  "anywhere",
                                whiteSpace:
                                  field ===
                                  "message"
                                    ? "pre-wrap"
                                    : "normal",
                                display:
                                  field ===
                                    "message"
                                    ? "-webkit-box"
                                    : "block",
                                WebkitLineClamp:
                                  field ===
                                  "message"
                                    ? 2
                                    : undefined,
                                WebkitBoxOrient:
                                  field ===
                                  "message"
                                    ? "vertical"
                                    : undefined,
                                overflow:
                                  "hidden",
                              }}
                            >
                              {String(
                                value
                              )}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <Eye
                    size={19}
                    style={{
                      flexShrink: 0,
                      opacity: 0.75,
                    }}
                  />
                </div>
              </button>
            )
          )}
        </div>
      )}

      <ShowAllButton
        expanded={expanded}
        total={items.length}
        onClick={onToggle}
      />
    </div>
  );
}

function DetailsModal({
  record,
  onClose,
}: {
  record: DetailRecord;
  onClose: () => void;
}) {
  const entries = Object.entries(
    record.data
  );

  return (
    <div
      role="presentation"
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background:
          "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={record.title}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="panel"
        style={{
          width: "min(760px, 100%)",
          maxHeight: "88vh",
          overflowY: "auto",
          padding: "1.25rem",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            paddingBottom: "1rem",
            background: "inherit",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                overflowWrap:
                  "anywhere",
              }}
            >
              {record.title}
            </h2>

            {record.subtitle ? (
              <p
                style={{
                  margin:
                    "0.4rem 0 0",
                  opacity: 0.7,
                  overflowWrap:
                    "anywhere",
                }}
              >
                {record.subtitle}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="button secondary"
            style={{
              minWidth: "auto",
              padding: "0.65rem",
              flexShrink: 0,
            }}
          >
            <X size={19} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: "0.8rem",
          }}
        >
          {entries.map(
            ([field, value]) => (
              <div
                key={field}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(120px, 180px) 1fr",
                  gap: "1rem",
                  alignItems: "start",
                  padding: "0.9rem",
                  borderRadius: "12px",
                  background:
                    "rgba(255,255,255,0.04)",
                  border:
                    "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <strong
                  style={{
                    opacity: 0.75,
                    overflowWrap:
                      "anywhere",
                  }}
                >
                  {formatFieldName(
                    field
                  )}
                </strong>

                <div
                  style={{
                    overflowWrap:
                      "anywhere",
                    whiteSpace:
                      "pre-wrap",
                    minWidth: 0,
                  }}
                >
                  {formatFieldValue(
                    value
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

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

  const [
    affiliateApplications,
    setAffiliateApplications,
  ] = useState<
    AffiliateApplication[]
  >([]);

  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [selectedRecord, setSelectedRecord] =
    useState<DetailRecord | null>(null);

  const [showAll, setShowAll] =
    useState<ShowAllState>({
      orders: false,
      affiliates: false,
      customers: false,
      inquiries: false,
      contacts: false,
    });

  const [
    affiliateSort,
    setAffiliateSort,
  ] = useState<AffiliateSortOption>(
    "newest"
  );

  const [
    commissionRates,
    setCommissionRates,
  ] = useState<Record<string, number>>(
    {}
  );

  const [
    updatingOrderStatusId,
    setUpdatingOrderStatusId,
  ] = useState<string | null>(null);

  const [
    updatingPaymentStatusId,
    setUpdatingPaymentStatusId,
  ] = useState<string | null>(null);

  const [
    updatingAffiliateOrderId,
    setUpdatingAffiliateOrderId,
  ] = useState<string | null>(null);

  const [
    reviewingApplicationId,
    setReviewingApplicationId,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin || !db) {
      return;
    }

    const unsubscribers = [
      onSnapshot(
        query(
          collection(db, "orders"),
          orderBy(
            "createdAt",
            "desc"
          )
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
          collection(
            db,
            "affiliateApplications"
          ),
          orderBy(
            "createdAt",
            "desc"
          )
        ),
        (snapshot) => {
          setAffiliateApplications(
            snapshot.docs.map(
              (document) =>
                ({
                  id: document.id,
                  ...document.data(),
                }) as AffiliateApplication
            )
          );
        },
        (error) => {
          console.error(
            "Failed to load affiliate applications:",
            error
          );

          toast.error(
            "Could not load affiliate applications."
          );
        }
      ),

      onSnapshot(
        query(
          collection(
            db,
            "contacts"
          ),
          orderBy(
            "createdAt",
            "desc"
          )
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

          toast.error(
            "Could not load contact messages."
          );
        }
      ),

      onSnapshot(
        query(
          collection(
            db,
            "proInquiries"
          ),
          orderBy(
            "createdAt",
            "desc"
          )
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

          toast.error(
            "Could not load RailVision Pro inquiries."
          );
        }
      ),

      onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          const loadedCustomers =
            snapshot.docs.map(
              (document) => ({
                id: document.id,
                ...document.data(),
              })
            );

          loadedCustomers.sort(
            (first, second) =>
              getTimestampValue(
                second.createdAt
              ) -
              getTimestampValue(
                first.createdAt
              )
          );

          setCustomers(
            loadedCustomers
          );
        },
        (error) => {
          console.error(
            "Failed to load customers:",
            error
          );

          toast.error(
            "Could not load customers."
          );
        }
      ),
    ];

    return () => {
      unsubscribers.forEach(
        (unsubscribe) =>
          unsubscribe()
      );
    };
  }, [isAdmin]);

  const revenue = useMemo(
    () =>
      orders.reduce(
        (sum, order) =>
          sum +
          Number(order.total || 0),
        0
      ),
    [orders]
  );

  const pendingAffiliateCommission =
    useMemo(
      () =>
        orders.reduce(
          (sum, order) => {
            if (
              order.affiliateStatus !==
              "PENDING"
            ) {
              return sum;
            }

            return (
              sum +
              Number(
                order.affiliateCommission ||
                  0
              )
            );
          },
          0
        ),
      [orders]
    );

  const sortedAffiliateApplications =
    useMemo(() => {
      const applications = [
        ...affiliateApplications,
      ];

      switch (affiliateSort) {
        case "oldest":
          return applications.sort(
            (first, second) =>
              getTimestampValue(
                (
                  first as AffiliateApplication &
                    Record<
                      string,
                      unknown
                    >
                ).createdAt
              ) -
              getTimestampValue(
                (
                  second as AffiliateApplication &
                    Record<
                      string,
                      unknown
                    >
                ).createdAt
              )
          );

        case "followers":
          return applications.sort(
            (first, second) =>
              getFollowerCount(
                second.followers
              ) -
              getFollowerCount(
                first.followers
              )
          );

        case "unapproved":
          return applications.sort(
            (first, second) => {
              const firstApproved =
                isAffiliateApproved(
                  first
                );

              const secondApproved =
                isAffiliateApproved(
                  second
                );

              if (
                firstApproved !==
                secondApproved
              ) {
                return firstApproved
                  ? 1
                  : -1;
              }

              return (
                getTimestampValue(
                  (
                    second as AffiliateApplication &
                      Record<
                        string,
                        unknown
                      >
                  ).createdAt
                ) -
                getTimestampValue(
                  (
                    first as AffiliateApplication &
                      Record<
                        string,
                        unknown
                      >
                  ).createdAt
                )
              );
            }
          );

        case "newest":
        default:
          return applications.sort(
            (first, second) =>
              getTimestampValue(
                (
                  second as AffiliateApplication &
                    Record<
                      string,
                      unknown
                    >
                ).createdAt
              ) -
              getTimestampValue(
                (
                  first as AffiliateApplication &
                    Record<
                      string,
                      unknown
                    >
                ).createdAt
              )
          );
      }
    }, [
      affiliateApplications,
      affiliateSort,
    ]);

  const visibleOrders =
    showAll.orders
      ? orders
      : orders.slice(
          0,
          PREVIEW_LIMIT
        );

  const visibleAffiliateApplications =
    showAll.affiliates
      ? sortedAffiliateApplications
      : sortedAffiliateApplications.slice(
          0,
          PREVIEW_LIMIT
        );

  function toggleSection(
    section: keyof ShowAllState
  ) {
    setShowAll((current) => ({
      ...current,
      [section]:
        !current[section],
    }));
  }

  function openRecordDetails(
    title: string,
    item: FirestoreDoc,
    subtitle?: string
  ) {
    setSelectedRecord({
      title,
      subtitle,
      data: item as Record<
        string,
        unknown
      >,
    });
  }

  async function changeOrderStatus(
    orderId: string,
    status: OrderStatus
  ) {
    setUpdatingOrderStatusId(
      orderId
    );

    try {
      await updateOrderStatus(
        orderId,
        status
      );

      toast.success(
        "Order status updated."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update order status."
      );
    } finally {
      setUpdatingOrderStatusId(
        null
      );
    }
  }

  async function changePaymentStatus(
    orderId: string,
    status: PaymentStatus
  ) {
    setUpdatingPaymentStatusId(
      orderId
    );

    try {
      await updateOrderPaymentStatus(
        orderId,
        status
      );

      toast.success(
        status === "PAID"
          ? "Payment marked as verified."
          : "Payment status updated."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update payment status."
      );
    } finally {
      setUpdatingPaymentStatusId(
        null
      );
    }
  }

  async function changeAffiliateStatus(
    orderId: string,
    status: AffiliateCommissionStatus
  ) {
    setUpdatingAffiliateOrderId(
      orderId
    );

    try {
      await updateAffiliateCommissionStatus(
        orderId,
        status
      );

      toast.success(
        "Affiliate commission updated."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update affiliate commission."
      );
    } finally {
      setUpdatingAffiliateOrderId(
        null
      );
    }
  }

  async function approveApplication(
    application: AffiliateApplication,
    commissionRate: number
  ) {
    if (
      !application.fullName ||
      !application.email ||
      !application.instagramUsername
    ) {
      toast.error(
        "The application is missing required details."
      );
      return;
    }

    if (
      !Number.isFinite(
        commissionRate
      ) ||
      commissionRate < 1 ||
      commissionRate > 50
    ) {
      toast.error(
        "Enter a commission rate between 1% and 50%."
      );
      return;
    }

    setReviewingApplicationId(
      application.id
    );

    try {
      const result =
        await approveAffiliateApplication(
          application.id,
          {
            fullName:
              application.fullName,

            email:
              application.email,

            instagramUsername:
              application.instagramUsername,

            instagramProfileUrl:
              application.instagramProfileUrl,

            followers:
              application.followers,

            contentCategory:
              application.contentCategory,
          },
          commissionRate
        );

      toast.success(
        `Affiliate approved. Code: ${result.affiliateCode}`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not approve the application."
      );
    } finally {
      setReviewingApplicationId(
        null
      );
    }
  }

  async function rejectApplication(
    applicationId: string
  ) {
    setReviewingApplicationId(
      applicationId
    );

    try {
      await rejectAffiliateApplication(
        applicationId
      );

      toast.success(
        "Affiliate application rejected."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not reject the application."
      );
    } finally {
      setReviewingApplicationId(
        null
      );
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
            Login using an approved
            admin email address.
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
          Manage RailVision orders,
          customers, applications, and
          affiliate commissions.
        </h1>

        <p>
          Review payments, delivery
          status, creator applications,
          and customer communications.
        </p>
      </section>

      <section className="section analytics-grid">
        {[
          {
            icon: BarChart3,
            label: "Sales",
            value:
              formatCurrency(revenue),
          },
          {
            icon: Package,
            label: "Orders",
            value: String(
              orders.length
            ),
          },
          {
            icon: UsersRound,
            label: "Customers",
            value: String(
              customers.length
            ),
          },
          {
            icon: Mail,
            label:
              "Pending affiliate commission",
            value: formatCurrency(
              pendingAffiliateCommission
            ),
          },
        ].map((metric) => (
          <div
            className="stat-card"
            key={metric.label}
          >
            <metric.icon size={28} />

            <span>
              {metric.value}
            </span>

            <p>{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="section admin-tables">
        <div className="panel">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                Orders
              </h2>

              <p
                style={{
                  margin:
                    "0.35rem 0 0",
                  opacity: 0.7,
                }}
              >
                {orders.length} order
                {orders.length === 1
                  ? ""
                  : "s"}
              </p>
            </div>
          </div>

          <OrderAdminList
            orders={visibleOrders}
            onStatusChange={
              changeOrderStatus
            }
            onPaymentStatusChange={
              changePaymentStatus
            }
            onAffiliateStatusChange={
              changeAffiliateStatus
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
            updatingAffiliateOrderId={
              updatingAffiliateOrderId
            }
          />

          <ShowAllButton
            expanded={showAll.orders}
            total={orders.length}
            onClick={() =>
              toggleSection(
                "orders"
              )
            }
          />
        </div>

        <div className="panel">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                Affiliate applications
              </h2>

              <p
                style={{
                  margin:
                    "0.35rem 0 0",
                  opacity: 0.7,
                }}
              >
                {
                  affiliateApplications.length
                }{" "}
                application
                {affiliateApplications.length ===
                1
                  ? ""
                  : "s"}
              </p>
            </div>

            {showAll.affiliates ? (
              <label
                style={{
                  display: "grid",
                  gap: "0.35rem",
                  minWidth: "190px",
                }}
              >
                <span
                  style={{
                    fontSize:
                      "0.85rem",
                    opacity: 0.75,
                  }}
                >
                  Sort affiliates
                </span>

                <select
                  value={affiliateSort}
                  onChange={(event) =>
                    setAffiliateSort(
                      event.target
                        .value as AffiliateSortOption
                    )
                  }
                  style={{
                    width: "100%",
                    borderRadius:
                      "10px",
                    padding:
                      "0.7rem 0.8rem",
                    background:
                      "rgba(255,255,255,0.06)",
                    color: "inherit",
                    border:
                      "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <option value="newest">
                    Newest first
                  </option>

                  <option value="oldest">
                    Oldest first
                  </option>

                  <option value="followers">
                    Most followers
                  </option>

                  <option value="unapproved">
                    Unapproved first
                  </option>
                </select>
              </label>
            ) : null}
          </div>

          {visibleAffiliateApplications.length ===
          0 ? (
            <div className="empty-state">
              <p>
                No affiliate applications
                found.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "0.85rem",
              }}
            >
              {visibleAffiliateApplications.map(
                (application) => {
                  const applicationData =
                    application as AffiliateApplication &
                      Record<
                        string,
                        unknown
                      >;

                  const approved =
                    isAffiliateApproved(
                      application
                    );

                  const reviewing =
                    reviewingApplicationId ===
                    application.id;

                  const commissionRate =
                    commissionRates[
                      application.id
                    ] ?? 10;

                  return (
                    <div
                      key={
                        application.id
                      }
                      style={{
                        border:
                          "1px solid rgba(255,255,255,0.1)",
                        borderRadius:
                          "14px",
                        padding: "1rem",
                        background:
                          "rgba(255,255,255,0.035)",
                        display: "grid",
                        gap: "1rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedRecord(
                            {
                              title:
                                application.fullName ||
                                "Affiliate application",
                              subtitle:
                                application.email ||
                                application.instagramUsername ||
                                undefined,
                              data: applicationData,
                            }
                          )
                        }
                        style={{
                          border: 0,
                          padding: 0,
                          background:
                            "transparent",
                          color: "inherit",
                          textAlign:
                            "left",
                          cursor:
                            "pointer",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "grid",
                              gap: "0.45rem",
                              minWidth: 0,
                            }}
                          >
                            <strong
                              style={{
                                fontSize:
                                  "1.05rem",
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {application.fullName ||
                                "Unnamed applicant"}
                            </strong>

                            <span
                              style={{
                                opacity:
                                  0.8,
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {application.email ||
                                "No email"}
                            </span>

                            <span
                              style={{
                                opacity:
                                  0.8,
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              Instagram:{" "}
                              {application.instagramUsername ||
                                "Not provided"}
                            </span>

                            <span
                              style={{
                                opacity:
                                  0.8,
                              }}
                            >
                              Followers:{" "}
                              {application.followers ||
                                "Not provided"}
                            </span>

                            <span
                              style={{
                                opacity:
                                  0.7,
                                fontSize:
                                  "0.88rem",
                              }}
                            >
                              Applied:{" "}
                              {formatDate(
                                applicationData.createdAt
                              )}
                            </span>
                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "0.6rem",
                            }}
                          >
                            <span
                              style={{
                                padding:
                                  "0.35rem 0.65rem",
                                borderRadius:
                                  "999px",
                                background:
                                  approved
                                    ? "rgba(40, 200, 120, 0.15)"
                                    : "rgba(255, 180, 40, 0.15)",
                                fontSize:
                                  "0.82rem",
                                fontWeight:
                                  700,
                              }}
                            >
                              {approved
                                ? "Approved"
                                : String(
                                    applicationData.status ||
                                      "Pending"
                                  )}
                            </span>

                            <Eye
                              size={19}
                              style={{
                                flexShrink: 0,
                                opacity:
                                  0.75,
                              }}
                            />
                          </div>
                        </div>
                      </button>

                      {!approved ? (
                        <div
                          style={{
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            alignItems:
                              "end",
                            gap: "0.75rem",
                          }}
                        >
                          <label
                            style={{
                              display:
                                "grid",
                              gap: "0.35rem",
                              minWidth:
                                "150px",
                            }}
                          >
                            <span
                              style={{
                                fontSize:
                                  "0.82rem",
                                opacity:
                                  0.75,
                              }}
                            >
                              Commission %
                            </span>

                            <input
                              type="number"
                              min={1}
                              max={50}
                              step={1}
                              value={
                                commissionRate
                              }
                              onChange={(
                                event
                              ) => {
                                const value =
                                  Number(
                                    event
                                      .target
                                      .value
                                  );

                                setCommissionRates(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    [application.id]:
                                      value,
                                  })
                                );
                              }}
                              style={{
                                width:
                                  "100%",
                                borderRadius:
                                  "10px",
                                padding:
                                  "0.7rem 0.8rem",
                                background:
                                  "rgba(255,255,255,0.06)",
                                color:
                                  "inherit",
                                border:
                                  "1px solid rgba(255,255,255,0.12)",
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            className="button primary"
                            disabled={
                              reviewing
                            }
                            onClick={() =>
                              approveApplication(
                                application,
                                commissionRate
                              )
                            }
                          >
                            {reviewing
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            className="button secondary"
                            disabled={
                              reviewing
                            }
                            onClick={() =>
                              rejectApplication(
                                application.id
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                }
              )}
            </div>
          )}

          <ShowAllButton
            expanded={
              showAll.affiliates
            }
            total={
              sortedAffiliateApplications.length
            }
            onClick={() =>
              toggleSection(
                "affiliates"
              )
            }
          />
        </div>

        <RecordSection
          title="Customers"
          items={customers}
          previewFields={[
            "name",
            "fullName",
            "email",
            "phone",
          ]}
          expanded={
            showAll.customers
          }
          onToggle={() =>
            toggleSection(
              "customers"
            )
          }
          onSelect={(item) =>
            openRecordDetails(
              String(
                item.name ||
                  item.fullName ||
                  "Customer details"
              ),
              item,
              item.email
                ? String(
                    item.email
                  )
                : undefined
            )
          }
          emptyMessage="No customers found."
        />

        <RecordSection
          title="RailVision Pro inquiries"
          items={inquiries}
          previewFields={[
            "company",
            "name",
            "email",
            "fleetSize",
            "message",
          ]}
          expanded={
            showAll.inquiries
          }
          onToggle={() =>
            toggleSection(
              "inquiries"
            )
          }
          onSelect={(item) =>
            openRecordDetails(
              String(
                item.company ||
                  item.name ||
                  "RailVision Pro inquiry"
              ),
              item,
              item.email
                ? String(
                    item.email
                  )
                : undefined
            )
          }
          emptyMessage="No RailVision Pro inquiries found."
        />

        <RecordSection
          title="Contact messages"
          items={contacts}
          previewFields={[
            "name",
            "email",
            "subject",
            "message",
          ]}
          expanded={showAll.contacts}
          onToggle={() =>
            toggleSection(
              "contacts"
            )
          }
          onSelect={(item) =>
            openRecordDetails(
              String(
                item.subject ||
                  item.name ||
                  "Contact message"
              ),
              item,
              item.email
                ? String(
                    item.email
                  )
                : undefined
            )
          }
          emptyMessage="No contact messages found."
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

      {selectedRecord ? (
        <DetailsModal
          record={selectedRecord}
          onClose={() =>
            setSelectedRecord(null)
          }
        />
      ) : null}
    </>
  );
}