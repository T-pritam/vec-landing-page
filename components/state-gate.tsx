"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAppState, type AppState } from "@/components/state-context";
import { MapPinIcon } from "@/components/icons";
import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/cn";

const OPTIONS: { id: AppState; code: string; name: string; blurb: string }[] = [
  {
    id: "vic",
    code: "VIC",
    name: "Victoria",
    blurb: "Victorian Energy Upgrades, Solar Victoria and federal STCs.",
  },
  {
    id: "nsw",
    code: "NSW",
    name: "New South Wales",
    blurb: "Energy Savings Scheme, Peak Demand Reduction Scheme and STCs.",
  },
];

/**
 * State-selection gate. Mounted on the state-specific pages (Residential,
 * Commercial and each product page). If the visitor arrives without having
 * chosen a state, a blocking modal asks them to pick VIC or NSW before the
 * state-specific figures make sense. Once chosen, the choice persists
 * (localStorage, via StateContext) and the gate never shows again.
 */
export function StateGate() {
  const { state, setState, hydrated } = useAppState();
  const firstBtn = useRef<HTMLButtonElement>(null);

  const open = hydrated && state === null;

  // Lock body scroll while the gate is open; focus the first choice.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstBtn.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="state-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div aria-hidden className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg rounded-2xl border border-hairline bg-surface p-6 shadow-2xl shadow-ink/20 sm:p-8">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-8 w-8" />
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            <MapPinIcon className="h-4 w-4 text-brand-ink" />
            Your state
          </span>
        </div>

        <h2 id="state-gate-title" className="text-h2 mt-4">
          First, choose your state.
        </h2>
        <p className="mt-3 text-body text-text-muted">
          The programs, the rebates and the figures are different in each state.
          Pick yours and we&apos;ll show you only what applies.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {OPTIONS.map((o, i) => (
            <button
              key={o.id}
              ref={i === 0 ? firstBtn : undefined}
              type="button"
              onClick={() => setState(o.id)}
              className={cn(
                "lift group flex flex-col rounded-xl border-2 border-hairline bg-surface p-5 text-left transition-colors",
                "hover:border-brand focus-visible:border-brand focus-visible:outline-none",
              )}
            >
              <span className="flex items-baseline gap-2">
                <span className="text-h3 font-bold text-ink">{o.code}</span>
                <span className="text-sm font-medium text-text-muted">
                  {o.name}
                </span>
              </span>
              <span className="mt-2 text-sm leading-relaxed text-text-muted">
                {o.blurb}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
