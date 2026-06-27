import { cn } from "@/lib/cn";

/**
 * AEM Energy brand mark — a rising sun (amber, with a fan of rays) above a
 * two-tone green leaf/hill wave. Recreated as a clean, crisp SVG from the
 * supplied logo so it themes and scales without raster artefacts.
 *
 *  - tone="color"  → full amber sun + green waves (header, footer, cards)
 *  - tone="mono"   → single-colour silhouette in `currentColor` (watermark,
 *                    favicon, anywhere a faded one-tone mark is wanted)
 *
 * Size is controlled by the caller via `className` (defaults to h-9 w-9).
 */
export function BrandMark({
  tone = "color",
  className,
  title,
}: {
  tone?: "color" | "mono";
  className?: string;
  title?: string;
}) {
  const cx = 32;
  const cy = 30;
  const sunR = 8.5;
  const rIn = sunR + 2.2;

  // Fan of rays across the upper hemisphere; longest pointing straight up.
  const rayAngles = [14, 33, 52, 71, 90, 109, 128, 147, 166];
  const rays = rayAngles.map((deg) => {
    const a = (deg * Math.PI) / 180;
    const near90 = 1 - Math.abs(90 - deg) / 90; // 0..1, peaks straight up
    const len = 3.4 + near90 * 3.2;
    const dx = Math.cos(a);
    const dy = -Math.sin(a);
    return {
      x1: cx + dx * rIn,
      y1: cy + dy * rIn,
      x2: cx + dx * (rIn + len),
      y2: cy + dy * (rIn + len),
    };
  });

  const mono = tone === "mono";

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-9 w-9 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {!mono && (
        <defs>
          <radialGradient id="aem-sun" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#FFD24D" />
            <stop offset="60%" stopColor="#F6B11F" />
            <stop offset="100%" stopColor="#F08A1D" />
          </radialGradient>
          <linearGradient id="aem-wave-back" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7FB541" />
            <stop offset="100%" stopColor="#A6CE4E" />
          </linearGradient>
          <linearGradient id="aem-wave-front" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0E6E40" />
            <stop offset="100%" stopColor="#3F9E54" />
          </linearGradient>
        </defs>
      )}

      {/* rays */}
      <g
        stroke={mono ? "currentColor" : "#F6B11F"}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={mono ? 0.9 : 1}
      >
        {rays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
        ))}
      </g>

      {/* sun */}
      <circle
        cx={cx}
        cy={cy}
        r={sunR}
        fill={mono ? "currentColor" : "url(#aem-sun)"}
      />

      {/* leaf / hill waves — back (lime) then front (deep green) */}
      <path
        d="M6 41c8-5 15-5 23-1 7 3 14 4 22-1l5-2c-3 7-11 12-21 12-9 0-15-3-22-3-3 0-6 .6-8 1z"
        fill={mono ? "currentColor" : "url(#aem-wave-back)"}
        opacity={mono ? 0.55 : 1}
      />
      <path
        d="M9 47c7-4 13-4 21-1 8 3 16 3 24-3-3 6-9 11-19 11-8 0-13-3-19-4-3-.5-5-.3-7 1z"
        fill={mono ? "currentColor" : "url(#aem-wave-front)"}
        opacity={mono ? 0.75 : 1}
      />
    </svg>
  );
}
