"use client";

import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
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