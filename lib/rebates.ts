/**
 * ============================================================================
 * REBATE CONFIG — SINGLE SOURCE OF TRUTH
 * ============================================================================
 * Every dollar figure on the site (upgrade pages, the stacking calculator, the
 * home/how-it-works teasers) is read from this one module. Nothing is hardcoded
 * in markup. PRD §8.1 requires this so the calculator can consume the same
 * numbers, and §3.4 / §9 require every figure to be framed "up to / indicative,"
 * never guaranteed.
 *
 * COMPLIANCE NOTES (PRD §3.2):
 *  - These are INDICATIVE placeholders. Real values move with policy & market
 *    certificate prices. Confirm before launch (PRD §9 item 4).
 *  - The word "free" is never used. We talk about a "large upfront discount"
 *    and "what you'll actually pay."
 *  - VEU and Solar Victoria are kept distinct: income thresholds belong ONLY to
 *    the Solar Victoria layer (`incomeTested`), never to VEU.
 * ============================================================================
 */

export type LayerId = "veu" | "solarVictoria" | "stc";

export interface IncentiveLayerMeta {
  id: LayerId;
  /** Full program name. */
  name: string;
  /** Short label used in compact UI (chips, calculator legend). */
  short: string;
  /** One-line plain-English description. */
  blurb: string;
  /** Who/what creates the value — used in How It Works. */
  mechanism: string;
  /** Solar Victoria is the only income-tested layer. */
  incomeTested: boolean;
}

export const INCENTIVE_LAYERS: Record<LayerId, IncentiveLayerMeta> = {
  veu: {
    id: "veu",
    name: "Victorian Energy Upgrades",
    short: "VEU",
    blurb:
      "A certificate-based discount, applied upfront. Not means-tested — open to Victorian households and businesses.",
    mechanism:
      "We create VEECs from the energy your upgrade saves and sell them to energy retailers; that value comes back to you as an upfront discount.",
    incomeTested: false,
  },
  solarVictoria: {
    id: "solarVictoria",
    name: "Solar Victoria",
    short: "Solar Victoria",
    blurb:
      "A state rebate (and interest-free loan on some products) for eligible homes. This is the one layer with income and property thresholds.",
    mechanism:
      "A separate state-government rebate program. Eligibility depends on household income, property value and whether you've claimed before.",
    incomeTested: true,
  },
  stc: {
    id: "stc",
    name: "Small-scale Technology Certificates",
    short: "STC",
    blurb:
      "Federal certificates created when you install eligible solar PV or solar/heat-pump hot water. Taken off your price upfront.",
    mechanism:
      "A federal scheme. Certificate value is set by the market and is deducted from your system price at point of sale.",
    incomeTested: false,
  },
};

/** An indicative dollar range for one incentive layer on one upgrade. */
export interface LayerValue {
  /** Indicative lower bound, AUD. */
  min: number;
  /** Indicative upper bound, AUD ("up to"). */
  max: number;
  /** "rebate"/"discount" reduce price; "loan" is interest-free finance, not a discount. */
  kind: "discount" | "rebate" | "loan";
  /** Short eligibility caveat shown beside the figure. */
  note?: string;
}

export interface UpgradeRebate {
  /** Matches the upgrade slug in lib/upgrades.ts. */
  slug: string;
  /** Which layers can apply to this upgrade (in display order). */
  layers: Partial<Record<LayerId, LayerValue>>;
  /**
   * Plain-English line for "which incentives combine for this upgrade"
   * (PRD §7.4 block 5: stacking note).
   */
  stackingNote: string;
}

/**
 * Per-upgrade indicative values. Applicability of each layer is set to be
 * broadly faithful to how the programs actually work (e.g. solar PV draws STC +
 * Solar Victoria, not VEU; heat-pump hot water can draw all three) — but the
 * figures themselves are placeholders.
 */
