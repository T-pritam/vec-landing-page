import type { UpgradeIcon } from "@/lib/upgrades";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
 * Brand logo — inline so it themes (ink wordmark on light, white on dark) and
 * stays crisp. Mirrors /public/logo-mark.svg. Swap on client brand confirm.
 * ------------------------------------------------------------------------- */
export function Logo({
  variant = "horizontal",
  onInk = false,
  className,
}: {
  variant?: "mark" | "horizontal";
  onInk?: boolean;
  className?: string;
}) {
  const Mark = (
    <svg
      viewBox="0 0 64 64"
      className="h-9 w-9 shrink-0"
      role="img"
      aria-hidden={variant === "horizontal"}
      aria-label={variant === "mark" ? "Accredited Energy" : undefined}
    >
      <rect width="64" height="64" rx="16" fill={onInk ? "#FFFFFF" : "#0B0E14"} />
      <path d="M37 11 L19 36 H30 L27 53 L46 27 H35 Z" fill="#F4A300" />
    </svg>
  );

  if (variant === "mark") return <span className={className}>{Mark}</span>;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {Mark}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.05rem] font-bold tracking-tight",
            onInk ? "text-white" : "text-ink",
          )}
        >
          Accredited Energy
        </span>
        <span
          className={cn(
            "mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em]",
            onInk ? "text-white/55" : "text-text-muted",
          )}
        >
          Victorian Energy Upgrades
        </span>
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Upgrade icons — custom line set (PRD §4: re-conceive, don't reuse the stock
 * drop/snowflake/battery/bulb grid). 24px, currentColor stroke.
 * ------------------------------------------------------------------------- */
const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Solar() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M12 1.5v1.6M12 12.9v1.2M18.5 8h-1.6M7.1 8H5.5M16.6 3.4l-1.1 1.1M8.5 11.5l-1.1 1.1M16.6 12.6l-1.1-1.1M8.5 4.5 7.4 3.4" />
      <path d="M5.5 20.5 7 15.5h10l1.5 5z" />
      <path d="M6.4 17.5h11.2M12 15.5v5" />
    </svg>
  );
}

function HeatPump() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="9" rx="2" />
      <path d="M6 8.5h4M6 11h4" />
      <circle cx="16" cy="9.5" r="2.4" />
      <path d="M9 18c1.2-1 1.2-2 0-3M13 18c1.2-1 1.2-2 0-3M17 18c1.2-1 1.2-2 0-3" />
    </svg>
  );
}

function HotWater() {
  return (
    <svg {...iconProps}>
      <path d="M12 3s5 5.2 5 9a5 5 0 0 1-10 0c0-3.8 5-9 5-9Z" />
      <path d="M9.5 13.5c.8.9 1.7.9 2.5 0s1.7-.9 2.5 0" />
    </svg>
  );
}

function Battery() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="7" width="15" height="10" rx="2" />
      <path d="M21 10.5v3" />
      <path d="M11 9.5 9 12.5h2.4L10 15" />
    </svg>
  );
}

function AirCon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="6.5" rx="2" />
      <path d="M6 8.2h7" />
      <path d="M7 15c1.4 0 1.4 1.5 2.8 1.5M12 15.5c1.4 0 1.4 1.7 2.8 1.7M16.5 14.8c1.2 0 1.2 1.3 2.4 1.3" />
    </svg>
  );
}

function Led() {
  return (
    <svg {...iconProps}>
      <path d="M8.5 14.5a5.5 5.5 0 1 1 7 0c-.7.6-1 1.2-1 2.2h-5c0-1-.3-1.6-1-2.2Z" />
      <path d="M9.5 19h5M10.5 21h3" />
    </svg>
  );
}

const ICONS: Record<UpgradeIcon, () => React.ReactElement> = {
  solar: Solar,
  "heat-pump": HeatPump,
  "hot-water": HotWater,
  battery: Battery,
  "air-con": AirCon,
  led: Led,
};

export function UpgradeGlyph({
  icon,
  className,
}: {
  icon: UpgradeIcon;
  className?: string;
}) {
  const C = ICONS[icon];
  return (
    <span className={className}>
      <C />
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Small utility icons
 * ------------------------------------------------------------------------- */
export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M6.5 4h3l1.2 3.5-1.8 1.3a11 11 0 0 0 5 5l1.3-1.8L19 16.5v3a1.5 1.5 0 0 1-1.6 1.5A14.5 14.5 0 0 1 4 6.6 1.5 1.5 0 0 1 5.5 5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 3 5 5.5v5.2c0 4.4 3 7.6 7 9.3 4-1.7 7-4.9 7-9.3V5.5L12 3Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M9 11.5 11 13.5 15 9"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LayersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 3 21 8l-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
