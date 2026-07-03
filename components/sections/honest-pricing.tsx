"use client";

import { useAppState } from "@/components/state-context";
import { Eyebrow } from "@/components/ui/section";
import { CheckIcon } from "@/components/icons";

/**
 * "Why we'll never tell you it's free" — the strongest section on the site
 * (rewrite doc). State-aware: the first paragraph differs between Victoria (VEU
 * minimum contribution + set co-payments) and New South Wales (ESS/PDRS, some
 * jobs near zero). Defaults to the Victorian wording until a state is chosen.
 * Renders the inner two-column content; wrap it in a `<Section tone="ink">`.
 */
const BODY_1 = {
  vic: "There is no such thing as a completely free upgrade under the VEU program. A minimum customer contribution always applies, and some upgrades carry a larger set co-payment on top. A provider promising a fully free system is either cutting a corner or not following the rules.",
  nsw: "In New South Wales the discount comes through the Energy Savings Scheme and the Peak Demand Reduction Scheme, and how far it goes depends on the upgrade. Some jobs are heavily discounted, a few come close to no upfront cost, but a provider promising everything for free is not being straight with you.",
} as const;

const PANEL: [string, string][] = [
  [
    "What you'll hear from us",
    "“A genuine upfront discount.” “Here's what you'll actually pay.”",
  ],
  [
    "What you won't hear",
    "“One hundred percent free.” “No cost to you.” “Government funded giveaway.”",
  ],
  [
    "Why it matters",
    "A free claim is usually a compliance red flag, and a quiet way to hide the real price.",
  ],
];

export function HonestPricing() {
  const { state } = useAppState();
  const body1 = BODY_1[state ?? "vic"];

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <Eyebrow onInk>Honest pricing</Eyebrow>
        <h2 className="text-h2 mt-4 text-white">
          Why we'll never tell you it's “free”.
        </h2>
        <p className="mt-5 text-white/70">{body1}</p>
        <p className="mt-4 text-white/70">
          We talk about a{" "}
          <strong className="text-white">genuine upfront discount</strong> and
          what you'll actually pay. That is the honest version, and a provider
          who can quote it that way is one who knows the rules well enough to get
          your numbers right.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <ul className="space-y-4">
          {PANEL.map(([h, b]) => (
            <li key={h} className="flex gap-3">
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand" />
              <span>
                <span className="block font-semibold text-white">{h}</span>
                <span className="block text-sm text-white/65">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
