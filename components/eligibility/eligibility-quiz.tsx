"use client";

import { useMemo, useState } from "react";
import { UpgradeGlyph, CheckIcon, LayersIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/lead-form";
import { IndicativeChip, IndicativeDisclaimer } from "@/components/indicative";
import { UPGRADES, getUpgrade, type UpgradeIcon } from "@/lib/upgrades";
import {
  computeStack,
  formatAUD,
  INCENTIVE_LAYERS,
  type LayerId,
} from "@/lib/rebates";
import { cn } from "@/lib/cn";

/**
 * Tier B eligibility checker — built to the AEM handoff spec (doc §4/§5):
 * SIX steps — (1) Victorian postcode, (2) audience, (3) property/business type
 * + tenure, (4) upgrades of interest, (5) timing, (6) result + contact — that
 * branch on earlier answers and return one of THREE result states:
 *   • qualify       — "you likely qualify"
 *   • partial       — "let's talk — it's partial"
 *   • outside-scope — non-Victorian postcode (VEU is Victoria-only)
 * All three capture the lead via the shared LeadForm. Indicative figures come
 * from lib/rebates.ts and are framed "up to / indicative", never guaranteed.
 */

type Audience = "home" | "business";
type ResultState = "qualify" | "partial" | "outside-scope";

interface Answers {
  postcode?: string;
  audience?: Audience;
  propertyType?: string; // home
  sector?: string; // business
  tenure?: string; // own/rent (home) | own/lease (business)
  interests: string[];
  timing?: string;
}

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: UpgradeIcon;
}

// Home options exclude commercial-only upgrades (e.g. Commercial LED – NBB).
const homeInterestOptions: Option[] = UPGRADES.filter(
  (u) => u.available !== "commercial",
).map((u) => ({
  value: u.slug,
  label: u.name,
  description: u.tagline,
  icon: u.icon,
}));

const businessInterestOptions: Option[] = [
  { value: "solar", label: "Commercial solar", icon: "solar", description: "Rooftop / ground-mount PV" },
  { value: "led", label: "Commercial LED – NBB", icon: "led", description: "Non-building-based lighting" },
  { value: "heat-pumps", label: "Heating, cooling & hot water", icon: "heat-pump", description: "Efficient HVAC & hot water" },
  { value: "air-con", label: "Air conditioning", icon: "air-con", description: "Reverse-cycle systems" },
  { value: "battery", label: "Battery storage", icon: "battery", description: "Store generated power" },
];

const TIMING_OPTIONS: Option[] = [
  { value: "asap", label: "As soon as possible", description: "Ready to go now" },
  { value: "1-3m", label: "In 1–3 months", description: "Planning ahead" },
  { value: "3-6m", label: "In 3–6 months", description: "Further out" },
  { value: "researching", label: "Just researching", description: "Gathering information" },
];

const STEPS = ["postcode", "audience", "details", "interests", "timing", "result"] as const;
type StepId = (typeof STEPS)[number];
const TOTAL = STEPS.length;

/** Victorian postcodes: 3000–3999 and 8000–8999. */
function isVictorianPostcode(pc?: string): boolean {
  if (!pc || !/^\d{4}$/.test(pc)) return false;
  const n = Number(pc);
  return (n >= 3000 && n <= 3999) || (n >= 8000 && n <= 8999);
}

/** Upgrades that deliver a price-reducing incentive (not battery's loan-only). */
const ELIGIBLE_UPGRADES = new Set(
  UPGRADES.filter((u) => u.slug !== "battery").map((u) => u.slug),
);

function resolveResult(a: Answers): ResultState {
  if (!isVictorianPostcode(a.postcode)) return "outside-scope";
  const hasEligible = a.interests.some((s) => ELIGIBLE_UPGRADES.has(s));
  const partial =
    a.audience === "business" ||
    a.tenure === "rent" ||
    a.timing === "researching" ||
    !hasEligible;
  return partial ? "partial" : "qualify";
}

