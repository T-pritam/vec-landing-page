import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { SITE } from "@/lib/site";

// Route stays at /privacy so existing /privacy#terms links keep working. The
// privacy policy itself lives at /privacy-policy.
export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms of use for the AEM Energy website, including how indicative figures, VEU and Solar Victoria eligibility are presented.",
};

const TERMS = [
  {
    h: "Indicative figures only",
    p: `All dollar amounts, ranges and combined values shown on this site are indicative and presented as “up to” figures. They are not quotes or guarantees. Real values depend on your property, product, eligibility, government policy and market certificate prices, and can change.`,
  },
  {
    h: `No “free” upgrades`,
    p: "There are no free upgrades under the Victorian Energy Upgrades program. A minimum customer contribution applies. Any reference to a discount means a reduction in price, not a zero cost.",
  },
  {
    h: "Two distinct programs",
    p: "The VEU program and Solar Victoria are separate. Income and property thresholds apply only to Solar Victoria components, not to VEU. We keep them distinct when explaining what you qualify for.",
  },
  {
    h: "Eligibility & accreditation",
    p: "Only a registered Accredited Provider can create the certificates (VEECs) that fund the discount. We work with a registered Accredited Provider to handle this. Eligibility for any program is determined at assessment and may differ from indicative results shown here.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        lead="By using this site and its tools you accept the following terms."
        tone="muted"
      />

      <Section tone="surface" narrow>
        <div id="terms" className="scroll-mt-28 space-y-8">
          {TERMS.map((it) => (
            <section key={it.h}>
              <h2 className="text-h3 text-[1.25rem]">{it.h}</h2>
              <p className="mt-2 text-body">{it.p}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 text-caption">
          Last updated: placeholder. Contact:{" "}
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">
            {SITE.email}
          </a>
          . For how we handle personal information, see our{" "}
          <a href="/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </Section>
    </>
  );
}
