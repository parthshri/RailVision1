"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Order } from "@/lib/orders";

type PlainObject = Record<string, unknown>;

export type OrderStatus =
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "AWAITING_VERIFICATION"
  | "PAID"
  | "FAILED";

export type AffiliateStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export type AffiliateCommissionStatus =
  | "PENDING"
  | "APPROVED"
  | "PAID"
  | "REJECTED";
  export type AffiliateApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type AffiliateRecord = {
  code: string;
  name: string;
  email: string;
  instagram: string;
  status: AffiliateStatus;
  commissionRate: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  


};

export async function addContact(
  payload: PlainObject
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  return addDoc(
    collection(db, "contacts"),
    {
      ...payload,
      createdAt: serverTimestamp(),
      status: "new",
    }
  );
}

export async function addProInquiry(
  payload: PlainObject
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  return addDoc(
    collection(db, "proInquiries"),
    {
      ...payload,
      createdAt: serverTimestamp(),
      status: "new",
    }
  );
}

export async function addNotificationSignup(
  payload: PlainObject
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  return addDoc(
    collection(db, "notifications"),
    {
      ...payload,
      createdAt: serverTimestamp(),
    }
  );
}

export async function createOrder(
  order: Order
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  return addDoc(
    collection(db, "orders"),
    {
      ...order,
      createdAt: serverTimestamp(),
    }
  );
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  return updateDoc(
    doc(db, "orders", orderId),
    {
      orderStatus: status,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  return updateDoc(
    doc(db, "orders", orderId),
    {
      paymentStatus,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function createAffiliate(
  affiliate: Omit<
    AffiliateRecord,
    "createdAt" | "updatedAt"
  >
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  const cleanCode = affiliate.code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 30);

  if (!cleanCode) {
    throw new Error(
      "Invalid affiliate code."
    );
  }

  const affiliateRef = doc(
    db,
    "affiliates",
    cleanCode
  );

  const existingAffiliate =
    await getDoc(affiliateRef);

  if (existingAffiliate.exists()) {
    throw new Error(
      "This affiliate code already exists."
    );
  }

  return setDoc(affiliateRef, {
    ...affiliate,
    code: cleanCode,
    email: affiliate.email
      .trim()
      .toLowerCase(),
    instagram: affiliate.instagram.trim(),
    commissionRate: Math.max(
      0,
      Number(affiliate.commissionRate) || 0
    ),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
export async function updateAffiliateCommissionStatus(
  orderId: string,
  affiliateStatus: AffiliateCommissionStatus
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  return updateDoc(
    doc(db, "orders", orderId),
    {
      affiliateStatus,
      affiliateUpdatedAt:
        serverTimestamp(),
    }
  );
}

export async function addAffiliateApplication(
  payload: {
    fullName: string;
    email: string;
    instagramUsername: string;
    instagramProfileUrl: string;
    followers: number;
    contentCategory: string;
    message: string;
  }
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  return addDoc(
    collection(
      db,
      "affiliateApplications"
    ),
    {
      ...payload,

      email: payload.email
        .trim()
        .toLowerCase(),

      instagramUsername:
        payload.instagramUsername.trim(),

      instagramProfileUrl:
        payload.instagramProfileUrl.trim(),

      followers: Math.max(
        0,
        Number(payload.followers) || 0
      ),

      status: "PENDING",

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function getValidAffiliate(
  rawCode: string
): Promise<AffiliateRecord | null> {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  const cleanCode = rawCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 30);

  if (!cleanCode) {
    return null;
  }

  const affiliateSnapshot =
    await getDoc(
      doc(db, "affiliates", cleanCode)
    );

  if (!affiliateSnapshot.exists()) {
    return null;
  }

  const data =
    affiliateSnapshot.data() as Omit<
      AffiliateRecord,
      "code"
    >;

  if (data.status !== "ACTIVE") {
    return null;
  }

  return {
    code: cleanCode,
    ...data,
  };
  
  
}
function generateAffiliateCode(
  instagramUsername: string,
  fullName: string
) {
  const usernameCode = instagramUsername
    .replace("@", "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 16);

  const nameCode = fullName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);

  const baseCode =
    usernameCode ||
    nameCode ||
    "CREATOR";

  const randomNumber = Math.floor(
    100 + Math.random() * 900
  );

  return `${baseCode}${randomNumber}`;
}

export async function approveAffiliateApplication(
  applicationId: string,
  application: {
    fullName: string;
    email: string;
    instagramUsername: string;
    instagramProfileUrl?: string;
    followers?: number;
    contentCategory?: string;
  },
  commissionRate: number
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  const applicationRef = doc(
    db,
    "affiliateApplications",
    applicationId
  );

  const applicationSnapshot =
    await getDoc(applicationRef);

  if (!applicationSnapshot.exists()) {
    throw new Error(
      "Affiliate application was not found."
    );
  }

  const applicationData =
    applicationSnapshot.data();

  if (
    applicationData.status === "APPROVED"
  ) {
    throw new Error(
      "This application is already approved."
    );
  }

  if (
    applicationData.status === "REJECTED"
  ) {
    throw new Error(
      "This application has already been rejected."
    );
  }

  const safeCommissionRate = Math.min(
    50,
    Math.max(
      1,
      Number(commissionRate) || 10
    )
  );

  let affiliateCode =
    generateAffiliateCode(
      application.instagramUsername,
      application.fullName
    );

  let affiliateRef = doc(
    db,
    "affiliates",
    affiliateCode
  );

  let affiliateSnapshot =
    await getDoc(affiliateRef);

  while (affiliateSnapshot.exists()) {
    affiliateCode =
      generateAffiliateCode(
        application.instagramUsername,
        application.fullName
      );

    affiliateRef = doc(
      db,
      "affiliates",
      affiliateCode
    );

    affiliateSnapshot =
      await getDoc(affiliateRef);
  }

  await setDoc(affiliateRef, {
    code: affiliateCode,

    name: application.fullName.trim(),

    email: application.email
      .trim()
      .toLowerCase(),

    instagram:
      application.instagramUsername.trim(),

    instagramProfileUrl:
      application.instagramProfileUrl
        ?.trim() || "",

    followers: Math.max(
      0,
      Number(application.followers) || 0
    ),

    contentCategory:
      application.contentCategory
        ?.trim() || "",

    status: "ACTIVE",

    commissionRate:
      safeCommissionRate,

    totalOrders: 0,
    pendingEarnings: 0,
    approvedEarnings: 0,
    paidEarnings: 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(applicationRef, {
    status: "APPROVED",
    affiliateCode,
    commissionRate:
      safeCommissionRate,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    affiliateCode,
    commissionRate:
      safeCommissionRate,
  };
}

export async function rejectAffiliateApplication(
  applicationId: string
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  const applicationRef = doc(
    db,
    "affiliateApplications",
    applicationId
  );

  const applicationSnapshot =
    await getDoc(applicationRef);

  if (!applicationSnapshot.exists()) {
    throw new Error(
      "Affiliate application was not found."
    );
  }

  const applicationData =
    applicationSnapshot.data();

  if (
    applicationData.status === "APPROVED"
  ) {
    throw new Error(
      "An approved application cannot be rejected."
    );
  }

  return updateDoc(applicationRef, {
    status: "REJECTED",
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
export type AffiliateDashboardData = {
  affiliateCode: string;
  affiliateName: string;
  commissionRate: number;

  totalReferredOrders: number;

  /**
   * Successful affiliate orders completed during
   * the current Monday-Sunday week in India time.
   */
  weeklyReferredOrders: number;

  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  remainingPayableAmount: number;
};

/**
 * RailVision affiliate bonus weeks run from:
 *
 * Monday 12:00 AM IST
 * through
 * Sunday 11:59:59 PM IST
 */
function getCurrentAffiliateWeekRange() {
  const IST_OFFSET_MINUTES = 330;
  const IST_OFFSET_MS =
    IST_OFFSET_MINUTES * 60 * 1000;

  const now = new Date();

  /*
   * Shift the current instant into an artificial
   * UTC date whose UTC fields represent IST.
   */
  const nowInIndia = new Date(
    now.getTime() + IST_OFFSET_MS
  );

  const currentDay =
    nowInIndia.getUTCDay();

  /*
   * JavaScript:
   * Sunday = 0
   * Monday = 1
   *
   * Convert this into the number of days
   * passed since Monday.
   */
  const daysSinceMonday =
    (currentDay + 6) % 7;

  const weekStartAsIndiaWallTime =
    Date.UTC(
      nowInIndia.getUTCFullYear(),
      nowInIndia.getUTCMonth(),
      nowInIndia.getUTCDate() -
        daysSinceMonday,
      0,
      0,
      0,
      0
    );

  /*
   * Convert Monday 12:00 AM IST back into
   * the real UTC instant stored by Firestore.
   */
  const weekStart = new Date(
    weekStartAsIndiaWallTime -
      IST_OFFSET_MS
  );

  const weekEnd = new Date(
    weekStart.getTime() +
      7 * 24 * 60 * 60 * 1000
  );

  return {
    weekStart,
    weekEnd,
  };
}

/**
 * Safely converts Firestore Timestamp,
 * JavaScript Date, ISO strings and millisecond
 * numbers into a JavaScript Date.
 */
function convertToDate(
  value: unknown
): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    const convertedDate = new Date(value);

    return Number.isNaN(
      convertedDate.getTime()
    )
      ? null
      : convertedDate;
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value
  ) {
    const timestampLike = value as {
      toDate?: unknown;
    };

    if (
      typeof timestampLike.toDate ===
      "function"
    ) {
      const convertedDate =
        timestampLike.toDate();

      if (
        convertedDate instanceof Date &&
        !Number.isNaN(
          convertedDate.getTime()
        )
      ) {
        return convertedDate;
      }
    }
  }

  return null;
}

/**
 * Determines whether an order should count
 * toward the weekly affiliate bonus.
 *
 * An order counts when:
 *
 * 1. It has not been cancelled.
 * 2. Its affiliate commission has not been rejected.
 * 3. It is paid OR delivered.
 *
 * This supports both prepaid and COD orders.
 */
function isSuccessfulAffiliateOrder(
  order: Record<string, unknown>
) {
  const orderStatus = String(
    order.orderStatus || ""
  ).toUpperCase();

  const paymentStatus = String(
    order.paymentStatus || ""
  ).toUpperCase();

  const affiliateStatus = String(
    order.affiliateStatus || ""
  ).toUpperCase();

  const isCancelled =
    orderStatus === "CANCELLED";

  const isRejected =
    affiliateStatus === "REJECTED";

  const isPaid =
    paymentStatus === "PAID";

  const isDelivered =
    orderStatus === "DELIVERED";

  return (
    !isCancelled &&
    !isRejected &&
    (isPaid || isDelivered)
  );
}

export async function getAffiliateByEmail(
  email: string
): Promise<AffiliateRecord | null> {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  const cleanEmail = email
    .trim()
    .toLowerCase();

  console.log(
    "Searching affiliate for email:",
    cleanEmail
  );

  if (!cleanEmail) {
    return null;
  }

  const affiliateQuery = query(
    collection(db, "affiliates"),
    where("email", "==", cleanEmail),
    where("status", "==", "ACTIVE")
  );

  try {
    const snapshot = await getDocs(
      affiliateQuery
    );

    console.log(
      "Affiliate results found:",
      snapshot.size
    );

    if (snapshot.empty) {
      return null;
    }

    const affiliateDocument =
      snapshot.docs[0];

    const data =
      affiliateDocument.data() as AffiliateRecord;

    console.log(
      "Affiliate document:",
      affiliateDocument.id,
      data
    );

    return {
      ...data,
      code:
        data.code ||
        affiliateDocument.id,
    };
  } catch (error) {
    console.error(
      "Affiliate lookup error:",
      error
    );

    throw error;
  }
}

export async function getAffiliateDashboardData(
  email: string
): Promise<AffiliateDashboardData | null> {
  if (!db) {
    throw new Error(
      "Firebase is not configured yet."
    );
  }

  const affiliate =
    await getAffiliateByEmail(email);

  if (!affiliate) {
    return null;
  }

  const ordersQuery = query(
    collection(db, "orders"),
    where(
      "affiliateCode",
      "==",
      affiliate.code
    )
  );

  const ordersSnapshot =
    await getDocs(ordersQuery);

  const {
    weekStart,
    weekEnd,
  } = getCurrentAffiliateWeekRange();

  let weeklyReferredOrders = 0;

  let pendingCommission = 0;
  let approvedCommission = 0;
  let paidCommission = 0;

  ordersSnapshot.docs.forEach(
    (orderDocument) => {
      const order =
        orderDocument.data() as Record<
          string,
          unknown
        >;

      const commission = Math.max(
        0,
        Number(
          order.affiliateCommission || 0
        ) || 0
      );

      const affiliateStatus = String(
        order.affiliateStatus || "PENDING"
      ).toUpperCase();

      /*
       * Calculate commission totals.
       */
      if (
        affiliateStatus === "APPROVED"
      ) {
        approvedCommission +=
          commission;
      } else if (
        affiliateStatus === "PAID"
      ) {
        paidCommission += commission;
      } else if (
        affiliateStatus !== "REJECTED"
      ) {
        pendingCommission +=
          commission;
      }

      /*
       * Calculate the current week's
       * successful referred sales.
       */
      const orderCreatedAt =
        convertToDate(order.createdAt);

      if (!orderCreatedAt) {
        console.warn(
          `Order ${orderDocument.id} has no valid createdAt timestamp and cannot be counted toward the weekly bonus.`
        );

        return;
      }

      const isInsideCurrentWeek =
        orderCreatedAt >= weekStart &&
        orderCreatedAt < weekEnd;

      if (
        isInsideCurrentWeek &&
        isSuccessfulAffiliateOrder(
          order
        )
      ) {
        weeklyReferredOrders += 1;
      }
    }
  );

  console.log(
    "Affiliate weekly tracking:",
    {
      affiliateCode:
        affiliate.code,
      weekStart:
        weekStart.toISOString(),
      weekEnd:
        weekEnd.toISOString(),
      weeklyReferredOrders,
    }
  );

  return {
    affiliateCode:
      affiliate.code,

    affiliateName:
      affiliate.name,

    commissionRate: Math.max(
      0,
      Number(
        affiliate.commissionRate
      ) || 0
    ),

    totalReferredOrders:
      ordersSnapshot.size,

    weeklyReferredOrders,

    pendingCommission,
    approvedCommission,
    paidCommission,

    /*
     * Approved commission is currently
     * approved but not yet marked as paid.
     */
    remainingPayableAmount:
      approvedCommission,
  };
}