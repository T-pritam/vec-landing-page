import { Section, SectionHeader } from "@/components/ui/section";
import { ArrowLink } from "@/components/ui/button";
import { HomeHero } from "@/components/sections/home-hero";
import { AudienceSplit } from "@/components/sections/audience-split";
import { MoneyFlow } from "@/components/sections/money-flow";
import { FullChain } from "@/components/sections/full-chain";
import { UpgradesGrid } from "@/components/sections/upgrades-grid";
import { StackingSection } from "@/components/sections/stacking-section";
import { SocialProof } from "@/components/sections/social-proof";
import { CtaBand } from "@/components/sections/cta-band";
import { TrustStrip } from "@/components/trust-strip";
import { FaqAccordion } from "@/components/faq-accordion";
import { Eyebrow } from "@/components/ui/section";
import { FAQS } from "@/lib/faq";

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero: owns a position, not a discount % */}
      <HomeHero />

      {/* 2 — Audience self-select: the single most important block */}
      <Section tone="muted" spacing="sm">
        <SectionHeader
          eyebrow="Start here"
          title="First, who are you?"
          lead="The home and business journeys are different. Pick your path and we'll tune everything to you."
        />
        <div className="mt-10">
          <AudienceSplit />
        </div>
      </Section>

      {/* 3 — How the money works (teaser) */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="The part nobody explains"
          title="Where does the money actually come from?"
          lead="No catch, no mystery. Here's the mechanism in four steps — the thing almost no competitor will tell you plainly."
        />
        <div className="mt-10">
          <MoneyFlow />
        </div>
        <div className="mt-8">
          <ArrowLink href="/how-it-works">
            See the full explanation, including the “why it isn't free” part
          </ArrowLink>
        </div>
      </Section>

      {/* 4 — Full-chain "you do nothing" */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Full-chain, in-house"
          title="We assess. We install. We handle the paperwork. You save."
          lead="Because we're the Accredited Person, every step sits with one team — no chasing a separate installer, rebate agent and certificate trader."
        />
        <div className="mt-10">
          <FullChain />
        </div>
      </Section>

      {/* 5 — Upgrades */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="What we upgrade"
          title="Pick an upgrade — or stack a few."
          lead="Every figure here is indicative and shown as an “up to” amount. Solar is our flagship; each upgrade has its own page."
        />
        <div className="mt-10">
          <UpgradesGrid />
        </div>
      </Section>

      {/* 6 — Stacking explainer (interactive calculator occupies this slot) */}
      <Section tone="muted">
        <StackingSection />
      </Section>

      {/* 7 — Trust / accreditation strip (premium dark break) */}
      <Section tone="ink">
        <SectionHeader
          eyebrow="Proof, not a slogan"
          title="“Accredited” should mean something. Here's what ours means."
          lead="Most sites say “accredited” with no evidence. The genuinely strong fact — that we're re-tested every year — is used by almost nobody."
          onInk
        />
        <div className="mt-10">
          <TrustStrip onInk />
        </div>
        <div className="mt-8">
          <ArrowLink
            href="/about"
            className="text-white decoration-brand hover:text-brand"
          >
            More on our accreditation &amp; the full-chain story
          </ArrowLink>
        </div>
      </Section>

      {/* 8 — Social proof */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="What customers say"
          title="Straight answers, start to finish."
        />
        <div className="mt-10">
          <SocialProof />
        </div>
      </Section>

      {/* 9 — FAQ teaser */}
      <Section tone="muted" narrow>
        <Eyebrow>Good to know</Eyebrow>
        <h2 className="text-h2 mt-4">Questions, answered honestly.</h2>
        <div className="mt-8">
          <FaqAccordion items={FAQS.slice(0, 5)} />
        </div>
        <div className="mt-8">
          <ArrowLink href="/faq">See all FAQs</ArrowLink>
        </div>
      </Section>

      {/* 10 — Final CTA + contact */}
      <Section tone="surface">
        <CtaBand />
      </Section>
    </>
  );
}
