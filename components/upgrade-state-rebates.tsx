import { CountUp } from "@/components/motion/count-up";
import { IndicativeChip } from "@/components/indicative";
import { LayersIcon } from "@/components/icons";
import { ArrowLink } from "@/components/ui/button";
import { Eyebrow, SectionHeader } from "@/components/ui/section";
import {
  INCENTIVE_LAYERS,
  formatRange,
  type LayerId,
  type LayerValue,
  type UpgradeRebate,
} from "@/lib/rebates";

/* --------------------------------------------------------------------------
 * HeadlineCard — the compact value card below the product gallery
 * -------------------------------------------------------------------------- */

export function HeadlineCard({
  rebate,
  headline,
}: {
  rebate: UpgradeRebate | undefined;
  headline: number;
}) {
  const layers = rebate
    ? (Object.entries(rebate.layers) as [LayerId, LayerValue][])
    : [];
  const loanLayers = layers.filter(([, v]) => v.kind === "loan");
  const discountLayers = layers.filter(([, v]) => v.kind !== "loan");
  const onlyLoan = loanLayers.length > 0 && discountLayers.length === 0;

  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-muted px-5 py-4">
      <div>
        <span className="block text-xs font-medium text-text-muted">
          {onlyLoan ? "Interest-free loan" : "Indicative value"}
        </span>
        <span className="figure text-2xl font-semibold text-ink">
          up to{" "}
          <CountUp value={headline || (loanLayers[0]?.[1].max ?? 0)} />
        </span>
      </div>
      <IndicativeChip />
    </div>
  );
}

/* --------------------------------------------------------------------------
 * RebatePanel — "How much you can get" right column in section 2
 * -------------------------------------------------------------------------- */

export function RebatePanel({
  rebate,
  headline,
}: {
  rebate: UpgradeRebate | undefined;
  headline: number;
}) {
  const layers = rebate
    ? (Object.entries(rebate.layers) as [LayerId, LayerValue][])
    : [];
  const discountLayers = layers.filter(([, v]) => v.kind !== "loan");
  const loanLayers = layers.filter(([, v]) => v.kind === "loan");

  return (
    <div>
      <SectionHeader eyebrow="How much you can get" title="Your incentives." />
      <div className="mt-6 rounded-2xl border border-hairline bg-surface-muted p-6 sm:p-7">
        <ul className="space-y-4">
          {discountLayers.map(([id, v]) => (
            <LayerRow key={id} id={id} value={v} />
          ))}
          {loanLayers.map(([id, v]) => (
            <LayerRow key={id} id={id} value={v} />
          ))}
        </ul>
        {discountLayers.length > 0 && (
          <div className="mt-5 flex items-end justify-between border-t border-hairline pt-5">
            <span className="text-sm font-medium text-text-muted">
              Combined, up to
            </span>
            <span className="figure text-3xl font-semibold text-ink">
              <CountUp value={headline} />
            </span>
          </div>
        )}
        <p className="mt-5 text-caption text-text-muted">
          Figures are indicative only and shown as "up to" amounts. Real values
          change with government policy and market certificate prices, and depend
          on your property, product and eligibility. Nothing here is a quote or
          a guarantee. Figures last reviewed June 2026 for Victoria, Australia.
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * StackingNote — the branded card in section 4/5
 * -------------------------------------------------------------------------- */

export function StackingNote({
  rebate,
}: {
  rebate: UpgradeRebate | undefined;
}) {
  const layers = rebate
    ? (Object.entries(rebate.layers) as [LayerId, LayerValue][])
    : [];

  return (
    <div className="lift rounded-2xl bg-brand-tint p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <LayersIcon className="h-5 w-5 text-brand-ink" />
        <Eyebrow>Stacking note</Eyebrow>
      </div>
      <p className="mt-4 text-body text-ink">{rebate?.stackingNote}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {layers.map(([id]) => (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink"
          >
            <span className="h-2 w-2 rounded-full bg-brand" />
            {INCENTIVE_LAYERS[id].short}
          </span>
        ))}
      </div>
      <div className="mt-5">
        <ArrowLink href="/how-it-works#stacking">
          Try the stacking calculator
        </ArrowLink>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Row sub-component
 * -------------------------------------------------------------------------- */

function LayerRow({ id, value }: { id: LayerId; value: LayerValue }) {
  const meta = INCENTIVE_LAYERS[id];
  return (
    <li className="flex items-start justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 font-semibold text-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          {meta.name}
          {value.kind === "loan" && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-text-muted">
              loan, not a discount
            </span>
          )}
        </p>
        {value.note && (
          <p className="mt-1 pl-[1.125rem] text-sm text-text-muted">
            {value.note}
          </p>
        )}
      </div>
      <span className="figure shrink-0 whitespace-nowrap text-right font-semibold text-ink">
        {formatRange(value.min, value.max)}
      </span>
    </li>
  );
}
