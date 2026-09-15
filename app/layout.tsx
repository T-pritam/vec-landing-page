import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { WhatsAppFAB } from "@/components/whatsapp-fab";
import { Watermark } from "@/components/brand/watermark";
import { UtmCapture } from "@/components/utm-capture";
import { MetaPixelPageViews } from "@/components/meta-pixel";
import { SITE } from "@/lib/site";

// Optional Fraunces — hero display only (PRD §5 fonts). Variable font: omit
// `weight` so the full optical range is available for large display sizes.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}, Victorian Energy Upgrades, handled end-to-end`,
    template: `%s, ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: [{ url: "/AEM.png", type: "image/png" }],
    apple: "/AEM.png",
  },
  openGraph: {
    title: `${SITE.name}, Victorian Energy Upgrades, handled end-to-end`,
    description: SITE.description,
    type: "website",
    locale: "en_AU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${GeistSans.variable} ${GeistMono.variable} ${fraunces.variable}`}
    >
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1595779092185135');
fbq('track', 'PageView');`,
          }}
        />
        {/* End Meta Pixel Code */}
      </head>
      <body className="min-h-screen antialiased">
        {/* Meta Pixel no-JS fallback (an <img> isn't valid inside <head>) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=1595779092185135&ev=PageView&noscript=1"
          />
        </noscript>
        <MetaPixelPageViews />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {/* Snapshots ad campaign params on landing; renders nothing. */}
        <UtmCapture />
        <Watermark />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <StickyMobileCTA />
        <WhatsAppFAB />
      </body>
    </html>
  );
}
