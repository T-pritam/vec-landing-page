"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { CheckIcon } from "@/components/icons";

/**
 * The full-chain "you do nothing" promise (homepage change request, Home 4a).
 * Rebuilt as a scroll-driven reveal: the four points reveal one at a time on the
 * left while the photos accumulate on the right (ref: Home 4b). Reduced-motion
 * renders everything immediately with no transform.
 */
const EASE = [0.16, 1, 0.3, 1] as const;

const CHAIN = [
  {
    label: "We assess",
    body: "An accredited assessment of your place and what qualifies, with no obligation.",
    who: "Us",
  },
  {
    label: "We install",
    body: "Our registered installers do the work, to the program's standard.",
    who: "Us",
  },
  {
    label: "We handle the paperwork",
    body: "We create and sell the certificates and manage all the compliance.",
    who: "Us",
  },
  {
    label: "You save",
    body: "You pay the reduced price. A genuine upfront discount, not a “free” gimmick.",
    who: "You",
  },
];

const IMAGES = [
  { src: "/images/solar.jpg", alt: "Rooftop solar panels" },
  { src: "/images/air-con.jpg", alt: "A split-system air conditioner in a living room" },
  { src: "/images/water.jpg", alt: "A heat-pump hot water system" },
  { src: "/images/battery.jpg", alt: "A home battery in a garage" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } },
};
const pointVar: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const picVar: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function FullChain() {
  const reduce = useReducedMotion();

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Left: the four points reveal one at a time. */}
      <motion.ol
        className="space-y-4"
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={container}
      >
        {CHAIN.map((step, i) => {
          const isYou = step.who === "You";
          return (
            <motion.li
              key={step.label}
              variants={reduce ? undefined : pointVar}
              className={
                isYou
                  ? "rounded-2xl bg-ink p-6 text-white sm:p-7"
                  : "rounded-2xl border border-hairline bg-surface p-6 sm:p-7"
              }
            >
              <div className="flex items-center justify-between">
                <span
                  className={
                    isYou
                      ? "figure text-sm text-white/50"
                      : "figure text-sm text-text-muted"
                  }
                >
                  Step {i + 1}
                </span>
                <span
                  className={
                    isYou
                      ? "rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-ink"
                      : "rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-text-muted"
                  }
                >
                  {step.who}
                </span>
              </div>
              <h3
                className={
                  isYou
                    ? "mt-4 flex items-center gap-2 text-h3 text-[1.25rem] text-white"
                    : "mt-4 flex items-center gap-2 text-h3 text-[1.25rem]"
                }
              >
                {isYou && <CheckIcon className="h-5 w-5 text-brand" />}
                {step.label}
              </h3>
              <p
                className={
                  isYou
                    ? "mt-2 text-sm leading-relaxed text-white/70"
                    : "mt-2 text-sm leading-relaxed text-text-muted"
                }
              >
                {step.body}
              </p>
            </motion.li>
          );
        })}
      </motion.ol>

      {/* Right: the photos accumulate as each point reveals. */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={container}
      >
        {IMAGES.map((img) => (
          <motion.div
            key={img.src}
            variants={reduce ? undefined : picVar}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-hairline bg-surface-muted"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
