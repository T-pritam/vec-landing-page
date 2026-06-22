import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { EligibilityQuiz } from "@/components/eligibility/eligibility-quiz";
import { Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Check your eligibility",
  description:
    "A quick, branching eligibility check for homes and businesses. See which upgrades fit and an indicative idea of the combined value — never a guarantee. No obligation.",
};

export default function CheckEligibilityPage() {
  return (
    <>
      <section className="bg-surface-muted pt-28 pb-12 sm:pt-32 sm:pb-14">
        <div className="container-page max-w-3xl text-center">
          <Eyebrow>Check eligibility</Eyebrow>
          <h1 className="text-display mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
            See what you qualify for.
          </h1>
          <p className="text-lead mx-auto mt-5 max-w-xl">
            A few quick questions — they adapt as you go. You'll get a tailored
            shortlist of upgrades and an indicative idea of the combined value.
            No obligation, and nothing here is a guarantee.
          </p>
        </div>
      </section>

      <Section tone="surface" spacing="sm">
        <EligibilityQuiz />
      </Section>

      <Section tone="muted" spacing="sm" narrow>
        <p className="text-center text-caption">
          Why we lead with this: of the competitor sites we reviewed, almost none
          offer a real eligibility check — most just say “request a quote.” This
          is the honest first step, and it's free to use.
        </p>
      </Section>
    </>
  );
}
