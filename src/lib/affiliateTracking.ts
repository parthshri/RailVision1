export const AFFILIATE_STORAGE_KEY =
  "railvision_affiliate";

const AFFILIATE_EXPIRY_DAYS = 30;

export type StoredAffiliate = {
  code: string;
  savedAt: number;
  expiresAt: number;
};

export function cleanAffiliateCode(
  value: string
) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 30);
}

export function saveAffiliateCode(
  rawCode: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const code = cleanAffiliateCode(rawCode);

  if (!code) {
    return;
  }

  const now = Date.now();

  const affiliate: StoredAffiliate = {
    code,
    savedAt: now,
    expiresAt:
      now +
      AFFILIATE_EXPIRY_DAYS *
        24 *
        60 *
        60 *
        1000,
  };

  localStorage.setItem(
    AFFILIATE_STORAGE_KEY,
    JSON.stringify(affiliate)
  );
}

export function getAffiliateCode():
  | string
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = localStorage.getItem(
    AFFILIATE_STORAGE_KEY
  );

  if (!saved) {
    return null;
  }

  try {
    const affiliate = JSON.parse(
      saved
    ) as StoredAffiliate;

    if (
      !affiliate.code ||
      !affiliate.expiresAt
    ) {
      localStorage.removeItem(
        AFFILIATE_STORAGE_KEY
      );

      return null;
    }

    if (Date.now() > affiliate.expiresAt) {
      localStorage.removeItem(
        AFFILIATE_STORAGE_KEY
      );

      return null;
    }

    return cleanAffiliateCode(
      affiliate.code
    );
  } catch {
    localStorage.removeItem(
      AFFILIATE_STORAGE_KEY
    );

    return null;
  }
}

export function removeAffiliateCode() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    AFFILIATE_STORAGE_KEY
  );
}