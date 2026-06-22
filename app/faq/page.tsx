import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { FaqAccordion } from "@/components/faq-accordion";
import { CtaBand } from "@/components/sections/cta-band";
import { FAQ_CATEGORIES, faqsByCategory } from "@/lib/faq";
import { PRIMARY_CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Straight, factually-grounded answers about the VEU program: is it means-tested, is it really not “free”, who sets the rebate value, and how the commercial path differs.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Every question, answered honestly."
        lead="No spin and no “free” gimmicks. If your question isn't here, ask us — we'll add it."
        tone="muted"
        primary={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        secondary={{ label: "Ask a question", href: "/contact" }}
      />

      <Section tone="surface" narrow>
        <div className="space-y-14">
          {FAQ_CATEGORIES.map((cat) => (
            <div key={cat}>
              <h2 className="eyebrow">{cat}</h2>
              <div className="mt-5">
                <FaqAccordion items={faqsByCategory(cat)} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <CtaBand />
      </Section>
    </>
  );
}
