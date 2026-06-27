"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface CarouselSlide {
  id: string;
  /** Accessible label for the slide, e.g. "Rooftop array". */
  label: string;
  node: React.ReactNode;
}

/**
 * Lightweight, dependency-free, accessible carousel (PRD-lean stack — no new
 * npm dep). Native CSS scroll-snap gives real swipe on touch; prev/next arrows
 * and dot indicators drive it on desktop; arrow keys work when focused.
 *
 * Per the AEM brief: ONE carousel per product, and a single slide renders with
 * no controls. Slides are lazy by nature (off-screen SVG/JSX isn't painted).
 */
export function Carousel({
  slides,
  ariaLabel,
  className,
}: {
  slides: CarouselSlide[];
  ariaLabel: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const single = slides.length <= 1;

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(i, track.children.length - 1));
    const child = track.children[clamped] as HTMLElement | undefined;
    child?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, []);

  // Keep the active dot in sync with the scroll position.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || single) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        setActive(i);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [single]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (single) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(active - 1);
    }
  };

  return (
    <div
      className={cn("relative", className)}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div
        ref={trackRef}
        tabIndex={single ? undefined : 0}
        onKeyDown={onKeyDown}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          !single && "focus-visible:outline-2 focus-visible:outline-brand",
        )}
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.label}`}
            className="w-full shrink-0 snap-start"
          >
            {s.node}
          </div>
        ))}
      </div>

      {!single && (
        <>
          {/* Arrows — desktop */}
          <button
            type="button"
            onClick={() => scrollToIndex(active - 1)}
            disabled={active === 0}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface/90 text-ink shadow-sm backdrop-blur transition-opacity hover:bg-surface disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(active + 1)}
            disabled={active === slides.length - 1}
            aria-label="Next image"
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface/90 text-ink shadow-sm backdrop-blur transition-opacity hover:bg-surface disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <Chevron dir="right" />
          </button>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to ${s.label}`}
                aria-current={i === active}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active
                    ? "w-6 bg-brand"
                    : "w-2 bg-hairline hover:bg-text-muted/40",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
