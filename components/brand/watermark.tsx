import { BrandMark } from "@/components/brand/brand-mark";

/**
 * Subtle AEM logo watermark (Change #2). A single large rising-sun mark,
 * fixed to the viewport so it reads as a faint background texture as the page
 * scrolls. Implementation notes:
 *  - `pointer-events-none` + `aria-hidden` — purely decorative, never blocks
 *    clicks or screen readers.
 *  - Sections paint opaque backgrounds, so a plain "behind everything" layer
 *    would be covered. Instead this sits on top at ~4% opacity with
 *    `mix-blend-multiply`, which only darkens light surfaces by a hair and
 *    fades out entirely over the dark (ink) sections — so it never reduces
 *    text contrast (Change #2 requirement) yet stays visible on light areas.
 *  - One-tone (`mono`) mark in ink, no animation — reduced-motion safe.
 */
export function Watermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden mix-blend-multiply"
    >
      <BrandMark
        tone="mono"
        className="absolute -right-[12vw] top-1/2 h-[70vmax] w-[70vmax] -translate-y-1/2 text-ink opacity-[0.04]"
      />
    </div>
  );
}
