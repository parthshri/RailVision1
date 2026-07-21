"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ExternalLink,
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

  return (
    <>
      <article className="admin-list">
        <h2>
          Affiliate applications
        </h2>

        {applications.length === 0 ? (
          <p>
            No affiliate applications yet.
          </p>
        ) : null}

        {applications.map(
          (application) => (
            <div
              className="admin-row"
              key={application.id}
              onClick={() =>
                setSelectedApplication(
                  application
                )
              }
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <strong>
                {application.fullName ||
                  "Unknown creator"}
              </strong>

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
                Status:{" "}
                <strong>
                  {application.status ||
                    "PENDING"}
                </strong>
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
            </div>
          )
        )}
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
            setSelectedApplication(null)
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
    application.commissionRate || 10
  );

  useEffect(() => {
    setCommissionRate(
      application.commissionRate || 10
    );
  }, [
    application.id,
    application.commissionRate,
  ]);

  const alreadyReviewed =
    application.status === "APPROVED" ||
    application.status === "REJECTED";

  return (
    <section className="section">
      <div
        className="panel"
        style={{
          position: "relative",
          maxWidth: 850,
          margin: "0 auto",
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

        <h2>
          Affiliate Application
        </h2>

        <p>
          <strong>Name:</strong>{" "}
          {application.fullName || "-"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {application.email || "-"}
        </p>

        <p>
          <strong>
            Instagram username:
          </strong>{" "}
          {application
            .instagramUsername || "-"}
        </p>

        <p>
          <strong>Followers:</strong>{" "}
          {Number(
            application.followers || 0
          ).toLocaleString("en-IN")}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {application.contentCategory ||
            "-"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {application.status ||
            "PENDING"}
        </p>

        {application
          .instagramProfileUrl ? (
          <a
            className="button secondary"
            href={
              application.instagramProfileUrl
            }
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={18} />
            Open Instagram Profile
          </a>
        ) : null}

        <hr />

        <h3>Creator message</h3>

        <p>
          {application.message ||
            "No message provided."}
        </p>

        {application.status ===
        "APPROVED" ? (
          <div
            style={{
              padding: 16,
              border:
                "1px solid var(--line)",
              borderRadius: 8,
            }}
          >
            <p>
              <strong>
                Affiliate code:
              </strong>{" "}
              {application.affiliateCode ||
                "-"}
            </p>

            <p>
              <strong>
                Commission rate:
              </strong>{" "}
              {application.commissionRate ||
                0}
              %
            </p>
          </div>
        ) : null}

        {!alreadyReviewed ? (
          <>
            <label
              style={{
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
      </div>
    </section>
  );
}