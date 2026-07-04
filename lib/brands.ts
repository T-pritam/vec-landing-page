/**
 * Brands AEM Energy installs, keyed by upgrade slug. Surfaced on each product
 * page as an auto-scrolling logo marquee (see `components/sections/brand-marquee`).
 *
 * `logo` is an optional path under `/images/brands/`. Where no clean official
 * logo was available, `logo` is omitted and the marquee renders the brand name
 * on its own — so the list is always complete. Nominative "brands we install"
 * use; logos are shown unaltered with no endorsement/partnership claim.
 *
 * Note: hot water is folded into the Heat Pumps product, so the `heat-pumps`
 * list is the hot-water brand set.
 */

export interface Brand {
  name: string;
  /** Path under /public, e.g. "/images/brands/daikin.svg". Optional. */
  logo?: string;
}

const B = "/images/brands";

export const UPGRADE_BRANDS: Record<string, Brand[]> = {
  solar: [
    { name: "Jinko Solar", logo: `${B}/jinko.png` },
    { name: "Aiko", logo: `${B}/aiko.svg` },
    { name: "Canadian Solar", logo: `${B}/canadian-solar.png` },
    { name: "LONGi", logo: `${B}/longi.png` },
    { name: "Hanersun", logo: `${B}/hanersun.png` },
  ],
  battery: [
    { name: "GoodWe", logo: `${B}/goodwe.svg` },
    { name: "Growatt" },
    { name: "FoxESS", logo: `${B}/foxess.png` },
    { name: "Sofar", logo: `${B}/sofar.svg` },
    { name: "Hiconix" },
    { name: "Neovolt" },
    { name: "Sungrow", logo: `${B}/sungrow.svg` },
    { name: "Tesla", logo: `${B}/tesla.png` },
    { name: "BYD", logo: `${B}/byd.svg` },
    { name: "SigEnergy", logo: `${B}/sigenergy.svg` },
  ],
  "air-con": [
    { name: "Daikin", logo: `${B}/daikin.svg` },
    { name: "Panasonic", logo: `${B}/panasonic.svg` },
    { name: "Mitsubishi Electric", logo: `${B}/mitsubishi.svg` },
    { name: "Rinnai", logo: `${B}/rinnai.svg` },
    { name: "Midea", logo: `${B}/midea.svg` },
  ],
  "heat-pumps": [
    { name: "Emerald", logo: `${B}/emerald.png` },
    { name: "AGM Energy" },
    { name: "Rinnai", logo: `${B}/rinnai.svg` },
    { name: "Midea", logo: `${B}/midea.svg` },
    { name: "Econova", logo: `${B}/econova.png` },
    { name: "Ecogenic" },
  ],
};

export function getUpgradeBrands(slug: string): Brand[] {
  return UPGRADE_BRANDS[slug] ?? [];
}
