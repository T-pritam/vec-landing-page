import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AEM Energy Pty Ltd collects, uses, discloses and protects your personal information under the Privacy Act 1988 (Cth) and the Australian Privacy Principles.",
  alternates: { canonical: "/privacy-policy" },
};

const LAST_UPDATED = "14 September 2026";

function Email() {
  return <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "About this policy",
    body: (
      <>
        <p>
          AEM Energy Pty Ltd (&quot;AEM Energy&quot;, &quot;we&quot;, &quot;us&quot;)
          respects your privacy. This policy explains how we collect, use,
          disclose and protect your personal information, in accordance with the
          Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
        </p>
        <p>
          By submitting an enquiry to us, you agree to the handling of your
          personal information as described here.
        </p>
      </>
    ),
  },
  {
    title: "What we collect",
    body: (
      <ul>
        <li>Name, email address, phone number, residential address and postcode</li>
        <li>Whether you own or rent your property</li>
        <li>
          Details about your home&apos;s existing hot water, heating, cooling or
          energy systems
        </li>
        <li>
          Information about your enquiry and any subsequent communications with us
        </li>
        <li>Records of calls, SMS and emails between you and our team</li>
        <li>
          Technical data such as IP address, browser type and pages viewed on our
          website
        </li>
      </ul>
    ),
  },
  {
    title: "How we collect it",
    body: (
      <ul>
        <li>Directly from you, through forms on our website</li>
        <li>
          Through lead forms on Facebook and Instagram, operated by Meta Platforms
        </li>
        <li>By telephone, SMS or email when you contact us or we contact you</li>
        <li>
          Automatically through cookies and similar technologies on our website
        </li>
      </ul>
    ),
  },
  {
    title: "Why we collect it",
    body: (
      <ul>
        <li>To respond to your enquiry and answer your questions</li>
        <li>
          To assess your eligibility for energy upgrades under the Victorian
          Energy Upgrades (VEU) program
        </li>
        <li>To arrange and conduct an in-home assessment</li>
        <li>
          To arrange installation of products and services through accredited
          providers
        </li>
        <li>
          To meet our record-keeping and compliance obligations under the VEU
          program
        </li>
        <li>To improve our website, services and advertising</li>
      </ul>
    ),
  },
  {
    title: "Victorian Energy Upgrades program",
    body: (
      <>
        <p>
          Where your enquiry relates to a VEU upgrade, your personal information
          will be shared with the Accredited Person or Accredited Provider
          responsible for your installation, and may be provided to the Essential
          Services Commission of Victoria or its authorised auditors as required
          under the Victorian Energy Efficiency Target Act 2007 and associated
          regulations.
        </p>
        <p>
          VEU program records must be retained for the period specified by the
          Essential Services Commission.
        </p>
      </>
    ),
  },
  {
    title: "Who we disclose your information to",
    body: (
      <>
        <ul>
          <li>Accredited Persons and Accredited Providers under the VEU program</li>
          <li>Installation contractors and technicians attending your property</li>
          <li>The Essential Services Commission of Victoria and its auditors</li>
          <li>
            Our IT, customer relationship management and communications service
            providers
          </li>
          <li>Our professional advisers, where required</li>
          <li>
            Government agencies or law enforcement, where required or authorised
            by law
          </li>
        </ul>
        <p>We do not sell your personal information.</p>
      </>
    ),
  },
  {
    title: "Overseas disclosure",
    body: (
      <>
        <p>
          Some of our customer service, administration and sales support
          functions are performed by personnel located in India. Your personal
          information may be accessed, stored and processed in India for these
          purposes.
        </p>
        <p>
          Some of our service providers store data on servers located outside
          Australia, including in the United States, Singapore and the European
          Union.
        </p>
        <p>
          We take reasonable steps to ensure overseas recipients handle your
          personal information in a manner consistent with the Australian Privacy
          Principles. By providing your information to us, you acknowledge that
          APP 8.1 will not apply to these disclosures and that we will not be
          accountable under the Privacy Act for any breach by an overseas
          recipient.
        </p>
      </>
    ),
  },
  {
    title: "Marketing and contact consent",
    body: (
      <>
        <p>
          When you submit an enquiry, you consent to being contacted by AEM
          Energy by telephone, SMS and email regarding your enquiry and related
          energy upgrade products and services.
        </p>
        <p>You may withdraw your consent at any time by:</p>
        <ul>
          <li>Replying STOP to any SMS from us</li>
          <li>Clicking &quot;unsubscribe&quot; in any email from us</li>
          <li>
            Emailing us at <Email />
          </li>
        </ul>
        <p>
          We honour the Do Not Call Register. However, where you have provided
          express consent for us to contact you, we may do so even if your number
          is listed on the Register. You may withdraw that consent at any time.
        </p>
      </>
    ),
  },
  {
    title: "Cookies and online tracking",
    body: (
      <>
        <p>
          Our website uses cookies and similar technologies to understand how
          visitors use the site and to measure the effectiveness of our
          advertising.
        </p>
        <p>
          We use the Meta Pixel, a tool provided by Meta Platforms, Inc. This
          allows us to measure the results of our Facebook and Instagram
          advertising and to show relevant ads to people who have visited our
          website. Information collected may include your IP address, browser
          information and actions you take on our site. Meta handles this
          information in accordance with its own Data Policy, available at{" "}
          <External href="https://www.facebook.com/privacy/policy">
            facebook.com/privacy/policy
          </External>
          .
        </p>
        <p>
          You can disable cookies through your browser settings, and you can
          manage your Meta ad preferences at{" "}
          <External href="https://www.facebook.com/adpreferences">
            facebook.com/adpreferences
          </External>
          .
        </p>
      </>
    ),
  },
  {
    title: "Security",
    body: (
      <>
        <p>
          We take reasonable steps to protect your personal information from
          misuse, interference, loss, unauthorised access, modification and
          disclosure. This includes access controls, secure storage and
          confidentiality obligations on our staff and contractors.
        </p>
        <p>
          No method of transmission or storage is completely secure, and we
          cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    title: "Retention",
    body: (
      <p>
        We retain your personal information for as long as necessary to fulfil
        the purposes described in this policy, and for any longer period required
        by the VEU program, taxation law, or other legal obligations. When no
        longer required, we destroy or de-identify it.
      </p>
    ),
  },
  {
    title: "Accessing and correcting your information",
    body: (
      <p>
        You may request access to the personal information we hold about you, and
        ask us to correct it if it is inaccurate, out of date or incomplete. Email{" "}
        <Email />. We will respond within a reasonable period. In limited
        circumstances permitted by law we may decline a request, and if we do we
        will tell you why in writing.
      </p>
    ),
  },
  {
    title: "Complaints",
    body: (
      <>
        <p>
          If you believe we have breached the Australian Privacy Principles,
          contact us at <Email />. We will acknowledge your complaint and aim to
          resolve it within 30 days.
        </p>
        <p>
          If you are not satisfied with our response, you may complain to the
          Office of the Australian Information Commissioner:
          <br />
          Website: <External href="https://www.oaic.gov.au">oaic.gov.au</External>{" "}
          | Phone: <a href="tel:1300363992">1300 363 992</a>
        </p>
      </>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. The current version will
        always be available at{" "}
        <Link href="/privacy-policy">aemenergy.com.au/privacy-policy</Link>.
      </p>
    ),
  },
  {
    title: "Contact us",
    body: (
      <p>
        {SITE.legalName}
        <br />
        {SITE.address}
        <br />
        Email: <Email />
        <br />
        Phone: <a href={SITE.phoneHref}>{SITE.phone}</a>
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lead={`${SITE.legalName} (ACN ${SITE.acn} | ABN ${SITE.abn})`}
        tone="muted"
      />

      <Section tone="surface" narrow>
        <p className="text-caption">Last updated: {LAST_UPDATED}</p>

        <ol className="mt-10 space-y-12">
          {SECTIONS.map((s, i) => (
            <li key={s.title} id={`section-${i + 1}`} className="scroll-mt-28">
              <h2 className="text-h3">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-body [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
                {s.body}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
