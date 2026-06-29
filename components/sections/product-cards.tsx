import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { getProductHeroVisual } from "@/components/brand/product-visual";
import { UPGRADES } from "@/lib/upgrades";
import { UPGRADE_IMAGE } from "@/lib/images";
import { cn } from "@/lib/cn";

/**
 * Image-led product card grid for the /products page — mirrors the reference
 * layout (photo · title · tagline · "View Details"). Deliberately separate from
 * the figure-led `UpgradesGrid` (still used on /residential): no rebate figures
 * here, to keep this page clean. Cards use a licensed stock photo where one
 * exists, otherwise the on-brand SVG scene (battery).
 *
 * `audience="all"` includes commercial-only upgrades (e.g. Commercial LED).
 */
export function ProductCards({
  className,
  audience = "all",
}: {
  className?: string;
  audience?: "residential" | "all";
}) {
  const items =
    audience === "all"
      ? UPGRADES
      : UPGRADES.filter((u) => u.available !== "commercial");

  return (
    <Stagger
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((u) => {
        const img = UPGRADE_IMAGE[u.slug];
        const fallback = img ? null : getProductHeroVisual(u.slug);
        return (
          <StaggerItem key={u.slug}>
            <Link
              href={`/upgrades/${u.slug}`}
              className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                {img ? (
                  <Image
                    src={img}
                    alt={u.longName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
                    {fallback}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-h3">{u.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {u.tagline}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 transition-colors group-hover:text-brand-hover">
                  View Details
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
