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
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  remainingPayableAmount: number;
};

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

  let pendingCommission = 0;
  let approvedCommission = 0;
  let paidCommission = 0;

  ordersSnapshot.docs.forEach(
    (orderDocument) => {
      const order =
        orderDocument.data();

      const commission = Number(
        order.affiliateCommission || 0
      );

      if (
        order.affiliateStatus ===
        "APPROVED"
      ) {
        approvedCommission +=
          commission;
      } else if (
        order.affiliateStatus ===
        "PAID"
      ) {
        paidCommission += commission;
      } else if (
        order.affiliateStatus !==
        "REJECTED"
      ) {
        pendingCommission +=
          commission;
      }
    }
  );

  return {
    affiliateCode: affiliate.code,
    affiliateName: affiliate.name,
    commissionRate:
      affiliate.commissionRate,

    totalReferredOrders:
      ordersSnapshot.size,

    pendingCommission,
    approvedCommission,
    paidCommission,

    remainingPayableAmount:
      approvedCommission,
  };
}