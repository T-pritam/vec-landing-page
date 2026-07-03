"use client";

import { useAppState } from "@/components/state-context";
import { SectionHeader } from "@/components/ui/section";
import { ArrowLink } from "@/components/ui/button";
import { StackingCalculator } from "@/components/calculator/stacking-calculator";
import { INCENTIVE_LAYERS } from "@/lib/rebates";

/**
 * The stacking story (rewrite doc). State-aware: Victoria stacks three programs
 * (VEU + Solar Victoria + STC) and gets the live calculator; New South Wales
 * stacks the ESS/PDRS scheme discounts with federal STCs. The interactive
 * calculator models Victorian figures only, so NSW shows the accurate scheme
 * cards plus a route to a personalised eligibility check rather than fabricated
 * NSW maths. Defaults to the Victorian view until a state is chosen.
 */

const VIC_TITLE = "Three programs. One combined value.";
const NSW_TITLE = "Two schemes, plus federal certificates.";

const VIC_INTRO =
  "Most providers explain one rebate and leave it there. In Victoria you can often combine three: the VEU discount, a Solar Victoria rebate and federal STCs, into a single larger figure. Here's roughly how they stack for your situation, shown as a range rather than a best-case headline.";
const NSW_INTRO =
  "Most providers explain one discount and leave it there. In New South Wales you can often combine a state scheme discount, through the Energy Savings Scheme or the Peak Demand Reduction Scheme, with federal STCs. Here's roughly how they stack for your situation, shown as a range.";

const NSW_CARDS = [
  {
    short: "NSW ESS",
    blurb:
      "A certificate-based discount under the Energy Savings Scheme, taken off your price upfront. Not income tested.",
    incomeTested: false,
  },
  {
    short: "PDRS",
    blurb:
      "A peak-demand discount on eligible gear such as air conditioners, applied upfront. Not income tested.",
    incomeTested: false,
  },
  {
    short: "STC",
    blurb:
      "Federal certificates for eligible solar and heat-pump hot water, taken off your price upfront. The value steps down a little each year.",
    incomeTested: false,
  },
];

const INDICATIVE_NOTE =
  "Indicative figures only. Not a quote and not a guarantee. Your real number is confirmed in writing before you commit.";

export function StackingSection({
  eyebrow = "The stacking story",
  title,
  showLayers = true,
}: {
  eyebrow?: string;
  title?: string;
  showLayers?: boolean;
}) {
  const { state } = useAppState();
  const isNsw = state === "nsw";

  return (
    <div>
      <SectionHeader
        eyebrow={eyebrow}
        title={title ?? (isNsw ? NSW_TITLE : VIC_TITLE)}
        lead={isNsw ? NSW_INTRO : VIC_INTRO}
      />

      {showLayers && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {isNsw
            ? NSW_CARDS.map((l) => (
                <LayerCard
                  key={l.short}
                  short={l.short}
                  blurb={l.blurb}
                  incomeTested={l.incomeTested}
                />
              ))
            : (["veu", "solarVictoria", "stc"] as const).map((id) => {
                const l = INCENTIVE_LAYERS[id];
                return (
                  <LayerCard
                    key={id}
                    short={l.short}
                    blurb={l.blurb}
                    incomeTested={l.incomeTested}
                  />
                );
              })}
        </div>
      )}

      {isNsw ? (
        <div className="mt-10 rounded-2xl border border-hairline bg-surface-muted p-6 sm:p-8">
          <p className="text-body text-ink">
            Good news in New South Wales: the main schemes here are not income
            tested, so there's no threshold to work around. The exact combined
            figure depends on the upgrade and your site, so we confirm it on your
            personalised eligibility check.
          </p>
          <p className="mt-3 text-caption text-text-muted">{INDICATIVE_NOTE}</p>
          <div className="mt-5">
            <ArrowLink href="/check-eligibility">
              Check your NSW eligibility
            </ArrowLink>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10">
            <StackingCalculator />
          </div>
          <p className="mt-4 text-caption text-text-muted">{INDICATIVE_NOTE}</p>
        </>
      )}
    </div>
  );
}

function LayerCard({
  short,
  blurb,
  incomeTested,
}: {
  short: string;
  blurb: string;
  incomeTested: boolean;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        <p className="font-semibold text-ink">{short}</p>
        {incomeTested && (
          <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-[0.6875rem] font-medium text-text-muted">
            income-tested
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{blurb}</p>
    </div>
  );
}
