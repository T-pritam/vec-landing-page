import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader, Eyebrow } from "@/components/ui/section";
import { MoneyFlow } from "@/components/sections/money-flow";
import { StackingSection } from "@/components/sections/stacking-section";
import { CtaBand } from "@/components/sections/cta-band";
import { CheckIcon } from "@/components/icons";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works — where the money really comes from",
  description:
    "The VEU mechanism in plain English: we create certificates, retailers are obligated to buy them, and the value comes back to you as an upfront discount. No catch — and honestly, not “free”.",
};

const TIMELINES = [
  {
    tag: "Residential",
    title: "Fast and simple",
    points: [
      "Eligibility check in about a minute",
      "Assessment booked quickly",
      "Many upgrades done in a single visit",
      "Discount applied upfront — no waiting on a rebate cheque",
    ],
  },
  {
    tag: "Commercial / C&I",
    title: "A longer, managed path",
    points: [
      "Scoping and a site assessment",
      "Measurement & verification where required",
      "Certificate creation across the project",
      "Managed end-to-end so your team isn't running the scheme",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            No catch. Here's exactly where the money comes from.
          </>
        }
        lead="Most providers won't explain this. We will — because once you understand the mechanism, the honest version is actually more reassuring than a “free” headline."
        tone="muted"
        primary={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        secondary={{ label: "Talk to us", href: SECONDARY_CTA.href }}
      />

      {/* 1 & 2 — The plain-English mechanism + where the money comes from */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="The mechanism"
          title="From your upgrade to your discount, in four steps."
          lead="The money doesn't come from the government's pocket. It comes from a market the government created — and we're accredited to operate in it."
        />
        <div className="mt-10">
          <MoneyFlow detailed />
        </div>
      </Section>

      {/* 3 — Why it isn't "free" */}
      <Section tone="ink">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow onInk>Honest pricing</Eyebrow>
            <h2 className="text-h2 mt-4 text-white">
              Why we'll never tell you it's “free”.
            </h2>
            <p className="mt-5 text-white/70">
              There are no free upgrades under the VEU program — a minimum
              customer contribution always applies. Any provider advertising a
              completely “free” system isn't complying with the program.
            </p>
            <p className="mt-4 text-white/70">
              We talk about a <strong className="text-white">large upfront
              discount</strong> and <strong className="text-white">what
              you'll actually pay</strong>. It's the honest version — and it's
              also your best signal that a provider knows the rules.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <ul className="space-y-4">
              {[
                ["What you'll hear from us", "“A large upfront discount.” “Here's what you'll pay.”"],
                ["What you won't hear", "“100% free.” “No cost to you.” “Government-funded giveaway.”"],
                ["Why it matters", "The “free” claim is a compliance red flag — and a quiet way to hide the real price."],
              ].map(([h, b]) => (
                <li key={h} className="flex gap-3">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand" />
                  <span>
                    <span className="block font-semibold text-white">{h}</span>
                    <span className="block text-sm text-white/65">{b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 4 — Stacking explainer (calculator occupies the slot) */}
      <Section tone="surface">
        <StackingSection
          eyebrow="Stacking, in full"
          title="The full stacking story — try it yourself."
        />
      </Section>

      {/* 5 — Timelines */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="What to expect"
          title="How long does it take?"
          lead="Residential is fast. Commercial runs a longer verification path — here's the honest difference."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {TIMELINES.map((t) => (
            <div
              key={t.tag}
              className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8"
            >
              <span className="eyebrow">{t.tag}</span>
              <h3 className="text-h3 mt-3">{t.title}</h3>
              <ul className="mt-5 space-y-3">
                {t.points.map((p) => (
                  <li key={p} className="flex gap-3 text-body">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-success" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 6 — CTA into eligibility */}
      <Section tone="surface">
        <CtaBand
          title="Now you know the mechanism — see what you qualify for."
          body="It takes about a minute. We'll show you the upgrades that fit and an indicative idea of the combined value — never a guarantee, always honest."
        />
      </Section>
    </>
  );
}
