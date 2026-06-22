/**
 * Site-wide constants. Contact / trading details are PRD §9 "client to confirm"
 * items — these are clearly-labelled placeholders, swap on client confirm.
 */
export const SITE = {
  name: "Accredited Energy",
  // PRD §9 item 7 — trading name & accreditation details (placeholder).
  legalName: "Accredited Energy Pty Ltd",
  tagline: "The accredited team that handles your entire energy upgrade.",
  description:
    "A Victorian Accredited Person under the Victorian Energy Upgrades (VEU) program. We own the whole chain — assessment, install, certificates and paperwork — so you get a large upfront discount and do almost nothing.",
  url: "https://accredited-energy.example",
  // PRD §9 item 3 — contact details (placeholder).
  phone: "1300 000 000",
  phoneHref: "tel:1300000000",
  email: "hello@accredited-energy.example",
  serviceArea: "Victoria — metro & regional",
  // PRD §9 item 7 — accreditation number (placeholder).
  accreditationNo: "AP-0000 (placeholder)",
  abn: "00 000 000 000 (placeholder)",
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

/** Primary navigation (PRD §6 sitemap). */
export const PRIMARY_NAV: NavItem[] = [
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "The money mechanism — explained plainly",
  },
  {
    label: "Residential",
    href: "/residential",
    description: "Upgrades for your home",
  },
  {
    label: "Business / C&I",
    href: "/business",
    description: "Commercial & industrial projects",
  },
  {
    label: "About",
    href: "/about",
    description: "Accreditation & the full-chain story",
  },
];

/** Persistent primary CTA — appears in header on every page (PRD §6 global). */
export const PRIMARY_CTA = {
  label: "Check your eligibility",
  shortLabel: "Check eligibility",
  href: "/check-eligibility",
} as const;

export const SECONDARY_CTA = {
  label: "Get a quote",
  href: "/contact",
} as const;
