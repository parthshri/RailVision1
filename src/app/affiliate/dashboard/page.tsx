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
  Gift,
  Link2,
  PackageCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
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

type AffiliateDashboardWithWeeklySales =
  AffiliateDashboardData & {
    weeklyReferredOrders?: number;
  };

type BonusMilestone = {
  sales: number;
  bonus: number;
};

const BONUS_MILESTONES: BonusMilestone[] = [
  {
    sales: 5,
    bonus: 100,
  },
  {
    sales: 10,
    bonus: 300,
  },
  {
    sales: 20,
    bonus: 800,
  },
  {
    sales: 50,
    bonus: 2500,
  },
];

function getUnlockedBonus(
  weeklySales: number
) {
  return BONUS_MILESTONES.reduce(
    (highestBonus, milestone) => {
      if (
        weeklySales >= milestone.sales
      ) {
        return milestone.bonus;
      }

      return highestBonus;
    },
    0
  );
}

function getNextMilestone(
  weeklySales: number
) {
  return (
    BONUS_MILESTONES.find(
      (milestone) =>
        weeklySales < milestone.sales
    ) || null
  );
}

function getPreviousMilestoneSales(
  weeklySales: number
) {
  return BONUS_MILESTONES.reduce(
    (highestSales, milestone) => {
      if (
        weeklySales >= milestone.sales
      ) {
        return milestone.sales;
      }

      return highestSales;
    },
    0
  );
}

