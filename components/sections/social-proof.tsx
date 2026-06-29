import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

/**
 * Social proof (PRD §7.1 block 8) — "client to supply" (§9 item 5). Clearly
 * labelled placeholder cards so the section is built and ready to swap.
 */
const PLACEHOLDER_REVIEWS = [
  {
    quote:
      "They explained exactly where the discount came from and what we'd actually pay. No “free” nonsense — just a straight answer.",
    name: "Placeholder, Bendigo",
    detail: "Heat pump + hot water",
  },
  {
    quote:
      "One team handled the assessment, the install and all the paperwork. We genuinely did almost nothing.",
    name: "Placeholder, Geelong",
    detail: "Rooftop solar",
  },
  {
    quote:
      "Having their own Accredited Person actually meant something — the certificates were created in-house, not outsourced.",
    name: "Placeholder, Melbourne",
    detail: "Solar + battery",
  },
];

export function SocialProof({ onInk = false }: { onInk?: boolean }) {
  return (
    <div>
      {/* Rating summary — established/credible cue (Greenmarks reference) */}
      <div
        className={cn(
          "mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border p-4",
          onInk ? "border-white/10 bg-white/[0.04]" : "border-hairline bg-surface",
        )}
      >
        <span aria-hidden className="flex gap-0.5 text-brand">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} />
          ))}
        </span>
        <span className={cn("font-semibold", onInk ? "text-white" : "text-ink")}>
          4.9/5 average
        </span>
        <span className={cn("text-sm", onInk ? "text-white/55" : "text-text-muted")}>
          across Victorian households &amp; businesses
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            onInk ? "bg-leaf/20 text-leaf-tint" : "bg-leaf-tint text-leaf-ink",
          )}
        >
          Operating since 2009
        </span>
        <span
          className={cn(
            "w-full text-caption sm:w-auto sm:ml-auto",
            onInk && "text-white/45",
          )}
        >
          Placeholder rating — client to supply.
        </span>
      </div>

      <Stagger className="grid gap-4 md:grid-cols-3">
        {PLACEHOLDER_REVIEWS.map((r) => (
          <StaggerItem
            key={r.name}
            className={cn(
              "lift flex h-full flex-col gap-5 rounded-2xl border p-6",
              onInk ? "border-white/10 bg-white/[0.04]" : "border-hairline bg-surface",
            )}
          >
            <div aria-hidden className="flex gap-0.5 text-brand">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <blockquote
              className={cn(
                "text-[1.0625rem] leading-relaxed",
                onInk ? "text-white/90" : "text-ink",
              )}
            >
              “{r.quote}”
            </blockquote>
            <div className="mt-auto">
              <p className={cn("text-sm font-semibold", onInk ? "text-white" : "text-ink")}>
                {r.name}
              </p>
              <p className={cn("text-sm", onInk ? "text-white/55" : "text-text-muted")}>
                {r.detail}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <p className={cn("mt-4 text-caption", onInk && "text-white/50")}>
        Placeholder testimonials — client to supply real reviews before launch.
      </p>
    </div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.95 2.6.95-5.5-4-3.9 5.53-.8z" />
    </svg>
  );
}
