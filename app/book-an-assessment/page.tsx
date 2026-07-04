import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { LeadForm } from "@/components/lead-form";
import { PhoneIcon, CheckIcon } from "@/components/icons";
import { PAGE_IMAGE } from "@/lib/images";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book an assessment",
  description:
    "Pick a date and time that suits you and an accredited AEM Energy team member will confirm your no-obligation assessment. A straight answer on what you'd actually pay.",
};

export default function BookAnAssessmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Book an assessment"
        title="Pick a time that suits you."
        lead="Choose a preferred date and a time slot, and add your details. An accredited team member will confirm your no-obligation assessment — and give you a straight answer on what you'd actually pay."
        tone="muted"
        image={PAGE_IMAGE.contact.src}
        imageAlt={PAGE_IMAGE.contact.alt}
      />

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* What to expect */}
          <div>
            <h2 className="text-h3">What to expect</h2>
            <ul className="mt-6 space-y-2.5">
              {[
                "A no-obligation assessment of your place and usage",
                "A clear, honest figure on what you'd actually pay",
                "One accredited team for assessment, install and paperwork",
                "3-hour arrival windows, 8am–8pm, so you're not waiting all day",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-body">
                  <CheckIcon className="h-4 w-4 shrink-0 text-success" />
                  {t}
                </li>
              ))}
            </ul>

            <dl className="mt-8 border-t border-hairline pt-8">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                Prefer to call?
              </dt>
              <dd className="mt-1">
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-2 text-[1.25rem] text-ink hover:text-brand-hover"
                >
                  <PhoneIcon className="h-5 w-5 text-brand-ink" />
                  {SITE.phone}
                </a>
              </dd>
            </dl>

            <p className="mt-8 text-caption">
              Booking a slot is a request, not a locked appointment — we'll
              confirm it with you. Contact details are placeholders, client to
              confirm before launch.
            </p>
          </div>

          {/* Booking form (date + time slot) */}
          <div>
            <LeadForm
              context="book-an-assessment"
              booking
              submitLabel="Book my assessment"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
