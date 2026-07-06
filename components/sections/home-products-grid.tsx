import Image from "next/image";
import Link from "next/link";
import { getUpgrade } from "@/lib/upgrades";
import { UPGRADE_IMAGE } from "@/lib/images";

/**
 * Homepage product grid (Home 3): one large Solar hero card, paired with
 * Heat Pumps / Battery / Air Con stacked vertically alongside it. Reuses the
 * same card conventions as `ProductCards`/`UpgradesGrid` (rounded-2xl,
 * hairline border, `lift` hover) rather than inventing new visual language.
 */
const SIDE_SLUGS = ["heat-pumps", "battery", "air-con"] as const;

export function HomeProductsGrid() {
  const solar = getUpgrade("solar");
  if (!solar) return null;

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
      <Link
        href={`/upgrades/${solar.slug}`}
        className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface"
      >
        <div className="relative min-h-[280px] flex-1 overflow-hidden bg-surface-muted">
          <Image
            src={UPGRADE_IMAGE[solar.slug]}
            alt={solar.longName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
        <div className="p-6 sm:p-8">
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
            Flagship
          </span>
          <h3 className="text-h2 mt-4">{solar.name}</h3>
          <p className="mt-2 text-body text-text-muted">{solar.tagline}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 transition-colors group-hover:text-brand-hover">
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

      <div className="flex flex-col gap-6">
        {SIDE_SLUGS.map((slug) => {
          const upgrade = getUpgrade(slug);
          if (!upgrade) return null;
          return (
            <Link
              key={slug}
              href={`/upgrades/${slug}`}
              className="lift group flex flex-1 items-stretch gap-4 overflow-hidden rounded-2xl border border-hairline bg-surface p-4 sm:p-5"
            >
              <div className="relative w-32 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:w-40">
                <Image
                  src={UPGRADE_IMAGE[slug]}
                  alt={upgrade.longName}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <h3 className="text-h3 text-[1.125rem]">{upgrade.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {upgrade.tagline}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 transition-colors group-hover:text-brand-hover">
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
          );
        })}
      </div>
    </div>
  );
}
