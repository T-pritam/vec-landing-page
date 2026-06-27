import Link from "next/link";
import { WaterFilterIcon } from "@/components/icons";
import { STANDALONE_PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/cn";

/**
 * "Also from AEM Energy" — standalone (NON-VEU) products (Change #5). A clean
 * card that deliberately does NOT reuse the VEU UpgradesGrid: no indicative
 * "up to $X", no rebate badge, no scheme language. Green (leaf) accent sets it
 * apart from the amber VEU upgrades, and a quiet tag states it's standalone.
 */
export function StandaloneProducts({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {STANDALONE_PRODUCTS.map((p) => (
        <Link
          key={p.slug}
          href={`/products/${p.slug}`}
          className="group flex items-start justify-between gap-5 rounded-2xl border border-leaf/25 bg-leaf-tint p-6 transition-colors hover:border-leaf/50 sm:p-7"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-leaf text-white [&>svg]:h-7 [&>svg]:w-7">
              <WaterFilterIcon />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-h3">{p.name}</h3>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-leaf-ink">
                  Standalone · no rebate
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {p.tagline}
              </p>
            </div>
          </div>
          <span
            aria-hidden
            className="mt-1 shrink-0 text-leaf-ink transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
