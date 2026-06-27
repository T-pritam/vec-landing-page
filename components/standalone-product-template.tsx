import { WaterFilterIcon, CheckIcon } from "@/components/icons";
import { Button, ArrowLink } from "@/components/ui/button";
import { Section, SectionHeader, Eyebrow } from "@/components/ui/section";
import { ProductGallery } from "@/components/brand/product-gallery";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/faq-accordion";
import { SECONDARY_CTA, SITE } from "@/lib/site";
import type { StandaloneProduct } from "@/lib/products";
import type { FaqItem } from "@/lib/faq";

/**
 * Standalone (NON-VEU) product page — AEM brief Change #5. Built from scratch,
 * NOT from the VEU upgrade template, so there is deliberately:
 *   • no IndicativeChip / "up to $X" rebate figure
 *   • no rebate or stacking card
 *   • no VEU / Solar Victoria / certificate language
 *   • no "Check eligibility" CTA (that's the VEU funnel)
 * Instead it carries a clear, positive "this is a standalone product, no rebate"
 * note and a plain "Get a quote" CTA. Green (leaf) is the accent here to set it
 * apart from the amber VEU products.
 */
export function StandaloneProductTemplate({
  product,
}: {
  product: StandaloneProduct;
}) {
  return (
    <>
      {/* 1 — Hero */}
      <section className="bg-leaf-tint pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf text-white [&>svg]:h-7 [&>svg]:w-7">
                  <WaterFilterIcon />
                </span>
                <p className="eyebrow text-leaf-ink">{product.eyebrow}</p>
              </div>
              <h1 className="text-display mt-5 text-[clamp(2.25rem,5vw,3.75rem)]">
                {product.heroHeadline}
              </h1>
              <p className="text-lead mt-6 max-w-xl">{product.heroSub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={SECONDARY_CTA.href} size="lg">
                  {SECONDARY_CTA.label}
                </Button>
                <Button href="/contact" size="lg" variant="secondary">
                  Talk to us
                </Button>
              </div>
            </div>

            {/* Product carousel + standalone (no-rebate) note */}
            <div>
              <ProductGallery slug={product.slug} name={product.name} />
              <div className="mt-4 rounded-2xl border border-leaf/30 bg-surface px-5 py-4">
                <p className="flex items-start gap-2 text-sm text-ink">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
                  <span>
                    <span className="font-semibold">A standalone product.</span>{" "}
                    Not part of the VEU or Solar Victoria program — there's no
                    government rebate, certificate or scheme. Simple
                    product-and-install pricing.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — What it is */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="What it is"
              title={product.whatItIs.heading}
            />
            <p className="mt-5 text-body">{product.whatItIs.body}</p>
          </div>
          <ul className="space-y-3 lg:pt-2">
            {product.whatItIs.points.map((p) => (
              <li key={p} className="flex gap-3 text-body">
                <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-leaf" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 3 — How it works (service steps, not scheme steps) */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="How it works"
          title="From a quick chat to clean water."
          lead="A simple supply-and-install — no forms, no scheme paperwork."
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {product.howItWorks.map((step, i) => (
            <li
              key={step}
              className="rounded-2xl border border-hairline bg-surface p-6"
            >
              <span className="figure text-sm font-semibold text-leaf-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-body text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4 — Why us */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <Eyebrow>Why AEM Energy</Eyebrow>
            <h2 className="text-h2 mt-4">One team, accountable for the result.</h2>
            <p className="mt-5 text-body">{product.whyUs}</p>
            <div className="mt-6">
              <ArrowLink href="/about">More about AEM Energy</ArrowLink>
            </div>
          </div>
          <div className="rounded-2xl bg-leaf-tint p-6 sm:p-8">
            <p className="text-sm font-medium text-leaf-ink">Good to know</p>
            <p className="mt-3 text-body text-ink">
              Distillo sits alongside our energy upgrades, but it's a separate
              purchase. If you're also looking at solar, heat pumps or a battery,
              we can talk through those under the VEU program separately.
            </p>
            <div className="mt-5">
              <ArrowLink href="/residential">See our energy upgrades</ArrowLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 5 — FAQ */}
      {product.faqs.length > 0 && (
        <Section tone="muted" narrow>
          <Eyebrow>{product.name} questions</Eyebrow>
          <h2 className="text-h2 mt-4">Good to know.</h2>
          <div className="mt-8">
            <FaqAccordion
              items={product.faqs.map<FaqItem>((f) => ({
                ...f,
                category: "Residential",
              }))}
            />
          </div>
        </Section>
      )}

      {/* 6 — CTA (non-VEU: get a quote, not check eligibility) */}
      <Section tone="surface" spacing="sm">
        <CtaBand
          title={`Interested in ${product.name}?`}
          body={`Get a clear product-and-install quote, or talk it through with our team on ${SITE.phone}.`}
          primaryHref={SECONDARY_CTA.href}
          primaryLabel={SECONDARY_CTA.label}
        />
      </Section>
    </>
  );
}