export default function AffiliateDashboardPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    dashboard,
    setDashboard,
  ] =
    useState<AffiliateDashboardData | null>(
      null
    );

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

  const weeklyTrackingData =
    dashboard as
      | AffiliateDashboardWithWeeklySales
      | null;

  const weeklySales = Math.max(
    0,
    Number(
      weeklyTrackingData
        ?.weeklyReferredOrders ?? 0
    )
  );

  const weeklySalesAvailable =
    typeof weeklyTrackingData
      ?.weeklyReferredOrders === "number";

  const unlockedBonus =
    getUnlockedBonus(weeklySales);

  const nextMilestone =
    getNextMilestone(weeklySales);

  const previousMilestoneSales =
    getPreviousMilestoneSales(
      weeklySales
    );

  const salesNeeded =
    nextMilestone
      ? Math.max(
          0,
          nextMilestone.sales -
            weeklySales
        )
      : 0;

  const milestoneProgress =
    nextMilestone
      ? Math.min(
          100,
          Math.max(
            0,
            ((weeklySales -
              previousMilestoneSales) /
              (nextMilestone.sales -
                previousMilestoneSales)) *
              100
          )
        )
      : 100;

  useEffect(() => {
    if (
      !dashboard ||
      !weeklySalesAvailable ||
      typeof window === "undefined"
    ) {
      return;
    }

    const notificationKey = [
      "affiliate-weekly-bonus",
      dashboard.affiliateCode,
      weeklySales,
    ].join("-");

    const alreadyShown =
      window.sessionStorage.getItem(
        notificationKey
      );

    if (alreadyShown) {
      return;
    }

    if (nextMilestone) {
      toast.success(
        `Only ${salesNeeded} more ${
          salesNeeded === 1
            ? "sale"
            : "sales"
        } to unlock ${formatCurrency(
          nextMilestone.bonus
        )} bonus!`,
        {
          duration: 6000,
          icon: "🚀",
        }
      );
    } else {
      toast.success(
        "Amazing! You unlocked the highest weekly bonus.",
        {
          duration: 6000,
          icon: "🏆",
        }
      );
    }

    window.sessionStorage.setItem(
      notificationKey,
      "shown"
    );
  }, [
    dashboard,
    weeklySales,
    weeklySalesAvailable,
    nextMilestone,
    salesNeeded,
  ]);

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

          <p>Logged-in email:</p>

          <strong>
            {user.email ||
              "No email found"}
          </strong>

          <p
            style={{
              marginTop: 16,
            }}
          >
            This email must exactly match
            the email stored in the
            approved affiliate document.
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
          Track your referred orders,
          commission and weekly bonus
          progress.
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
            position: "relative",
            maxWidth: 1000,
            margin: "0 auto",
            overflow: "hidden",
            border:
              "1px solid rgba(37, 99, 235, 0.28)",
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(124, 58, 237, 0.08), var(--surface))",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              right: -80,
              top: -90,
              borderRadius: "50%",
              background:
                "rgba(37, 99, 235, 0.12)",
              filter: "blur(10px)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems:
                    "flex-start",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "#ffffff",
                  }}
                >
                  <Trophy size={28} />
                </div>

                <div>
                  <span className="eyebrow">
                    New affiliate rewards
                  </span>

                  <h2
                    style={{
                      marginTop: 6,
                      marginBottom: 8,
                    }}
                  >
                    Weekly Bonus Tracker
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      maxWidth: 650,
                    }}
                  >
                    Earn your regular{" "}
                    <strong>
                      {
                        dashboard.commissionRate
                      }
                      % commission
                    </strong>{" "}
                    on every successful
                    order, plus weekly
                    milestone bonuses.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    minWidth: 145,
                    padding: "12px 16px",
                    border:
                      "1px solid var(--line)",
                    borderRadius: 12,
                    background:
                      "var(--surface)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color:
                        "var(--muted)",
                      fontSize: 13,
                    }}
                  >
                    Sales this week
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: 4,
                      fontSize: 24,
                    }}
                  >
                    {weeklySales}
                  </strong>
                </div>

                <div
                  style={{
                    minWidth: 145,
                    padding: "12px 16px",
                    border:
                      "1px solid var(--line)",
                    borderRadius: 12,
                    background:
                      "var(--surface)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color:
                        "var(--muted)",
                      fontSize: 13,
                    }}
                  >
                    Bonus unlocked
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: 4,
                      fontSize: 24,
                    }}
                  >
                    {formatCurrency(
                      unlockedBonus
                    )}
                  </strong>
                </div>
              </div>
            </div>

            {!weeklySalesAvailable && (
              <div
                style={{
                  marginTop: 22,
                  padding: "14px 16px",
                  borderRadius: 10,
                  border:
                    "1px solid rgba(245, 158, 11, 0.4)",
                  background:
                    "rgba(245, 158, 11, 0.1)",
                }}
              >
                <strong>
                  Weekly tracking is not
                  connected yet.
                </strong>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                  }}
                >
                  Add{" "}
                  <code>
                    weeklyReferredOrders
                  </code>{" "}
                  to the data returned by{" "}
                  <code>
                    getAffiliateDashboardData()
                  </code>
                  .
                </p>
              </div>
            )}

            {weeklySalesAvailable && (
              <>
                <div
                  style={{
                    marginTop: 28,
                    padding: 20,
                    border:
                      "1px solid var(--line)",
                    borderRadius: 14,
                    background:
                      "var(--surface)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 8,
                        }}
                      >
                        <Target
                          size={20}
                        />

                        <strong>
                          {nextMilestone
                            ? `Next target: ${nextMilestone.sales} sales`
                            : "All milestones completed"}
                        </strong>
                      </div>

                      <p
                        style={{
                          margin:
                            "8px 0 0",
                          color:
                            "var(--muted)",
                        }}
                      >
                        {nextMilestone
                          ? `You have completed ${weeklySales} of ${nextMilestone.sales} sales.`
                          : "You reached the highest weekly bonus milestone."}
                      </p>
                    </div>

                    {nextMilestone ? (
                      <div
                        style={{
                          padding:
                            "10px 14px",
                          borderRadius:
                            999,
                          fontWeight: 700,
                          background:
                            "rgba(37, 99, 235, 0.12)",
                          color:
                            "var(--text)",
                        }}
                      >
                        {salesNeeded} more{" "}
                        {salesNeeded === 1
                          ? "sale"
                          : "sales"}
                      </div>
                    ) : (
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 8,
                          padding:
                            "10px 14px",
                          borderRadius:
                            999,
                          fontWeight: 700,
                          background:
                            "rgba(34, 197, 94, 0.14)",
                        }}
                      >
                        <Sparkles
                          size={18}
                        />
                        Maximum unlocked
                      </div>
                    )}
                  </div>

                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(
                      milestoneProgress
                    )}
                    aria-label="Weekly bonus milestone progress"
                    style={{
                      height: 14,
                      marginTop: 20,
                      overflow: "hidden",
                      borderRadius: 999,
                      background:
                        "rgba(148, 163, 184, 0.22)",
                    }}
                  >
                    <div
                      style={{
                        width: `${milestoneProgress}%`,
                        height: "100%",
                        borderRadius:
                          999,
                        background:
                          "linear-gradient(90deg, #2563eb, #7c3aed)",
                        transition:
                          "width 500ms ease",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 12,
                      marginTop: 10,
                      fontSize: 13,
                      color:
                        "var(--muted)",
                    }}
                  >
                    <span>
                      {
                        previousMilestoneSales
                      }{" "}
                      sales
                    </span>

                    <span>
                      {nextMilestone
                        ? `${nextMilestone.sales} sales`
                        : "Completed"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 18,
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: 12,
                    background:
                      nextMilestone
                        ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(124, 58, 237, 0.12))"
                        : "rgba(34, 197, 94, 0.14)",
                  }}
                >
                  {nextMilestone ? (
                    <TrendingUp
                      size={24}
                    />
                  ) : (
                    <Trophy size={24} />
                  )}

                  <div>
                    <strong
                      style={{
                        display: "block",
                      }}
                    >
                      {nextMilestone
                        ? `Do ${salesNeeded} more ${
                            salesNeeded ===
                            1
                              ? "sale"
                              : "sales"
                          } to unlock a ${formatCurrency(
                            nextMilestone.bonus
                          )} bonus!`
                        : `You unlocked the maximum ${formatCurrency(
                            unlockedBonus
                          )} weekly bonus!`}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        marginTop: 4,
                        color:
                          "var(--muted)",
                      }}
                    >
                      More sales means more
                      commission plus a
                      bigger weekly bonus.
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: 14,
                    marginTop: 22,
                  }}
                >
                  {BONUS_MILESTONES.map(
                    (milestone) => {
                      const unlocked =
                        weeklySales >=
                        milestone.sales;

                      const current =
                        nextMilestone
                          ?.sales ===
                        milestone.sales;

                      return (
                        <article
                          key={
                            milestone.sales
                          }
                          style={{
                            padding: 18,
                            borderRadius: 14,
                            border:
                              unlocked
                                ? "1px solid rgba(34, 197, 94, 0.45)"
                                : current
                                  ? "1px solid rgba(37, 99, 235, 0.45)"
                                  : "1px solid var(--line)",
                            background:
                              unlocked
                                ? "rgba(34, 197, 94, 0.10)"
                                : current
                                  ? "rgba(37, 99, 235, 0.08)"
                                  : "var(--surface)",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              gap: 10,
                            }}
                          >
                            <Gift
                              size={24}
                            />

                            <span
                              style={{
                                display:
                                  "inline-flex",
                                alignItems:
                                  "center",
                                gap: 5,
                                padding:
                                  "5px 9px",
                                borderRadius:
                                  999,
                                fontSize:
                                  12,
                                fontWeight:
                                  700,
                                background:
                                  unlocked
                                    ? "rgba(34, 197, 94, 0.16)"
                                    : "rgba(148, 163, 184, 0.16)",
                              }}
                            >
                              {unlocked ? (
                                <>
                                  <CheckCircle2
                                    size={
                                      14
                                    }
                                  />
                                  Unlocked
                                </>
                              ) : current ? (
                                "Next target"
                              ) : (
                                "Locked"
                              )}
                            </span>
                          </div>

                          <strong
                            style={{
                              display:
                                "block",
                              marginTop:
                                16,
                              fontSize:
                                21,
                            }}
                          >
                            {
                              milestone.sales
                            }{" "}
                            Sales
                          </strong>

                          <span
                            style={{
                              display:
                                "block",
                              marginTop:
                                6,
                              fontSize:
                                18,
                              fontWeight:
                                700,
                            }}
                          >
                            {formatCurrency(
                              milestone.bonus
                            )}{" "}
                            Bonus
                          </span>
                        </article>
                      );
                    }
                  )}
                </div>

                <p
                  style={{
                    margin:
                      "18px 0 0",
                    color:
                      "var(--muted)",
                    fontSize: 13,
                  }}
                >
                  The highest milestone
                  reached during the week
                  determines the weekly
                  bonus. Cancelled,
                  refunded or unsuccessful
                  orders should not count
                  toward weekly sales.
                </p>
              </>
            )}
          </div>
        </div>
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
            reels, stories, YouTube Shorts
            or video descriptions.
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
              {dashboard.commissionRate}%
            </strong>
          </p>
        </div>
      </section>
    </>
  );
}