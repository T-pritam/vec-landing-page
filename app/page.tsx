import { Section, SectionHeader } from "@/components/ui/section";
import { ArrowLink } from "@/components/ui/button";
import { HomeHero } from "@/components/sections/home-hero";
import { AudienceSplit } from "@/components/sections/audience-split";
import { MoneyFlow } from "@/components/sections/money-flow";
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
            lead="The home and business journeys are different. Pick your path and we'll tune everything to you."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <AudienceSplit />
        </Reveal>
      </Section>

      {/* 3 — How the money works (teaser) */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="The part nobody explains"
            title="Where does the money actually come from?"
            lead="No catch, no mystery. Here's the mechanism in four steps — the thing almost no competitor will tell you plainly."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <MoneyFlow />
        </Reveal>
        <Reveal delay={0.12} className="mt-8">
          <ArrowLink href="/how-it-works">
            See the full explanation, including the “why it isn't free” part
          </ArrowLink>
        </Reveal>
      </Section>

      {/* 4 — Full-chain "you do nothing" */}
      <Section tone="muted">
        <Reveal>
          <SectionHeader
            eyebrow="Full-chain, in-house"
            title="We assess. We install. We handle the paperwork. You save."
            lead="Because we operate under our Accredited Person, Aussie Eco Marks, every step sits with one team — no chasing a separate installer, rebate agent and certificate trader."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <FullChain />
        </Reveal>
      </Section>

      {/* 5 — Why AEM (image + copy; the products grid now lives on /products) */}
      <Section tone="surface">
        <FeatureSplit
          eyebrow="Why AEM Energy"
          title="One team owns the whole upgrade — start to finish."
          body={
            <>
              <p>
                AEM Energy operates under our Accredited Person, Aussie Eco
                Marks, in the Victorian Energy Upgrades program. That means the
                assessment, the install and the certificate creation all sit
                with one accountable team — you're not chasing a separate
                installer, a rebate agent and a paperwork service.
              </p>
              <p>
                The result is a large upfront discount — not a “free” gimmick —
                and a process where you do almost nothing. We size the system to
                how you actually use power, complete the work with our
                accredited installers, and handle every certificate and
                compliance step behind the scenes.
              </p>
            </>
          }
          points={[
            "Solar, heat pumps, hot water, batteries, air conditioning and commercial LED.",
            "Indicative “up to” figures shown honestly — never guaranteed.",
            "Accredited Person re-tested every year — accreditation that means something.",
          ]}
          image="/images/home.jpg"
          imageAlt="A modern home at dusk, the kind AEM Energy upgrades across Victoria"
          cta={{ label: "Browse all products", href: "/products" }}
          link={{ label: "How the money works", href: "/how-it-works" }}
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
                Our registered installers do the work to the program's standard
                — and because we've operated in the VEU program since 2009,
                we've seen the edge cases that catch other providers out.
              </p>
              <p>
                Where a home qualifies, we keep the programs distinct: the VEU
                discount is open to Victorian households and businesses, while a
                Solar Victoria rebate — the one layer with income and property
                thresholds — is applied separately for eligible homes. You'll
                always see which applies to you.
              </p>
            </>
          }
          points={[
            "VEU is not means-tested; only the Solar Victoria layer is.",
            "Metro & regional Victoria — one accountable team end-to-end.",
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
            eyebrow="Proof, not a slogan"
            title="“Accredited” should mean something. Here's what ours means."
            lead="Most sites say “accredited” with no evidence. The genuinely strong fact — that our Accredited Person, Aussie Eco Marks, is re-tested every year — is used by almost nobody."
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
            More on our accreditation &amp; the full-chain story
          </ArrowLink>
        </Reveal>
      </Section>

      {/* 8 — Social proof */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="What customers say"
            title="Straight answers, start to finish."
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
