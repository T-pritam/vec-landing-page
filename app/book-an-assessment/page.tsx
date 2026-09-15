import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { LeadForm } from "@/components/lead-form";
import { PhoneIcon, CheckIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book an assessment",
  description:
    "Pick a date and time that suits you and an accredited AEM Energy team member will confirm your no-obligation assessment. A straight answer on what you'd actually pay.",
};

export default function BookAnAssessmentPage() {
  return (
    <>
      <section className="relative min-h-[70vh] w-full overflow-hidden">
        <Image
          src="/images/contact.jpg"
          alt="A friendly, no-obligation consultation with an accredited team member"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
        />
        <div className="absolute bottom-16 sm:bottom-20 lg:bottom-24 left-0 p-8 sm:p-12 lg:p-16 z-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
            BOOK AN ASSESSMENT
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
            Pick a time that suits you.
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium text-white/80">
            Choose a preferred date and a time slot, and add your details. An
            accredited team member will confirm your no-obligation assessment
            and give you a straight answer on what you&apos;d actually pay.
          </p>
        </div>
      </section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* What to expect */}
          <div>
            <h2 className="text-h3">What to expect</h2>
            <ul className="mt-6 space-y-2.5">
              {[
                "Assessment of your place and usage",
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
              Booking a slot is a request, not a locked appointment. We will
              confirm it with you.
            </p>
          </div>

          {/* Booking form (date + time slot) */}
          <div>
            <LeadForm
              context="book-an-assessment"
              conversion="booking"
              booking
              submitLabel="Book my assessment"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
