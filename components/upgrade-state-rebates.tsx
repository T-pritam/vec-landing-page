"use client";

import { useAppState } from "@/components/state-context";
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
import {
  NSW_INCENTIVE_LAYERS,
  NSW_REBATE_META,
  type NswLayerId,
  type NswLayerValue,
  type NswUpgradeRebate,
} from "@/lib/nsw-rebates";

/* --------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

function nswComputedHeadline(rebate: NswUpgradeRebate | undefined): number {
  if (!rebate) return 0;
  return Object.values(rebate.layers)
    .filter(
      (l): l is NswLayerValue =>
        Boolean(l) && l.kind !== "loan" && !l.variable,
    )
    .reduce((sum, l) => sum + l.max, 0);
}

/* --------------------------------------------------------------------------
 * StateHeadlineCard — the compact value card below the product gallery
 * -------------------------------------------------------------------------- */

export function StateHeadlineCard({
  vicRebate,
  vicHeadline,
  nswRebate,
}: {
  vicRebate: UpgradeRebate | undefined;
  vicHeadline: number;
  nswRebate: NswUpgradeRebate | undefined;
}) {
  const { state } = useAppState();

  if (state === "nsw") {
    const nswHeadline = nswComputedHeadline(nswRebate);
    const nswLayers = nswRebate
      ? (
          Object.entries(nswRebate.layers) as [NswLayerId, NswLayerValue][]
        ).filter(([, v]) => v.kind !== "loan")
      : [];
    const isOnlyVariable =
      nswLayers.length > 0 && nswLayers.every(([, v]) => v.variable);

    return (
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-muted px-5 py-4">
        <div>
          <span className="block text-xs font-medium text-text-muted">
            NSW — indicative value
          </span>
          <span className="figure text-2xl font-semibold text-ink">
            {isOnlyVariable || nswHeadline === 0 ? (
              "Variable — see details"
            ) : (
              <>
                up to <CountUp value={nswHeadline} />
              </>
            )}
          </span>
        </div>
        <IndicativeChip />
      </div>
    );
  }

  // VIC
  const vicLayers = vicRebate
    ? (Object.entries(vicRebate.layers) as [LayerId, LayerValue][])
    : [];
  const vicLoanLayers = vicLayers.filter(([, v]) => v.kind === "loan");
  const vicDiscountLayers = vicLayers.filter(([, v]) => v.kind !== "loan");
  const onlyLoan = vicLoanLayers.length > 0 && vicDiscountLayers.length === 0;

  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-muted px-5 py-4">
      <div>
        <span className="block text-xs font-medium text-text-muted">
          {onlyLoan ? "Interest-free loan" : "Indicative value"}
        </span>
        <span className="figure text-2xl font-semibold text-ink">
          up to{" "}
          <CountUp value={vicHeadline || (vicLoanLayers[0]?.[1].max ?? 0)} />
        </span>
      </div>
      <IndicativeChip />
    </div>
  );
}

/* --------------------------------------------------------------------------
 * StateRebatePanel — "How much you can get" right column in section 2
 * -------------------------------------------------------------------------- */

