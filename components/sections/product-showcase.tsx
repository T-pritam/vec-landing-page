"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  {
    title: "Solar",
    desc: "Generate your own power and reduce your bills. Stack STC rebates and Solar Victoria on top.",
    incentive: "Up to $4,700 in combined indicative incentives",
    cta: "View Solar",
    href: "/upgrades/solar",
    image: "/images/Products/solar.png",
    bg: "#F7F5F0",
    textColor: "text-gray-900",
    dark: false,
  },
  {
    title: "Battery Storage",
    desc: "Store what your solar generates and use it after dark.",
    incentive: "Interest-free loan available, not a rebate",
    cta: "View Battery",
    href: "/upgrades/battery",
    image: "/images/Products/battery.png",
    bg: "#FFFFFF",
    textColor: "text-gray-900",
    dark: false,
  },
  {
    title: "Reverse Cycle Air Con",
    desc: "Efficient heating and cooling, year round, with an upfront VEU discount.",
    incentive: "VEU discount applied upfront on your quote",
    cta: "View Air Con",
    href: "/upgrades/air-con",
    image: "/images/Products/aircon.png",
    bg: "#1A1A1A",
    textColor: "text-white",
    dark: true,
  },
  {
    title: "Heat Pumps",
    desc: "Cut hot water costs with a system that runs on ambient air.",
    incentive: "VEU discount applied upfront on your quote",
    cta: "View Heat Pumps",
    href: "/upgrades/heat-pumps",
    image: "/images/Products/heat_pump.png",
    bg: "#F7F5F0",
    textColor: "text-gray-900",
    dark: false,
  },
  {
    title: "Distillo Water Filter",
    desc: "Filtered drinking water installed under your sink. No ongoing subscription.",
    incentive:
      "Not part of the VEU scheme. A standalone product, priced on its own merits.",
    cta: "View Distillo",
    href: "/products/distillo-water-filtration",
    image: "/images/Products/distillo.png",
    bg: "#FFFFFF",
    textColor: "text-gray-900",
    dark: false,
  },
];

// 5 products + the final CTA frame, one 100vh scroll segment each.
const FRAME_COUNT = PRODUCTS.length + 1;

export function ProductShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.max(
      0,
      Math.min(FRAME_COUNT - 1, Math.floor(v * FRAME_COUNT)),
    );
    setActive(idx);
  });

  const bg = active < PRODUCTS.length ? PRODUCTS[active].bg : "#1A1A1A";

  const frameClass = (i: number) =>
    cn(
      "absolute inset-0 flex items-center transform transition-all duration-500",
      i === active
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : i < active
          ? "opacity-0 -translate-y-[30px] pointer-events-none"
          : "opacity-0 translate-y-[30px] pointer-events-none",
    );

  return (
    <div ref={wrapperRef} className="relative h-[600vh]">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center transition-colors duration-700"
        style={{ backgroundColor: bg }}
      >
        {PRODUCTS.map((p, i) => (
          <div key={p.title} className={frameClass(i)}>
            <div className="w-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 items-center">
              {/* Text — left 40% */}
              <div>
                <h2 className={cn("text-4xl font-bold", p.textColor)}>
                  <Link href={p.href} className="transition-opacity hover:opacity-80">
                    {p.title}
                  </Link>
                </h2>
                <p
                  className={cn(
                    "text-lg mt-4 leading-relaxed",
                    p.dark ? "text-white/80" : "text-gray-600",
                  )}
                >
                  {p.desc}
                </p>
                <span
                  className={cn(
                    "text-sm inline-block px-3 py-1 rounded-full mt-3",
                    p.dark
                      ? "text-green-400 bg-green-900/30"
                      : "text-green-700 bg-green-50",
                  )}
                >
                  {p.incentive}
                </span>
                <div className="mt-6">
                  <Link
                    href={p.href}
                    className={cn(
                      "text-lg font-semibold transition-colors",
                      p.dark
                        ? "text-green-400 hover:text-green-300"
                        : "text-[#3D913C] hover:text-[#2E7D32]",
                    )}
                  >
                    {p.cta} →
                  </Link>
                </div>
              </div>
              {/* Image — right 60%. The height comes from this outer sizer;
                  the PNGs carry white backgrounds, so multiply (screen on the
                  dark frame) blends them into the frame color. */}
              <div className="h-[40vh] lg:h-[70vh]">
                <div
                  className="relative w-full h-full bg-transparent"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    style={{
                      mixBlendMode: p.dark ? "screen" : "multiply",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Final CTA frame */}
        <div className={cn(frameClass(PRODUCTS.length), "justify-center")}>
          <div className="flex flex-col items-center px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to see what your property qualifies for?
            </h2>
            <Link
              href="/book-an-assessment"
              className="cta-green mt-6 inline-block rounded-lg px-8 py-4 text-lg"
            >
              Book an assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
