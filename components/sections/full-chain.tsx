import { CheckIcon } from "@/components/icons";

/**
 * The full-chain "you do nothing" promise (PRD §7.1 block 4). Four steps:
 * We assess → We install → We handle paperwork → You save. The strongest
 * consumer message in the category and almost unclaimed (gap ③).
 */
const CHAIN = [
  {
    label: "We assess",
    body: "An accredited assessment of your place and what qualifies — no obligation.",
    who: "Us",
  },
  {
    label: "We install",
    body: "Our registered installers do the work, to the program's standard.",
    who: "Us",
  },
  {
    label: "We handle the paperwork",
    body: "We create and sell the certificates and manage all the compliance.",
    who: "Us",
  },
  {
    label: "You save",
    body: "You pay the reduced price — a large upfront discount, not a “free” gimmick.",
    who: "You",
  },
];

export function FullChain() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-4">
      {CHAIN.map((step, i) => {
        const isYou = step.who === "You";
        return (
          <div
            key={step.label}
            className={isYou ? "bg-ink p-6 text-white sm:p-7" : "bg-surface p-6 sm:p-7"}
          >
            <div className="flex items-center justify-between">
              <span
                className={
                  isYou
                    ? "figure text-sm text-white/50"
                    : "figure text-sm text-text-muted"
                }
              >
                Step {i + 1}
              </span>
              <span
                className={
                  isYou
                    ? "rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-ink"
                    : "rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-text-muted"
                }
              >
                {step.who}
              </span>
            </div>
            <h3
              className={
                isYou
                  ? "mt-4 flex items-center gap-2 text-h3 text-[1.25rem] text-white"
                  : "mt-4 flex items-center gap-2 text-h3 text-[1.25rem]"
              }
            >
              {isYou && <CheckIcon className="h-5 w-5 text-brand" />}
              {step.label}
            </h3>
            <p
              className={
                isYou
                  ? "mt-2 text-sm leading-relaxed text-white/70"
                  : "mt-2 text-sm leading-relaxed text-text-muted"
              }
            >
              {step.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}
