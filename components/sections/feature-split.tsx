import Image from "next/image";
import { Eyebrow } from "@/components/ui/section";
import { CheckIcon } from "@/components/icons";
import { Button, ArrowLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

/**
 * Reusable two-column image + copy block. Pairs a licensed photo with a body of
 * text, optional bullet points and a CTA — used to make text-heavy sections feel
 * less sparse (client request: more copy + real imagery). `reverse` flips the
 * image to the right on desktop.
 */
export function FeatureSplit({
  eyebrow,
  title,
  body,
  points,
  image,
  imageAlt,
  reverse = false,
  cta,
  link,
}: {
  eyebrow?: string;
  title: string;
  body: React.ReactNode;
  points?: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
  cta?: { label: string; href: string };
  link?: { label: string; href: string };
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(reverse && "lg:order-2")}>
        <div className="lift relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hairline bg-surface-muted shadow-sm shadow-ink/5">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      <Reveal delay={0.08} className={cn(reverse && "lg:order-1")}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-h2 mt-4">{title}</h2>
        <div className="mt-5 space-y-4 text-body">{body}</div>
        {points && points.length > 0 && (
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-body">
                <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-success" />
                {p}
              </li>
            ))}
          </ul>
        )}
        {(cta || link) && (
          <div className="mt-8 flex flex-wrap items-center gap-5">
            {cta && <Button href={cta.href}>{cta.label}</Button>}
            {link && <ArrowLink href={link.href}>{link.label}</ArrowLink>}
          </div>
        )}
      </Reveal>
    </div>
  );
}
