import { cn } from "@/lib/cn";
import { REBATE_META } from "@/lib/rebates";

/**
 * The compliance-critical framing components. Every dollar figure on the site
 * must carry "up to / indicative" framing and never imply a guarantee or the
 * word "free" (PRD §3.2, §3.4 note, §9).
 */

/** Small inline chip placed next to any figure. */
export function IndicativeChip({
  onInk = false,
  className,
}: {
  onInk?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]",
        onInk
          ? "bg-white/10 text-white/70"
          : "bg-brand-tint text-brand-ink",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
      Indicative
    </span>
  );
}

/** Standard disclaimer line/box. `variant="full"` for the long legal version. */
export function IndicativeDisclaimer({
  variant = "short",
  onInk = false,
  className,
}: {
  variant?: "short" | "full";
  onInk?: boolean;
  className?: string;
}) {
  const text =
    variant === "full" ? REBATE_META.disclaimer : REBATE_META.shortDisclaimer;
  return (
    <p
      className={cn(
        "text-caption",
        onInk ? "text-white/55" : "text-text-muted",
        className,
      )}
    >
      {text}
      {variant === "full" && (
        <>
          {" "}
          Figures last reviewed {REBATE_META.lastReviewed} for{" "}
          {REBATE_META.region}.
        </>
      )}
    </p>
  );
}
