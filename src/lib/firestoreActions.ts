"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type PlainObject = Record<string, unknown>;

export async function addContact(payload: PlainObject) {
  if (!db) throw new Error("Firebase is not configured yet.");
  return addDoc(collection(db, "contacts"), {
    ...payload,
    createdAt: serverTimestamp(),
    status: "new"
  });
}

export async function addProInquiry(payload: PlainObject) {
  if (!db) throw new Error("Firebase is not configured yet.");
  return addDoc(collection(db, "proInquiries"), {
    ...payload,
    createdAt: serverTimestamp(),
    status: "new"
  });
}

export async function addNotificationSignup(payload: PlainObject) {
  if (!db) throw new Error("Firebase is not configured yet.");
  return addDoc(collection(db, "notifications"), {
    ...payload,
    createdAt: serverTimestamp()
  });
}
