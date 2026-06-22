import { cn } from "@/lib/cn";

type Tone = "surface" | "muted" | "ink" | "business" | "brand-tint";

const toneStyles: Record<Tone, string> = {
  surface: "bg-surface text-ink",
  muted: "bg-surface-muted text-ink",
  // Dark premium sections: ink bg + white text + amber accents (PRD palette rule).
  ink: "bg-ink text-white on-ink",
  business: "bg-business text-white on-ink",
  "brand-tint": "bg-brand-tint text-ink",
};

export function Section({
  tone = "surface",
  className,
  containerClassName,
  narrow = false,
  spacing = "default",
  id,
  children,
}: {
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  narrow?: boolean;
  spacing?: "default" | "sm" | "none";
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        toneStyles[tone],
        spacing === "default" && "section-y",
        spacing === "sm" && "section-y-sm",
        className,
      )}
    >
      <div className={cn(narrow ? "container-narrow" : "container-page", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
  onInk = false,
}: {
  children: React.ReactNode;
  className?: string;
  onInk?: boolean;
}) {
  return (
    <p className={cn("eyebrow", onInk && "text-brand", className)}>{children}</p>
  );
}

/** Standard section header: eyebrow + H2 + optional lead. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  onInk = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  onInk?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center mx-auto max-w-2xl",
        className,
      )}
    >
      {eyebrow && <Eyebrow onInk={onInk}>{eyebrow}</Eyebrow>}
      <h2 className={cn("text-h2", onInk && "text-white")}>{title}</h2>
      {lead && (
        <p className={cn("text-lead", onInk && "text-white/70")}>{lead}</p>
      )}
    </div>
  );
}

/** Hairline-bordered card used across hubs and grids. */
export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-hairline bg-surface p-6 sm:p-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
