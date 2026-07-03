"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Eyebrow } from "@/components/ui/section";
import { CheckIcon } from "@/components/icons";
import { Button, ArrowLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Full-section background image with a directional wipe reveal on scroll
 * (homepage change request, Home 5 & 6). The photo fills the section and wipes
 * in — left-to-right for Home 5, right-to-left for Home 6 — using a clip-path
 * so the copy stays clear on its side. Reduced-motion renders the photo fully
 * revealed with no animation.
 */
const EASE = [0.16, 1, 0.3, 1] as const;

export function BgSlideFeature({
  eyebrow,
  title,
  body,
  points,
  image,
  imageAlt,
  copySide = "right",
  reveal = "ltr",
  cta,
  link,
}: {
  eyebrow?: string;
  title: string;
  body: React.ReactNode;
  points?: string[];
  image: string;
  imageAlt: string;
  copySide?: "left" | "right";
  reveal?: "ltr" | "rtl";
  cta?: { label: string; href: string };
  link?: { label: string; href: string };
}) {
  const reduce = useReducedMotion();
  const clipHidden =
    reveal === "ltr" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  const clipShown = "inset(0 0 0 0)";

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {/* Background photo with a directional clip-path wipe. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        initial={reduce ? false : { clipPath: clipHidden }}
        whileInView={reduce ? undefined : { clipPath: clipShown }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1, ease: EASE }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Legibility gradient on the copy side. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          copySide === "left"
            ? "bg-gradient-to-r from-ink via-ink/85 to-ink/10"
            : "bg-gradient-to-l from-ink via-ink/85 to-ink/10",
        )}
      />

      <div className="container-page py-20 sm:py-28 lg:py-32">
        <div className={cn("max-w-xl", copySide === "right" && "lg:ml-auto")}>
          {eyebrow && <Eyebrow onInk>{eyebrow}</Eyebrow>}
          <h2 className="text-h2 mt-4 text-white">{title}</h2>
          <div className="mt-5 space-y-4 text-white/75">{body}</div>
          {points && points.length > 0 && (
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-white/80">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand" />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {(cta || link) && (
            <div className="mt-8 flex flex-wrap items-center gap-5">
              {cta && <Button href={cta.href}>{cta.label}</Button>}
              {link && (
                <ArrowLink
                  href={link.href}
                  className="text-white decoration-brand hover:text-brand"
                >
                  {link.label}
                </ArrowLink>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
