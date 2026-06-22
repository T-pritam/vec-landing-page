import { Button } from "@/components/ui/button";
import { PhoneIcon } from "@/components/icons";
import { SITE, PRIMARY_CTA } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Reusable closing CTA band. Layered CTAs by commitment — primary "Check
 * eligibility" plus a lower-friction call option (PRD §2.3, §7.1 block 10).
 */
export function CtaBand({
  title = "Find out what you qualify for.",
  body = "Check your eligibility in about a minute, or talk to an accredited team member. No obligation, and no “free” gimmicks — just a straight answer on what you'd pay.",
  tone = "brand-tint",
  primaryHref = PRIMARY_CTA.href,
  primaryLabel = PRIMARY_CTA.label,
}: {
  title?: string;
  body?: string;
  tone?: "brand-tint" | "ink";
  primaryHref?: string;
  primaryLabel?: string;
}) {
  const onInk = tone === "ink";
  return (
    <div
      className={cn(
        "rounded-3xl px-7 py-12 text-center sm:px-12 sm:py-16",
        onInk ? "on-ink bg-ink text-white" : "bg-brand-tint",
      )}
    >
      <h2 className={cn("mx-auto max-w-2xl text-h2", onInk && "text-white")}>
        {title}
      </h2>
      <p
        className={cn(
          "mx-auto mt-4 max-w-2xl text-lead",
          onInk && "text-white/70",
        )}
      >
        {body}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href={primaryHref} size="lg">
          {primaryLabel}
        </Button>
        <Button
          href={SITE.phoneHref}
          size="lg"
          variant={onInk ? "secondary-on-ink" : "secondary"}
        >
          <PhoneIcon className="h-4 w-4" />
          {SITE.phone}
        </Button>
      </div>
    </div>
  );
}
