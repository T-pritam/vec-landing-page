import { Section, SectionHeader } from "@/components/ui/section";
import { HomeHero } from "@/components/sections/home-hero";
import { AudienceSplit } from "@/components/sections/audience-split";
import { HomeProductsGrid } from "@/components/sections/home-products-grid";
import { FullChain } from "@/components/sections/full-chain";
import { TrustStrip } from "@/components/trust-strip";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { PRIMARY_CTA } from "@/lib/site";

const WHY_POINTS = [
  "Solar, batteries, heat pumps and air conditioning.",
  "Backed by Aussie Ecomarks, a registered Accredited Provider under the VEU scheme.",
  "Indicative “up to” figures, shown honestly and never guaranteed.",
];

export default function HomePage() {
  return (
    <>
      {/* Home 1 — Hero */}
      <HomeHero />

      {/* Why AEM Energy — single consolidated intro (replaces the two stacked
          photo bands; the imagery now lives in the hero carousel). */}
      <Section tone="surface" spacing="sm">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeader
              eyebrow="Why AEM Energy"
              title="One team owns your whole upgrade, start to finish."
              lead="From solar and batteries to heat pumps and air conditioning, AEM Energy assesses your place, installs the upgrade and handles every certificate. As a sister concern of Aussie Ecomarks — a registered Accredited Provider under the VEU scheme — the whole chain sits with one accountable team, so a real upfront discount reaches you with almost nothing to do."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {/* Check-eligibility CTA commented out per client request (2026-07-30).
              <Button href={PRIMARY_CTA.href} size="lg">
                {PRIMARY_CTA.label}
              </Button>
              */}
              <Button href="/products" size="lg">
                Browse all products
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="space-y-4 rounded-2xl border border-hairline bg-surface-muted p-6 sm:p-8">
              {WHY_POINTS.map((p) => (
                <li key={p} className="flex gap-3 text-body">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand-ink" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Home 2 — Residential & Business info (informative block, no path-picker;
          heading placeholder, client copy TBC). */}
      <Section tone="muted" spacing="sm">
        <Reveal>
          <SectionHeader
            eyebrow="Who we help"
            title="Residential and commercial, both handled."
            lead="We serve homes and businesses across Victoria. The upgrades, the paperwork and the timelines differ, but one accountable team owns the whole job either way."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <AudienceSplit />
        </Reveal>
      </Section>

      {/* Home 3 — Our products: Solar hero card + Heat Pumps / Battery /
          Air Con stacked alongside it. */}
      <Section tone="surface" spacing="sm">
        <Reveal>
          <SectionHeader
            eyebrow="Our products"
            title="Pick an upgrade — or stack a few."
            lead="Every figure is indicative and shown as an “up to” amount. Solar is our flagship; each upgrade has its own page."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <HomeProductsGrid />
        </Reveal>
      </Section>

      {/* Home 4a — We assess / install / paperwork / you save (scroll reveal) */}
      <Section tone="muted">
        <Reveal>
          <SectionHeader
            eyebrow="Full-chain, in-house"
            title="We assess. We install. We handle the paperwork. You save."
            lead="Because our sister concern Aussie Ecomarks is a registered Accredited Provider and we do the whole job ourselves, every step sits with one team. You're not chasing a separate installer, a rebate agent and a certificate trader, and hoping they talk to each other."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <FullChain />
        </Reveal>
      </Section>

      {/* Home 7 — "Accredited" should mean something (proof strip; link removed) */}
      <Section tone="ink">
        <Reveal>
          <SectionHeader
            eyebrow="Our accreditation"
            title="What our accreditation actually involves."
            lead="Plenty of sites say accredited and stop there. The part that matters is that ours — held by our sister concern Aussie Ecomarks — is re-checked every year and covers the whole job rather than one slice of it."
            onInk
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <TrustStrip onInk />
        </Reveal>
      </Section>
    </>
  );
}
