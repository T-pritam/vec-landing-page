"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { UpgradeGlyph } from "@/components/icons";
import { PRIMARY_NAV, SECONDARY_CTA } from "@/lib/site";
import { cn } from "@/lib/cn";

const PRODUCT_DROPDOWN = [
  { label: "Solar", href: "/upgrades/solar", icon: "solar" as const },
  { label: "Heat Pumps", href: "/upgrades/heat-pumps", icon: "heat-pump" as const },
  { label: "Battery", href: "/upgrades/battery", icon: "battery" as const },
  { label: "Air Con", href: "/upgrades/air-con", icon: "air-con" as const },
];

function WaterDropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2.7C12 2.7 5.5 10.5 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10.5 12 2.7 12 2.7Z" />
    </svg>
  );
}

const WA_PATH =
  "M16.004 2.002a13.94 13.94 0 0 0-11.86 21.36L2 30l6.84-2.1A13.94 13.94 0 1 0 16.004 2.002Zm0 25.54a11.56 11.56 0 0 1-5.9-1.62l-.42-.25-4.37 1.34 1.18-4.3-.28-.44a11.6 11.6 0 1 1 9.79 5.27Zm6.34-8.68c-.35-.17-2.06-1.02-2.38-1.14-.32-.11-.55-.17-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.41.26-.76.09-.35-.18-1.47-.54-2.8-1.73-1.04-.92-1.73-2.06-1.94-2.41-.2-.35-.02-.54.15-.71.16-.16.35-.41.52-.62.18-.2.23-.35.35-.58.12-.23.06-.44-.03-.61-.09-.18-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.6h-.67c-.23 0-.61.09-.93.44-.32.35-1.22 1.2-1.22 2.92 0 1.72 1.25 3.39 1.42 3.62.18.23 2.46 3.75 5.96 5.26.83.36 1.48.58 1.99.74.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.66.29-.82.29-1.52.2-1.66-.08-.15-.32-.23-.67-.41Z";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
  }, [pathname]);

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

  const openWhatsAppChat = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-whatsapp-chat"));
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled || open
            ? "border-b"
            : "border-b border-transparent",
        )}
        style={{
          background: scrolled || open ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled || open ? "blur(4px)" : "none",
          WebkitBackdropFilter: scrolled || open ? "blur(4px)" : "none",
          borderBottomColor: scrolled || open ? "rgba(255,255,255,0.2)" : "transparent",
        }}
      >
        <div className="container-page flex h-16 items-center justify-between gap-2 sm:h-18">
          {/* Logo — left */}
          <Link
            href="/"
            aria-label="AEM Energy home"
            className="shrink-0 rounded-lg py-1"
          >
            <Image
              src="/Logo.png"
              alt="AEM Energy, Smarter Homes"
              width={280}
              height={70}
              priority
              style={{ objectFit: "contain" }}
              className="h-10 w-auto"
            />
          </Link>

          {/* Nav links — center (desktop) */}
          <nav
            aria-label="Primary"
            className="hidden xl:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
          >
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-ink"
                    : "text-text-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA — right (desktop) */}
          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <Link
              href={SECONDARY_CTA.href}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300"
              style={{
                background: ctaHover
                  ? "linear-gradient(135deg, #2E7D32 0%, #3D913C 100%)"
                  : "linear-gradient(135deg, #3D913C 0%, #6DAF3B 100%)",
              }}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
            >
              {SECONDARY_CTA.label}
            </Link>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#3D913C] xl:hidden"
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
      </header>

      {/* Mobile menu — full-screen solid white overlay */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[60] flex flex-col bg-white xl:hidden"
        >
          {/* Menu header: logo + close */}
          <div
            className="shrink-0 flex items-center justify-between px-5 py-5"
            style={{ borderBottom: "1px solid #E5E5E5" }}
          >
            <Link href="/" onClick={() => setOpen(false)}>
              <Image
                src="/Logo.png"
                alt="AEM Energy"
                width={200}
                height={50}
                style={{ objectFit: "contain" }}
                className="h-9 w-auto"
              />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="#3D913C"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable middle: nav items + spacer */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
            <nav className="shrink-0 flex flex-col">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="px-6 py-6"
                style={{ borderBottom: "1px solid #E5E5E5" }}
              >
                <span className="text-[20px] font-bold" style={{ color: "#1A1A1A" }}>
                  Home
                </span>
              </Link>

              {/* Products — toggle only */}
              <div style={{ borderBottom: "1px solid #E5E5E5" }}>
                <button
                  type="button"
                  onClick={() => setProductsOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-6 py-6"
                >
                  <span className="text-[20px] font-bold" style={{ color: "#1A1A1A" }}>
                    Products
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      productsOpen && "rotate-90",
                    )}
                    fill="none"
                    stroke="#1A1A1A"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {productsOpen && (
                  <div className="flex flex-col" style={{ background: "#F8F8F8" }}>
                    {PRODUCT_DROPDOWN.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 py-4"
                        style={{ paddingLeft: 48 }}
                      >
                        <UpgradeGlyph
                          icon={item.icon}
                          className="[&>svg]:h-5 [&>svg]:w-5 text-[#3D913C]"
                        />
                        <span className="text-[18px] font-medium" style={{ color: "#1A1A1A" }}>
                          {item.label}
                        </span>
                      </Link>
                    ))}

                    <div className="mx-6 h-px" style={{ background: "#E5E5E5" }} />

                    <Link
                      href="/products/distillo-water-filtration"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 py-4"
                      style={{ paddingLeft: 48 }}
                    >
                      <WaterDropIcon className="h-5 w-5 text-[#3D913C]" />
                      <span className="text-[18px] font-medium" style={{ color: "#1A1A1A" }}>
                        Distillo
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              {/* About Us */}
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="px-6 py-6"
                style={{ borderBottom: "1px solid #E5E5E5" }}
              >
                <span className="text-[20px] font-bold" style={{ color: "#1A1A1A" }}>
                  About Us
                </span>
              </Link>

              {/* FAQ's */}
              <Link
                href="/faq"
                onClick={() => setOpen(false)}
                className="px-6 py-6"
                style={{ borderBottom: "1px solid #E5E5E5" }}
              >
                <span className="text-[20px] font-bold" style={{ color: "#1A1A1A" }}>
                  FAQ&apos;s
                </span>
              </Link>

              {/* How It Works */}
              <Link
                href="/how-it-works"
                onClick={() => setOpen(false)}
                className="px-6 py-6"
                style={{ borderBottom: "1px solid #E5E5E5" }}
              >
                <span className="text-[20px] font-bold" style={{ color: "#1A1A1A" }}>
                  How It Works
                </span>
              </Link>
            </nav>

            {/* Flexible whitespace */}
            <div className="flex-1" />
          </div>

          {/* Bottom CTAs */}
          <div className="shrink-0 flex flex-col gap-3 px-5 pb-6 pt-3">
            <Link
              href={SECONDARY_CTA.href}
              onClick={() => setOpen(false)}
              className="flex h-14 items-center justify-center text-[16px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #3D913C 0%, #6DAF3B 100%)",
                borderRadius: 28,
              }}
            >
              {SECONDARY_CTA.label}
            </Link>

            <button
              type="button"
              onClick={openWhatsAppChat}
              className="flex h-14 items-center justify-center gap-2 text-[16px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #3D913C 0%, #6DAF3B 100%)",
                borderRadius: 28,
              }}
            >
              <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d={WA_PATH} fill="#fff" />
              </svg>
              Chat with us
            </button>
          </div>
        </div>
      )}
    </>
  );
}
