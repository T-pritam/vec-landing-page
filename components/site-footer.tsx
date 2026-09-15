import Link from "next/link";
import { Logo, PhoneIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SITE, PRIMARY_CTA } from "@/lib/site";

const columns = [
  {
    title: "Products",
    links: [
      { label: "Solar", href: "/upgrades/solar" },
      { label: "Battery Storage", href: "/upgrades/battery" },
      { label: "Reverse Cycle Air Con", href: "/upgrades/air-con" },
      { label: "Heat Pumps", href: "/upgrades/heat-pumps" },
      {
        label: "Distillo Water Filter",
        href: "/products/distillo-water-filtration",
      },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Products", href: "/products" },
      // { label: "Check eligibility", href: "/check-eligibility" },
      { label: "About / Why us", href: "/about" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/privacy#terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink text-white">
      {/* CTA cap */}
      <div className="container-page border-b border-white/10 py-14 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-h2 text-white">
              See what you qualify for in about a minute.
            </h2>
            <p className="mt-3 text-white/65">
              No obligation. We'll show you the upgrades that fit and an
              indicative idea of the combined value.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Check-eligibility CTA commented out per client request (2026-07-30).
            <Button href={PRIMARY_CTA.href} size="lg">
              {PRIMARY_CTA.label}
            </Button>
            */}
            <a
              href={SITE.phoneHref}
              className="cta-green inline-flex items-center gap-2 rounded-lg px-8 py-4 text-lg"
            >
              <PhoneIcon className="h-4 w-4" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-page grid grid-cols-2 gap-8 pt-20 pb-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Logo onInk />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            {SITE.tagline}
          </p>
          <p className="mt-4 text-sm text-white/55">
            <a
              href={SITE.phoneHref}
              className="text-white/80 hover:text-brand"
            >
              {SITE.phone}
            </a>
            <span className="hidden md:inline">{" · "}</span>
            <br className="md:hidden" />
            <a
              href={`mailto:${SITE.email}`}
              className="text-white/80 hover:text-brand"
            >
              {SITE.email}
            </a>
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Legal line */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-white/60">
              {SITE.legalName} | ACN {SITE.acn} | ABN {SITE.abn}
            </p>
            <p>{SITE.address}</p>
            <p>
              © {new Date().getFullYear()} {SITE.legalName}. {SITE.accreditation}.
            </p>
          </div>
          <p className="max-w-2xl sm:text-right">
            Indicative figures only, not a quote or guarantee. VEU and Solar
            Victoria are distinct programs; income thresholds apply only to Solar
            Victoria.
          </p>
        </div>
      </div>
    </footer>
  );
}
