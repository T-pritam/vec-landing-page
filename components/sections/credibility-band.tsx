import { ShieldCheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Credibility band — the "established / credible" cue borrowed from the Aussie
 * Greenmarks reference (design blend). A compact stat strip plus an
 * accreditation/partner badge row, carrying the leaf-green secondary accent so
 * the blend reads without displacing the amber primary identity.
 */
const STATS: { stat: string; label: string }[] = [
  { stat: "2009", label: "VEU program running since" },
  { stat: "Every year", label: "Accredited Person re-tested" },
  { stat: "End-to-end", label: "One accountable team" },
  { stat: "Victoria-wide", label: "Metro & regional" },
];

const BADGES = ["VEU program", "Accredited Person", "Solar Victoria", "Clean Energy"];

export function CredibilityBand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-leaf/20 bg-leaf-tint",
        className,
      )}
    >
      <dl className="grid grid-cols-2 gap-px bg-leaf/15 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-leaf-tint p-6 sm:p-7">
            <dt className="figure text-2xl font-semibold text-leaf-ink sm:text-3xl">
              {s.stat}
            </dt>
            <dd className="mt-1 text-sm leading-snug text-text-muted">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-leaf/15 px-6 py-5 sm:px-7">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf-ink">
          Recognised under
        </span>
        {BADGES.map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink"
          >
            <ShieldCheckIcon className="h-4 w-4 text-leaf" />
            {b}
          </span>
        ))}
        <span className="text-caption w-full sm:w-auto sm:ml-auto">
          Official badges — client to supply before launch.
        </span>
      </div>
    </div>
  );
}
