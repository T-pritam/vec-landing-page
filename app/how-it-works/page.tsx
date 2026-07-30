import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { FullChain } from "@/components/sections/full-chain";
import { CheckIcon } from "@/components/icons";
import { PAGE_IMAGE } from "@/lib/images";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works — one accountable team, the whole upgrade",
  description:
    "How your upgrade actually gets done: one accountable team handles the assessment, the install and every certificate — backed by an Accredited Provider — so you get a genuine upfront discount and do almost nothing.",
};

const TIMELINES = [
  {
    tag: "Residential",
    title: "Fast and simple",
    points: [
      "Eligibility check in about a minute",
      "Assessment booked quickly",
      "Many upgrades done in a single visit",
      "Discount applied upfront, with no waiting on a rebate cheque",
    ],
  },
  {
    tag: "Commercial and C&I",
    title: "A longer, managed path",
    points: [
      "Scoping and a site assessment",
      "Measurement and verification where the scheme requires it",
      "Certificate creation across the whole project",
      "Managed start to finish, so your team isn't running the scheme",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={<>One accountable team. The whole upgrade, handled.</>}
        lead="One accountable team handles the assessment, the install and every certificate. Here is what to expect, and why we quote a genuine upfront discount instead of a “free” headline."
        tone="muted"
        image={PAGE_IMAGE["how-it-works"].src}
        imageAlt={PAGE_IMAGE["how-it-works"].alt}
        // Check-eligibility CTA commented out per client request (2026-07-30):
        // primary={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        secondary={{ label: "Talk to us", href: SECONDARY_CTA.href }}
      />

      {/* 1 — What to expect (timing) */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="What to expect"
          title="How long does it take?"
          lead="Residential is quick. Commercial runs a longer verification path, and here's the honest difference between the two."
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

      {/* 3 — Full chain, in house */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Full chain, in house"
          title="We assess. We install. We handle the paperwork. You save."
          lead="Because our sister concern Aussie Ecomarks is a registered Accredited Provider and we do the whole job ourselves, every step sits with one team. No chasing a separate installer, a rebate agent and a certificate trader."
        />
        <div className="mt-10">
          <FullChain />
        </div>
      </Section>
    </>
  );
}
