import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UpgradeTemplate } from "@/components/upgrade-template";
import { getUpgrade, UPGRADE_SLUGS } from "@/lib/upgrades";

export function generateStaticParams() {
  return UPGRADE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const upgrade = getUpgrade(slug);
  if (!upgrade) return {};
  return {
    title: `${upgrade.longName} — ${upgrade.heroHeadline}`,
    description: upgrade.heroSub,
  };
}

export default async function UpgradePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const upgrade = getUpgrade(slug);
  if (!upgrade) notFound();
  return <UpgradeTemplate upgrade={upgrade} />;
}
