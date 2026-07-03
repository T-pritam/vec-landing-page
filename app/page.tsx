import { Section, SectionHeader } from "@/components/ui/section";
import { ArrowLink } from "@/components/ui/button";
import { HomeHero } from "@/components/sections/home-hero";
import { AudienceSplit } from "@/components/sections/audience-split";
import { HonestPricing } from "@/components/sections/honest-pricing";
import { FullChain } from "@/components/sections/full-chain";
import { FeatureSplit } from "@/components/sections/feature-split";
import { StackingSection } from "@/components/sections/stacking-section";
import { SocialProof } from "@/components/sections/social-proof";
import { CredibilityBand } from "@/components/sections/credibility-band";
import { CtaBand } from "@/components/sections/cta-band";
import { TrustStrip } from "@/components/trust-strip";
import { FaqAccordion } from "@/components/faq-accordion";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { FAQS } from "@/lib/faq";

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero: owns a position, not a discount % */}
      <HomeHero />

      {/* 2 — Audience self-select: the single most important block */}
      <Section tone="muted" spacing="sm">
        <Reveal>
          <SectionHeader
            eyebrow="Start here"
            title="First, who are you?"
            lead="Homes and businesses get looked after differently, because the upgrades, the paperwork and the timelines are different. Tell us which you are and we'll show you only what fits."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <AudienceSplit />
        </Reveal>
      </Section>

      {/* 3 — Full-chain "you do nothing" */}
      <Section tone="muted">
        <Reveal>
          <SectionHeader
            eyebrow="Full-chain, in-house"
            title="We assess. We install. We handle the paperwork. You save."
            lead="Because we're accredited and do the whole job ourselves, every step sits with one team. You're not chasing a separate installer, a rebate agent and a certificate trader, and hoping they talk to each other."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <FullChain />
        </Reveal>
      </Section>

      {/* 4 — Honest pricing: the strongest, un-copyable section (VIC/NSW aware) */}
      <Section tone="ink">
        <Reveal>
          <HonestPricing />
        </Reveal>
      </Section>

      {/* 5 — Why AEM (image + copy; the products grid now lives on /products) */}
      <Section tone="surface">
        <FeatureSplit
          eyebrow="Why AEM Energy"
          title="One team owns the whole upgrade, start to finish."
          body={
            <>
              <p>
                AEM Energy is accredited in its own right: an Accredited Person
                under the VEU program in Victoria, and an Accredited Certificate
                Provider under the ESS and PDRS in New South Wales. That means
                the assessment, the install and the certificate creation all sit
                with one accountable team. You're not chasing a separate
                installer, a rebate agent and a paperwork service.
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
            "Solar, heat pumps, hot water, batteries, air conditioning and commercial LED.",
            "Indicative “up to” figures shown honestly, never guaranteed.",
            "Our accreditation is re-tested every year, so it actually means something.",
          ]}
          image="/images/home.jpg"
          imageAlt="A modern home at dusk, the kind AEM Energy upgrades across Australia"
          cta={{ label: "Browse all products", href: "/products" }}
          link={{ label: "How it works", href: "/how-it-works" }}
        />
      </Section>

      {/* 5b — Accreditation / install proof (image + copy) */}
      <Section tone="muted">
        <FeatureSplit
          reverse
          eyebrow="Done properly"
          title="Accredited installers. Real, tidy work."
          body={
            <>
              <p>
                Our registered installers do the work to the program standard.
                We've been operating since 2009, so we've seen the edge cases
                that trip newer providers up, and we quote around them before
                they become your problem.
              </p>
              <p>
                Where a program is income tested, we keep it separate and clear.
                In Victoria the VEU discount is open to households and businesses
                with no income test, while a Solar Victoria rebate is the one
                layer with income and property limits. In New South Wales the ESS
                and PDRS are not income tested. You'll always see which applies
                to you.
              </p>
            </>
          }
          points={[
            "Not income tested in either state, apart from the Solar Victoria layer in VIC.",
            "Metro and regional, in both states, with one accountable team end-to-end.",
            "We explain exactly where the discount comes from before you commit.",
          ]}
          image="/images/installer.jpg"
          imageAlt="An accredited installer fitting solar panels on a roof"
          link={{ label: "More on our accreditation", href: "/about" }}
        />
      </Section>

      {/* 6 — Stacking explainer (interactive calculator occupies this slot) */}
      <Section tone="muted">
        <Reveal>
          <StackingSection />
        </Reveal>
      </Section>

      {/* 7 — Trust / accreditation strip (premium dark break) */}
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
        <Reveal delay={0.12} className="mt-8">
          <ArrowLink
            href="/about"
            className="text-white decoration-brand hover:text-brand"
          >
            More on our accreditation and how the whole chain works
          </ArrowLink>
        </Reveal>
      </Section>

      {/* 8 — Social proof */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="From our customers"
            title="Done properly, explained honestly."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <SocialProof />
        </Reveal>
        <Reveal delay={0.12} className="mt-6">
          <CredibilityBand />
        </Reveal>
      </Section>

      {/* 9 — FAQ teaser */}
      <Section tone="muted" narrow>
        <Reveal>
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="text-h2 mt-4">Questions, answered honestly.</h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-8">
          <FaqAccordion items={FAQS.slice(0, 5)} />
        </Reveal>
        <Reveal delay={0.12} className="mt-8">
          <ArrowLink href="/faq">See all FAQs</ArrowLink>
        </Reveal>
      </Section>

      {/* 10 — Final CTA + contact */}
      <Section tone="surface">
        <Reveal>
          <CtaBand />
        </Reveal>
      </Section>
    </>
  );
}
