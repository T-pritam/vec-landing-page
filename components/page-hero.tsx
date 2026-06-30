import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

/**
 * Generic hero for inner pages. Owns a position, not a discount number
 * (PRD §4 gap, §5 guardrails). Tones: light surface, ink (dark/premium) or
 * navy business.
 *
 * Optional photography (client request — match the image-led reference sites):
 * - dark heroes (ink/business) use `image` as a full-bleed background under a
 *   gradient overlay so the white text stays legible;
 * - light heroes use it as a rounded side image in a two-column layout.
 * `imageVariant` overrides the tone-based default. With no `image`, the hero
 * renders exactly as before (backwards-compatible).
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  tone = "muted",
  primary,
  secondary,
  align = "left",
  image,
  imageAlt,
  imageVariant,
  imagePriority = true,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  tone?: "surface" | "muted" | "ink" | "business";
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  align?: "left" | "center";
  image?: string;
  imageAlt?: string;
  imageVariant?: "background" | "side";
  imagePriority?: boolean;
  children?: React.ReactNode;
}) {
  const onInk = tone === "ink" || tone === "business";
  const toneCls = {
    surface: "bg-surface text-ink",
    muted: "bg-surface-muted text-ink",
    ink: "bg-ink text-white on-ink",
    business: "bg-business text-white on-ink",
  }[tone];

  // Default: dark heroes get a full-bleed background, light heroes a side image.
  const variant = imageVariant ?? (onInk ? "background" : "side");
  const hasBg = !!image && variant === "background";
  const hasSide = !!image && variant === "side";

  const copy = (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        // Side layout: copy shares the row, so don't cap it as tightly.
        hasSide && "max-w-none",
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
  );

  return (
    <section
      className={cn(
        toneCls,
        "relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20",
      )}
    >
      {/* Full-bleed background photo (dark heroes) with a legibility overlay. */}
      {hasBg && (
        <>
          <Image
            src={image!}
            alt={imageAlt ?? ""}
            fill
            priority={imagePriority}
            sizes="100vw"
            className="object-cover"
            aria-hidden={!imageAlt}
          />
          <div
            aria-hidden
            className={cn(
              "absolute inset-0",
              tone === "business"
                ? "bg-gradient-to-r from-business via-business/90 to-business/55"
                : "bg-gradient-to-r from-ink via-ink/90 to-ink/55",
            )}
          />
        </>
      )}

      <div className="container-page relative z-10">
        {hasSide ? (
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>{copy}</div>
            <Reveal delay={0.08}>
              <div className="lift relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hairline bg-surface shadow-sm shadow-ink/5">
                <Image
                  src={image!}
                  alt={imageAlt ?? ""}
                  fill
                  priority={imagePriority}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  aria-hidden={!imageAlt}
                />
              </div>
            </Reveal>
          </div>
        ) : (
          copy
        )}
      </div>
    </section>
  );
}
