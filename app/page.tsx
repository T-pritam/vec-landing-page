import { Section, SectionHeader } from "@/components/ui/section";
import { CinematicIntro } from "@/components/sections/cinematic-intro";
import { HomeHero } from "@/components/sections/home-hero";
import { ProductsOverview } from "@/components/sections/products-overview";
import HowItWorks from "@/components/sections/how-it-works";
import { ProductGrid } from "@/components/sections/product-grid";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { ServingSection } from "@/components/sections/serving-section";
import { TrustStrip } from "@/components/trust-strip";
import { Reveal } from "@/components/motion/reveal";
import { getAllBrands } from "@/lib/brands";

export default function HomePage() {
  const allBrands = getAllBrands();

  return (
    <>
      <CinematicIntro />

      <HomeHero />

      <ProductsOverview />

      <HowItWorks />

      <ProductGrid />

      <section className="py-20 px-8 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Our Trusted Brands.
          </h2>
          <BrandMarquee brands={allBrands} />
        </div>
      </section>

      <ServingSection />

      <Section tone="ink">
        <Reveal>
          <SectionHeader
            eyebrow="Our accreditation"
            title="What our accreditation actually involves."
            lead="Plenty of sites say accredited and stop there. The part that matters is that ours, held by a registered Accredited Provider, is re-checked every year and covers the whole job rather than one slice of it."
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
