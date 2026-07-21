"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import toast from "react-hot-toast";

import {
  BadgeIndianRupee,
  CheckCircle2,
  Instagram,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

import {
  addAffiliateApplication,
} from "@/lib/firestoreActions";

export default function AffiliatePage() {
  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  async function submitApplication(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const formElement =
      event.currentTarget;

    const form =
      new FormData(formElement);

    const fullName = String(
      form.get("fullName") || ""
    ).trim();

    const email = String(
      form.get("email") || ""
    ).trim();

    const instagramUsername = String(
      form.get("instagramUsername") || ""
    ).trim();

    const instagramProfileUrl = String(
      form.get("instagramProfileUrl") || ""
    ).trim();

    const followers = Number(
      form.get("followers") || 0
    );

    const contentCategory = String(
      form.get("contentCategory") || ""
    ).trim();

    const message = String(
      form.get("message") || ""
    ).trim();

    if (
      !fullName ||
      !email ||
      !instagramUsername ||
      !instagramProfileUrl ||
      !contentCategory
    ) {
      toast.error(
        "Complete all required fields."
      );
      return;
    }

    if (
      !Number.isFinite(followers) ||
      followers < 0
    ) {
      toast.error(
        "Enter a valid follower count."
      );
      return;
    }

    setSubmitting(true);

    try {
      await addAffiliateApplication({
        fullName,
        email,
        instagramUsername,
        instagramProfileUrl,
        followers,
        contentCategory,
        message,
      });

      formElement.reset();

      toast.success(
        "Affiliate application submitted successfully."
      );
    } catch (error: unknown) {
      console.error(
        "Affiliate application failed:",
        error
      );

      const errorCode =
        typeof error === "object" &&
        error !== null &&
        "code" in error
          ? String(error.code)
          : "";

      if (
        errorCode ===
        "permission-denied"
      ) {
        toast.error(
          "Firestore blocked the application. Check and publish your Firestore rules."
        );
      } else if (
        errorCode === "unavailable"
      ) {
        toast.error(
          "Firebase is temporarily unavailable. Check your internet connection."
        );
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not submit your application."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="subhero">
        <span className="eyebrow">
          RailVision Affiliate Programme
        </span>

        <h1>
          Promote innovative STEM products
          and earn from successful sales.
        </h1>

        <p>
          Create reels, posts, and videos
          about RailVision products. Earn a
          commission when customers purchase
          through your affiliate link.
        </p>

        <Link
          href="/affiliate/dashboard"
          className="button secondary"
          style={{
            marginTop: 18,
          }}
        >
          <LayoutDashboard size={18} />
          Open Affiliate Dashboard
        </Link>
      </section>

      <section className="section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
            marginBottom: 34,
          }}
        >
          <AffiliateBenefit
            icon={Instagram}
            title="Share content"
            text="Promote RailVision through Instagram Reels, stories, posts, and other social platforms."
          />

          <AffiliateBenefit
            icon={BadgeIndianRupee}
            title="Earn commission"
            text="Receive commission from eligible orders placed using your unique affiliate link."
          />

          <AffiliateBenefit
            icon={UsersRound}
            title="Small creators welcome"
            text="Creators with engaged STEM, education, electronics, or student audiences can apply."
          />
        </div>

        <form
          className="panel form-grid"
          onSubmit={submitApplication}
          style={{
            maxWidth: 850,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              gridColumn: "1 / -1",
            }}
          >
            <span className="eyebrow">
              Creator application
            </span>

            <h2>
              Apply to become a RailVision
              affiliate
            </h2>

            <p>
              Applications are reviewed
              manually. Providing false
              follower or profile information
              may lead to rejection.
            </p>
          </div>

          <label>
            Full name

            <input
              required
              name="fullName"
              type="text"
              placeholder="Your full name"
              maxLength={80}
            />
          </label>

          <label>
            Email address

            <input
              required
              name="email"
              type="email"
              placeholder="you@example.com"
              maxLength={120}
            />
          </label>

          <label>
            Instagram username

            <input
              required
              name="instagramUsername"
              type="text"
              placeholder="@yourusername"
              maxLength={50}
            />
          </label>

          <label>
            Instagram profile link

            <input
              required
              name="instagramProfileUrl"
              type="url"
              placeholder="https://instagram.com/yourusername"
              maxLength={250}
            />
          </label>

          <label>
            Followers

            <input
              required
              name="followers"
              type="number"
              min={0}
              step={1}
              placeholder="10000"
            />
          </label>

          <label>
            Content category

            <select
              required
              name="contentCategory"
              defaultValue=""
            >
              <option
                value=""
                disabled
              >
                Select category
              </option>

              <option value="STEM">
                STEM and science
              </option>

              <option value="Electronics">
                Electronics and Arduino
              </option>

              <option value="Education">
                Education and student content
              </option>

              <option value="Robotics">
                Robotics and engineering
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </label>

          <label
            style={{
              gridColumn: "1 / -1",
            }}
          >
            Why would you like to promote
            RailVision?

            <textarea
              name="message"
              rows={5}
              placeholder="Tell us about your audience and the kind of content you create."
              maxLength={1000}
            />
          </label>

          <div
            style={{
              gridColumn: "1 / -1",
              padding: 16,
              border:
                "1px solid var(--line)",
              borderRadius: 8,
            }}
          >
            <strong>
              Important conditions
            </strong>

            <ul className="check-list">
              <li>
                <CheckCircle2 size={18} />
                Commission applies only to
                eligible delivered orders.
              </li>

              <li>
                <CheckCircle2 size={18} />
                Cancelled, returned, fake, or
                unpaid orders do not earn
                commission.
              </li>

              <li>
                <CheckCircle2 size={18} />
                Affiliate partnerships must
                be disclosed clearly in
                promotional content.
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="button primary"
            disabled={submitting}
            style={{
              gridColumn: "1 / -1",
            }}
          >
            {submitting
              ? "Submitting..."
              : "Submit Application"}
          </button>
        </form>
      </section>
    </>
  );
}

function AffiliateBenefit({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Instagram;
  title: string;
  text: string;
}) {
  return (
    <article className="panel">
      <Icon size={28} />

      <h3
        style={{
          marginTop: 14,
        }}
      >
        {title}
      </h3>

      <p>{text}</p>
    </article>
  );
}