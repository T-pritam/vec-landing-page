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
} as const;
