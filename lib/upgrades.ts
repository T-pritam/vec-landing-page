/**
 * Content config for the reusable upgrade-page template (PRD §7.4).
 * One pattern, themed per upgrade. Solar is the flagship instance and carries
 * the extra residential-vs-commercial split + link into the Business journey.
 *
 * All dollar figures come from lib/rebates.ts — none are written here.
 */

export type UpgradeIcon =
  | "solar"
  | "heat-pump"
  | "battery"
  | "air-con"
  | "led";

export interface UpgradeFaq {
  q: string;
  a: string;
}

export interface UpgradeContent {
  slug: string;
  /** Display name, e.g. "Solar". */
  name: string;
  /** Full label for nav/cards, e.g. "Solar panels (PV)". */
  longName: string;
  icon: UpgradeIcon;
  /** One-line tile description (used on hubs & home upgrade grid). */
  tagline: string;
  /** Eyebrow on the page. */
  eyebrow: string;
  /** Hero headline (owns a benefit, not a discount %). */
  heroHeadline: string;
  /** Hero sub-paragraph. */
  heroSub: string;
  /** Block 1 — "what it is" benefit bullets. */
  whatItIs: { heading: string; body: string; points: string[] };
  /** Block 3 — "how it works for this upgrade" (short, links to How It Works). */
  howItWorks: string[];
  /** Block 4 — why us / full-chain in this context. */
  fullChain: string;
  /** Whether the flagship residential-vs-commercial split renders. */
  flagship?: boolean;
  /** Commercial angle (shown on flagship + used by Business page links). */
  commercialAngle?: string;
  /** Upgrade-specific FAQ (block 6). */
  faqs: UpgradeFaq[];
  /**
   * Audience scope. `residential`/`both` show in the home & residential grids;
   * `commercial` is filtered OUT of those and surfaced in the Business journey
   * (e.g. Commercial LED – NBB, which no longer fits homes).
   */
  available: "residential" | "both" | "commercial";
}

