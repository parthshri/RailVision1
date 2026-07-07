"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth");
        return;
      }

      if (!isAdmin) {
        router.push("/");
      }
    }
  }, [loading, user, isAdmin, router]);


  if (loading) {
    return (
      <section className="section">
        <h2>Checking permissions...</h2>
      </section>
    );
  }


  if (!isAdmin) {
    return null;
  }


  return <>{children}</>;
}