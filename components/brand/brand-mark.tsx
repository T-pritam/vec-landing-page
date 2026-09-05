import { cn } from "@/lib/cn";

/**
 * AEM Energy brand mark — the client-supplied "AEM" green badge (rounded square
 * with the leaf), cropped from the full "AEM Energy — Smarter Homes" logo and
 * trimmed to a transparent PNG so it drops onto any background.
 *
 *  - tone="color"  → full-colour badge (header, footer, cards)
 *  - tone="mono"   → desaturated, low-opacity silhouette (watermark, anywhere
 *                    a faded one-tone mark is wanted)
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
  const mono = tone === "mono";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/AEM.png"
      alt={title ?? ""}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={cn(
        "h-9 w-9 shrink-0 object-contain",
        mono && "grayscale",
        className,
      )}
    />
  );
}