export function StateRebatePanel({
  vicRebate,
  vicHeadline,
  nswRebate,
}: {
  vicRebate: UpgradeRebate | undefined;
  vicHeadline: number;
  nswRebate: NswUpgradeRebate | undefined;
}) {
  const { state } = useAppState();

  if (state === "nsw") {
    const nswLayers = nswRebate
      ? (Object.entries(nswRebate.layers) as [NswLayerId, NswLayerValue][])
      : [];
    const nswDiscountLayers = nswLayers.filter(([, v]) => v.kind !== "loan");
    const nswLoanLayers = nswLayers.filter(([, v]) => v.kind === "loan");
    const nswHeadline = nswComputedHeadline(nswRebate);

    return (
      <div>
        <SectionHeader
          eyebrow="How much you can get"
          title="NSW incentives."
        />
        <div className="mt-6 rounded-2xl border border-hairline bg-surface-muted p-6 sm:p-7">
          <ul className="space-y-4">
            {nswDiscountLayers.map(([id, v]) => (
              <NswLayerRow key={id} id={id} value={v} />
            ))}
            {nswLoanLayers.map(([id, v]) => (
              <NswLayerRow key={id} id={id} value={v} />
            ))}
            {nswLayers.length === 0 && (
              <li className="text-sm text-text-muted">
                No specific NSW rebate data for this upgrade.
              </li>
            )}
          </ul>
          {nswHeadline > 0 && (
            <div className="mt-5 flex items-end justify-between border-t border-hairline pt-5">
              <span className="text-sm font-medium text-text-muted">
                Combined, up to
              </span>
              <span className="figure text-3xl font-semibold text-ink">
                <CountUp value={nswHeadline} />
              </span>
            </div>
          )}
          <p className="mt-5 text-caption text-text-muted">
            {NSW_REBATE_META.disclaimer}
          </p>
        </div>
      </div>
    );
  }

  // VIC
  const vicLayers = vicRebate
    ? (Object.entries(vicRebate.layers) as [LayerId, LayerValue][])
    : [];
  const vicDiscountLayers = vicLayers.filter(([, v]) => v.kind !== "loan");
  const vicLoanLayers = vicLayers.filter(([, v]) => v.kind === "loan");

  return (
    <div>
      <SectionHeader
        eyebrow="How much you can get"
        title="The indicative numbers."
      />
      <div className="mt-6 rounded-2xl border border-hairline bg-surface-muted p-6 sm:p-7">
        <ul className="space-y-4">
          {vicDiscountLayers.map(([id, v]) => (
            <VicLayerRow key={id} id={id} value={v} />
          ))}
          {vicLoanLayers.map(([id, v]) => (
            <VicLayerRow key={id} id={id} value={v} />
          ))}
        </ul>
        {vicDiscountLayers.length > 0 && (
          <div className="mt-5 flex items-end justify-between border-t border-hairline pt-5">
            <span className="text-sm font-medium text-text-muted">
              Combined, up to
            </span>
            <span className="figure text-3xl font-semibold text-ink">
              <CountUp value={vicHeadline} />
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
 * StateStackingNote — the branded card in section 4/5
 * -------------------------------------------------------------------------- */

export function StateStackingNote({
  vicRebate,
  nswRebate,
}: {
  vicRebate: UpgradeRebate | undefined;
  nswRebate: NswUpgradeRebate | undefined;
}) {
  const { state } = useAppState();

  if (state === "nsw") {
    const nswLayers = nswRebate
      ? (Object.entries(nswRebate.layers) as [NswLayerId, NswLayerValue][])
      : [];

    return (
      <div className="lift rounded-2xl bg-brand-tint p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <LayersIcon className="h-5 w-5 text-brand-ink" />
          <Eyebrow>NSW stacking note</Eyebrow>
        </div>
        <p className="mt-4 text-body text-ink">{nswRebate?.stackingNote}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {nswLayers.map(([id]) => (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink"
            >
              <span className="h-2 w-2 rounded-full bg-brand" />
              {NSW_INCENTIVE_LAYERS[id].short}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <ArrowLink href="/contact">Get a quote for NSW</ArrowLink>
        </div>
      </div>
    );
  }

  // VIC
  const vicLayers = vicRebate
    ? (Object.entries(vicRebate.layers) as [LayerId, LayerValue][])
    : [];

  return (
    <div className="lift rounded-2xl bg-brand-tint p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <LayersIcon className="h-5 w-5 text-brand-ink" />
        <Eyebrow>Stacking note</Eyebrow>
      </div>
      <p className="mt-4 text-body text-ink">{vicRebate?.stackingNote}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {vicLayers.map(([id]) => (
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
 * Row sub-components
 * -------------------------------------------------------------------------- */

function VicLayerRow({ id, value }: { id: LayerId; value: LayerValue }) {
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

function NswLayerRow({ id, value }: { id: NswLayerId; value: NswLayerValue }) {
  const meta = NSW_INCENTIVE_LAYERS[id];
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
          {value.variable && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-text-muted">
              variable
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
        {value.variable
          ? "See note"
          : formatRange(value.min, value.max)}
      </span>
    </li>
  );
}
