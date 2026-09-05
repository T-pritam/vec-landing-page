import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { FaqAccordion } from "@/components/faq-accordion";
import { FAQ_CATEGORIES, faqsByCategory } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Straight, factually-grounded answers about the VEU program: is it means-tested, is it really not free, who sets the rebate value, and how the commercial path differs.",
};

export default function FaqPage() {
  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/home.jpg"
          alt="A modern home of the kind AEM Energy upgrades"
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
            FAQ
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
            Every question, answered honestly.
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium text-white/80">
            No spin and no &ldquo;free&rdquo; gimmicks. If your question
            isn&apos;t here, ask us. We&apos;ll add it.
          </p>
          <Link
            href="/contact"
            className="cta-green mt-8 inline-block rounded-lg px-8 py-4 text-lg"
          >
            Ask a question
          </Link>
        </div>
      </section>

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
    </>
  );
}
