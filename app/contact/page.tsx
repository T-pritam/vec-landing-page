import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { PhoneIcon, CheckIcon, WhatsAppIcon } from "@/components/icons";
import { PAGE_IMAGE } from "@/lib/images";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Talk to an accredited team member about your home or commercial energy upgrade. No obligation, and a straight answer on what you'd actually pay.",
};

/** Opens WhatsApp with the first line already written, so there's no blank-box pause. */
const WHATSAPP_HREF = `${SITE.whatsappHref}?text=${encodeURIComponent(
  "Hi AEM Energy, I'd like to talk about an energy upgrade.",
)}`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the accredited team."
        lead="Message us on WhatsApp or give us a call, and tell us a little about your place and what you're considering. We'll come back with a clear, honest next step, no obligation."
        tone="muted"
        image={PAGE_IMAGE.contact.src}
        imageAlt={PAGE_IMAGE.contact.alt}
      />

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Details */}
          <div>
            <h2 className="text-h3">Get in touch</h2>
            <p className="mt-3 text-body">
              Prefer to talk? Message us on WhatsApp, call us, or send an email.
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
                  Address
                </dt>
                <dd className="mt-1 text-[1.0625rem] text-ink">
                  {SITE.address}
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
                "Backed by Aussie Ecomarks, a registered Accredited Provider",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-body">
                  <CheckIcon className="h-4 w-4 text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp, in the slot the enquiry form used to occupy. Same card
              treatment as LeadForm so the page's rhythm is unchanged. */}
          <div>
            <div className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/12 text-success">
                <WhatsAppIcon className="h-7 w-7" />
              </span>

              <h2 className="mt-5 text-h3">WhatsApp us</h2>
              <p className="mt-2 text-body">
                The quickest way to reach the team. Send us a message and an
                accredited team member will come back to you with a straight
                answer on what you&apos;d actually pay. No obligation.
              </p>

              <dl className="mt-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  WhatsApp
                </dt>
                <dd className="mt-1">
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[1.25rem] text-ink hover:text-brand-hover"
                  >
                    <WhatsAppIcon className="h-5 w-5 text-brand-ink" />
                    {SITE.phone}
                  </a>
                </dd>
              </dl>

              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-green mt-6 inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-full px-7 text-base sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
              </a>

              <p className="mt-6 text-caption">
                Messaging us opens WhatsApp with your own number. We&apos;ll
                never imply an upgrade is “free”. We will show you what
                you&apos;d actually pay. See our{" "}
                <a href="/privacy" className="underline underline-offset-2">
                  privacy notice
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
