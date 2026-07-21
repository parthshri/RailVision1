"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  cleanAffiliateCode,
  saveAffiliateCode,
} from "@/lib/affiliateTracking";

export function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const referralCode =
      searchParams.get("ref");

    if (!referralCode) {
      return;
    }

    const cleanedCode =
      cleanAffiliateCode(referralCode);

    if (!cleanedCode) {
      return;
    }

    saveAffiliateCode(cleanedCode);
  }, [searchParams]);

  return null;
}