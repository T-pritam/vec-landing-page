import { Section, SectionHeader } from "@/components/ui/section";
import { HomeHero } from "@/components/sections/home-hero";
import { BgSlideFeature } from "@/components/sections/bg-slide-feature";
import { AudienceSplit } from "@/components/sections/audience-split";
import { HomeProductsGrid } from "@/components/sections/home-products-grid";
import { FullChain } from "@/components/sections/full-chain";
import { StackingSection } from "@/components/sections/stacking-section";
import { TrustStrip } from "@/components/trust-strip";
import { Reveal } from "@/components/motion/reveal";

export default function HomePage() {
  return (
    <>
      {/* Home 1 — Hero */}
      <HomeHero />

      {/* Home 5 — One team owns the whole upgrade (Why AEM): full-bleed photo
          that wipes in left-to-right, copy on the right. */}
      <BgSlideFeature
        eyebrow="Why AEM Energy"
        title="One team owns the whole upgrade, start to finish."
        body={
          <>
            <p>
              AEM Energy is accredited in its own right: an Accredited Person
              under the VEU program in Victoria. That means the assessment,
              the install and the certificate creation all sit with one
              accountable team. You're not chasing a separate installer, a
              rebate agent and a paperwork service.
            </p>
            <p>
              The result is a real upfront discount and a process where you do
              almost nothing. We size the system to how you actually use power,
              complete the work with our own registered installers, and handle
              every certificate and compliance step behind the scenes.
            </p>
          </>
        }
        points={[
          "Solar, heat pumps, hot water, batteries and air conditioning.",
          "Indicative “up to” figures shown honestly, never guaranteed.",
          "Our accreditation is re-tested every year, so it actually means something.",
        ]}
        image="/images/solar.jpg"
        imageAlt="A modern Australian home with a full rooftop solar array — the kind of end-to-end upgrade AEM Energy owns start to finish"
        copySide="right"
        reveal="ltr"
        cta={{ label: "Browse all products", href: "/products" }}
        link={{ label: "How it works", href: "/how-it-works" }}
      />

      {/* Home 6 — Accredited installers: full-bleed photo that wipes in
          right-to-left (mirror of Home 5), copy on the left, no link. */}
      <BgSlideFeature
        eyebrow="Done properly"
        title="Accredited installers. Real, tidy work."
        body={
          <>
            <p>
              Our registered installers do the work to the program standard.
              We've been operating since 2021, so we've seen the edge cases that
              trip newer providers up, and we quote around them before they
              become your problem.
            </p>
            <p>
              Where a program is income tested, we keep it separate and clear.
              The VEU discount is open to households and businesses with no
              income test, while a Solar Victoria rebate is the one layer with
              income and property limits. You'll always see which applies to
              you.
            </p>
          </>
        }
        points={[
          "Not income tested, apart from the Solar Victoria layer.",
          "Metro and regional, with one accountable team end-to-end.",
          "We explain exactly where the discount comes from before you commit.",
        ]}
        image="/images/installer.jpg"
        imageAlt="An accredited installer fitting solar panels on a roof"
        copySide="left"
        reveal="rtl"
      />

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
            lead="Because we're accredited and do the whole job ourselves, every step sits with one team. You're not chasing a separate installer, a rebate agent and a certificate trader, and hoping they talk to each other."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <FullChain />
        </Reveal>
      </Section>

      {/* Home 7 — Stacking explainer (interactive calculator) */}
      <Section tone="surface">
        <Reveal>
          <StackingSection />
        </Reveal>
      </Section>

      {/* Home 8 — "Accredited" should mean something (proof strip; link removed) */}
      <Section tone="ink">
        <Reveal>
          <SectionHeader
            eyebrow="Our accreditation"
            title="What our accreditation actually involves."
            lead="Plenty of sites say accredited and stop there. The part that matters is that ours is re-checked every year, in our own name, and covers the whole job rather than one slice of it."
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
