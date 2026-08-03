"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  AffiliateApplication,
} from "@/components/admin/types";

type AffiliateApplicationsProps = {
  applications: AffiliateApplication[];

  reviewingApplicationId:
    | string
    | null;

  onApprove: (
    application: AffiliateApplication,
    commissionRate: number
  ) => Promise<void>;

  onReject: (
    applicationId: string
  ) => Promise<void>;
};

type AffiliateSortOption =
  | "newest"
  | "oldest"
  | "followers-high"
  | "followers-low"
  | "pending-first"
  | "approved-first"
  | "rejected-first";

const INITIAL_VISIBLE_COUNT = 8;

export function AffiliateApplications({
  applications,
  reviewingApplicationId,
  onApprove,
  onReject,
}: AffiliateApplicationsProps) {
  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState<
    AffiliateApplication | null
  >(null);

  const [showAll, setShowAll] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortBy, setSortBy] =
    useState<AffiliateSortOption>(
      "newest"
    );

  const filteredApplications =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const filtered =
        applications.filter(
          (application) => {
            if (!search) {
              return true;
            }

            const searchableText = [
              application.fullName,
              application.email,
              application.instagramUsername,
              application.contentCategory,
              application.status,
              application.affiliateCode,
              application.message,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            return searchableText.includes(
              search
            );
          }
        );

      return [...filtered].sort(
        (first, second) => {
          const firstFollowers =
            Number(
              first.followers || 0
            );

          const secondFollowers =
            Number(
              second.followers || 0
            );

          const firstTime =
            getTimestamp(
              first.createdAt
            );

          const secondTime =
            getTimestamp(
              second.createdAt
            );

          if (
            sortBy ===
            "followers-high"
          ) {
            return (
              secondFollowers -
              firstFollowers
            );
          }

          if (
            sortBy ===
            "followers-low"
          ) {
            return (
              firstFollowers -
              secondFollowers
            );
          }

          if (
            sortBy === "oldest"
          ) {
            return (
              firstTime - secondTime
            );
          }

          if (
            sortBy ===
            "pending-first"
          ) {
            return (
              getStatusPriority(
                first.status,
                "PENDING"
              ) -
              getStatusPriority(
                second.status,
                "PENDING"
              )
            );
          }

          if (
            sortBy ===
            "approved-first"
          ) {
            return (
              getStatusPriority(
                first.status,
                "APPROVED"
              ) -
              getStatusPriority(
                second.status,
                "APPROVED"
              )
            );
          }

          if (
            sortBy ===
            "rejected-first"
          ) {
            return (
              getStatusPriority(
                first.status,
                "REJECTED"
              ) -
              getStatusPriority(
                second.status,
                "REJECTED"
              )
            );
          }

          return (
            secondTime - firstTime
          );
        }
      );
    }, [
      applications,
      searchTerm,
      sortBy,
    ]);

  const displayedApplications =
    showAll
      ? filteredApplications
      : filteredApplications.slice(
          0,
          INITIAL_VISIBLE_COUNT
        );

  useEffect(() => {
    setShowAll(false);
  }, [searchTerm, sortBy]);

  return (
    <>
      <article className="admin-list">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                marginBottom: 4,
              }}
            >
              Affiliate applications
            </h2>

            <small
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {
                filteredApplications.length
              }{" "}
              of {applications.length}{" "}
              applications
            </small>
          </div>

          <SlidersHorizontal
            size={22}
          />
        </div>

        {applications.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) minmax(180px, 240px)",
              gap: 12,
              marginTop: 18,
              marginBottom: 18,
            }}
          >
            <label
              style={{
                position:
                  "relative",
              }}
            >
              <span
                style={{
                  position:
                    "absolute",
                  left: 13,
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  display: "grid",
                  pointerEvents:
                    "none",
                  color:
                    "var(--muted)",
                }}
              >
                <Search size={17} />
              </span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search creator, email or Instagram"
                style={{
                  paddingLeft: 40,
                }}
              />
            </label>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target
                    .value as AffiliateSortOption
                )
              }
              aria-label="Sort affiliate applications"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>

              <option value="followers-high">
                Most followers
              </option>

              <option value="followers-low">
                Fewest followers
              </option>

              <option value="pending-first">
                Unapproved first
              </option>

              <option value="approved-first">
                Approved first
              </option>

              <option value="rejected-first">
                Rejected first
              </option>
            </select>
          </div>
        ) : null}

        {applications.length === 0 ? (
          <p>
            No affiliate applications
            yet.
          </p>
        ) : null}

        {applications.length > 0 &&
        filteredApplications.length ===
          0 ? (
          <p>
            No applications match your
            search.
          </p>
        ) : null}

        {displayedApplications.map(
          (application) => (
            <button
              type="button"
              className="admin-row"
              key={application.id}
              onClick={() =>
                setSelectedApplication(
                  application
                )
              }
              style={{
                width: "100%",
                display: "flex",
                flexDirection:
                  "column",
                alignItems:
                  "stretch",
                gap: 10,
                cursor: "pointer",
                textAlign: "left",
                color: "inherit",
                font: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <strong>
                  {application.fullName ||
                    "Unknown creator"}
                </strong>

                <StatusBadge
                  status={
                    application.status
                  }
                />
              </div>

              <span>
                Email:{" "}
                {application.email ||
                  "-"}
              </span>

              <span>
                Instagram:{" "}
                {application
                  .instagramUsername ||
                  "-"}
              </span>

              <span>
                Followers:{" "}
                {Number(
                  application.followers ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}
              </span>

              <span>
                Submitted:{" "}
                {formatDate(
                  application.createdAt
                )}
              </span>

              {application.affiliateCode ? (
                <span>
                  Affiliate code:{" "}
                  <strong>
                    {
                      application.affiliateCode
                    }
                  </strong>
                </span>
              ) : null}

              <small
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                Click to view the complete
                application.
              </small>
            </button>
          )
        )}

        {filteredApplications.length >
          INITIAL_VISIBLE_COUNT ||
        showAll ? (
          <button
            type="button"
            className="button secondary"
            onClick={() =>
              setShowAll(
                (current) =>
                  !current
              )
            }
            style={{
              width: "100%",
              marginTop: 14,
            }}
          >
            {showAll ? (
              <>
                <ChevronUp
                  size={18}
                />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown
                  size={18}
                />
                Show All (
                {
                  filteredApplications.length
                }
                )
              </>
            )}
          </button>
        ) : null}
      </article>

      {selectedApplication ? (
        <AffiliateApplicationDetails
          application={
            selectedApplication
          }
          reviewing={
            reviewingApplicationId ===
            selectedApplication.id
          }
          onApprove={onApprove}
          onReject={onReject}
          onClose={() =>
            setSelectedApplication(
              null
            )
          }
        />
      ) : null}
    </>
  );
}

type AffiliateApplicationDetailsProps = {
  application: AffiliateApplication;
  reviewing: boolean;

  onApprove: (
    application: AffiliateApplication,
    commissionRate: number
  ) => Promise<void>;

  onReject: (
    applicationId: string
  ) => Promise<void>;

  onClose: () => void;
};

function AffiliateApplicationDetails({
  application,
  reviewing,
  onApprove,
  onReject,
  onClose,
}: AffiliateApplicationDetailsProps) {
  const [
    commissionRate,
    setCommissionRate,
  ] = useState(
    application.commissionRate ||
      10
  );

  useEffect(() => {
    setCommissionRate(
      application.commissionRate ||
        10
    );
  }, [
    application.id,
    application.commissionRate,
  ]);

  const alreadyReviewed =
    application.status ===
      "APPROVED" ||
    application.status ===
      "REJECTED";

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "grid",
        placeItems: "center",
        padding: 18,
        background:
          "rgba(0,0,0,0.78)",
        backdropFilter:
          "blur(8px)",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="affiliate-application-title"
        className="panel"
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          position: "relative",
          width:
            "min(850px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 28,
        }}
      >
        <button
          type="button"
          className="icon-link"
          aria-label="Close application"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <X size={18} />
        </button>

        <h2 id="affiliate-application-title">
          Affiliate Application
        </h2>

        <DetailRow
          label="Application ID"
          value={application.id}
        />

        <DetailRow
          label="Name"
          value={
            application.fullName
          }
        />

        <DetailRow
          label="Email"
          value={application.email}
        />

        <DetailRow
          label="Instagram username"
          value={
            application.instagramUsername
          }
        />

        <DetailRow
          label="Followers"
          value={Number(
            application.followers || 0
          ).toLocaleString("en-IN")}
        />

        <DetailRow
          label="Category"
          value={
            application.contentCategory
          }
        />

        <DetailRow
          label="Status"
          value={
            application.status ||
            "PENDING"
          }
        />

        <DetailRow
          label="Submitted"
          value={formatDate(
            application.createdAt
          )}
        />

        <DetailRow
          label="Reviewed"
          value={formatDate(
            application.reviewedAt
          )}
        />

        {application
          .instagramProfileUrl ? (
          <a
            className="button secondary"
            href={
              application.instagramProfileUrl
            }
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: 10,
            }}
          >
            <ExternalLink size={18} />
            Open Instagram Profile
          </a>
        ) : null}

        <hr />

        <h3>Creator message</h3>

        <div
          style={{
            padding: 16,
            border:
              "1px solid var(--line)",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            overflowWrap:
              "anywhere",
            lineHeight: 1.7,
          }}
        >
          {application.message ||
            "No message provided."}
        </div>

        {application.status ===
        "APPROVED" ? (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              border:
                "1px solid var(--line)",
              borderRadius: 8,
            }}
          >
            <DetailRow
              label="Affiliate code"
              value={
                application.affiliateCode
              }
            />

            <DetailRow
              label="Commission rate"
              value={`${
                application.commissionRate ||
                0
              }%`}
            />
          </div>
        ) : null}

        {!alreadyReviewed ? (
          <>
            <label
              style={{
                display: "block",
                marginTop: 20,
              }}
            >
              Commission rate (%)

              <input
                type="number"
                min={1}
                max={50}
                step={1}
                value={commissionRate}
                onChange={(event) =>
                  setCommissionRate(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </label>

            <div
              className="button-row"
              style={{
                marginTop: 22,
              }}
            >
              <button
                type="button"
                className="button primary"
                disabled={reviewing}
                onClick={() =>
                  onApprove(
                    application,
                    commissionRate
                  )
                }
              >
                {reviewing
                  ? "Processing..."
                  : "Approve Affiliate"}
              </button>

              <button
                type="button"
                className="button secondary"
                disabled={reviewing}
                onClick={() =>
                  onReject(
                    application.id
                  )
                }
              >
                Reject Application
              </button>
            </div>
          </>
        ) : null}

        <button
          type="button"
          className="button secondary"
          onClick={onClose}
          style={{
            marginTop: 20,
          }}
        >
          Close
        </button>
      </section>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | AffiliateApplication["status"]
    | undefined;
}) {
  const safeStatus =
    status || "PENDING";

  const background =
    safeStatus === "APPROVED"
      ? "rgba(34,197,94,0.15)"
      : safeStatus === "REJECTED"
        ? "rgba(244,63,94,0.15)"
        : "rgba(246,184,75,0.15)";

  return (
    <span
      style={{
        display: "inline-flex",
        width: "fit-content",
        padding: "5px 10px",
        borderRadius: 999,
        background,
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {safeStatus}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <p>
      <strong>{label}:</strong>{" "}
      <span
        style={{
          overflowWrap:
            "anywhere",
        }}
      >
        {String(value || "-")}
      </span>
    </p>
  );
}

function getStatusPriority(
  status: unknown,
  preferredStatus:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
) {
  return String(
    status || "PENDING"
  ).toUpperCase() === preferredStatus
    ? 0
    : 1;
}

function getTimestamp(
  value: unknown
) {
  const date =
    convertToDate(value);

  return date
    ? date.getTime()
    : 0;
}

function formatDate(
  value: unknown
) {
  const date =
    convertToDate(value);

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }
  ).format(date);
}

function convertToDate(
  value: unknown
): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(
      value.getTime()
    )
      ? null
      : value;
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value
  ) {
    const timestamp = value as {
      toDate?: unknown;
    };

    if (
      typeof timestamp.toDate ===
      "function"
    ) {
      const date =
        timestamp.toDate();

      return date instanceof Date
        ? date
        : null;
    }
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }

  return null;
}