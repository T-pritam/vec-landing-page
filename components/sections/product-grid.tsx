"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

const VEU_PRODUCTS = [
  {
    title: "Solar",
    image: "/images/Products/solar-home.png",
    href: "/upgrades/solar",
  },
  {
    title: "Battery Storage",
    image: "/images/Products/battery-home.png",
    href: "/upgrades/battery",
  },
  {
    title: "Reverse Cycle Air Con",
    image: "/images/Products/aircon-home.png",
    href: "/upgrades/air-con",
  },
  {
    title: "Heat Pumps",
    image: "/images/Products/heatpump-home.png",
    href: "/upgrades/heat-pumps",
  },
];

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function MobileCarousel() {
  const total = VEU_PRODUCTS.length;
  const loopCards = [
    VEU_PRODUCTS[total - 1],
    ...VEU_PRODUCTS,
    VEU_PRODUCTS[0],
  ];

  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(true);
  const touchRef = useRef<number | null>(null);

  // Every card is exactly one track width, so the slide offset is a plain
  // percentage. Nothing to measure, and it survives an orientation change.
  const displayIdx = idx + 1;
  const activeDot = ((idx % total) + total) % total;

  const goNext = () => {
    setAnimate(true);
    setIdx((prev) => prev + 1);
  };

  const goPrev = () => {
    setAnimate(true);
    setIdx((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (idx >= total) {
      setAnimate(false);
      setIdx(0);
    } else if (idx < 0) {
      setAnimate(false);
      setIdx(total - 1);
    }
  };

  useEffect(() => {
    if (!animate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    }
  }, [animate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchRef.current === null) return;
    const diff = touchRef.current - e.changedTouches[0].clientX;
    touchRef.current = null;
    if (Math.abs(diff) < 40) return;
    if (diff > 0) goNext();
    else goPrev();
  };

  return (
    // The negative margins cancel the section padding so the photos run edge
    // to edge. The wrapper is exactly as tall as the 3:4 photo, so the arrows
    // and the dots sit against the image and nothing else.
    <div className="relative -mx-8 mt-8 sm:-mx-12 lg:hidden">
      <button
        type="button"
        aria-label="Previous product"
        onClick={goPrev}
        className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full"
        style={{
          background: "rgba(255,255,255,0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        aria-label="Next product"
        onClick={goNext}
        className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full"
        style={{
          background: "rgba(255,255,255,0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <ChevronRight />
      </button>

      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex ${animate ? "transition-transform duration-300 ease-out" : ""}`}
          style={{ transform: `translateX(-${displayIdx * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopCards.map((p, i) => (
            <div
              key={`${p.title}-${i}`}
              className="relative aspect-[3/4] w-full shrink-0 overflow-hidden"
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 z-10">
                {p === VEU_PRODUCTS[0] && (
                  <span className="mb-1.5 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                    FLAGSHIP
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">
                  <Link href={p.href} className="hover:underline">
                    {p.title}
                  </Link>
                </h3>
                <Link
                  href={p.href}
                  className="mt-1 inline-block text-sm font-semibold text-white/90 hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots, overlaid on the bottom of the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2"
      >
        {VEU_PRODUCTS.map((p, i) => (
          <span
            key={p.title}
            className="h-2 w-2 rounded-full transition-colors duration-300"
            style={{
              background:
                i === activeDot ? "#FFFFFF" : "rgba(255,255,255,0.45)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ProductGrid() {
  return (
    <section className="bg-[#1A1A1A] py-20 px-8 sm:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#6DAF3B]">
            OUR PRODUCTS
          </p>
          <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">
            Pick an upgrade, or stack a few.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium text-gray-400">
            Every figure is indicative and shown as an &ldquo;up to&rdquo;
            amount. Solar is our flagship; each upgrade has its own page.
          </p>
        </Reveal>

        {/* Desktop bento grid. The photos are not links: only the product name
            and the View Details line navigate. */}
        <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-[1.3fr_1fr]">
          {/* Left column: Solar flagship — full-bleed image */}
          <Reveal>
            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white transition-colors hover:border-white/20">
              <div className="relative flex-1 min-h-[280px]">
                <Image
                  src="/images/Products/solar-home.png"
                  alt="Solar panels"
                  fill
                  sizes="55vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  FLAGSHIP
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-gray-900">
                  <Link href="/upgrades/solar" className="hover:underline">
                    Solar
                  </Link>
                </h3>
                <Link
                  href="/upgrades/solar"
                  className="mt-3 inline-block text-sm font-semibold text-[#3D913C] hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right column: 3 stacked horizontal cards — full-bleed images */}
          <div className="flex flex-col gap-6">
            {VEU_PRODUCTS.slice(1).map((p, i) => (
              <Reveal key={p.title} delay={0.1 * (i + 1)}>
                <div className="flex min-h-[160px] flex-1 overflow-hidden rounded-xl border border-white/10 bg-white transition-colors hover:border-white/20">
                  <div className="relative w-[40%] shrink-0">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-5">
                    <h3 className="text-lg font-bold text-gray-900">
                      <Link href={p.href} className="hover:underline">
                        {p.title}
                      </Link>
                    </h3>
                    <Link
                      href={p.href}
                      className="mt-2 inline-block text-sm font-semibold text-[#3D913C] hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mobile carousel — infinite loop */}
        <MobileCarousel />

        {/* Distillo standalone */}
        <div className="mt-16 pt-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#6DAF3B]">
              OUR STANDALONE PRODUCT
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Not part of the VEU scheme. A standalone product, priced on its
              own merits.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/products/distillo-water-filtration"
              className="group mx-auto mt-8 flex max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-white transition-colors hover:border-white/20 md:flex-row"
            >
              <div className="relative h-48 w-full md:h-auto md:w-[40%] md:shrink-0">
                <Image
                  src="/images/Products/distillo-home.png"
                  alt="Distillo water filtration"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Distillo
                </h3>
                <p className="mt-2 text-gray-600">
                  Pure water. Perfected. Under-sink filtration for your home.
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-[#3D913C] group-hover:underline">
                  View Details &rarr;
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
