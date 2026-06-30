import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader, Eyebrow } from "@/components/ui/section";
import { Button, ArrowLink } from "@/components/ui/button";
import { CheckIcon, ShieldCheckIcon, UpgradeGlyph } from "@/components/icons";
import { CtaBand } from "@/components/sections/cta-band";
import { PAGE_IMAGE } from "@/lib/images";
import { PRIMARY_CTA, SITE } from "@/lib/site";
import { UPGRADES } from "@/lib/upgrades";

export const metadata: Metadata = {
  title: "Business & Commercial energy upgrades (C&I)",
  description:
    "Commercial solar, lighting (Commercial LED – NBB) and HVAC upgrades managed end-to-end by AEM Energy, operating under our Accredited Person, Aussie Eco Marks. ROI-driven, compliant and credible — with combined value that can reach six figures.",
};

// Commercial-relevant upgrades (everything except residential-only items).
const COMMERCIAL_UPGRADES = UPGRADES.filter((u) => u.available !== "residential");

const OPPORTUNITY = [
  {
    stat: "Six figures",
    label: "possible combined value",
    body: "Large commercial solar and major efficiency projects can reach six-figure combined value. Modelled per project — indicative, never guaranteed.",
  },
  {
    stat: "One partner",
    label: "for the whole project",
    body: "Assessment, install, certificate creation and compliance — managed by AEM Energy with our Accredited Person, Aussie Eco Marks, so your team isn't running the scheme.",
  },
  {
    stat: "M&V",
    label: "measurement & verification",
    body: "Larger projects follow a measurement & verification path. We handle the method and the evidence so the value holds up.",
  },
];

const PROCESS = [
  { n: "01", t: "Scope & site assessment", b: "We review your site, loads and goals and identify the eligible activities." },
  { n: "02", t: "Model the project", b: "We model the indicative combined value and the ROI, and agree a method." },
  { n: "03", t: "Install & verify", b: "Our accredited team delivers the works and runs measurement & verification where required." },
  { n: "04", t: "Certificates & compliance", b: "We create the certificates and own the compliance obligations end-to-end." },
];

export default function BusinessPage() {
  return (
    <>
      <PageHero
        eyebrow="Commercial & industrial"
        title="Serious energy projects, managed by the accredited team."
        lead="For offices, warehouses, retail and industrial sites. Rational, ROI-driven and compliant — we own the whole project so your team doesn't have to."
        tone="business"
        image={PAGE_IMAGE.business.src}
        imageAlt={PAGE_IMAGE.business.alt}
        primary={{ label: "Book a site assessment", href: PRIMARY_CTA.href }}
        secondary={{ label: "Talk to our C&I team", href: "/contact" }}
      />

      {/* 2 — The commercial opportunity */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="The opportunity"
          title="The numbers are bigger — and so is the need to get it right."
          lead="Commercial value is project-specific. Here's the shape of it; we'll model the real figures with you."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {OPPORTUNITY.map((o) => (
            <div
              key={o.stat}
              className="rounded-2xl border border-hairline bg-surface p-6 sm:p-7"
            >
              <p className="figure text-3xl font-semibold text-business">
                {o.stat}
              </p>
              <p className="mt-1 text-sm font-medium text-text-muted">
                {o.label}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {o.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-caption">
          Indicative only — commercial value depends entirely on the project,
          site and market certificate prices. Not a quote or guarantee.
        </p>
      </Section>

      {/* Commercial upgrades we deliver (incl. Commercial LED – NBB) */}
      <Section tone="surface" spacing="sm">
        <SectionHeader
          eyebrow="Commercial upgrades"
          title="What we deliver for C&I sites."
          lead="The activities that scale for business — including Commercial LED – NBB for eligible non-building-based lighting."
        />
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COMMERCIAL_UPGRADES.map((u) => (
            <Link
              key={u.slug}
              href={`/upgrades/${u.slug}`}
              className="lift group flex items-start gap-3 rounded-2xl border border-hairline bg-surface p-5 transition-colors hover:border-business/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-business-tint text-business [&>span>svg]:h-6 [&>span>svg]:w-6">
                <UpgradeGlyph icon={u.icon} />
              </span>
              <span>
                <span className="block font-semibold text-ink">{u.name}</span>
                <span className="mt-0.5 block text-sm leading-snug text-text-muted">
                  {u.commercialAngle ? "Managed C&I project" : u.tagline}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 3 — How it works for business */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="The managed path"
          title="A longer, verified process — handled for you."
          lead="Unlike a quick residential install, commercial projects run a measurement & verification path. We manage every stage."
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <li key={p.n} className="rounded-2xl border border-hairline bg-surface p-6">
              <span className="figure text-sm font-semibold text-business">{p.n}</span>
              <p className="mt-3 text-h3 text-[1.125rem]">{p.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.b}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <ArrowLink href="/how-it-works">
            How the certificate mechanism works
          </ArrowLink>
        </div>
      </Section>

      {/* 4 & 5 — Full-chain + Accreditation & compliance (heavier emphasis) */}
      <Section tone="business">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <Eyebrow onInk>Accreditation & compliance</Eyebrow>
            <h2 className="text-h2 mt-4 text-white">
              The compliance burden sits with us — not your business.
            </h2>
            <p className="mt-5 text-white/75">
              As a full-chain operation under our Accredited Person, Aussie Eco
              Marks, we create the certificates and carry the program
              obligations. Your finance and facilities teams get a clean,
              ROI-driven project — not a scheme to administer.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Our Accredited Person creates VEECs — re-tested every year",
                "Measurement & verification handled to method",
                "Audit-ready documentation across the project",
                "One accountable partner, start to finish",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-white/85">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand" />
            <p className="mt-5 text-h3 text-white">Credible by design</p>
            <p className="mt-3 text-white/70">
              Most providers that address business do it dryly, and few prove
              their accreditation. We make it the centrepiece — because for a
              six-figure decision, credibility is the product.
            </p>
            <Button href={PRIMARY_CTA.href} className="mt-6">
              Book a site assessment
            </Button>
          </div>
        </div>
      </Section>

      {/* 6 — Case studies / logos (placeholder) */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Track record"
          title="Projects & partners."
          lead="Placeholder — client to supply case studies and logos before launch."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Warehouse lighting + solar", "Indicative six-figure value across a large logistics site.", "/images/solar.jpg"],
            ["Hospitality hot water + HVAC", "Stacked upgrades cutting energy across multiple venues.", "/images/air-con.jpg"],
            ["Retail portfolio LED", "High-volume lighting upgrade rolled out across stores.", "/images/led.jpg"],
          ].map(([t, b, img]) => (
            <article
              key={t}
              className="lift overflow-hidden rounded-2xl border border-hairline bg-surface-muted"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
                <Image
                  src={img}
                  alt={t}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-7">
                <span className="rounded-full bg-business-tint px-3 py-1 text-xs font-semibold text-business">
                  Case study · placeholder
                </span>
                <h3 className="mt-4 text-h3 text-[1.125rem]">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{b}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex h-20 items-center justify-center rounded-xl border border-dashed border-hairline text-sm text-text-muted"
            >
              Client logo
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface" spacing="sm">
        <CtaBand
          tone="ink"
          title="Scope your commercial project."
          body="Book a site assessment with our C&I team. We'll model the indicative value and ROI — and own the delivery, certificates and compliance."
          primaryLabel="Book a site assessment"
        />
      </Section>
    </>
  );
}
