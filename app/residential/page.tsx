import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { UpgradesGrid } from "@/components/sections/upgrades-grid";
import { StandaloneProducts } from "@/components/sections/standalone-products";
import { FullChain } from "@/components/sections/full-chain";
import { StackingSection } from "@/components/sections/stacking-section";
import { SocialProof } from "@/components/sections/social-proof";
import { CtaBand } from "@/components/sections/cta-band";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Residential upgrades for your home",
  description:
    "Solar, heat pumps (incl. hot water), batteries and air conditioning — household energy upgrades with a large upfront discount, handled end-to-end by AEM Energy, operating under our Accredited Person, Aussie Eco Marks.",
};

export default function ResidentialPage() {
  return (
    <>
      <PageHero
        eyebrow="For your home"
        title="Upgrade your home. We'll handle the rest."
        lead="Fast, simple, and mostly upfront. Pick a single upgrade or stack a few — we assess, install and manage every certificate, so you do almost nothing."
        tone="muted"
        primary={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        secondary={{ label: SECONDARY_CTA.label, href: SECONDARY_CTA.href }}
      />

      <Section tone="surface">
        <SectionHeader
          eyebrow="Household upgrades"
          title="Choose your upgrade."
          lead="Every figure is indicative and shown as an “up to” amount. Each upgrade has its own page with the detail."
        />
        <div className="mt-10">
          <UpgradesGrid />
        </div>

        {/* Also from AEM Energy — standalone (non-VEU) products */}
        <div className="mt-14 border-t border-hairline pt-12">
          <SectionHeader
            eyebrow="Also from AEM Energy"
            title="A standalone product, too."
            lead="Not everything we do is a VEU upgrade. Distillo Water Filtration is a separate product — no rebate or scheme, just a quality system and a clean install."
          />
          <div className="mt-8">
            <StandaloneProducts />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeader
          eyebrow="The easy part is you"
          title="We assess. We install. We handle the paperwork. You save."
        />
        <div className="mt-10">
          <FullChain />
        </div>
      </Section>

      <Section tone="surface">
        <StackingSection
          eyebrow="Stack your savings"
          title="See how the incentives stack for your home."
        />
      </Section>

      <Section tone="muted">
        <SectionHeader eyebrow="From our customers" title="Done properly, explained honestly." />
        <div className="mt-10">
          <SocialProof />
        </div>
      </Section>

      <Section tone="surface">
        <CtaBand />
      </Section>
    </>
  );
}
