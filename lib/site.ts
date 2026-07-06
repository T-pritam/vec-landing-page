/**
 * Site-wide constants. Contact / trading details are PRD §9 "client to confirm"
 * items — these are clearly-labelled placeholders, swap on client confirm.
 */
export const SITE = {
  name: "AEM Energy",
  // PRD §9 item 7 — trading name & accreditation details (placeholder).
  legalName: "AEM Energy Pty Ltd (placeholder)",
  // AEM Energy is accredited in its own right: an Accredited Person under the
  // Victorian Energy Upgrades (VEU) program.
  accreditation: "Accredited Person under the Victorian Energy Upgrades (VEU) program",
  tagline: "The accredited team that handles your entire energy upgrade.",
  description:
    "AEM Energy is the accredited team that handles your entire energy upgrade. We are an Accredited Person under the Victorian Energy Upgrades (VEU) program. We own the whole chain, from assessment and install to certificates and paperwork, so you get a genuine upfront discount and do almost nothing.",
  url: "https://aem-energy.example",
  // PRD §9 item 3 — contact details (placeholder).
  phone: "1300 000 000",
  phoneHref: "tel:1300000000",
  email: "hello@aem-energy.example",
  serviceArea: "Victoria, metro and regional",
  // PRD §9 item 7 — accreditation number (placeholder).
  accreditationNo: "AP-0000 (placeholder)",
  abn: "00 000 000 000 (placeholder)",
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

/**
 * Primary navigation. The header renders the "Your state" selector first (on the
 * left), then these links (homepage change request order).
 */
export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Home",
    href: "/",
    description: "Back to the homepage",
  },
  {
    label: "Products",
    href: "/products",
    description: "Everything we install",
  },
  {
    label: "About Us",
    href: "/about",
    description: "Accreditation and the full-chain story",
  },
  {
    label: "FAQ's",
    href: "/faq",
    description: "Questions, answered honestly",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "How the discount works, explained plainly",
  },
];

/** Persistent primary CTA — appears in header on every page (PRD §6 global). */
export const PRIMARY_CTA = {
  label: "Check your eligibility",
  shortLabel: "Check eligibility",
  href: "/check-eligibility",
} as const;

export const SECONDARY_CTA = {
  label: "Book an assessment",
  href: "/book-an-assessment",
} as const;
