import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";
import { FullChain } from "@/components/sections/full-chain";
import { CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "How It Works, one accountable team, the whole upgrade",
  description:
    "How your upgrade actually gets done: one accountable team handles the assessment, the install and every certificate, backed by an Accredited Provider, so you get a real upfront discount and do almost nothing.",
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
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/how-it-works.jpg"
          alt="Close-up of a solar panel surface catching the light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
        />
        <div className="absolute bottom-16 sm:bottom-20 lg:bottom-24 left-0 p-8 sm:p-12 lg:p-16 z-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
            HOW IT WORKS
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
            One accountable team. The whole upgrade, handled.
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium text-white/80">
            One accountable team handles the assessment, the install and every
            certificate. Here is what to expect, and why we quote a real
            upfront discount instead of a &ldquo;free&rdquo; headline.
          </p>
          <Link
            href="/book-an-assessment"
            className="cta-green mt-8 inline-block rounded-lg px-8 py-4 text-lg"
          >
            Talk to us
          </Link>
        </div>
      </section>

      {/* 1 - What to expect (timing) */}
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

      {/* 3 - Full chain, in house */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Full chain, in house"
          title="We assess. We install. We handle the paperwork. You save."
          lead="Because our subsidiary Aussie Ecomarks is a registered Accredited Provider and we do the whole job ourselves, every step sits with one team. No chasing a separate installer, a rebate agent and a certificate trader."
        />
        <div className="mt-10">
          <FullChain />
        </div>
      </Section>
    </>
  );
}
