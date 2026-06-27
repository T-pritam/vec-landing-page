import { cn } from "@/lib/cn";
import { ShieldCheckIcon } from "@/components/icons";

/**
 * Reusable trust-badge strip (PRD §6 global element). Surfaces the strongest,
 * most under-used proof in the category: full-chain accreditation + the annual
 * fit-and-proper / competent-and-capable test (PRD §3.4, gap ⑤).
 */
const TRUST_POINTS = [
  {
    label: "Accredited Person",
    detail: "We operate under Aussie Eco Marks — authorised to create VEECs",
  },
  {
    label: "Re-tested every year",
    detail: "Our AP passes “fit & proper” + “competent & capable” annually",
  },
  {
    label: "Full-chain, in-house",
    detail: "Assessment → install → certificates → paperwork",
  },
  {
    label: "Running since 2009",
    detail: "A long-standing program, extended well into the future",
  },
];

export function TrustStrip({
  onInk = false,
  className,
}: {
  onInk?: boolean;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4",
        onInk ? "bg-white/10" : "bg-hairline",
        className,
      )}
    >
      {TRUST_POINTS.map((p) => (
        <li
          key={p.label}
          className={cn(
            "flex flex-col gap-1.5 p-5",
            onInk ? "bg-ink" : "bg-surface",
          )}
        >
          <ShieldCheckIcon
            className={cn("h-5 w-5", onInk ? "text-brand" : "text-brand-ink")}
          />
          <p className={cn("font-semibold", onInk ? "text-white" : "text-ink")}>
            {p.label}
          </p>
          <p
            className={cn(
              "text-sm leading-snug",
              onInk ? "text-white/60" : "text-text-muted",
            )}
          >
            {p.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}
