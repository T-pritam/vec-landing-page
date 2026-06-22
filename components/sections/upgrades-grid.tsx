import Link from "next/link";
import { UpgradeGlyph } from "@/components/icons";
import { IndicativeChip } from "@/components/indicative";
import { UPGRADES } from "@/lib/upgrades";
import { maxHeadlineValue, formatAUD, getUpgradeRebate } from "@/lib/rebates";
import { cn } from "@/lib/cn";

/**
 * Entry tiles to the upgrade pages (PRD §7.1 block 5). Re-conceived from the
 * stock icon grid — figures pulled live from the rebate config and framed
 * indicative. The flagship (Solar) gets a wider, emphasised tile.
 */
export function UpgradesGrid({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {UPGRADES.map((u) => {
        const flagship = Boolean(u.flagship);
        const headline = maxHeadlineValue(u.slug);
        const rebate = getUpgradeRebate(u.slug);
        const loanOnly =
          rebate &&
          Object.values(rebate.layers).every((l) => l?.kind === "loan");
        return (
          <Link
            key={u.slug}
            href={`/upgrades/${u.slug}`}
            className={cn(
              "group relative flex flex-col justify-between gap-6 rounded-2xl border p-6 transition-colors sm:p-7",
              flagship
                ? "border-ink bg-ink text-white sm:col-span-2 on-ink hover:bg-ink-soft"
                : "border-hairline bg-surface hover:border-text-muted/40",
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl [&>span>svg]:h-7 [&>span>svg]:w-7",
                    flagship ? "bg-brand text-ink" : "bg-brand-tint text-brand-ink",
                  )}
                >
                  <UpgradeGlyph icon={u.icon} />
                </span>
                {flagship && (
                  <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
                    Flagship
                  </span>
                )}
              </div>
              <h3
                className={cn(
                  "mt-5 text-h3",
                  flagship ? "text-white text-[1.5rem]" : "",
                )}
              >
                {u.name}
              </h3>
              <p
                className={cn(
                  "mt-1.5 text-sm leading-relaxed",
                  flagship ? "text-white/70" : "text-text-muted",
                )}
              >
                {u.tagline}
              </p>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                <span
                  className={cn(
                    "block text-xs font-medium",
                    flagship ? "text-white/50" : "text-text-muted",
                  )}
                >
                  {loanOnly ? "Interest-free loan" : "Indicative value"}
                </span>
                <span
                  className={cn(
                    "figure text-2xl font-semibold",
                    flagship ? "text-white" : "text-ink",
                  )}
                >
                  up to {formatAUD(headline || 0)}
                  {loanOnly && (
                    <span className="ml-1 align-middle text-sm font-normal opacity-70">
                      (loan)
                    </span>
                  )}
                </span>
              </div>
              <IndicativeChip onInk={flagship} />
            </div>

            <span
              aria-hidden
              className={cn(
                "absolute right-6 top-6 hidden text-xl transition-transform duration-200 group-hover:translate-x-1 sm:block",
                flagship ? "text-white/0" : "text-text-muted/0",
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}
