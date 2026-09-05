"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Campaign attribution capture (Lead Backend Dev Handoff §6.1). Renders
 * nothing; it lives in the root layout so it runs on every page.
 *
 * The rule is "first touch wins": the moment a URL carries any UTM parameter
 * we snapshot all five plus the full landing URL. A later page without UTMs
 * leaves the snapshot alone, so someone who clicks an ad, browses, and then
 * books is still attributed to the ad that brought them.
 *
 * sessionStorage, not localStorage, on purpose — attribution should die with
 * the tab. A visitor who returns organically next week must not be credited to
 * last week's campaign.
 */

export const UTM_STORAGE_KEY = "aem_utm_data";
export const LANDING_PAGE_STORAGE_KEY = "aem_landing_page";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function UtmCapture() {
  // Deliberately not `useSearchParams()` — reading it in the root layout would
  // opt every page out of static rendering. `usePathname` re-runs the effect on
  // client-side navigation without that cost, and the query string is read
  // straight off `window.location`.
  const pathname = usePathname();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      // Nothing to capture: leave any existing snapshot untouched.
      if (!UTM_KEYS.some((k) => params.get(k))) return;

      // Store whatever is present — a missing utm_term must not discard the rest.
      const data: Record<string, string | null> = {};
      for (const key of UTM_KEYS) data[key] = params.get(key);

      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
      sessionStorage.setItem(LANDING_PAGE_STORAGE_KEY, window.location.href);
    } catch {
      // Private browsing, disabled storage, quota. Attribution is best-effort
      // and must never break the page it sits on.
    }
  }, [pathname]);

  return null;
}

/** Reads the snapshot back at submit time. Returns empty values, never throws. */
export function readUtmData(): {
  utm: Record<string, string | null>;
  landingPage: string | null;
} {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return {
      utm: raw ? (JSON.parse(raw) as Record<string, string | null>) : {},
      landingPage: sessionStorage.getItem(LANDING_PAGE_STORAGE_KEY),
    };
  } catch {
    return { utm: {}, landingPage: null };
  }
}
