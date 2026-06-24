"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3, ImageUp, Mail, Package, UsersRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { formatCurrency, products } from "@/lib/products";

type FirestoreDoc = Record<string, unknown> & { id: string };

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<FirestoreDoc[]>([]);
  const [contacts, setContacts] = useState<FirestoreDoc[]>([]);
  const [inquiries, setInquiries] = useState<FirestoreDoc[]>([]);
  const [customers, setCustomers] = useState<FirestoreDoc[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAdmin || !db) return;
    const unsubscribers = [
      onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snapshot) =>
        setOrders(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
      ),
      onSnapshot(query(collection(db, "contacts"), orderBy("createdAt", "desc")), (snapshot) =>
        setContacts(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
      ),
      onSnapshot(query(collection(db, "proInquiries"), orderBy("createdAt", "desc")), (snapshot) =>
        setInquiries(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
      ),
      onSnapshot(collection(db, "users"), (snapshot) =>
        setCustomers(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
      )
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [isAdmin]);

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  async function uploadImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const productId = String(form.get("productId"));
    const file = form.get("image");

    if (!(file instanceof File) || !file.size) {
      toast.error("Choose an image first.");
      return;
    }

    if (!db || !storage) {
      toast.error("Firebase is not configured yet.");
      return;
    }

    setUploading(true);
    try {
      const imageRef = ref(storage, `product-images/${productId}/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      await setDoc(doc(db, "products", productId), { imageUrl }, { merge: true });
      event.currentTarget.reset();
      toast.success("Product image updated.");
    } catch {
      toast.error("Upload failed. Check Firebase Storage rules and admin access.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <section className="auth-screen"><div className="skeleton profile-skeleton" /></section>;
  }

  if (!user || !isAdmin) {
    return (
      <section className="auth-screen">
        <div className="panel empty-state">
          <h1>Admin access required.</h1>
          <p>Login with an email listed in NEXT_PUBLIC_ADMIN_EMAILS.</p>
          <Link className="button primary" href="/auth">Login</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="subhero">
        <span className="eyebrow">Admin dashboard</span>
        <h1>Operate RailVision commerce, inquiries, customers, and analytics.</h1>
        <p>For production, pair this UI with Firebase custom admin claims and the included rules.</p>
      </section>

      <section className="section analytics-grid">
        {[
          { icon: BarChart3, label: "Sales", value: formatCurrency(revenue) },
          { icon: Package, label: "Orders", value: String(orders.length) },
          { icon: UsersRound, label: "Customers", value: String(customers.length) },
          { icon: Mail, label: "Pro inquiries", value: String(inquiries.length) }
        ].map((metric) => (
          <div className="stat-card" key={metric.label}>
            <metric.icon size={28} />
            <span>{metric.value}</span>
            <p>{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="section split">
        <div>
          <span className="eyebrow">Manage products</span>
          <h2>Upload replaceable product images.</h2>
          <p>Images are stored in Firebase Storage and linked to Firestore product documents.</p>
        </div>
        <form className="panel form-grid single" onSubmit={uploadImage}>
          <label>
            Product
            <select name="productId">
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </label>
          <label>
            Product image
            <input required type="file" name="image" accept="image/*" />
          </label>
          <button className="button primary" disabled={uploading}>
            <ImageUp size={18} /> {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </section>

      <section className="section admin-tables">
        <AdminList title="Orders" items={orders} fields={["customerEmail", "status", "total"]} />
        <AdminList title="Customers" items={customers} fields={["email", "name"]} />
        <AdminList title="RailVision Pro inquiries" items={inquiries} fields={["email", "company", "fleetSize"]} />
        <AdminList title="Contact messages" items={contacts} fields={["email", "subject", "message"]} />
      </section>
    </>
  );
}

function AdminList({
  title,
  items,
  fields
}: {
  title: string;
  items: FirestoreDoc[];
  fields: string[];
}) {
  return (
    <article className="admin-list">
      <h2>{title}</h2>
      {items.length === 0 ? <p>No records yet.</p> : null}
      {items.slice(0, 8).map((item) => (
        <div className="admin-row" key={item.id}>
          <strong>{item.id.slice(0, 8)}</strong>
          {fields.map((field) => (
            <span key={field}>{String(item[field] ?? "-")}</span>
          ))}
        </div>
      ))}
    </article>
  );
}
