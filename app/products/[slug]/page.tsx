import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandaloneProductTemplate } from "@/components/standalone-product-template";
import {
  getStandaloneProduct,
  STANDALONE_PRODUCT_SLUGS,
} from "@/lib/products";

export function generateStaticParams() {
  return STANDALONE_PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getStandaloneProduct(slug);
  if (!product) return {};
  return {
    title: `${product.longName} — ${product.heroHeadline}`,
    description: product.heroSub,
  };
}

export default async function StandaloneProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getStandaloneProduct(slug);
  if (!product) notFound();
  return <StandaloneProductTemplate product={product} />;
}
