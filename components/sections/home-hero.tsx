"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Carousel, type CarouselSlide } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/icons";
import { SECONDARY_CTA } from "@/lib/site";

/**
 * Home hero (redesign 2026-07-30) — light, product-led and crisp.
 *
 * Client change request: shift the hero from the dark, team-led treatment to a
 * bright, product-focused one. Just a short eyebrow + headline, an auto-rotating
 * image carousel of the upgrades we install, and a single "book an assessment"
 * CTA beneath it. Motion is reduced-motion aware; the carousel pauses on
 * hover/focus and doesn't auto-advance under reduced motion.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const IMAGES: { src: string; alt: string }[] = [
  { src: "/images/air-con.jpg", alt: "An efficient split-system air conditioner" },
  { src: "/images/solar.jpg", alt: "A full rooftop solar array on an Australian home" },
  { src: "/images/battery.jpg", alt: "A home battery storage unit" },
  { src: "/images/installer.jpg", alt: "An accredited installer fitting solar panels" },
  { src: "/images/home.jpg", alt: "A modern Victorian home at dusk" },
];

const SLIDES: CarouselSlide[] = IMAGES.map((img, i) => ({
  id: `hero-${i}`,
  label: img.alt,
  node: (
    <div className="relative h-[260px] w-full sm:h-[400px] lg:h-[500px]">
      <Image
        src={img.src}
        alt={img.alt}
        fill
        priority={i === 0}
        sizes="100vw"
        className="object-cover"
      />
    </div>
  ),
}));

export function HomeHero() {
  const reduce = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
  };
  const up: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  const animate = reduce ? undefined : "show";
  const initial = reduce ? false : "hidden";

  return (
    <section className="bg-surface">
      <div className="container-page py-16 sm:py-20 lg:py-24">
        <motion.div
          variants={container}
          initial={initial}
          animate={animate}
          className="max-w-3xl"
        >
          {/* Eyebrow pill */}
          <motion.div variants={up}>
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-muted px-4 py-1.5 text-sm font-medium text-text-muted">
              <CheckIcon className="h-4 w-4 text-brand" />
              Energy upgrades, made straightforward
            </span>
          </motion.div>

          {/* Product-led headline */}
          <motion.h1
            variants={up}
            className="text-display font-display mt-6 text-ink"
          >
            Solar, batteries &amp; heat pumps{" "}
            <span className="text-brand">upgraded properly.</span>
          </motion.h1>
        </motion.div>

        {/* Auto-rotating image carousel */}
        <motion.div
          variants={up}
          initial={initial}
          animate={animate}
          className="mt-10"
        >
          <Carousel
            slides={SLIDES}
            ariaLabel="Energy upgrades AEM Energy installs"
            autoPlay
            intervalMs={2000}
          />
        </motion.div>

        {/* Primary CTA — get people booked in. */}
        <motion.div
          variants={up}
          initial={initial}
          animate={animate}
          className="mt-8 flex justify-center"
        >
          <Button href={SECONDARY_CTA.href} size="lg">
            Book a free assessment today
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