export const UPGRADES: UpgradeContent[] = [
  {
    slug: "solar",
    name: "Solar",
    longName: "Solar panels (PV)",
    icon: "solar",
    tagline: "Generate your own power and stack three incentive layers.",
    eyebrow: "Flagship upgrade",
    heroHeadline: "Own your power bill, not just lower it.",
    heroSub:
      "Rooftop solar is where the incentives stack hardest — federal STCs come off the price upfront, and eligible homes can add a Solar Victoria rebate. We design, install and handle the paperwork end-to-end.",
    whatItIs: {
      heading: "What you actually get",
      body: "A correctly-sized PV system for your roof and usage, installed by our accredited team, with the upfront certificate value already taken off the price.",
      points: [
        "A system sized to how and when you actually use power — not an off-the-shelf number.",
        "Federal STC value deducted from your price at point of sale.",
        "A Solar Victoria rebate applied on top for eligible homes.",
        "Pairs with a battery and with eligible heat-pump (incl. hot water) upgrades to stack further.",
      ],
    },
    howItWorks: [
      "We assess your roof, shading and usage and size the system.",
      "Our accredited installers complete the job.",
      "STCs are created and discounted off your price; any Solar Victoria rebate is applied.",
      "You pay the reduced price — we handle the certificate paperwork.",
    ],
    fullChain:
      "Because we operate under our Accredited Person, Aussie Eco Marks, the assessment, the install and the certificate creation all sit with one team. You're not chasing a separate installer, a separate rebate agent and a separate paperwork service.",
    flagship: true,
    commercialAngle:
      "Commercial rooftop and ground-mount solar can run into six figures of combined value, with a longer measurement & verification path. We run that as a managed project — see the Business journey.",
    faqs: [
      {
        q: "Is rooftop solar means-tested?",
        a: "The federal STC component is not means-tested. The Solar Victoria rebate layer is — it has income and property thresholds. We keep the two separate so you know exactly which applies to you.",
      },
      {
        q: "Will it cover my whole bill?",
        a: "Sizing depends on your roof and usage. We size for the best return rather than promising a zero bill — and we'll show you the indicative numbers before you commit.",
      },
      {
        q: "Can I add a battery later?",
        a: "Yes. Many homes start with PV and add storage when it suits. We design with that in mind.",
      },
    ],
    available: "both",
  },
  {
    slug: "heat-pumps",
    name: "Heat Pumps",
    longName: "Heat pumps — heating, cooling & hot water",
    icon: "heat-pump",
    tagline:
      "Heating, cooling and hot water — the clearest three-layer stack (VEU + STC + Solar Victoria).",
    eyebrow: "Heating, cooling & hot water",
    heroHeadline: "One efficient system for heating, cooling and hot water.",
    heroSub:
      "A reverse-cycle heat pump replaces old gas or resistive heating — and a heat-pump hot water system is the clearest example of stacking, drawing the VEU discount, federal STCs and, for eligible homes, a Solar Victoria rebate at once.",
    whatItIs: {
      heading: "What you actually get",
      body: "A right-sized, high-efficiency heat pump installed by our accredited team — for space heating and cooling, hot water, or both — with the combined incentive value already taken off your price.",
      points: [
        "Reverse-cycle heating and cooling, plus efficient heat-pump hot water.",
        "Far lower running cost than gas or old electric storage.",
        "The VEU discount applied upfront — replacing gas or resistive systems saves the most.",
        "Heat-pump hot water can stack VEU + federal STCs + a Solar Victoria rebate for eligible homes.",
      ],
    },
    howItWorks: [
      "We assess your home — heating, cooling and hot-water needs — and size the system.",
      "Our accredited installers complete the changeover.",
      "VEECs (and STCs on eligible hot water) are created and discounted off your price; any Solar Victoria rebate is applied.",
      "You pay the reduced price — all paperwork handled.",
    ],
    fullChain:
      "Stacking three programs cleanly on a hot-water system is exactly where a full-chain operator earns its keep — we line up VEU, STC and Solar Victoria so you don't have to, all in one chain with no hand-offs.",
    commercialAngle:
      "Commercial sites can upgrade heating/cooling at scale — and high hot-water loads (hospitality, aged care, gyms) make a strong managed VEU project.",
    faqs: [
      {
        q: "Does this cover hot water too?",
        a: "Yes. Heat pumps now cover both space heating/cooling and hot water. A heat-pump hot water system is the clearest stacking example — it can draw VEU, federal STCs and a Solar Victoria rebate together for eligible homes.",
      },
      {
        q: "Do I have to remove my gas heater?",
        a: "Replacing gas or resistive heating is where the discount is largest, but we'll assess your situation and explain the options before anything changes.",
      },
      {
        q: "Is it means-tested?",
        a: "VEU is not means-tested — it's open to Victorian households and businesses. Only the Solar Victoria layer (which can apply to heat-pump hot water) has income and property thresholds.",
      },
    ],
    available: "both",
  },
  {
    slug: "battery",
    name: "Battery",
    longName: "Home battery storage",
    icon: "battery",
    tagline: "Store your solar — backed by an interest-free loan, not a discount.",
    eyebrow: "Energy storage",
    heroHeadline: "Use your solar after dark.",
    heroSub:
      "A home battery stores the power your panels make during the day. The main support here is a Solar Victoria interest-free loan for eligible homes — that's finance you repay, not a discount, and we're upfront about the difference.",
    whatItIs: {
      heading: "What you actually get",
      body: "A correctly-sized battery integrated with your solar, installed by our accredited team.",
      points: [
        "More of your own solar used at home instead of exported cheaply.",
        "Backup options during outages, depending on setup.",
        "A Solar Victoria interest-free loan for eligible homes — repaid over time.",
        "Best value when paired with a well-sized solar system.",
      ],
    },
    howItWorks: [
      "We review your solar, usage and goals to size storage.",
      "Our accredited installers integrate the battery.",
      "Eligible homes can apply for a Solar Victoria interest-free loan.",
      "You repay the loan over its term — we explain the real cost first.",
    ],
    fullChain:
      "We're clear that a battery's support is mostly finance, not a giveaway. Honest framing is the point — you'll see what you actually pay before you commit.",
    faqs: [
      {
        q: "Is the battery free or fully rebated?",
        a: "No. There are no free upgrades. The main support is an interest-free loan for eligible homes — you repay it. We'll show you the real numbers.",
      },
      {
        q: "Do I need solar first?",
        a: "A battery makes most sense with solar. We can design both together or add storage to an existing system.",
      },
    ],
    available: "residential",
  },
  {
    slug: "air-con",
    name: "Air Con",
    longName: "Efficient air conditioning",
    icon: "air-con",
    tagline: "High-efficiency cooling with an upfront VEU discount.",
    eyebrow: "Cooling",
    heroHeadline: "Cool efficiently, discounted upfront.",
    heroSub:
      "Upgrading to a high-efficiency reverse-cycle air conditioner is a VEU activity. The certificate value comes off your price at install.",
    whatItIs: {
      heading: "What you actually get",
      body: "A high-efficiency reverse-cycle unit sized to your space, installed by our accredited team, with the VEU discount applied.",
      points: [
        "Efficient cooling in summer and heating in winter.",
        "Lower running cost than older units.",
        "VEU discount applied upfront.",
        "Right-sizing so you're not paying to over-cool.",
      ],
    },
    howItWorks: [
      "We assess the space and your current unit.",
      "Our accredited installers complete the install.",
      "VEECs are created and discounted off your price.",
      "You pay the reduced price — paperwork handled.",
    ],
    fullChain:
      "Same full-chain promise: one accredited team for assessment, install and certificates.",
    commercialAngle:
      "Commercial cooling upgrades scale well as a managed VEU project.",
    faqs: [
      {
        q: "Is this the same as a heat pump?",
        a: "A reverse-cycle air conditioner is a type of heat pump. If you also want to replace central gas heating, see the Heat Pumps page.",
      },
    ],
    available: "both",
  },
  {
    slug: "led",
    name: "Commercial LED – NBB",
    longName: "Commercial LED – NBB (Non-Building Based)",
    icon: "led",
    tagline:
      "High-efficiency LED for eligible non-building-based commercial lighting.",
    eyebrow: "Commercial lighting",
    heroHeadline: "Cut the running cost of your outdoor & non-building lighting.",
    heroSub:
      "Commercial LED – NBB covers eligible non-building-based lighting only — outdoor and area lighting such as car parks, yards, sports and public-realm sites. A high-volume VEU activity, with the certificate value discounted upfront. (This is a commercial upgrade, not a residential one.)",
    whatItIs: {
      heading: "What you actually get",
      body: "High-efficiency LED upgrades for eligible non-building-based (NBB) commercial lighting, installed under the VEU program with the certificate value discounted.",
      points: [
        "Scoped to eligible non-building-based lighting — car parks, yards, outdoor and public-realm areas.",
        "Sharply lower lighting energy use across large sites.",
        "VEU discount applied upfront on a high-volume activity.",
        "Strong, fast-payback project for commercial and industrial operators.",
      ],
    },
    howItWorks: [
      "We audit your non-building-based lighting and confirm NBB eligibility.",
      "Our accredited team completes the LED upgrade.",
      "VEECs are created from the energy saved and discounted off your price.",
      "You pay the reduced price — paperwork handled.",
    ],
    fullChain:
      "On a high-volume NBB lighting roll-out, full-chain handling matters — one accountable team for the audit, the install and the certificates, with no hand-offs across a large site.",
    commercialAngle:
      "Non-building-based lighting (car parks, yards, sports and public-realm sites) is one of the highest-volume VEU activities — a strong, fast-payback commercial project.",
    faqs: [
      {
        q: "What does “non-building-based” mean?",
        a: "It's the VEU category for lighting that isn't inside a building — outdoor and area lighting such as car parks, yards, sports facilities and public spaces. We confirm eligibility against the NBB activity before any work.",
      },
      {
        q: "Is this available for homes?",
        a: "No — Commercial LED – NBB is a commercial activity for eligible non-building-based lighting only. It isn't a residential upgrade.",
      },
    ],
    available: "commercial",
  },
];

export function getUpgrade(slug: string): UpgradeContent | undefined {
  return UPGRADES.find((u) => u.slug === slug);
}

export const UPGRADE_SLUGS = UPGRADES.map((u) => u.slug);
