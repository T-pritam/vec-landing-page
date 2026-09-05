import type { UpgradeIcon } from "@/lib/upgrades";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/brand/brand-mark";

/* ---------------------------------------------------------------------------
 * Brand logo — the AEM Energy green badge mark (components/brand/brand-mark)
 * plus an inline wordmark so the type themes (ink on light, white on dark).
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
  if (variant === "mark")
    return (
      <span className={className}>
        <BrandMark title="AEM Energy" />
      </span>
    );

  // Dark backgrounds (footer): the full-colour lockup's darker greens don't
  // read on ink, so pair the badge mark with a white wordmark there.
  if (onInk)
    return (
      <span className={cn("inline-flex items-center gap-3", className)}>
        <BrandMark className="h-11 w-11" />
        <span className="text-[1.5rem] font-bold leading-none tracking-tight text-white">
          AEM Energy
        </span>
      </span>
    );

  // Light backgrounds (header): the full horizontal lockup.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/Logo.png"
      alt="AEM Energy, Smarter Homes"
      className={cn("h-10 w-auto", className)}
    />
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

const ICONS: Record<UpgradeIcon, () => React.ReactElement> = {
  solar: Solar,
  "heat-pump": HeatPump,
  battery: Battery,
  "air-con": AirCon,
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

/**
 * WhatsApp glyph. Unlike the stroked icons above this is a filled mark (the
 * brand shape only reads at small sizes as a solid), so it takes `currentColor`
 * as a fill and inherits the surrounding text colour like the rest.
 */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <path
        d="M16.004 2.002a13.94 13.94 0 0 0-11.86 21.36L2 30l6.84-2.1A13.94 13.94 0 1 0 16.004 2.002Zm0 25.54a11.56 11.56 0 0 1-5.9-1.62l-.42-.25-4.37 1.34 1.18-4.3-.28-.44a11.6 11.6 0 1 1 9.79 5.27Zm6.34-8.68c-.35-.17-2.06-1.02-2.38-1.14-.32-.11-.55-.17-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.41.26-.76.09-.35-.18-1.47-.54-2.8-1.73-1.04-.92-1.73-2.06-1.94-2.41-.2-.35-.02-.54.15-.71.16-.16.35-.41.52-.62.18-.2.23-.35.35-.58.12-.23.06-.44-.03-.61-.09-.18-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.6h-.67c-.23 0-.61.09-.93.44-.32.35-1.22 1.2-1.22 2.92 0 1.72 1.25 3.39 1.42 3.62.18.23 2.46 3.75 5.96 5.26.83.36 1.48.58 1.99.74.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.66.29-.82.29-1.52.2-1.66-.08-.15-.32-.23-.67-.41Z"
        fill="currentColor"
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

export function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 21s6.5-5.4 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.6 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.3" r="2.3" stroke="currentColor" strokeWidth={1.6} />
    </svg>
  );
}

/**
 * Water-filtration glyph — kept OUTSIDE the VEU `UpgradeIcon` set on purpose,
 * so the standalone Distillo product stays decoupled from the rebate system.
 */
export function WaterFilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 3s5 5.2 5 9a5 5 0 0 1-10 0c0-3.8 5-9 5-9Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M9.5 13.2c.8.9 1.7.9 2.5 0s1.7-.9 2.5 0"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
