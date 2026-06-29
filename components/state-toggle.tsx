"use client";

import { useAppState, type AppState } from "@/components/state-context";
import { MapPinIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const STATES: { id: AppState; label: string }[] = [
  { id: "vic", label: "VIC" },
  { id: "nsw", label: "NSW" },
];

/**
 * VIC/NSW state selector. Eye-catching by design (client request): a labelled,
 * amber-filled segmented control so visitors immediately see we serve two states.
 * `showLabel` renders the leading "Your state" pin label; `className` lets the
 * header/mobile menu size it.
 */
export function StateToggle({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { state, setState } = useAppState();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel && (
        <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
          <MapPinIcon className="h-4 w-4 shrink-0 text-brand-ink" />
          <span className="hidden sm:inline">Your state</span>
        </span>
      )}
      <div
        className="flex items-center gap-1 rounded-full border-2 border-brand bg-brand-tint p-1"
        role="group"
        aria-label="Select your state"
      >
        {STATES.map((s) => {
          const active = state === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setState(s.id)}
              aria-pressed={active}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-bold tracking-wide transition-all duration-200",
                active
                  ? "bg-brand text-ink shadow-sm"
                  : "text-brand-ink hover:bg-brand/15",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
