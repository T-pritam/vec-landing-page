"use client";

import { useAppState } from "@/components/state-context";
import { cn } from "@/lib/cn";

export function StateToggle({ className }: { className?: string }) {
  const { state, setState } = useAppState();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-hairline bg-surface-muted p-0.5 text-sm font-medium",
        className,
      )}
      role="group"
      aria-label="Select state"
    >
      <button
        type="button"
        onClick={() => setState("vic")}
        aria-pressed={state === "vic"}
        className={cn(
          "rounded-full px-3 py-1.5 transition-colors",
          state === "vic"
            ? "bg-surface text-ink shadow-sm"
            : "text-text-muted hover:text-ink",
        )}
      >
        VIC
      </button>
      <button
        type="button"
        onClick={() => setState("nsw")}
        aria-pressed={state === "nsw"}
        className={cn(
          "rounded-full px-3 py-1.5 transition-colors",
          state === "nsw"
            ? "bg-surface text-ink shadow-sm"
            : "text-text-muted hover:text-ink",
        )}
      >
        NSW
      </button>
    </div>
  );
}
