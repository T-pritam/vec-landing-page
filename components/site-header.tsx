"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, UpgradeGlyph } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PRIMARY_NAV, PRIMARY_CTA } from "@/lib/site";
import { UPGRADES } from "@/lib/upgrades";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-hairline bg-surface/85 backdrop-blur-xl"
          : "border-transparent bg-surface/0",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link
          href="/"
          aria-label="AEM Energy — home"
          className="shrink-0 rounded-lg py-1"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors",
                isActive(item.href)
                  ? "text-ink"
                  : "text-text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={PRIMARY_CTA.href} size="sm">
            {PRIMARY_CTA.label}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-300",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 block h-0.5 w-6 bg-current transition-opacity duration-200",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-300",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="container-page max-h-[calc(100dvh-4rem)] overflow-y-auto pb-8 pt-2">
          <nav aria-label="Mobile" className="flex flex-col">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col border-b border-hairline py-4"
              >
                <span className="text-lg font-semibold text-ink">
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-sm text-text-muted">
                    {item.description}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Upgrades
          </p>
          <div className="grid grid-cols-2 gap-2">
            {UPGRADES.map((u) => (
              <Link
                key={u.slug}
                href={`/upgrades/${u.slug}`}
                className="flex items-center gap-2.5 rounded-xl border border-hairline p-3"
              >
                <UpgradeGlyph
                  icon={u.icon}
                  className="text-brand-ink [&>svg]:h-5 [&>svg]:w-5"
                />
                <span className="text-sm font-medium text-ink">{u.name}</span>
              </Link>
            ))}
          </div>

          <Button href={PRIMARY_CTA.href} size="lg" className="mt-6 w-full">
            {PRIMARY_CTA.label}
          </Button>
        </div>
      </div>
    </header>
  );
}
