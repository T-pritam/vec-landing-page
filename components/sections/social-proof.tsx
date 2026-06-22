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
      "Being an Accredited Person actually meant something — they could create the certificates themselves.",
    name: "Placeholder, Melbourne",
    detail: "Solar + battery",
  },
];

export function SocialProof({ onInk = false }: { onInk?: boolean }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLACEHOLDER_REVIEWS.map((r) => (
          <figure
            key={r.name}
            className={cn(
              "flex flex-col gap-5 rounded-2xl border p-6",
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
            <figcaption className="mt-auto">
              <p className={cn("text-sm font-semibold", onInk ? "text-white" : "text-ink")}>
                {r.name}
              </p>
              <p className={cn("text-sm", onInk ? "text-white/55" : "text-text-muted")}>
                {r.detail}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
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
