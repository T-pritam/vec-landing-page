import { SectionHeader } from "@/components/ui/section";
import { StackingCalculator } from "@/components/calculator/stacking-calculator";
import { INCENTIVE_LAYERS } from "@/lib/rebates";

/**
 * The stacking story (PRD §3.3, gap ⑥). Per the single-phase brief the
 * interactive calculator is built now and occupies the stacking slot on Home
 * and How It Works. Short explainer of the three layers, then the live tool.
 */
export function StackingSection({
  eyebrow = "The stacking story",
  title = "Three programs. One combined value.",
  showLayers = true,
}: {
  eyebrow?: string;
  title?: string;
  showLayers?: boolean;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        lead="Most providers explain one rebate. Often you can combine three — the VEU discount, a Solar Victoria rebate and federal STCs — into a single, larger figure. Here's roughly how they stack for your situation."
      />

      {showLayers && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {(["veu", "solarVictoria", "stc"] as const).map((id) => {
            const l = INCENTIVE_LAYERS[id];
            return (
              <div
                key={id}
                className="rounded-2xl border border-hairline bg-surface p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                  <p className="font-semibold text-ink">{l.short}</p>
                  {l.incomeTested && (
                    <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-[0.6875rem] font-medium text-text-muted">
                      income-tested
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {l.blurb}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <StackingCalculator />
      </div>
    </div>
  );
}
