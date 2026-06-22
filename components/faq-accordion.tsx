"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/faq";
import { cn } from "@/lib/cn";

/** Accordion list (PRD §7.7 — implement FAQ as an accordion). */
export function FaqAccordion({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className={cn("divide-y divide-hairline border-y border-hairline", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-[1.0625rem] font-semibold text-ink">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline transition-colors",
                    isOpen && "border-brand bg-brand-tint",
                  )}
                >
                  <span className="absolute h-0.5 w-3 bg-ink" />
                  <span
                    className={cn(
                      "absolute h-0.5 w-3 bg-ink transition-transform duration-300",
                      isOpen ? "rotate-0" : "rotate-90",
                    )}
                  />
                </span>
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl text-body">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
