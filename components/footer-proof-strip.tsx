"use client";

import { useAppState } from "@/components/state-context";

/**
 * State-aware one-line accreditation proof for the footer (rewrite doc). Shows
 * the Victorian line by default until a state is chosen, and swaps to the NSW
 * scheme names once the visitor selects New South Wales.
 */
const PROOF = {
  vic: "Accredited Person under VEU. Re-tested every year. Whole chain in house. Operating since 2009.",
  nsw: "Accredited Certificate Provider under ESS and PDRS. Re-tested every year. Whole chain in house. Operating since 2009.",
} as const;

export function FooterProofStrip() {
  const { state } = useAppState();
  return (
    <p className="text-xs font-medium text-white/55">{PROOF[state ?? "vic"]}</p>
  );
}
