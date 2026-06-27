/**
 * Standalone (NON-VEU) products — AEM brief Change #5.
 *
 * These are deliberately kept SEPARATE from lib/upgrades.ts so that no rebate
 * badge, indicative figure, VEU / Solar Victoria language, or stacking story
 * can leak in. There are intentionally NO rebate/figure fields on this type —
 * a standalone product must never imply a government scheme or rebate.
 *
 * Distillo Water Filtration is the first such product.
 */

export interface StandaloneProductFaq {
  q: string;
  a: string;
}

export interface StandaloneProduct {
  slug: string;
  name: string;
  longName: string;
  /** One-line tile description. */
  tagline: string;
  eyebrow: string;
  heroHeadline: string;
  heroSub: string;
  whatItIs: { heading: string; body: string; points: string[] };
  /** Service/install steps — NOT certificate/scheme steps. */
  howItWorks: string[];
  whyUs: string;
  faqs: StandaloneProductFaq[];
}

export const STANDALONE_PRODUCTS: StandaloneProduct[] = [
  {
    slug: "distillo-water-filtration",
    name: "Distillo Water Filtration",
    longName: "Distillo Water Filtration",
    tagline:
      "Cleaner, better-tasting water at every tap — supplied and installed by AEM Energy.",
    eyebrow: "Standalone product",
    heroHeadline: "Better water, straight from your tap.",
    heroSub:
      "Distillo is a high-performance home water filtration system, supplied and installed by AEM Energy. It's a standalone product — not part of the Victorian Energy Upgrades or Solar Victoria programs — so there's no government rebate or scheme involved. Just a quality system and a clean install.",
    whatItIs: {
      heading: "What you actually get",
      body: "A Distillo filtration system matched to your household and water supply, installed by our team with a tidy, professional finish.",
      points: [
        "Cleaner, better-tasting water at the tap.",
        "Reduced sediment, chlorine taste and odour.",
        "Sized and fitted to your home's plumbing.",
        "A standalone purchase — straightforward pricing, no scheme paperwork.",
      ],
    },
    howItWorks: [
      "We talk through your water and household needs.",
      "We recommend the right Distillo configuration.",
      "Our team installs it cleanly and shows you how it works.",
      "You enjoy filtered water — with simple servicing when it's due.",
    ],
    whyUs:
      "Distillo is supplied and fitted by the same AEM Energy team you'd trust with an energy upgrade — so the install is tidy, the advice is straight, and there's one company accountable for the result.",
    faqs: [
      {
        q: "Is there a government rebate for this?",
        a: "No. Distillo Water Filtration is a standalone product — it isn't part of the Victorian Energy Upgrades or Solar Victoria programs, so no rebate, certificate or scheme applies. You buy it as a normal product.",
      },
      {
        q: "Do you install it?",
        a: "Yes. Our team supplies and installs Distillo, and walks you through using and servicing it.",
      },
      {
        q: "How is the price worked out?",
        a: "It's straightforward product-and-install pricing based on the system that suits your home — we'll quote it clearly before you commit.",
      },
    ],
  },
];

export function getStandaloneProduct(slug: string): StandaloneProduct | undefined {
  return STANDALONE_PRODUCTS.find((p) => p.slug === slug);
}

export const STANDALONE_PRODUCT_SLUGS = STANDALONE_PRODUCTS.map((p) => p.slug);
