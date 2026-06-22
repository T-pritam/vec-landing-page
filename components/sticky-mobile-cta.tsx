"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PhoneIcon } from "@/components/icons";
import { SITE, PRIMARY_CTA } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Sticky mobile call/CTA bar (PRD §6 global element). Mobile only. Hidden on the
 * eligibility page (the CTA target) and after the user scrolls into the footer.
 */
export function StickyMobileCTA() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const nearBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 220;
      setShow(window.scrollY > 480 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (pathname.startsWith(PRIMARY_CTA.href)) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/90 p-3 backdrop-blur-xl transition-transform duration-300 lg:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-2.5">
        <a
          href={SITE.phoneHref}
          aria-label={`Call ${SITE.phone}`}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-hairline text-ink"
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
        <Link
          href={PRIMARY_CTA.href}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-brand font-semibold text-ink"
        >
          {PRIMARY_CTA.label}
        </Link>
      </div>
    </div>
  );
}
