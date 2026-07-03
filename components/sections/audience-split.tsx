import { cn } from "@/lib/cn";

/**
 * Residential & Business info (homepage change request, Home 2). Previously the
 * "First, who are you?" path-picker; now a purely informative block — the cards
 * no longer link anywhere and the "Explore" CTAs are removed. Copy is TBC by the
 * client; the existing informative copy is kept as a placeholder.
 */
const PATHS = [
  {
    tag: "For your home",
    title: "Upgrades for your home",
    body: "Quick, mostly sorted upfront. Solar, heat pumps, hot water and more, with a discount you can see on the quote.",
    tone: "brand" as const,
  },
  {
    tag: "For your business",
    title: "Commercial and industrial",
    body: "Bigger projects that stack up on the numbers. We manage the measurement, the certificates and the compliance, start to finish.",
    tone: "business" as const,
  },
];

export function AudienceSplit() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PATHS.map((p) => (
        <div
          key={p.title}
          className={cn(
            "relative flex flex-col gap-8 overflow-hidden rounded-3xl p-8 sm:p-10",
            p.tone === "brand" ? "bg-brand-tint" : "on-ink bg-business text-white",
          )}
        >
          <div>
            <span
              className={cn(
                "text-sm font-semibold uppercase tracking-[0.14em]",
                p.tone === "brand" ? "text-brand-ink" : "text-white/60",
              )}
            >
              {p.tag}
            </span>
            <h3
              className={cn(
                "mt-3 text-h2 text-[1.75rem] sm:text-[2rem]",
                p.tone === "business" && "text-white",
              )}
            >
              {p.title}
            </h3>
            <p
              className={cn(
                "mt-3 max-w-md text-body",
                p.tone === "business" && "text-white/70",
              )}
            >
              {p.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
