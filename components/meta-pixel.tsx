"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Which Meta Pixel event each lead form fires on a successful submit.
 *   booking     → Lead (the real conversion: someone requesting a visit)
 *   contact     → Contact (standard event, general enquiry)
 *   eligibility → EligibilityQuizComplete (custom, top-of-funnel signal only)
 */
const CONVERSION_EVENTS = {
  booking: ["track", "Lead"],
  contact: ["track", "Contact"],
  eligibility: ["trackCustom", "EligibilityQuizComplete"],
} as const;

export type PixelConversion = keyof typeof CONVERSION_EVENTS;

export function trackConversion(kind: PixelConversion) {
  window.fbq?.(...CONVERSION_EVENTS[kind]);
}

/**
 * The base Pixel snippet in app/layout.tsx fires PageView on the hard load only.
 * This fires it again on every client-side (next/link) navigation.
 */
export function MetaPixelPageViews() {
  const pathname = usePathname();
  // Start at the initial path so the first render doesn't double-count the
  // base snippet's PageView (also safe under StrictMode's double effect run).
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
