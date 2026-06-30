/**
 * Stock-photo paths (client decision: licensed stock photography on the
 * homepage + products page, overriding the earlier SVG-only guideline).
 * Files live in /public/images. Keyed by upgrade slug where a faithful photo
 * exists; `battery` has no faithful stock photo, so it falls back to the
 * on-brand SVG scene (see components/sections/product-cards.tsx).
 */
export const UPGRADE_IMAGE: Record<string, string> = {
  solar: "/images/solar.jpg",
  "heat-pumps": "/images/heat-pump.jpg",
  "air-con": "/images/air-con.jpg",
  led: "/images/led.jpg",
  // battery: intentionally omitted -> SVG fallback
};

/** General-purpose lifestyle / brand photos. */
export const SITE_IMAGE = {
  installer: "/images/installer.jpg",
  home: "/images/home.jpg",
  solar: "/images/solar.jpg",
  heroHome: "/images/hero-home.jpg",
  water: "/images/water.jpg",
} as const;

/**
 * Per-route hero photography + alt text (licensed stock, matching the visual
 * standard of the reference sites). Keyed by route so each `PageHero` can pull a
 * large, on-message photo. Dark heroes (about, business) use the photo as a
 * full-bleed background under an overlay; light heroes use it as a side image.
 */
export const PAGE_IMAGE: Record<
  string,
  { src: string; alt: string }
> = {
  residential: {
    src: "/images/residential.jpg",
    alt: "A modern home at dusk — the kind AEM Energy upgrades across Victoria",
  },
  business: {
    src: "/images/business.jpg",
    alt: "A large-scale commercial solar array — the bigger projects AEM Energy manages end-to-end",
  },
  about: {
    src: "/images/about.jpg",
    alt: "An accredited installer fitting solar panels under a clear sky",
  },
  "how-it-works": {
    src: "/images/how-it-works.jpg",
    alt: "Close-up of a solar panel surface catching the light",
  },
  products: {
    src: "/images/products.jpg",
    alt: "A clean array of rooftop solar panels against a blue sky",
  },
  contact: {
    src: "/images/contact.jpg",
    alt: "A friendly, no-obligation consultation with an accredited team member",
  },
  faq: {
    src: "/images/home.jpg",
    alt: "A modern home of the kind AEM Energy upgrades",
  },
};
