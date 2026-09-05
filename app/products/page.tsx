import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductShowcase } from "@/components/sections/product-showcase";

export const metadata: Metadata = {
  title: "Our Energy Upgrades",
  description:
    "Solar panels, heat pump hot water, reverse cycle air conditioning, battery storage and Distillo water filtration. Assessed, installed and certified across Victoria.",
};

export default function ProductsPage() {
  return (
    <>
      {/* Full-bleed hero — all text is baked into the image */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/hero/producthome.png"
          alt="AEM Energy complete energy solutions: solar, heat pumps, air conditioning, battery storage and water filtration"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute bottom-24 sm:bottom-28 left-0 right-0 z-20 flex justify-center">
          <Link
            href="/book-an-assessment"
            className="cta-green rounded-lg px-8 py-4 text-lg shadow-lg"
          >
            Book an assessment
          </Link>
        </div>
      </section>

      <ProductShowcase />
    </>
  );
}
