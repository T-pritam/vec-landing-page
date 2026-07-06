"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/icons";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";
import { SITE_IMAGE } from "@/lib/images";

/**
 * Home hero (PRD §7.1 block 1) — owns a POSITION, not a discount %.
 *
 * Cinematic, image-led treatment (client reference): the hero photo runs
 * full-bleed behind a dark scrim, with a single left-aligned copy column on
 * top — pill badge, headline, short lead, both CTAs and a slim trust line.
 * Primary CTA uses the brand green (green primary + lime secondary).
 * All motion is reduced-motion aware.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const TRUST = [
  "Accredited to create certificates",
  "Re-tested every year",
  "Operating since 2021",
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

  const animate = reduce ? undefined : "show";
  const initial = reduce ? false : "hidden";

  return (
    <section className="relative overflow-hidden bg-ink on-ink">
      {/* Full-bleed hero photo — sits behind everything. */}
      <Image
        src={SITE_IMAGE.heroHome}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Dark scrim: strongest on the left (behind the copy), fading to reveal
          the photo on the right — keeps the white headline legible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink from-5% via-ink/80 via-45% to-ink/25"
      />
      {/* Vertical fade so text lifts off the sky and the section blends into
          the page below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/50"
      />

      <div className="container-page relative z-10 py-28 sm:py-36 lg:py-44">
        <motion.div
          variants={container}
          initial={initial}
          animate={animate}
          className="max-w-2xl"
        >
          {/* Pill badge */}
          <motion.div variants={up}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <CheckIcon className="h-4 w-4 text-brand" />
              Energy upgrades, made straightforward
            </span>
          </motion.div>

          {/* Headline on two lines. */}
          <motion.h1
            variants={up}
            className="text-display font-display mt-6 text-white"
          >
            The accredited team that handles your
            <br />
            <span className="relative inline-block whitespace-nowrap">
              entire upgrade.
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-10 h-[0.42em] rounded bg-brand/40"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 1 }}
                />
              )}
            </span>
          </motion.h1>

          {/* Short lead — mirrors the reference's supporting paragraph, drawn
              from the site's existing positioning copy. */}
          <motion.p
            variants={up}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/75"
          >
            One accredited team assesses your place, installs the upgrade and
            handles every certificate — so a real upfront discount reaches you
            with almost nothing to do on your end.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={up} className="mt-8 flex flex-wrap gap-3">
            <Button href={PRIMARY_CTA.href} size="lg">
              {PRIMARY_CTA.label}
            </Button>
            <Button
              href={SECONDARY_CTA.href}
              size="lg"
              variant="secondary-on-ink"
            >
              {SECONDARY_CTA.label}
            </Button>
          </motion.div>

          {/* Trust ticks */}
          <motion.ul
            variants={up}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70"
          >
            {TRUST.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-brand" />
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
