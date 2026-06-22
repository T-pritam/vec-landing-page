"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { CheckIcon } from "@/components/icons";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";

/**
 * Home hero (PRD §7.1 block 1) — owns a POSITION, not a discount %. Balanced
 * layout: headline, short sub, both CTAs and a slim trust line, with calmer
 * spacing. The visual is the animated product motif — the full-chain
 * "you do nothing" card that assembles itself on load (PRD §4/§5: no stock
 * photography). All motion is reduced-motion aware.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const CHAIN = [
  { who: "We", label: "Assess your place" },
  { who: "We", label: "Install the upgrade" },
  { who: "We", label: "Handle every certificate" },
  { who: "You", label: "Pay the discounted price" },
];

const TRUST = [
  "Accredited to create certificates",
  "Re-tested every year",
  "Running since 2009",
];

export function HomeHero() {
  const reduce = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
  };
  const up: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  const cardWrap: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASE, staggerChildren: 0.12, delayChildren: 0.45 },
    },
  };
  const row: Variants = {
    hidden: { opacity: 0, x: 16 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  };

  // When reduced motion is requested, skip all entrance/idle animation.
  const animate = reduce ? undefined : "show";
  const initial = reduce ? false : "hidden";

  return (
    <section className="relative overflow-hidden bg-surface pt-28 pb-16 sm:pt-32 sm:pb-24">
      {/* soft amber wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-brand-tint to-transparent"
      />
      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <motion.div variants={container} initial={initial} animate={animate}>
            <motion.div variants={up}>
              <Eyebrow>Victorian Energy Upgrades · Accredited Person</Eyebrow>
            </motion.div>

            <motion.h1 variants={up} className="text-display font-display mt-5">
              The accredited team that handles your{" "}
              <span className="relative inline-block whitespace-nowrap text-brand-ink">
                entire upgrade.
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 bottom-1 -z-10 h-[0.42em] rounded bg-brand/30"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 1 }}
                  />
                )}
              </span>
            </motion.h1>

            <motion.p variants={up} className="text-lead mt-6 max-w-xl">
              From the first assessment to the final certificate, we own the
              whole chain. A large upfront discount — not a “free” gimmick — and
              you do almost nothing.
            </motion.p>

            <motion.div variants={up} className="mt-8 flex flex-wrap gap-3">
              <Button href={PRIMARY_CTA.href} size="lg">
                {PRIMARY_CTA.label}
              </Button>
              <Button href={SECONDARY_CTA.href} size="lg" variant="secondary">
                {SECONDARY_CTA.label}
              </Button>
            </motion.div>

            <motion.ul
              variants={up}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-muted"
            >
              {TRUST.map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4 text-success" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Visual: the full chain, assembling on load */}
          <div className="relative">
            {/* pulsing glow behind the card */}
            {!reduce && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand/20 blur-3xl"
                animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.97, 1.03, 0.97] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            <Floating disabled={reduce}>
              <motion.div
                variants={cardWrap}
                initial={initial}
                animate={animate}
                className="rounded-3xl border border-hairline bg-surface p-2 shadow-xl shadow-ink/5"
              >
                <div className="rounded-[1.25rem] bg-ink p-6 on-ink sm:p-7">
                  <p className="text-sm font-medium text-white/60">
                    Who does the work?
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {CHAIN.map((step) => {
                      const isYou = step.who === "You";
                      return (
                        <motion.li
                          key={step.label}
                          variants={reduce ? undefined : row}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${
                            isYou
                              ? "border-brand/40 bg-brand/15"
                              : "border-white/10 bg-white/[0.04]"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isYou ? "bg-brand text-ink" : "bg-white/10 text-white"
                            }`}
                          >
                            {step.who}
                          </span>
                          <span className="text-[0.9375rem] font-medium text-white">
                            {step.label}
                          </span>
                          {isYou ? (
                            <motion.span
                              className="ml-auto"
                              initial={reduce ? false : { scale: 0, rotate: -20 }}
                              animate={reduce ? undefined : { scale: 1, rotate: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 320,
                                damping: 14,
                                delay: 1.15,
                              }}
                            >
                              <CheckIcon className="h-5 w-5 text-brand" />
                            </motion.span>
                          ) : (
                            <span className="ml-auto text-xs text-white/40">
                              handled
                            </span>
                          )}
                        </motion.li>
                      );
                    })}
                  </ul>
                  <p className="mt-5 text-center text-sm text-white/55">
                    That's the whole point —{" "}
                    <span className="font-semibold text-white">
                      you do nothing.
                    </span>
                  </p>
                </div>
              </motion.div>
            </Floating>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Gentle infinite float for the hero card (disabled for reduced motion). */
function Floating({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) return <>{children}</>;
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
