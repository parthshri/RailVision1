"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { addProInquiry } from "@/lib/firestoreActions";

export function InquiryForm() {
  const [loading, setLoading] = useState(false);

async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setLoading(true);

  const form = new FormData(event.currentTarget);

  try {
    await addProInquiry({
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company"),
      fleetSize: form.get("fleetSize"),
      message: form.get("message"),
    });

    (event.target as HTMLFormElement).reset();

    toast.success(
      "Inquiry received. Our enterprise team will reach out."
    );
  } catch (error) {
    console.error("Pro inquiry error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Could not submit inquiry. Please try again."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <label>
        Name
        <input required name="name" placeholder="Your name" />
      </label>
      <label>
        Work email
        <input required type="email" name="email" placeholder="you@company.com" />
      </label>
      <label>
        Organization
        <input required name="company" placeholder="Rail operator or agency" />
      </label>
      <label>
        Fleet size
        <input name="fleetSize" placeholder="Example: 120 coaches" />
      </label>
      <label className="full">
        Deployment goals
        <textarea required name="message" placeholder="Tell us about the routes, assets, and inspection challenges." />
      </label>
      <button className="button primary full" disabled={loading}>
        {loading ? "Submitting..." : "Request Enterprise Demo"}
      </button>
    </form>
  );
}
