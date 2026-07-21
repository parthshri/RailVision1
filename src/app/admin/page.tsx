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
  AffiliateApplications,
} from "@/components/admin/AffiliateApplications";

import {
  AdminRecordList,
} from "@/components/admin/AdminRecordList";

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
          collection(
            db,
            "affiliateApplications"
          ),
          orderBy("createdAt", "desc")
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
          collection(
            db,
            "proInquiries"
          ),
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
            "Failed to load customers:",
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
          sum +
          Number(order.total || 0),
        0
      ),
    [orders]
  );

  const pendingAffiliateCommission =
    useMemo(
      () =>
        orders.reduce((sum, order) => {
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
        }, 0),
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
      console.error(error);

      toast.error(
        "Failed to update order status."
      );
    } finally {
      setUpdatingOrderStatusId(null);
    }
  }

  async function changePaymentStatus(
    orderId: string,
    status: PaymentStatus
  ) {
    setUpdatingPaymentStatusId(orderId);

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
      setUpdatingPaymentStatusId(null);
    }
  }

  async function changeAffiliateStatus(
    orderId: string,
    status: AffiliateCommissionStatus
  ) {
    setUpdatingAffiliateOrderId(orderId);

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
      setUpdatingAffiliateOrderId(null);
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
      !Number.isFinite(commissionRate) ||
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
      setReviewingApplicationId(null);
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
      setReviewingApplicationId(null);
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
            Login using an approved admin
            email address.
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
          Review payments, delivery status,
          creator applications, and customer
          communications.
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

        <AffiliateApplications
          applications={
            affiliateApplications
          }
          reviewingApplicationId={
            reviewingApplicationId
          }
          onApprove={
            approveApplication
          }
          onReject={
            rejectApplication
          }
        />

        <AdminRecordList
          title="Customers"
          items={customers}
          fields={["email", "name"]}
        />

        <AdminRecordList
          title="RailVision Pro inquiries"
          items={inquiries}
          fields={[
            "email",
            "company",
            "fleetSize",
          ]}
        />

        <AdminRecordList
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