import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Audience self-select (PRD §7.1 block 2) — "the single most important block on
 * the page." Two clear paths so each visitor self-identifies in the first
 * screen and routes to content tuned to them (PRD §2.4).
 */
const PATHS = [
  {
    href: "/residential",
    tag: "I'm a homeowner",
    title: "Upgrades for your home",
    body: "Fast, simple, mostly upfront. Solar, heat pumps, hot water and more — with a large discount, not a “free” gimmick.",
    cta: "Explore residential",
    tone: "brand" as const,
  },
  {
    href: "/business",
    tag: "I'm a business",
    title: "Commercial & industrial",
    body: "Larger projects with real ROI. We manage the whole thing — the measurement, the certificates and the compliance.",
    cta: "Explore business",
    tone: "business" as const,
  },
];

export function AudienceSplit() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PATHS.map((p) => (
        <Link
          key={p.href}
          href={p.href}
          className={cn(
            "group relative flex flex-col justify-between gap-8 overflow-hidden rounded-3xl p-8 transition-transform sm:p-10",
            p.tone === "brand"
              ? "bg-brand-tint"
              : "on-ink bg-business text-white",
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
          <span
            className={cn(
              "inline-flex items-center gap-2 font-semibold",
              p.tone === "brand" ? "text-ink" : "text-white",
            )}
          >
            {p.cta}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
