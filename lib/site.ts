/**
 * Site-wide constants. Contact / trading details confirmed by the client
 * (2026-07-30). Accreditation is held by Aussie Ecomarks — AEM Energy is a
 * sister concern that delivers upgrades under that accreditation.
 */
export const SITE = {
  name: "AEM Energy",
  legalName: "AEM Energy Pty Ltd",
  // AEM Energy is a sister concern of Aussie Ecomarks, a registered Accredited
  // Provider under the Victorian Energy Upgrades (VEU) scheme.
  accreditation:
    "A subsidiary of Aussie Ecomarks, a registered Accredited Provider under the Victorian Energy Upgrades (VEU) scheme",
  tagline: "Everything your home runs on, upgraded properly.",
  description:
    "AEM Energy handles your entire energy upgrade, end to end. As a subsidiary of Aussie Ecomarks, a registered Accredited Provider under the Victorian Energy Upgrades (VEU) scheme, we own the whole chain, from assessment and install to certificates and paperwork, so you get a real upfront discount and do almost nothing.",
  url: "https://aemenergy.com.au",
  phone: "+61 434 623 604",
  phoneHref: "tel:+61434623604",
  // Same number as `phone`, digits only — wa.me rejects "+" and spaces.
  whatsappHref: "https://wa.me/61434623604",
  email: "contact@aemenergy.com.au",
  serviceArea: "Victoria, metro and regional",
  address: "3 Envision Close, Pakenham VIC 3810",
  abn: "36 696 217 651",
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
