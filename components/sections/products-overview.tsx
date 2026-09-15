"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

const HEADING = "Everything your home's energy system needs.";
const BODY =
  "From solar and batteries to heat pumps and air conditioning, AEM Energy assesses your place, installs the upgrade and handles every certificate. Working with a registered Accredited Provider under the VEU scheme, the whole chain sits within one accredited structure, so a real upfront discount reaches you with almost nothing to do.";

export function ProductsOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const [displayedText, setDisplayedText] = useState("");

  // Typing is driven by scroll position, so scrolling down types forward and
  // scrolling back up erases.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "start 30%"],
  });

  const charIndex = useTransform(scrollYProgress, [0, 1], [0, HEADING.length]);

  useMotionValueEvent(charIndex, "change", (v) => {
    setDisplayedText(HEADING.slice(0, Math.round(v)));
  });

  const isTypingDone = displayedText.length === HEADING.length;

  return (
    <section
      ref={sectionRef}
      className="bg-white py-20 px-8 sm:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left column */}
        <div>
          <h2 className="relative text-3xl sm:text-4xl font-bold text-gray-900">
            {/* Invisible full heading reserves the final size so nothing shifts while typing. */}
            <span className="invisible" aria-hidden>
              {HEADING}
            </span>
            <span className="absolute inset-0">
              {displayedText}
            </span>
          </h2>
          <p
            className={cn(
              "text-lg text-gray-600 mt-6 leading-relaxed transform transition-all duration-[600ms] ease-out",
              isTypingDone
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0",
            )}
          >
            {BODY}
          </p>
        </div>

        {/* Right column */}
        <div
          className={cn(
            "relative w-full aspect-[4/3] rounded-2xl overflow-hidden transform transition-all duration-[600ms] ease-out",
            isTypingDone
              ? "translate-x-0 opacity-100"
              : "-translate-x-12 opacity-0",
          )}
        >
          <Image
            src="/images/Products/unified.png"
            alt="The full AEM Energy product range, solar, battery, heat pump, air conditioning and water filtration"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
