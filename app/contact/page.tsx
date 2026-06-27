import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { LeadForm } from "@/components/lead-form";
import { PhoneIcon, CheckIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Talk to an accredited team member about your home or commercial energy upgrade. No obligation, and a straight answer on what you'd actually pay.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the accredited team."
        lead="Tell us a little about your place and what you're considering. We'll come back with a clear, honest next step — no obligation."
        tone="muted"
      />

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Details */}
          <div>
            <h2 className="text-h3">Get in touch</h2>
            <p className="mt-3 text-body">
              Prefer to talk? Call us — or leave your details and we'll call you.
            </p>

            <dl className="mt-8 space-y-6">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex items-center gap-2 text-h3 text-[1.25rem] text-ink hover:text-brand-hover"
                  >
                    <PhoneIcon className="h-5 w-5 text-brand-ink" />
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-[1.0625rem] text-ink hover:text-brand-hover"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Service area
                </dt>
                <dd className="mt-1 text-[1.0625rem] text-ink">
                  {SITE.serviceArea}
                </dd>
              </div>
            </dl>

            <ul className="mt-8 space-y-2.5 border-t border-hairline pt-8">
              {[
                "No obligation, ever",
                "A straight answer on what you'd pay",
                "Backed by our Accredited Person, Aussie Eco Marks",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-body">
                  <CheckIcon className="h-4 w-4 text-success" />
                  {t}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-caption">
              Contact details are placeholders — client to confirm before launch.
            </p>
          </div>

          {/* Shared lead form */}
          <div>
            <LeadForm context="contact" submitLabel="Send my enquiry" />
          </div>
        </div>
      </Section>
    </>
  );
}
