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
  | "hot-water"
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
  /** Accent treatment — most use brand amber; keep single-accent rule. */
  available: "residential" | "both";
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
        "Pairs with a battery and with eligible hot-water or heat-pump upgrades to stack further.",
      ],
    },
    howItWorks: [
      "We assess your roof, shading and usage and size the system.",
      "Our accredited installers complete the job.",
      "STCs are created and discounted off your price; any Solar Victoria rebate is applied.",
      "You pay the reduced price — we handle the certificate paperwork.",
    ],
    fullChain:
      "Because we're the Accredited Person, the assessment, the install and the certificate creation all sit with one team. You're not chasing a separate installer, a separate rebate agent and a separate paperwork service.",
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
    longName: "Reverse-cycle heat pumps",
    icon: "heat-pump",
    tagline: "Efficient electric heating and cooling — a strong VEU discount.",
    eyebrow: "Heating & cooling",
    heroHeadline: "Heat and cool for a fraction of the running cost.",
    heroSub:
      "Replacing old gas or resistive heating with an efficient reverse-cycle heat pump is one of the highest-value VEU activities. The discount comes off your install price upfront.",
    whatItIs: {
      heading: "What you actually get",
      body: "A right-sized, high-efficiency reverse-cycle system installed by our accredited team, with the VEU certificate value already discounted.",
      points: [
        "One system that heats in winter and cools in summer.",
        "Far lower running cost than gas or old electric heaters.",
        "The VEU discount applied upfront — the biggest savings come from replacing gas or resistive heating.",
        "Works well alongside solar to cut running costs further.",
      ],
    },
    howItWorks: [
      "We assess your home and current heating to size the unit.",
      "Our accredited installers complete the changeover.",
      "VEECs are created from the energy saved and discounted off your price.",
      "You pay the reduced price — paperwork handled.",
    ],
    fullChain:
      "We size, install and certify in one chain. No hand-off between a sales rep, an installer and a certificate trader who don't talk to each other.",
    commercialAngle:
      "Commercial sites can upgrade heating/cooling at scale with a managed VEU project.",
    faqs: [
      {
        q: "Do I have to remove my gas heater?",
        a: "Replacing gas or resistive heating is where the discount is largest, but we'll assess your situation and explain the options before anything changes.",
      },
      {
        q: "Is it means-tested?",
        a: "No. VEU is not means-tested — it's open to Victorian households and businesses.",
      },
    ],
    available: "both",
  },
  {
    slug: "hot-water",
    name: "Hot Water",
    longName: "Heat-pump & solar hot water",
    icon: "hot-water",
    tagline: "The clearest three-layer stack — VEU + STC + Solar Victoria.",
    eyebrow: "Hot water",
    heroHeadline: "The upgrade where all three incentives can stack.",
    heroSub:
      "A heat-pump hot water system can draw the VEU discount, federal STCs and — for eligible homes — a Solar Victoria rebate at the same time. It's the clearest example of the stacking story.",
    whatItIs: {
      heading: "What you actually get",
      body: "An efficient heat-pump (or solar) hot water system installed by our accredited team, with the combined incentive value taken off your price.",
      points: [
        "Hot water for a fraction of the energy of gas or old electric storage.",
        "VEU discount applied upfront.",
        "Federal STCs deducted from the price.",
        "Solar Victoria hot-water rebate on top for eligible homes.",
      ],
    },
    howItWorks: [
      "We assess your hot-water use and existing system.",
      "Our accredited installers complete the swap.",
      "VEECs and STCs are created and discounted; any Solar Victoria rebate is applied.",
      "You pay the reduced price — all paperwork handled.",
    ],
    fullChain:
      "Stacking three programs cleanly is exactly where a full-chain Accredited Person earns its keep — we line up VEU, STC and Solar Victoria so you don't have to.",
    commercialAngle:
      "High hot-water loads (hospitality, aged care, gyms) make commercial hot-water upgrades a strong managed VEU project.",
    faqs: [
      {
        q: "Can I really get all three?",
        a: "For eligible homes installing the right system, yes — VEU, STC and a Solar Victoria rebate can apply together. Eligibility for the Solar Victoria layer depends on income and property thresholds.",
      },
      {
        q: "Heat pump or solar hot water?",
        a: "Both can be eligible. We'll recommend based on your roof, climate zone and usage.",
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
    name: "LED",
    longName: "LED lighting",
    icon: "led",
    tagline: "A quick VEU win for homes — and high-volume for business.",
    eyebrow: "Lighting",
    heroHeadline: "The simplest place to start.",
    heroSub:
      "Switching to efficient LED lighting is a fast, low-friction VEU activity. Modest for a single home, but high-volume — and high-value — for commercial sites.",
    whatItIs: {
      heading: "What you actually get",
      body: "Efficient LED lighting installed under the VEU program, with the certificate value discounted.",
      points: [
        "Lower lighting energy use across the property.",
        "VEU discount applied upfront.",
        "An easy first upgrade to start the relationship.",
        "Scales dramatically for warehouses, offices and retail.",
      ],
    },
    howItWorks: [
      "We assess your lighting.",
      "Our accredited team completes the upgrade.",
      "VEECs are created and discounted off your price.",
      "You pay the reduced price.",
    ],
    fullChain:
      "Even on a small job, you get the same accredited, full-chain handling — and it's often the doorway to a bigger upgrade plan.",
    commercialAngle:
      "Commercial lighting is one of the highest-volume VEU activities — a strong, fast-payback project for warehouses, offices and retail.",
    faqs: [
      {
        q: "Is it worth it for one home?",
        a: "The per-home figure is modest, but it's quick and there's no means test. For commercial sites the numbers are much larger.",
      },
    ],
    available: "both",
  },
];

export function getUpgrade(slug: string): UpgradeContent | undefined {
  return UPGRADES.find((u) => u.slug === slug);
}

export const UPGRADE_SLUGS = UPGRADES.map((u) => u.slug);
