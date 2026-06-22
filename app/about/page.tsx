import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader, Eyebrow } from "@/components/ui/section";
import { TrustStrip } from "@/components/trust-strip";
import { SocialProof } from "@/components/sections/social-proof";
import { CtaBand } from "@/components/sections/cta-band";
import { CheckIcon, ShieldCheckIcon } from "@/components/icons";
import { SITE, PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "About & Why Us — accreditation, proven",
  description:
    "We're a full-chain Accredited Person under the VEU program — re-tested every year on a fit-and-proper and competent-and-capable basis. Owning the whole chain is how we protect customers.",
};

const FULL_CHAIN_POINTS = [
  {
    t: "We own the lead",
    b: "We talk to you directly — no reselling your details to a third-party installer.",
  },
  {
    t: "We own the install",
    b: "Our registered installers do the work to the program's standard.",
  },
  {
    t: "We own the certificates",
    b: "Only an Accredited Person can create VEECs. That's us — the value isn't outsourced.",
  },
  {
    t: "We own the outcome",
    b: "One accountable team end-to-end means nothing falls between the cracks.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Accredited isn't a slogan here. It's the whole business."
        lead="We're a full-chain Accredited Person under the Victorian Energy Upgrades program. That's a specific, verifiable status — and it's the reason we can do what most providers can't."
        tone="ink"
        primary={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        secondary={{ label: SECONDARY_CTA.label, href: SECONDARY_CTA.href }}
      />

      {/* 1 — Who we are */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Who we are"
              title="The accredited team that handles your entire upgrade."
            />
            <p className="mt-5 text-body">
              Under the VEU program, only an Accredited Person can create the
              tradable certificates (VEECs) that fund the rebates. We own the
              entire chain — the lead, the assessment, the install (via our
              registered installers), the certificate creation, and the sale.
            </p>
            <p className="mt-4 text-body">
              For you, that means a single accountable team and an honest number.
              We'll never tell you an upgrade is “free” — there's always a
              minimum contribution — but we will show you a large upfront
              discount and exactly what you'd pay.
            </p>
          </div>
          <aside className="rounded-2xl border border-hairline bg-surface-muted p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              At a glance
            </p>
            <dl className="mt-4 space-y-4">
              {[
                ["Status", "Accredited Person (VEU)"],
                ["Accreditation no.", SITE.accreditationNo],
                ["ABN", SITE.abn],
                ["Service area", SITE.serviceArea],
                ["Program running since", "2009"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-t border-hairline pt-4 first:border-0 first:pt-0">
                  <dt className="text-sm text-text-muted">{k}</dt>
                  <dd className="text-sm font-medium text-ink text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-caption">
              Placeholder details — client to confirm trading name &amp;
              accreditation specifics before launch.
            </p>
          </aside>
        </div>
      </Section>

      {/* 2 — Accreditation as proof */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Proof, not a promise"
          title="Re-tested every single year."
          lead="Accredited Persons must pass a “fit and proper persons” test and a “competent and capable” test — and renew accreditation annually. It's a strong, specific credibility signal that almost no competitor surfaces."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Fit & proper", "An annual integrity test — not a one-time tick."],
            ["Competent & capable", "Proven capability to deliver, reassessed every year."],
            ["Renewed annually", "Accreditation lapses if we don't keep meeting the bar."],
          ].map(([t, b]) => (
            <div key={t} className="rounded-2xl border border-hairline bg-surface p-6">
              <ShieldCheckIcon className="h-8 w-8 text-brand-ink" />
              <h3 className="mt-4 text-h3 text-[1.125rem]">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{b}</p>
            </div>
          ))}
        </div>
        {/* Official badges placeholder */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {["Accredited Person", "VEU program", "Solar Victoria", "Clean Energy"].map(
            (b) => (
              <div
                key={b}
                className="flex h-16 items-center gap-2 rounded-xl border border-dashed border-hairline px-5 text-sm text-text-muted"
              >
                <ShieldCheckIcon className="h-5 w-5 text-text-muted" />
                {b} badge
              </div>
            ),
          )}
        </div>
        <p className="mt-3 text-caption">
          Official accreditation badges — client to supply before launch.
        </p>
      </Section>

      {/* 3 — The full-chain advantage */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="The full-chain advantage"
          title="Owning every step is how we protect you."
          lead="When the lead, the install and the certificates sit with different companies, things go wrong in the gaps. We removed the gaps."
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {FULL_CHAIN_POINTS.map((p) => (
            <div key={p.t} className="bg-surface p-6">
              <CheckIcon className="h-6 w-6 text-success" />
              <h3 className="mt-4 font-semibold text-ink">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4 — Trust signals */}
      <Section tone="ink">
        <Eyebrow onInk>Trust signals</Eyebrow>
        <h2 className="text-h2 mt-4 text-white">Built to be checked.</h2>
        <div className="mt-10">
          <TrustStrip onInk />
        </div>
        <div className="mt-12">
          <SocialProof onInk />
        </div>
      </Section>

      <Section tone="surface">
        <CtaBand />
      </Section>
    </>
  );
}
