import { Carousel } from "@/components/ui/carousel";
import { getProductVisuals } from "@/components/brand/product-visual";
import { cn } from "@/lib/cn";

/**
 * One product carousel per product (Change #1). Pulls the on-brand SVG visuals
 * for the given slug and renders them in the shared accessible Carousel.
 * Returns null if a product has no visuals defined (so callers can fall back).
 */
export function ProductGallery({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const slides = getProductVisuals(slug);
  if (!slides) return null;
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-surface p-2 shadow-sm shadow-ink/5",
        className,
      )}
    >
      <Carousel slides={slides} ariaLabel={`${name} — product images`} />
    </div>
  );
}
