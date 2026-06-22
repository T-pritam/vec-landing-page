import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { CheckIcon } from "@/components/icons";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";

/**
 * Home hero (PRD §7.1 block 1) — owns a POSITION, not a discount %. Headline:
 * "the accredited team that handles your entire energy upgrade." Primary CTA is
 * Check eligibility; secondary is Get a quote. The visual is an abstract
 * full-chain "you do nothing" panel — no stock photography (PRD §4/§5).
 */
const CHAIN = [
  { who: "We", label: "Assess your place" },
  { who: "We", label: "Install the upgrade" },
  { who: "We", label: "Handle every certificate" },
  { who: "You", label: "Pay the discounted price" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-surface pt-28 pb-16 sm:pt-32 sm:pb-24">
      {/* soft amber wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-brand-tint to-transparent"
      />
      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Copy */}
          <div className="reveal">
            <Eyebrow>Victorian Energy Upgrades · Accredited Person</Eyebrow>
            <h1 className="text-display font-display mt-5">
              The accredited team that handles your{" "}
              <span className="text-brand-ink">entire energy upgrade.</span>
            </h1>
            <p className="text-lead mt-6 max-w-xl">
              From the first assessment to the final certificate, we own the
              whole chain. You get a large upfront discount — not a “free”
              gimmick — and you do almost nothing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={PRIMARY_CTA.href} size="lg">
                {PRIMARY_CTA.label}
              </Button>
              <Button href={SECONDARY_CTA.href} size="lg" variant="secondary">
                {SECONDARY_CTA.label}
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-muted">
              {[
                "Accredited to create certificates",
                "Re-tested every year",
                "Running since 2009",
              ].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4 text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual: the full chain */}
          <div className="reveal" style={{ animationDelay: "120ms" }}>
            <div className="rounded-3xl border border-hairline bg-surface p-2 shadow-xl shadow-ink/5">
              <div className="rounded-[1.25rem] bg-ink p-6 sm:p-7 on-ink">
                <p className="text-sm font-medium text-white/60">
                  Who does the work?
                </p>
                <ul className="mt-4 space-y-2.5">
                  {CHAIN.map((step, i) => {
                    const isYou = step.who === "You";
                    return (
                      <li
                        key={step.label}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${
                          isYou
                            ? "border-brand/40 bg-brand/15"
                            : "border-white/10 bg-white/[0.04]"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isYou
                              ? "bg-brand text-ink"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          {step.who}
                        </span>
                        <span className="text-[0.9375rem] font-medium text-white">
                          {step.label}
                        </span>
                        {isYou ? (
                          <CheckIcon className="ml-auto h-5 w-5 text-brand" />
                        ) : (
                          <span className="ml-auto text-xs text-white/40">
                            handled
                          </span>
                        )}
                        {i < CHAIN.length - 1 && (
                          <span className="sr-only">then</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-5 text-center text-sm text-white/55">
                  That's the whole point —{" "}
                  <span className="font-semibold text-white">you do nothing.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
