import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy & Terms",
  description:
    "Privacy notice and terms of use for the Accredited Energy prototype. Placeholder legal content — client to provide final copy before launch.",
};

const PRIVACY = [
  {
    h: "What we collect",
    p: "When you use the eligibility check or a contact form, we collect the details you give us — such as your name, contact details, postcode and the upgrades you're interested in — so we can respond to your enquiry.",
  },
  {
    h: "How we use it",
    p: "We use your information to assess what you may be eligible for, to contact you about your enquiry, and to deliver any upgrade you proceed with. We will never imply an upgrade is “free” — we'll always show you what you'd actually pay.",
  },
  {
    h: "Who sees it",
    p: "Your details are handled by our accredited team. As a full-chain Accredited Person we don't sell your details to third-party installers. Where a service provider helps us operate (for example a CRM or email tool), they only process data on our instructions.",
  },
  {
    h: "Your choices",
    p: "You can ask us to access, correct or delete your information at any time by emailing us. We keep information only as long as needed for your enquiry or as required by law.",
  },
];

const TERMS = [
  {
    h: "Indicative figures only",
    p: "All dollar amounts, ranges and combined values shown on this site are indicative and presented as “up to” figures. They are not quotes or guarantees. Real values depend on your property, product, eligibility, government policy and market certificate prices, and can change.",
  },
  {
    h: "No “free” upgrades",
    p: "There are no free upgrades under the Victorian Energy Upgrades program — a minimum customer contribution applies. Any reference to a discount means a reduction in price, not a zero cost.",
  },
  {
    h: "Two distinct programs",
    p: "The VEU program and Solar Victoria are separate. Income and property thresholds apply only to Solar Victoria components, not to VEU. We keep them distinct when explaining what you qualify for.",
  },
  {
    h: "Eligibility & accreditation",
    p: "Only an Accredited Person can create the certificates (VEECs) that fund the discount. Eligibility for any program is determined at assessment and may differ from indicative results shown here.",
  },
];

function LegalBlock({
  id,
  kicker,
  title,
  intro,
  items,
}: {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  items: { h: string; p: string }[];
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <p className="eyebrow">{kicker}</p>
      <h2 className="text-h2 mt-3">{title}</h2>
      <p className="text-lead mt-4">{intro}</p>
      <div className="mt-8 space-y-8">
        {items.map((it) => (
          <section key={it.h}>
            <h3 className="text-h3 text-[1.25rem]">{it.h}</h3>
            <p className="mt-2 text-body">{it.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy & Terms"
        lead="Placeholder legal content for the prototype — client to provide final copy before launch. The honest-pricing and indicative-figure principles below reflect how the site is built to behave."
        tone="muted"
      />

      <Section tone="surface" narrow>
        <div className="rounded-2xl border border-brand/30 bg-brand-tint p-5 text-sm text-ink">
          <strong className="font-semibold">Prototype notice:</strong> the text
          below is standard placeholder wording. Replace with reviewed legal copy
          before go-live.
        </div>

        <div className="mt-12 space-y-16">
          <LegalBlock
            id="privacy"
            kicker="Privacy notice"
            title="How we handle your information"
            intro={`This notice explains how ${SITE.legalName} collects and uses your information when you use this site.`}
            items={PRIVACY}
          />
          <hr className="border-hairline" />
          <LegalBlock
            id="terms"
            kicker="Terms & conditions"
            title="Using this site"
            intro="By using this site and its tools you accept the following terms."
            items={TERMS}
          />
        </div>

        <p className="mt-12 text-caption">
          Last updated: placeholder. Contact:{" "}
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">
            {SITE.email}
          </a>
          .
        </p>
      </Section>
    </>
  );
}
