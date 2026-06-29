/**
 * NSW Energy Rebates — content and figures.
 * Source: NSW Government (energy.nsw.gov.au), IPART, Clean Energy Regulator,
 * Clean Energy Council. Last reviewed June 2026.
 * Do NOT change dollar figures without re-checking against official sources.
 */

export type NswLayerId =
  | "stc"
  | "nswEss"
  | "nswVpp"
  | "cheaperHomeBatteries"
  | "nswHomeSaver";

export interface NswIncentiveLayerMeta {
  id: NswLayerId;
  name: string;
  short: string;
  blurb: string;
  incomeTested: boolean;
}

export const NSW_INCENTIVE_LAYERS: Record<NswLayerId, NswIncentiveLayerMeta> =
  {
    stc: {
      id: "stc",
      name: "Small-scale Technology Certificates",
      short: "STC",
      blurb:
        "Federal certificates created when you install eligible solar PV or heat-pump hot water. Applied as an upfront discount at point of sale.",
      incomeTested: false,
    },
    nswEss: {
      id: "nswEss",
      name: "NSW Energy Savings Scheme",
      short: "NSW ESS",
      blurb:
        "A certificate-based upfront discount delivered by an Accredited Certificate Provider (ACP). Not means-tested.",
      incomeTested: false,
    },
    nswVpp: {
      id: "nswVpp",
      name: "NSW VPP Incentive",
      short: "NSW VPP",
      blurb:
        "One-off state payment (up to $1,500) for connecting your battery to an approved Virtual Power Plant. Most households receive ~$1,100.",
      incomeTested: false,
    },
    cheaperHomeBatteries: {
      id: "cheaperHomeBatteries",
      name: "Cheaper Home Batteries Program",
      short: "Fed. Batteries",
      blurb:
        "Federal upfront discount of $272 per usable kWh (May–Dec 2026). Battery must be 5–50 kWh, installed with solar by an accredited installer.",
      incomeTested: false,
    },
    nswHomeSaver: {
      id: "nswHomeSaver",
      name: "NSW Home Energy Saver Program",
      short: "NSW Loan",
      blurb:
        "Zero-interest loan up to $15,000 repayable over 10 years. A loan, not a grant — applied after other rebates.",
      incomeTested: true,
    },
  };

export interface NswLayerValue {
  min: number;
  max: number;
  kind: "discount" | "rebate" | "loan";
  /** If true, amount is model-dependent — UI shows note only, no dollar range */
  variable?: boolean;
  note?: string;
}

export interface NswUpgradeRebate {
  slug: string;
  layers: Partial<Record<NswLayerId, NswLayerValue>>;
  stackingNote: string;
}

export const NSW_UPGRADE_REBATES: Record<string, NswUpgradeRebate> = {
  solar: {
    slug: "solar",
    layers: {
      stc: {
        min: 1000,
        max: 2500,
        kind: "discount",
        note: "Federal STCs — typical 6.6 kW system in the Sydney region ≈ $1,840; exact amount depends on system size, location and STC market price",
      },
    },
    stackingNote:
      "Solar PV in NSW draws only federal STCs — there is no separate NSW state rebate for panels. NSW state support is focused on batteries and hot water upgrades. The STC value steps down each year and the scheme ends in 2030.",
  },
  "heat-pumps": {
    slug: "heat-pumps",
    layers: {
      nswEss: {
        min: 405,
        max: 675,
        kind: "discount",
        note: "NSW Energy Savings Scheme — for replacing an existing electric water heater with a heat pump",
      },
      stc: {
        min: 700,
        max: 1800,
        kind: "discount",
        note: "Federal STCs — combined with NSW ESS, total savings generally range from $1,400 to $2,500",
      },
    },
    stackingNote:
      "Heat-pump hot water in NSW can stack the NSW ESS discount ($405–$675) with federal STCs. Combined savings generally range from $1,400 to $2,500 depending on your existing system and circumstances. A nomination form must be signed before installation begins.",
  },
  battery: {
    slug: "battery",
    layers: {
      cheaperHomeBatteries: {
        min: 1360,
        max: 5500,
        kind: "discount",
        note: "Federal Cheaper Home Batteries Program — $272 per usable kWh (May–Dec 2026); first 14 kWh at full rate, tapering beyond that",
      },
      nswVpp: {
        min: 1100,
        max: 1500,
        kind: "rebate",
        note: "NSW VPP Incentive for connecting to an approved Virtual Power Plant — most households receive ~$1,100",
      },
    },
    stackingNote:
      "Two separate incentives stack on NSW home batteries: the federal Cheaper Home Batteries Program upfront discount ($272/kWh) and the NSW VPP Incentive (up to $1,500) for joining an approved Virtual Power Plant. Both can be combined — the older NSW BESS1 hardware rebate has been replaced by the federal program.",
  },
  "air-con": {
    slug: "air-con",
    layers: {
      nswEss: {
        min: 0,
        max: 0,
        kind: "discount",
        variable: true,
        note: "NSW ESS — variable upfront discount via an ACP; amount depends on unit size and efficiency rating. No single fixed figure.",
      },
    },
    stackingNote:
      "Reverse-cycle air conditioning in NSW receives a variable upfront discount via the NSW Energy Savings Scheme — the amount depends on the size and efficiency of the unit you choose. More efficient units generate a larger discount. Available to both households and businesses.",
  },
  led: {
    slug: "led",
    layers: {
      nswEss: {
        min: 500,
        max: 20000,
        kind: "discount",
        note: "NSW ESS — commercial LED now uses the Project Impact (PIAM&V) method (simple formula method closed 31 March 2026); savings scale with facility size",
      },
    },
    stackingNote:
      "Commercial LED upgrades in NSW are delivered as a discount via an ACP under the NSW ESS. Important 2026 update: the simple Commercial Lighting Energy Savings Formula method closed on 31 March 2026 — upgrades now use the Project Impact (PIAM&V) method, requiring a specialist provider.",
  },
};

export const NSW_REBATE_META = {
  lastReviewed: "June 2026",
  region: "New South Wales, Australia",
  currency: "AUD",
  disclaimer:
    "Information on this page is general only and was last updated in June 2026. Rebate and incentive values are linked to certificate market prices and government scheme rules, which change over time. Eligibility is assessed by your installer's Accredited Certificate Provider. For the most current details, refer to the NSW Government (energy.nsw.gov.au), IPART, and the Clean Energy Regulator. We are not affiliated with these government bodies, and amounts shown are indicative, not guaranteed.",
  shortDisclaimer:
    "Indicative figures — not a quote or guarantee. Refer to energy.nsw.gov.au for current details.",
} as const;

export function getNswUpgradeRebate(slug: string): NswUpgradeRebate | undefined {
  return NSW_UPGRADE_REBATES[slug];
}

export function nswMaxHeadlineValue(slug: string): number {
  const r = NSW_UPGRADE_REBATES[slug];
  if (!r) return 0;
  return Object.values(r.layers)
    .filter(
      (l): l is NswLayerValue =>
        Boolean(l) && l.kind !== "loan" && !l.variable,
    )
    .reduce((sum, l) => sum + l.max, 0);
}