export const UPGRADE_REBATES: Record<string, UpgradeRebate> = {
  solar: {
    slug: "solar",
    layers: {
      stc: {
        min: 1000,
        max: 3300,
        kind: "discount",
        note: "Federal STCs — scales with system size",
      },
      solarVictoria: {
        min: 0,
        max: 1400,
        kind: "rebate",
        note: "Eligible homes only — income & property thresholds",
      },
    },
    stackingNote:
      "Solar PV draws federal STCs and, for eligible homes, a Solar Victoria rebate. Pair it with an eligible heat-pump (incl. hot water) upgrade and the VEU layer stacks on top.",
  },
  "heat-pumps": {
    slug: "heat-pumps",
    layers: {
      veu: {
        min: 500,
        max: 3000,
        kind: "discount",
        note: "Heating/cooling or hot water — replacing gas/electric saves most",
      },
      stc: {
        min: 200,
        max: 900,
        kind: "discount",
        note: "Heat-pump hot water also creates federal STCs",
      },
      solarVictoria: {
        min: 0,
        max: 1000,
        kind: "rebate",
        note: "Hot water, eligible homes only — income & property thresholds",
      },
    },
    stackingNote:
      "Heat pumps cover heating, cooling and hot water. Heat-pump hot water is the clearest stacking story — it can draw the VEU discount, federal STCs and a Solar Victoria rebate at once for eligible homes.",
  },
  battery: {
    slug: "battery",
    layers: {
      solarVictoria: {
        min: 0,
        max: 8800,
        kind: "loan",
        note: "Interest-free loan for eligible homes — repaid over time, not a discount",
      },
    },
    stackingNote:
      "A battery pairs with solar PV. The main support is a Solar Victoria interest-free loan for eligible homes — that's finance, not a discount, and we say so.",
  },
  "air-con": {
    slug: "air-con",
    layers: {
      veu: {
        min: 200,
        max: 900,
        kind: "discount",
        note: "High-efficiency reverse-cycle units",
      },
    },
    stackingNote:
      "Upgrading to a high-efficiency reverse-cycle system is a VEU activity, applied as an upfront discount.",
  },
  led: {
    slug: "led",
    layers: {
      veu: {
        min: 200,
        max: 5000,
        kind: "discount",
        note: "Per site — non-building-based lighting scales with fixture count",
      },
    },
    stackingNote:
      "Commercial LED – NBB is a high-volume VEU activity for eligible non-building-based lighting — the discount scales with the size of the roll-out.",
  },
};

/** Metadata for honest framing (PRD §3.4 note, §9). */
export const REBATE_META = {
  /** PRD §9 item 4 — confirm before launch. */
  lastReviewed: "June 2026",
  region: "Victoria, Australia",
  currency: "AUD",
  disclaimer:
    "Figures are indicative only and shown as “up to” amounts. Real values change with government policy and market certificate prices, and depend on your property, product and eligibility. Nothing here is a quote or a guarantee.",
  shortDisclaimer: "Indicative “up to” figures — not a quote or guarantee.",
} as const;

/* ----------------------------------------------------------------------------
 * Derived helpers (used by the calculator and upgrade pages)
 * ------------------------------------------------------------------------- */

export function getUpgradeRebate(slug: string): UpgradeRebate | undefined {
  return UPGRADE_REBATES[slug];
}

/**
 * Aggregate the stacked, indicative value across a set of upgrades.
 * Shared by the stacking calculator AND the eligibility quiz so both read the
 * same single source of truth. Solar Victoria is income-tested, so callers pass
 * whether to include it.
 */
export interface StackResult {
  layerTotals: Partial<Record<LayerId, { min: number; max: number }>>;
  loan: { min: number; max: number } | null;
  combined: { min: number; max: number };
  active: LayerId[];
}

export function computeStack(
  slugs: string[],
  opts: { includeSolarVictoria: boolean },
): StackResult {
  const layerTotals: Partial<Record<LayerId, { min: number; max: number }>> = {};
  const active = new Set<LayerId>();
  let loanMin = 0;
  let loanMax = 0;
  let hasLoan = false;
  let combinedMin = 0;
  let combinedMax = 0;

  for (const slug of slugs) {
    const rebate = UPGRADE_REBATES[slug];
    if (!rebate) continue;
    for (const [id, val] of Object.entries(rebate.layers) as [
      LayerId,
      LayerValue,
    ][]) {
      if (id === "solarVictoria" && !opts.includeSolarVictoria) continue;
      if (val.kind === "loan") {
        loanMin += val.min;
        loanMax += val.max;
        hasLoan = true;
        continue;
      }
      const cur = layerTotals[id] ?? { min: 0, max: 0 };
      layerTotals[id] = { min: cur.min + val.min, max: cur.max + val.max };
      active.add(id);
      combinedMin += val.min;
      combinedMax += val.max;
    }
  }

  return {
    layerTotals,
    loan: hasLoan ? { min: loanMin, max: loanMax } : null,
    combined: { min: combinedMin, max: combinedMax },
    active: [...active],
  };
}

/** Sum of the upper-bound ("up to") across all layers that reduce price. */
export function maxHeadlineValue(slug: string): number {
  const r = UPGRADE_REBATES[slug];
  if (!r) return 0;
  return Object.values(r.layers)
    .filter((l): l is LayerValue => Boolean(l) && l.kind !== "loan")
    .reduce((sum, l) => sum + l.max, 0);
}

export function formatAUD(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Format a range as "$X–$Y" with a single currency symbol. */
export function formatRange(min: number, max: number): string {
  if (min <= 0) return `up to ${formatAUD(max)}`;
  return `${formatAUD(min)}–${formatAUD(max)}`;
}
