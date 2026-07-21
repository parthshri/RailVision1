"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Link2,
  PackageCheck,
  Wallet,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";

import {
  AffiliateDashboardData,
  getAffiliateDashboardData,
} from "@/lib/firestoreActions";

import {
  formatCurrency,
} from "@/lib/products";

export default function AffiliateDashboardPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    dashboard,
    setDashboard,
  ] = useState<
    AffiliateDashboardData | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user?.email) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const data =
          await getAffiliateDashboardData(
            user?.email || ""
          );

        if (active) {
          setDashboard(data);
        }
      } catch (dashboardError) {
        console.error(
          "Affiliate dashboard failed:",
          dashboardError
        );

        if (active) {
          setError(
            "Could not load affiliate dashboard."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [authLoading, user?.email]);

  const affiliateLink = useMemo(() => {
    if (!dashboard) {
      return "";
    }

    const siteUrl =
      process.env
        .NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "");

    return `${siteUrl}/shop?ref=${encodeURIComponent(
      dashboard.affiliateCode
    )}`;
  }, [dashboard]);

  async function copyAffiliateLink() {
    if (!affiliateLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        affiliateLink
      );

      toast.success(
        "Affiliate link copied."
      );
    } catch {
      toast.error(
        "Could not copy affiliate link."
      );
    }
  }

  if (authLoading || loading) {
    return (
      <section className="auth-screen">
        <div className="skeleton profile-skeleton" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="auth-screen">
        <div className="panel empty-state">
          <h1>
            Login to open your affiliate
            dashboard.
          </h1>

          <Link
            href="/auth"
            className="button primary"
          >
            Login
          </Link>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="auth-screen">
        <div className="panel empty-state">
          <h1>
            Could not load dashboard.
          </h1>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!dashboard) {
  return (
    <section className="auth-screen">
      <div className="panel empty-state">
        <h1>
          Affiliate account not active.
        </h1>

        <p>
          Logged-in email:
        </p>

        <strong>
          {user.email || "No email found"}
        </strong>

        <p
          style={{
            marginTop: 16,
          }}
        >
          This email must exactly match the
          email stored in the approved affiliate
          document.
        </p>

        <Link
          href="/affiliate"
          className="button primary"
        >
          Open Affiliate Page
        </Link>
      </div>
    </section>
  );
}

  const metrics = [
    {
      icon: PackageCheck,
      label:
        "Total referred orders",
      value: String(
        dashboard.totalReferredOrders
      ),
    },
    {
      icon: Clock3,
      label:
        "Pending commission",
      value: formatCurrency(
        dashboard.pendingCommission
      ),
    },
    {
      icon: CheckCircle2,
      label:
        "Approved commission",
      value: formatCurrency(
        dashboard.approvedCommission
      ),
    },
    {
      icon: BadgeIndianRupee,
      label:
        "Paid commission",
      value: formatCurrency(
        dashboard.paidCommission
      ),
    },
    {
      icon: Wallet,
      label:
        "Remaining payable amount",
      value: formatCurrency(
        dashboard.remainingPayableAmount
      ),
    },
  ];

  return (
    <>
      <section className="subhero">
        <span className="eyebrow">
          Affiliate dashboard
        </span>

        <h1>
          Welcome,{" "}
          {dashboard.affiliateName}
        </h1>

        <p>
          Track your referred orders and
          affiliate earnings.
        </p>
      </section>

      <section className="section analytics-grid">
        {metrics.map((metric) => (
          <article
            className="stat-card"
            key={metric.label}
          >
            <metric.icon size={28} />

            <span>{metric.value}</span>

            <p>{metric.label}</p>
          </article>
        ))}
      </section>

      <section className="section">
        <div
          className="panel"
          style={{
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <Link2 size={30} />

          <h2
            style={{
              marginTop: 14,
            }}
          >
            Your affiliate link
          </h2>

          <p>
            Share this link in your bio,
            reels, stories, or video
            descriptions.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: 16,
              border:
                "1px solid var(--line)",
              borderRadius: 8,
            }}
          >
            <code
              style={{
                flex: "1 1 320px",
                overflowWrap:
                  "anywhere",
              }}
            >
              {affiliateLink}
            </code>

            <button
              type="button"
              className="button primary"
              onClick={copyAffiliateLink}
            >
              <Copy size={18} />
              Copy Link
            </button>

            <a
              href={affiliateLink}
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              <ExternalLink size={18} />
              Open Link
            </a>
          </div>

          <p
            style={{
              marginTop: 18,
              color: "var(--muted)",
            }}
          >
            Commission rate:{" "}
            <strong>
              {
                dashboard.commissionRate
              }
              %
            </strong>
          </p>
        </div>
      </section>
    </>
  );
}