import Link from "next/link";
import { UpgradeGlyph, CheckIcon, LayersIcon } from "@/components/icons";
import { Button, ArrowLink } from "@/components/ui/button";
import { Section, SectionHeader, Eyebrow } from "@/components/ui/section";
import { IndicativeChip, IndicativeDisclaimer } from "@/components/indicative";
import { ProductGallery } from "@/components/brand/product-gallery";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/faq-accordion";
import { UPGRADES, type UpgradeContent } from "@/lib/upgrades";
import {
  getUpgradeRebate,
  maxHeadlineValue,
  formatRange,
  formatAUD,
  INCENTIVE_LAYERS,
  type LayerId,
  type LayerValue,
} from "@/lib/rebates";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";
import type { FaqItem } from "@/lib/faq";

/**
 * Reusable upgrade-page template (PRD §7.4). One pattern, themed per upgrade.
 * All dollar figures are read from the rebate config and framed indicative.
 * The flagship instance (Solar) additionally renders the residential-vs-
 * commercial split and a link into the Business journey.
 */
export function UpgradeTemplate({ upgrade }: { upgrade: UpgradeContent }) {
  const rebate = getUpgradeRebate(upgrade.slug);
  const headline = maxHeadlineValue(upgrade.slug);
  const layerEntries = rebate
    ? (Object.entries(rebate.layers) as [LayerId, LayerValue][])
    : [];
  const loanLayers = layerEntries.filter(([, v]) => v.kind === "loan");
  const discountLayers = layerEntries.filter(([, v]) => v.kind !== "loan");
  const others = UPGRADES.filter((u) => u.slug !== upgrade.slug);

  return (
    <>
      {/* 1 — Upgrade hero */}
      <section className="bg-surface-muted pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-ink [&>span>svg]:h-7 [&>span>svg]:w-7">
                  <UpgradeGlyph icon={upgrade.icon} />
                </span>
                <Eyebrow>{upgrade.eyebrow}</Eyebrow>
              </div>
              <h1 className="text-display mt-5 text-[clamp(2.25rem,5vw,3.75rem)]">
                {upgrade.heroHeadline}
              </h1>
              <p className="text-lead mt-6 max-w-xl">{upgrade.heroSub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={PRIMARY_CTA.href} size="lg">
                  {PRIMARY_CTA.label}
                </Button>
                <Button href={SECONDARY_CTA.href} size="lg" variant="secondary">
                  {SECONDARY_CTA.label}
                </Button>
              </div>
            </div>

            {/* Product carousel (Change #1) — one carousel per product, with a
                compact indicative-value line beneath so the figure stays visible
                (full breakdown lives in section 2). */}
            <div>
              <ProductGallery slug={upgrade.slug} name={upgrade.name} />
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-muted px-5 py-4">
                <div>
                  <span className="block text-xs font-medium text-text-muted">
                    {loanLayers.length && !discountLayers.length
                      ? "Interest-free loan"
                      : "Indicative value"}
                  </span>
                  <span className="figure text-2xl font-semibold text-ink">
                    up to{" "}
                    {formatAUD(headline || (loanLayers[0]?.[1].max ?? 0))}
                  </span>
                </div>
                <IndicativeChip />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — What you actually get + How much you can get */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="What it is"
              title={upgrade.whatItIs.heading}
            />
            <p className="mt-5 text-body">{upgrade.whatItIs.body}</p>
            <ul className="mt-6 space-y-3">
              {upgrade.whatItIs.points.map((p) => (
                <li key={p} className="flex gap-3 text-body">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-success" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader
              eyebrow="How much you can get"
              title="The indicative numbers."
            />
            <div className="mt-6 rounded-2xl border border-hairline bg-surface-muted p-6 sm:p-7">
              <ul className="space-y-4">
                {discountLayers.map(([id, v]) => (
                  <LayerRow key={id} id={id} value={v} />
                ))}
                {loanLayers.map(([id, v]) => (
                  <LayerRow key={id} id={id} value={v} />
                ))}
              </ul>
              {discountLayers.length > 0 && (
                <div className="mt-5 flex items-end justify-between border-t border-hairline pt-5">
                  <span className="text-sm font-medium text-text-muted">
                    Combined, up to
                  </span>
                  <span className="figure text-3xl font-semibold text-ink">
                    {formatAUD(headline)}
                  </span>
                </div>
              )}
              <div className="mt-5">
                <IndicativeDisclaimer variant="full" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3 — How it works for this upgrade */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="How it works"
          title="Four steps — and we do most of them."
          lead="The short version for this upgrade. The full mechanism (where the money comes from) lives on How It Works."
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upgrade.howItWorks.map((step, i) => (
            <li
              key={step}
              className="rounded-2xl border border-hairline bg-surface p-6"
            >
              <span className="figure text-sm font-semibold text-brand-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-body text-ink">{step}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <ArrowLink href="/how-it-works">
            See where the money actually comes from
          </ArrowLink>
        </div>
      </Section>

      {/* 4 — Why us / full-chain + 5 — Stacking note */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Why us</Eyebrow>
            <h2 className="text-h2 mt-4">One accredited team, start to finish.</h2>
            <p className="mt-5 text-body">{upgrade.fullChain}</p>
            <div className="mt-6">
              <ArrowLink href="/about">Why accreditation matters</ArrowLink>
            </div>
          </div>

          <div className="rounded-2xl bg-brand-tint p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <LayersIcon className="h-5 w-5 text-brand-ink" />
              <Eyebrow>Stacking note</Eyebrow>
            </div>
            <p className="mt-4 text-body text-ink">{rebate?.stackingNote}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {layerEntries.map(([id]) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink"
                >
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  {INCENTIVE_LAYERS[id].short}
                </span>
              ))}
            </div>
            <div className="mt-5">
              <ArrowLink href="/how-it-works#stacking">
                Try the stacking calculator
              </ArrowLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Flagship only — residential vs commercial split */}
      {upgrade.flagship && (
        <Section tone="ink">
          <SectionHeader
            eyebrow="Residential & commercial"
            title="Same accreditation. Two very different projects."
            lead="Solar scales from a single rooftop to a six-figure commercial install. The journey differs — pick the one that fits."
            onInk
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <span className="eyebrow text-brand">For your home</span>
              <h3 className="text-h3 mt-3 text-white">
                Fast, stacked, mostly upfront
              </h3>
              <p className="mt-3 text-white/70">
                Federal STCs plus a Solar Victoria rebate for eligible homes,
                applied to your price. Pair it with hot water or a heat pump to
                stack the VEU layer too.
              </p>
              <Button href={PRIMARY_CTA.href} className="mt-6">
                {PRIMARY_CTA.label}
              </Button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <span className="eyebrow text-brand">For your business</span>
              <h3 className="text-h3 mt-3 text-white">
                A managed, six-figure project
              </h3>
              <p className="mt-3 text-white/70">{upgrade.commercialAngle}</p>
              <Button
                href="/business"
                variant="secondary-on-ink"
                className="mt-6"
              >
                See the business journey
              </Button>
            </div>
          </div>
        </Section>
      )}

      {/* 6 — FAQ + CTA */}
      {upgrade.faqs.length > 0 && (
        <Section tone="muted" narrow>
          <Eyebrow>{upgrade.name} questions</Eyebrow>
          <h2 className="text-h2 mt-4">Good to know.</h2>
          <div className="mt-8">
            <FaqAccordion
              items={upgrade.faqs.map<FaqItem>((f) => ({
                ...f,
                category: "Residential",
              }))}
            />
          </div>
          <div className="mt-8">
            <ArrowLink href="/faq">All FAQs</ArrowLink>
          </div>
        </Section>
      )}

      {/* Other upgrades */}
      <Section tone="surface" spacing="sm">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-h3">Explore other upgrades</h2>
          <ArrowLink href="/residential">All residential</ArrowLink>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {others.map((u) => (
            <Link
              key={u.slug}
              href={`/upgrades/${u.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink hover:border-text-muted/40"
            >
              <UpgradeGlyph
                icon={u.icon}
                className="text-brand-ink [&>svg]:h-4 [&>svg]:w-4"
              />
              {u.name}
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="surface" spacing="sm">
        <CtaBand />
      </Section>
    </>
  );
}

function LayerRow({ id, value }: { id: LayerId; value: LayerValue }) {
  const meta = INCENTIVE_LAYERS[id];
  return (
    <li className="flex items-start justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 font-semibold text-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          {meta.name}
          {value.kind === "loan" && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-text-muted">
              loan, not a discount
            </span>
          )}
        </p>
        {value.note && (
          <p className="mt-1 pl-[1.125rem] text-sm text-text-muted">
            {value.note}
          </p>
        )}
      </div>
      <span className="figure shrink-0 whitespace-nowrap text-right font-semibold text-ink">
        {formatRange(value.min, value.max)}
      </span>
    </li>
  );
}
