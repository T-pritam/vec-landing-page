import type { CSSProperties } from "react";
import type { Brand } from "@/lib/brands";

/**
 * Auto-scrolling logo marquee for the brands AEM Energy installs (product pages).
 * Each chip shows the brand logo + name (name only where no logo is available).
 * Pure-CSS animation (`.brand-marquee*` in globals.css) — no client JS — with a
 * seamless loop (the list is rendered twice) and a reduced-motion fallback to a
 * plain scrollable strip.
 *
 * Logos are plain <img> so both SVG and PNG marks render without needing the
 * Next image optimiser's `dangerouslyAllowSVG`.
 */
export function BrandMarquee({
  brands,
  ariaLabel = "Brands we install",
}: {
  brands: Brand[];
  ariaLabel?: string;
}) {
  if (!brands.length) return null;

  // Two copies for the seamless -50% loop; the second copy is decorative.
  const loop = [...brands, ...brands];
  // Keep perceived speed steady regardless of list length.
  const duration = Math.max(20, brands.length * 4.5);

  return (
    <div className="brand-marquee" role="group" aria-label={ariaLabel}>
      <ul
        className="brand-marquee-track gap-3 py-1 sm:gap-4"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {loop.map((b, i) => (
          <li
            key={`${b.name}-${i}`}
            aria-hidden={i >= brands.length}
            className="flex h-24 w-44 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-hairline bg-surface px-5"
          >
            {b.logo ? (
              <>
                <span className="flex h-9 w-full items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.logo}
                    alt={`${b.name} logo`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-9 w-auto max-w-full object-contain"
                  />
                </span>
                <span className="text-xs font-medium text-text-muted">
                  {b.name}
                </span>
              </>
            ) : (
              <span className="text-center text-lg font-semibold tracking-tight text-ink">
                {b.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
