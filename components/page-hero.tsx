import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

/**
 * Generic hero for inner pages. Owns a position, not a discount number
 * (PRD §4 gap, §5 guardrails). Tones: light surface, ink (dark/premium) or
 * navy business.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  tone = "muted",
  primary,
  secondary,
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  tone?: "surface" | "muted" | "ink" | "business";
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  align?: "left" | "center";
  children?: React.ReactNode;
}) {
  const onInk = tone === "ink" || tone === "business";
  const toneCls = {
    surface: "bg-surface text-ink",
    muted: "bg-surface-muted text-ink",
    ink: "bg-ink text-white on-ink",
    business: "bg-business text-white on-ink",
  }[tone];

  return (
    <section className={cn(toneCls, "pt-28 pb-16 sm:pt-32 sm:pb-20")}>
      <div className="container-page">
        <Reveal
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow && <Eyebrow onInk={onInk}>{eyebrow}</Eyebrow>}
          <h1
            className={cn(
              "text-display mt-4 text-[clamp(2.25rem,5vw,3.75rem)]",
              onInk && "text-white",
            )}
          >
            {title}
          </h1>
          {lead && (
            <p
              className={cn(
                "text-lead mt-6",
                onInk ? "text-white/70" : "",
                align === "center" && "mx-auto",
              )}
            >
              {lead}
            </p>
          )}
          {(primary || secondary) && (
            <div
              className={cn(
                "mt-8 flex flex-wrap gap-3",
                align === "center" && "justify-center",
              )}
            >
              {primary && (
                <Button href={primary.href} size="lg">
                  {primary.label}
                </Button>
              )}
              {secondary && (
                <Button
                  href={secondary.href}
                  size="lg"
                  variant={onInk ? "secondary-on-ink" : "secondary"}
                >
                  {secondary.label}
                </Button>
              )}
            </div>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