export function EligibilityQuiz() {
  const [answers, setAnswers] = useState<Answers>({ interests: [] });
  const [index, setIndex] = useState(0);

  const stepId: StepId = STEPS[Math.min(index, TOTAL - 1)];

  const goNext = () => setIndex((i) => Math.min(i + 1, TOTAL - 1));
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));

  function setSingle(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }
  function toggleMulti(key: keyof Answers, value: string) {
    setAnswers((prev) => {
      const cur = (prev[key] as string[]) ?? [];
      return {
        ...prev,
        [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
      };
    });
  }
  function setAudience(v: Audience) {
    // Switching audience resets downstream answers but keeps the postcode.
    setAnswers((prev) => ({
      postcode: prev.postcode,
      audience: v,
      interests: [],
    }));
    goNext();
  }

  const interestOptions =
    answers.audience === "business" ? businessInterestOptions : homeInterestOptions;

  const canAdvance = (() => {
    switch (stepId) {
      case "postcode":
        return /^\d{4}$/.test(answers.postcode ?? "");
      case "audience":
        return Boolean(answers.audience);
      case "details":
        return Boolean(
          (answers.audience === "business" ? answers.sector : answers.propertyType) &&
            answers.tenure,
        );
      case "interests":
        return answers.interests.length > 0;
      case "timing":
        return Boolean(answers.timing);
      default:
        return false;
    }
  })();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text-muted">
            {stepId === "result" ? "Your result" : `Step ${index + 1} of ${TOTAL}`}
          </span>
          {stepId !== "result" && <span className="text-text-muted">No obligation</span>}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
            style={{ width: `${(index / (TOTAL - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div key={stepId} className="reveal">
        {stepId === "postcode" && (
          <PostcodeStep
            value={answers.postcode}
            onChange={(v) => setSingle("postcode", v)}
            onEnter={() => canAdvance && goNext()}
          />
        )}

        {stepId === "audience" && (
          <AudienceStep value={answers.audience} onPick={setAudience} />
        )}

        {stepId === "details" && (
          <DetailsStep answers={answers} onSingle={setSingle} />
        )}

        {stepId === "interests" && (
          <ChoiceStep
            title="Which upgrades are you interested in?"
            hint="Pick everything that's on your mind — stacking several is where the value is."
            type="multi"
            options={interestOptions}
            selected={answers.interests}
            onToggle={(v) => toggleMulti("interests", v)}
          />
        )}

        {stepId === "timing" && (
          <ChoiceStep
            title="When are you looking to go ahead?"
            hint="A rough idea is fine — it just helps us prioritise."
            type="single"
            options={TIMING_OPTIONS}
            selected={answers.timing}
            onSingle={(v) => setSingle("timing", v)}
          />
        )}

        {stepId === "result" && (
          <ResultStep
            answers={answers}
            onRestart={() => {
              setAnswers({ interests: [] });
              setIndex(0);
            }}
          />
        )}
      </div>

      {/* Nav */}
      {stepId !== "result" && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={index === 0}
            className="text-sm font-medium text-text-muted hover:text-ink disabled:opacity-0"
          >
            ← Back
          </button>
          {stepId !== "audience" && (
            <Button onClick={goNext} disabled={!canAdvance} size="lg">
              {stepId === "timing" ? "See my result" : "Continue"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- steps ---------------------------------- */

function PostcodeStep({
  value,
  onChange,
  onEnter,
}: {
  value?: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  const vic = isVictorianPostcode(value);
  const filled = /^\d{4}$/.test(value ?? "");
  return (
    <div>
      <StepHeading
        title="First — what's your postcode?"
        hint="The Victorian Energy Upgrades program is Victoria-only, so this is where we start."
      />
      <input
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={4}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter();
        }}
        placeholder="e.g. 3000"
        aria-label="Postcode"
        className="figure w-full max-w-[12rem] rounded-2xl border border-hairline bg-surface px-5 py-4 text-2xl tracking-widest text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
      {filled && (
        <p
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 text-sm",
            vic ? "text-success" : "text-text-muted",
          )}
        >
          {vic ? (
            <>
              <CheckIcon className="h-4 w-4" /> That's in Victoria — you're in the right place.
            </>
          ) : (
            <>That postcode looks outside Victoria — we'll show you what that means.</>
          )}
        </p>
      )}
    </div>
  );
}

function AudienceStep({
  value,
  onPick,
}: {
  value?: Audience;
  onPick: (v: Audience) => void;
}) {
  const opts: { value: Audience; label: string; desc: string }[] = [
    { value: "home", label: "My home", desc: "Household upgrades — fast and simple." },
    { value: "business", label: "My business", desc: "Commercial & industrial — larger, ROI-driven." },
  ];
  return (
    <div>
      <StepHeading title="Is this for your home or a business?" />
      <div className="grid gap-3 sm:grid-cols-2">
        {opts.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onPick(o.value)}
            className={cn(
              "rounded-2xl border p-6 text-left transition-colors",
              value === o.value
                ? "border-brand bg-brand-tint"
                : "border-hairline hover:border-text-muted/40",
            )}
          >
            <span className="text-h3 block">{o.label}</span>
            <span className="mt-1 block text-body">{o.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailsStep({
  answers,
  onSingle,
}: {
  answers: Answers;
  onSingle: (key: keyof Answers, value: string) => void;
}) {
  const isBusiness = answers.audience === "business";
  const typeQ = isBusiness
    ? {
        key: "sector" as const,
        title: "What kind of site is it?",
        options: [
          { value: "office", label: "Office" },
          { value: "retail", label: "Retail" },
          { value: "warehouse", label: "Warehouse / industrial" },
          { value: "hospitality", label: "Hospitality" },
          { value: "other", label: "Something else" },
        ],
      }
    : {
        key: "propertyType" as const,
        title: "What kind of property is it?",
        options: [
          { value: "house", label: "House" },
          { value: "townhouse", label: "Townhouse" },
          { value: "apartment", label: "Apartment / unit" },
        ],
      };
  const tenureOptions = isBusiness
    ? [
        { value: "own", label: "We own it" },
        { value: "lease", label: "We lease it" },
      ]
    : [
        { value: "own", label: "I own it" },
        { value: "rent", label: "I rent it" },
      ];

  return (
    <div className="space-y-8">
      <div>
        <StepHeading title={typeQ.title} />
        <Pills
          options={typeQ.options}
          value={answers[typeQ.key]}
          onPick={(v) => onSingle(typeQ.key, v)}
        />
      </div>
      <div>
        <h3 className="mb-3 font-semibold text-ink">
          {isBusiness ? "Do you own or lease the premises?" : "Do you own or rent?"}
        </h3>
        <Pills
          options={tenureOptions}
          value={answers.tenure}
          onPick={(v) => onSingle("tenure", v)}
        />
      </div>
    </div>
  );
}

function Pills({
  options,
  value,
  onPick,
}: {
  options: { value: string; label: string }[];
  value?: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onPick(o.value)}
          className={cn(
            "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
            value === o.value
              ? "border-brand bg-brand-tint text-ink"
              : "border-hairline text-text-muted hover:border-text-muted/40 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ChoiceStep({
  title,
  hint,
  type,
  options,
  selected,
  onSingle,
  onToggle,
}: {
  title: string;
  hint?: string;
  type: "single" | "multi";
  options: Option[];
  selected?: string | string[];
  onSingle?: (v: string) => void;
  onToggle?: (v: string) => void;
}) {
  return (
    <div>
      <StepHeading title={title} hint={hint} />
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const isOn =
            type === "multi"
              ? (selected as string[]).includes(o.value)
              : selected === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={isOn}
              onClick={() => (type === "multi" ? onToggle?.(o.value) : onSingle?.(o.value))}
              className={cn(
                "flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors",
                isOn ? "border-brand bg-brand-tint" : "border-hairline hover:border-text-muted/40",
              )}
            >
              {o.icon && (
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl [&>span>svg]:h-6 [&>span>svg]:w-6",
                    isOn ? "bg-surface text-brand-ink" : "bg-surface-muted text-text-muted",
                  )}
                >
                  <UpgradeGlyph icon={o.icon} />
                </span>
              )}
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{o.label}</span>
                {o.description && (
                  <span className="block text-sm text-text-muted">{o.description}</span>
                )}
              </span>
              {type === "multi" && (
                <span
                  className={cn(
                    "ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                    isOn ? "border-brand bg-brand text-ink" : "border-hairline",
                  )}
                >
                  {isOn && <CheckIcon className="h-4 w-4" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultStep({
  answers,
  onRestart,
}: {
  answers: Answers;
  onRestart: () => void;
}) {
  const state = resolveResult(answers);
  const isBusiness = answers.audience === "business";
  const interests = answers.interests.length ? answers.interests : ["solar"];
  const includeSV = !isBusiness && answers.tenure !== "rent";
  const stack = computeStack(interests, { includeSolarVictoria: includeSV });
  const recommended = interests
    .map((s) => getUpgrade(s))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  const timingLabel = TIMING_OPTIONS.find((t) => t.value === answers.timing)?.label;
  const summaryLines = [
    `Postcode: ${answers.postcode ?? "—"}`,
    `Audience: ${isBusiness ? "Business / C&I" : "Home"}`,
    answers.propertyType && `Property: ${answers.propertyType}`,
    answers.sector && `Sector: ${answers.sector}`,
    answers.tenure && `Tenure: ${answers.tenure}`,
    `Interested in: ${recommended.map((u) => u.name).join(", ")}`,
    timingLabel && `Timing: ${timingLabel}`,
    `Result: ${state}`,
  ].filter(Boolean) as string[];

  const layerOrder: LayerId[] = ["veu", "solarVictoria", "stc"];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
        {state === "outside-scope" ? (
          <OutsideScope postcode={answers.postcode} />
        ) : (
          <>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
                state === "qualify"
                  ? "bg-success/10 text-success"
                  : "bg-brand-tint text-brand-ink",
              )}
            >
              {state === "qualify" ? (
                <>
                  <CheckIcon className="h-4 w-4" /> Good news — you look eligible
                </>
              ) : (
                <>Let's talk — your situation looks partial</>
              )}
            </span>

            {isBusiness ? (
              <>
                <h2 className="mt-5 text-h2">
                  This looks like a strong commercial fit.
                </h2>
                <p className="mt-3 text-lead">
                  Based on your answers, your site is a good candidate for a
                  managed VEU project. Commercial value is modelled per project —
                  and it can reach six figures — so the next step is a site
                  assessment, not a calculator.
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-5 text-h2">
                  {state === "qualify"
                    ? "Here's what you could stack — indicatively."
                    : "There's likely value here — let's confirm the detail."}
                </h2>
                {state === "partial" && (
                  <p className="mt-3 text-body">
                    {answers.tenure === "rent"
                      ? "As a renter you can still benefit, but some upgrades need your landlord's sign-off — so we'll talk it through."
                      : answers.timing === "researching"
                        ? "You're still researching — no rush. Here's the indicative picture so you know what's possible."
                        : "A couple of your answers mean we should confirm the detail with you — here's the indicative picture."}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
                  <span className="text-sm text-text-muted">up to</span>
                  <span className="figure text-5xl font-semibold leading-none sm:text-6xl">
                    {formatAUD(stack.combined.max)}
                  </span>
                  <IndicativeChip />
                </div>
                <p className="mt-2 text-body">
                  combined indicative value across your selected upgrades
                  {answers.tenure === "rent" && " (excluding Solar Victoria — owner sign-off needed)"}
                  .
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {layerOrder.map((id) => {
                    const on = stack.active.includes(id);
                    return (
                      <li
                        key={id}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
                          on
                            ? "border-brand/40 bg-brand-tint text-ink"
                            : "border-hairline text-text-muted line-through opacity-60",
                        )}
                      >
                        <LayersIcon className="h-3.5 w-3.5 text-brand-ink" />
                        {INCENTIVE_LAYERS[id].short}
                      </li>
                    );
                  })}
                </ul>

                {stack.loan && (
                  <p className="mt-4 rounded-xl bg-surface-muted px-4 py-3 text-sm text-text-muted">
                    Plus a Solar Victoria interest-free loan up to{" "}
                    <span className="figure font-semibold text-ink">
                      {formatAUD(stack.loan.max)}
                    </span>{" "}
                    for storage — finance you repay, not a discount.
                  </p>
                )}
              </>
            )}

            {recommended.length > 0 && (
              <div className="mt-7">
                <p className="text-sm font-semibold text-ink">
                  {isBusiness ? "Worth scoping for your site" : "Recommended for you"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recommended.map((u) => (
                    <a
                      key={u.slug}
                      href={`/upgrades/${u.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 text-sm font-medium text-ink hover:border-text-muted/40"
                    >
                      <UpgradeGlyph icon={u.icon} className="text-brand-ink [&>svg]:h-4 [&>svg]:w-4" />
                      {u.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7">
              <IndicativeDisclaimer variant="full" />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="mt-4 text-sm font-medium text-text-muted underline underline-offset-4 hover:text-ink"
        >
          Start over
        </button>
      </div>

      {/* Lead capture — all three states capture the lead */}
      <div>
        <h3 className="text-h3">
          {state === "outside-scope"
            ? "Leave your details anyway"
            : isBusiness
              ? "Book a site assessment"
              : "Confirm it with our team"}
        </h3>
        <p className="mt-2 text-body">
          {state === "outside-scope"
            ? "We'll let you know if a program opens up in your area, or point you toward your state's scheme. No obligation."
            : "Leave your details and an accredited team member will confirm exactly what you qualify for — and what you'd actually pay. No obligation."}
        </p>
        <LeadForm
          context={`eligibility-quiz:${state}`}
          defaults={{
            audience: answers.audience,
            postcode: answers.postcode,
            message: `Eligibility checker —\n${summaryLines.join("\n")}`,
          }}
          submitLabel={
            state === "outside-scope"
              ? "Keep me posted"
              : isBusiness
                ? "Request a site assessment"
                : "Confirm my eligibility"
          }
          className="mt-5"
          summary={
            <div className="rounded-xl bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                Your answers
              </p>
              <p className="mt-1.5 text-sm text-ink">{summaryLines.join(" · ")}</p>
            </div>
          }
        />
      </div>
    </div>
  );
}

function OutsideScope({ postcode }: { postcode?: string }) {
  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 text-sm font-semibold text-text-muted">
        Outside our service area
      </span>
      <h2 className="mt-5 text-h2">
        Postcode {postcode} looks outside Victoria.
      </h2>
      <p className="mt-3 text-lead">
        The Victorian Energy Upgrades program is Victoria-only, so we can't run
        an upgrade for that address today. Other states have their own schemes —
        leave your details and we'll point you in the right direction.
      </p>
    </>
  );
}

function StepHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-h3 sm:text-[1.625rem]">{title}</h2>
      {hint && <p className="mt-2 text-body">{hint}</p>}
    </div>
  );
}
