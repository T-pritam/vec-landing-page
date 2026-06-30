import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProductCards } from "@/components/sections/product-cards";
import { StandaloneProducts } from "@/components/sections/standalone-products";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { PAGE_IMAGE } from "@/lib/images";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products & upgrades",
  description:
    "Browse the energy upgrades AEM Energy installs — solar, heat pumps, batteries, air conditioning and commercial LED — plus our standalone Distillo water filtration. Each comes with a large upfront discount, handled end-to-end.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our products"
        title="Everything we install, in one place."
        lead="Browse our energy upgrades — each one handled end-to-end, from assessment to certificate. Pick a product to see how it works, what it qualifies for and what you'd actually pay."
        tone="muted"
        image={PAGE_IMAGE.products.src}
        imageAlt={PAGE_IMAGE.products.alt}
        primary={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        secondary={{ label: SECONDARY_CTA.label, href: SECONDARY_CTA.href }}
      />

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Energy upgrades"
            title="Choose a product."
            lead="Every upgrade has its own page with the indicative “up to” figures and eligibility. Solar is our flagship."
          />
        </Reveal>
        <div className="mt-10">
          <ProductCards audience="all" />
        </div>

        <Reveal className="mt-16 block border-t border-hairline pt-12">
          <SectionHeader
            eyebrow="Also from AEM Energy"
            title="A standalone product, too."
            lead="Not everything we do is a VEU upgrade. Distillo Water Filtration is a separate product — no rebate or scheme, just a quality system and a clean install."
          />
          <div className="mt-8">
            <StandaloneProducts />
          </div>
        </Reveal>
      </Section>

      <Section tone="surface" spacing="sm">
        <CtaBand />
      </Section>
    </>
  );
}
