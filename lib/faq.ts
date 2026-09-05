/**
 * FAQ content (PRD §7.7). Pre-answered starter questions, factually grounded,
 * categorised (Residential / Business / Money & eligibility) so it can grow.
 * Honest-cost framing throughout — never the word "free".
 */

export type FaqCategory = "Money & eligibility" | "Residential" | "Business";

export interface FaqItem {
  category: FaqCategory;
  q: string;
  a: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  "Money & eligibility",
  "Residential",
  "Business",
];

export const FAQS: FaqItem[] = [
  {
    category: "Money & eligibility",
    q: "Is it means-tested?",
    a: "The VEU program is not means-tested. It's open to Victorian households and businesses. Some Solar Victoria components do have income and property thresholds, so we keep the two programs separate when we explain what you qualify for.",
  },
  {
    category: "Money & eligibility",
    q: `Is this “free”?`,
    a: "No. There are no free upgrades under the VEU program. A minimum customer contribution applies. What you get is a large upfront discount. We'll always show you what you'll actually pay.",
  },
  {
    category: "Money & eligibility",
    q: "Who sets the rebate value?",
    a: "The market. Certificate prices move with supply and demand, not a fixed government rate. The government creates the obligation that makes the market exist and sets the rules. It isn't the buyer.",
  },
  {
    category: "Money & eligibility",
    q: "Do I need a special provider?",
    a: "Yes. Only a registered Accredited Provider can create the certificates that fund the discount. AEM Energy is a subsidiary of Aussie Ecomarks, a registered Accredited Provider under the VEU scheme, so it's handled in-house. It's the single most important thing to check when comparing providers.",
  },
  {
    category: "Money & eligibility",
    q: "Can I claim more than once?",
    a: "Yes. For different qualifying upgrades. Many customers stack several upgrades over time.",
  },
  {
    category: "Residential",
    q: "What happens to my old appliance?",
    a: "For many upgrades it's removed and responsibly recycled by us as part of the job.",
  },
  {
    category: "Residential",
    q: "How long does it take?",
    a: "Residential upgrades are fast, often a single visit once you're booked. Larger commercial projects run a longer verification path.",
  },
  {
    category: "Residential",
    q: "Can I combine VEU with Solar Victoria and STCs?",
    a: "Often yes. Depending on the upgrade, the VEU discount, a Solar Victoria rebate and federal STCs can stack into one combined value. The eligibility check shows how this works for your situation.",
  },
  {
    category: "Business",
    q: "How is the commercial path different?",
    a: "Larger projects (commercial solar, big lighting or HVAC upgrades) can run a longer measurement & verification path and a more rational, ROI-driven decision. We manage the whole project end-to-end.",
  },
  {
    category: "Business",
    q: "How large can commercial value get?",
    a: "Commercial solar and major efficiency projects can reach five figures of combined incentive value. The exact figure depends on the project. We'll model it with you.",
  },
  {
    category: "Business",
    q: "Do you handle compliance and paperwork?",
    a: "Yes. Backed by our subsidiary Aussie Ecomarks, a registered Accredited Provider, we own certificate creation and the compliance obligations, so your team isn't managing the scheme.",
  },
];

export function faqsByCategory(category: FaqCategory): FaqItem[] {
  return FAQS.filter((f) => f.category === category);
}
