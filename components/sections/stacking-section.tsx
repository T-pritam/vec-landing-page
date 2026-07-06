import { SectionHeader } from "@/components/ui/section";
import { StackingCalculator } from "@/components/calculator/stacking-calculator";
import { INCENTIVE_LAYERS } from "@/lib/rebates";

/**
 * The stacking story (rewrite doc). Victoria stacks three programs — VEU,
 * Solar Victoria and federal STCs — and the interactive calculator models
 * them live.
 */

const TITLE = "Three programs. One combined value.";

const INTRO =
  "Most providers explain one rebate and leave it there. In Victoria you can often combine three: the VEU discount, a Solar Victoria rebate and federal STCs, into a single larger figure. Here's roughly how they stack for your situation, shown as a range rather than a best-case headline.";

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
  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title ?? TITLE} lead={INTRO} />

      {showLayers && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {(["veu", "solarVictoria", "stc"] as const).map((id) => {
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

      <div className="mt-10">
        <StackingCalculator />
      </div>
      <p className="mt-4 text-caption text-text-muted">{INDICATIVE_NOTE}</p>
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
