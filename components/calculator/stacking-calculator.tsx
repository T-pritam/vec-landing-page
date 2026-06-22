"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UpgradeGlyph, LayersIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { IndicativeChip, IndicativeDisclaimer } from "@/components/indicative";
import { UPGRADES } from "@/lib/upgrades";
import {
  INCENTIVE_LAYERS,
  computeStack,
  formatAUD,
  type LayerId,
} from "@/lib/rebates";
import { PRIMARY_CTA } from "@/lib/site";
import { cn } from "@/lib/cn";

type SvStatus = "yes" | "unsure" | "no";
type Audience = "home" | "business";

const LAYER_ORDER: LayerId[] = ["veu", "solarVictoria", "stc"];

export function StackingCalculator() {
  const [audience, setAudience] = useState<Audience>("home");
  const [selected, setSelected] = useState<string[]>(["solar", "hot-water"]);
  const [sv, setSv] = useState<SvStatus>("unsure");

  const result = useMemo(
    () => computeStack(selected, { includeSolarVictoria: sv !== "no" }),
    [selected, sv],
  );
  const active = useMemo(() => new Set(result.active), [result.active]);

  const toggle = (slug: string) =>
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
      {/* ---------------- Controls ---------------- */}
      <div className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
        {/* Audience */}
        <Fieldset
          legend="Who's this for?"
          step={1}
        >
          <Segmented
            options={[
              { value: "home", label: "My home" },
              { value: "business", label: "My business" },
            ]}
            value={audience}
            onChange={(v) => setAudience(v as Audience)}
          />
        </Fieldset>

        {audience === "business" ? (
          <div className="mt-6 rounded-2xl bg-business-tint p-6">
            <p className="font-semibold text-business">
              Commercial value is project-specific — and usually much larger.
            </p>
            <p className="mt-2 text-body">
              For C&amp;I projects the combined value can reach six figures and
              runs through a measurement &amp; verification path. A quick
              calculator can't do it justice.
            </p>
            <Button href="/business" variant="business" className="mt-4">
              See the business journey
            </Button>
          </div>
        ) : (
          <>
            {/* Upgrades */}
            <Fieldset
              legend="Which upgrades are you considering?"
              hint="Pick as many as you like — stacking is the point."
              step={2}
            >
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {UPGRADES.map((u) => {
                  const on = selected.includes(u.slug);
                  return (
                    <button
                      key={u.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(u.slug)}
                      className={cn(
                        "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors",
                        on
                          ? "border-brand bg-brand-tint"
                          : "border-hairline bg-surface hover:border-text-muted/40",
                      )}
                    >
                      <UpgradeGlyph
                        icon={u.icon}
                        className={cn(
                          "[&>svg]:h-5 [&>svg]:w-5",
                          on ? "text-brand-ink" : "text-text-muted",
                        )}
                      />
                      <span className="text-sm font-semibold text-ink">
                        {u.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Fieldset>

            {/* Solar Victoria eligibility */}
            <Fieldset
              legend="Eligible for Solar Victoria?"
              hint="It's the only layer that's income- and property-tested. VEU and STCs aren't."
              step={3}
            >
              <Segmented
                options={[
                  { value: "yes", label: "Likely yes" },
                  { value: "unsure", label: "Not sure" },
                  { value: "no", label: "Over threshold" },
                ]}
                value={sv}
                onChange={(v) => setSv(v as SvStatus)}
              />
            </Fieldset>
          </>
        )}
      </div>

      {/* ---------------- Result ---------------- */}
      <div className="on-ink overflow-hidden rounded-3xl bg-ink text-white">
        <div className="flex h-full flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-white/70">
              <LayersIcon className="h-4 w-4 text-brand" />
              Indicative combined value
            </span>
            <IndicativeChip onInk />
          </div>

          {audience === "business" ? (
            <div className="flex flex-1 flex-col justify-center py-10 text-center">
              <p className="figure text-5xl font-semibold text-white">
                Six figures
              </p>
              <p className="mt-3 text-white/65">
                possible on larger commercial projects — modelled per project,
                not estimated here.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5">
                <div className="flex items-end gap-2">
                  <span className="text-sm text-white/55">up to</span>
                  <span className="figure text-5xl font-semibold leading-none text-white sm:text-6xl">
                    {formatAUD(result.combined.max)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/55">
                  {result.combined.min > 0 ? (
                    <>
                      indicative range{" "}
                      <span className="figure text-white/75">
                        {formatAUD(result.combined.min)}–
                        {formatAUD(result.combined.max)}
                      </span>{" "}
                      across your selected upgrades
                    </>
                  ) : (
                    "Select an upgrade above to see how the layers stack."
                  )}
                </p>
              </div>

              {/* Layer breakdown */}
              <ul className="mt-6 space-y-2.5">
                {LAYER_ORDER.map((id) => {
                  const meta = INCENTIVE_LAYERS[id];
                  const total = result.layerTotals[id];
                  const on = active.has(id);
                  return (
                    <li
                      key={id}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors",
                        on
                          ? "border-white/15 bg-white/[0.06]"
                          : "border-white/5 bg-transparent opacity-45",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            on ? "bg-brand" : "bg-white/30",
                          )}
                        />
                        <span className="text-sm font-medium text-white">
                          {meta.short}
                        </span>
                      </span>
                      <span className="figure text-sm text-white/80">
                        {total
                          ? total.min > 0
                            ? `${formatAUD(total.min)}–${formatAUD(total.max)}`
                            : `up to ${formatAUD(total.max)}`
                          : id === "solarVictoria" && sv === "no"
                            ? "over threshold"
                            : "—"}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {result.loan && (
                <p className="mt-3 rounded-xl bg-white/[0.06] px-4 py-3 text-sm text-white/70">
                  <span className="font-semibold text-white">
                    + interest-free loan up to {formatAUD(result.loan.max)}
                  </span>{" "}
                  for storage — that's finance you repay, not a discount.
                </p>
              )}

              <div className="mt-auto pt-6">
                <Button
                  href={PRIMARY_CTA.href}
                  size="lg"
                  className="w-full"
                >
                  {PRIMARY_CTA.label}
                </Button>
                <div className="mt-3">
                  <IndicativeDisclaimer onInk />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- sub-components ----------------------------- */

function Fieldset({
  legend,
  hint,
  step,
  children,
}: {
  legend: string;
  hint?: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-6 first:mt-0">
      <legend className="mb-3 flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
          {step}
        </span>
        <span className="font-semibold text-ink">{legend}</span>
      </legend>
      {hint && (
        <p className="-mt-1 mb-3 pl-[2.125rem] text-sm text-text-muted">{hint}</p>
      )}
      {children}
    </fieldset>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex w-full rounded-xl border border-hairline bg-surface-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            value === o.value
              ? "bg-surface text-ink shadow-sm"
              : "text-text-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
