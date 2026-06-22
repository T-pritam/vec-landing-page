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
 * Tier B eligibility quiz (PRD §7.3 target). A branching, multi-step flow that
 * adapts questions to earlier answers (home vs business fork; an extra heating
 * question only when relevant) and returns a TAILORED result — recommended
 * upgrades + an indicative, never-guaranteed combined value — then captures the
 * lead via the shared LeadForm. Indicative figures come from lib/rebates.ts.
 */

type Audience = "home" | "business";
type Single = string;

interface Answers {
  audience?: Audience;
  tenure?: string;
  propertyType?: string;
  sector?: string;
  interests: string[];
  heating?: string;
  scale?: string;
  sv?: string; // home Solar Victoria signal
}

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: UpgradeIcon;
}

interface Question {
  key: keyof Answers;
  title: string;
  hint?: string;
  type: "single" | "multi";
  options: Option[];
}

const homeInterestOptions: Option[] = UPGRADES.map((u) => ({
  value: u.slug,
  label: u.name,
  description: u.tagline,
  icon: u.icon,
}));

const businessInterestOptions: Option[] = [
  { value: "solar", label: "Commercial solar", icon: "solar", description: "Rooftop / ground-mount PV" },
  { value: "led", label: "Lighting", icon: "led", description: "High-volume LED upgrades" },
  { value: "heat-pumps", label: "Heating & cooling", icon: "heat-pump", description: "Efficient HVAC" },
  { value: "air-con", label: "Air conditioning", icon: "air-con", description: "Reverse-cycle systems" },
  { value: "hot-water", label: "Hot water", icon: "hot-water", description: "High hot-water loads" },
  { value: "battery", label: "Battery storage", icon: "battery", description: "Store generated power" },
];

const QUESTIONS: Record<string, Question> = {
  "home-tenure": {
    key: "tenure",
    title: "Do you own or rent your home?",
    hint: "Renters can still benefit, but some upgrades need the owner's go-ahead.",
    type: "single",
    options: [
      { value: "own", label: "I own it" },
      { value: "rent", label: "I rent it" },
    ],
  },
  "home-type": {
    key: "propertyType",
    title: "What kind of property is it?",
    type: "single",
    options: [
      { value: "house", label: "House" },
      { value: "townhouse", label: "Townhouse" },
      { value: "apartment", label: "Apartment / unit" },
    ],
  },
  "home-interests": {
    key: "interests",
    title: "Which upgrades are you interested in?",
    hint: "Pick everything that's on your mind — stacking several is where the value is.",
    type: "multi",
    options: homeInterestOptions,
  },
  "home-heating": {
    key: "heating",
    title: "How do you heat your home now?",
    hint: "Replacing gas or old electric heating is where the discount is largest.",
    type: "single",
    options: [
      { value: "gas", label: "Gas ducted / heater" },
      { value: "electric", label: "Old electric heating" },
      { value: "split", label: "A split system already" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  "home-sv": {
    key: "sv",
    title: "A quick eligibility signal for Solar Victoria",
    hint: "It's the only layer that's income- and property-tested. VEU and STCs aren't — so this only affects one part of your result.",
    type: "single",
    options: [
      { value: "yes", label: "Likely under the thresholds" },
      { value: "unsure", label: "Not sure" },
      { value: "no", label: "Over the thresholds" },
    ],
  },
  "biz-sector": {
    key: "sector",
    title: "What kind of site is it?",
    type: "single",
    options: [
      { value: "office", label: "Office" },
      { value: "retail", label: "Retail" },
      { value: "warehouse", label: "Warehouse / industrial" },
      { value: "hospitality", label: "Hospitality / accommodation" },
      { value: "other", label: "Something else" },
    ],
  },
  "biz-tenure": {
    key: "tenure",
    title: "Do you own or lease the premises?",
    hint: "Either can work — it affects how we structure the project.",
    type: "single",
    options: [
      { value: "own", label: "We own it" },
      { value: "lease", label: "We lease it" },
    ],
  },
  "biz-interests": {
    key: "interests",
    title: "What are you looking to upgrade?",
    hint: "Pick as many as apply.",
    type: "multi",
    options: businessInterestOptions,
  },
  "biz-scale": {
    key: "scale",
    title: "Roughly how large is the site?",
    hint: "A ballpark is fine — it helps us gauge the scale of the opportunity.",
    type: "single",
    options: [
      { value: "small", label: "Small", description: "Single small premises" },
      { value: "medium", label: "Medium", description: "A larger site or a few locations" },
      { value: "large", label: "Large", description: "Major site / multi-site portfolio" },
    ],
  },
};

function buildSteps(a: Answers): string[] {
  if (!a.audience) return ["audience"];
  if (a.audience === "home") {
    const steps = ["audience", "home-tenure", "home-type", "home-interests"];
    if (a.interests.some((s) => s === "heat-pumps" || s === "air-con")) {
      steps.push("home-heating");
    }
    steps.push("home-sv", "result");
    return steps;
  }
  return ["audience", "biz-sector", "biz-tenure", "biz-interests", "biz-scale", "result"];
}

export function EligibilityQuiz() {
  const [answers, setAnswers] = useState<Answers>({ interests: [] });
  const [index, setIndex] = useState(0);

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const stepId = steps[Math.min(index, steps.length - 1)];
  const total = steps.length;

  const goNext = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));

  function setAudience(v: Audience) {
    // Reset downstream answers when switching the top-level branch.
    setAnswers({ audience: v, interests: [] });
    setIndex(1);
  }

  function setSingle(key: keyof Answers, value: Single) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti(key: keyof Answers, value: string) {
    setAnswers((prev) => {
      const cur = (prev[key] as string[]) ?? [];
      const next = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
      return { ...prev, [key]: next };
    });
  }

  const canAdvance = (() => {
    if (stepId === "audience") return Boolean(answers.audience);
    if (stepId === "result") return false;
    const q = QUESTIONS[stepId];
    if (!q) return false;
    if (q.type === "multi") return (answers[q.key] as string[]).length > 0;
    return Boolean(answers[q.key]);
  })();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text-muted">
            {stepId === "result" ? "Your result" : `Step ${index + 1} of ${total}`}
          </span>
          {stepId !== "result" && (
            <span className="text-text-muted">No obligation</span>
          )}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
            style={{ width: `${(index / (total - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div key={stepId} className="reveal">
        {stepId === "audience" ? (
          <AudienceStep value={answers.audience} onPick={setAudience} />
        ) : stepId === "result" ? (
          <ResultStep answers={answers} onRestart={() => { setAnswers({ interests: [] }); setIndex(0); }} />
        ) : (
          <QuestionStep
            q={QUESTIONS[stepId]}
            answers={answers}
            onSingle={setSingle}
            onToggle={toggleMulti}
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
              Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- steps ---------------------------------- */

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
      <StepHeading
        title="Let's see what you qualify for."
        hint="Two quick questions to start — this takes about a minute."
      />
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

function QuestionStep({
  q,
  answers,
  onSingle,
  onToggle,
}: {
  q: Question;
  answers: Answers;
  onSingle: (key: keyof Answers, value: string) => void;
  onToggle: (key: keyof Answers, value: string) => void;
}) {
  const selected = answers[q.key];
  return (
    <div>
      <StepHeading title={q.title} hint={q.hint} />
      <div
        className={cn(
          "grid gap-3",
          q.options.some((o) => o.icon) ? "sm:grid-cols-2" : "sm:grid-cols-2",
        )}
      >
        {q.options.map((o) => {
          const isOn =
            q.type === "multi"
              ? (selected as string[]).includes(o.value)
              : selected === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={isOn}
              onClick={() =>
                q.type === "multi"
                  ? onToggle(q.key, o.value)
                  : onSingle(q.key, o.value)
              }
              className={cn(
                "flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors",
                isOn
                  ? "border-brand bg-brand-tint"
                  : "border-hairline hover:border-text-muted/40",
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
                  <span className="block text-sm text-text-muted">
                    {o.description}
                  </span>
                )}
              </span>
              {q.type === "multi" && (
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
  const isBusiness = answers.audience === "business";
  const interests = answers.interests.length
    ? answers.interests
    : ["solar"];
  const includeSV = !isBusiness && answers.sv !== "no";
  const stack = computeStack(interests, { includeSolarVictoria: includeSV });

  const recommended = interests
    .map((s) => getUpgrade(s))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  const summaryLines = [
    `Audience: ${isBusiness ? "Business / C&I" : "Home"}`,
    answers.tenure && `Tenure: ${answers.tenure}`,
    answers.propertyType && `Property: ${answers.propertyType}`,
    answers.sector && `Sector: ${answers.sector}`,
    answers.scale && `Scale: ${answers.scale}`,
    answers.heating && `Heating: ${answers.heating}`,
    `Interested in: ${recommended.map((u) => u.name).join(", ")}`,
  ].filter(Boolean) as string[];

  const leadDefaults = {
    audience: answers.audience,
    message: `Eligibility quiz result —\n${summaryLines.join("\n")}`,
  };

  const layerOrder: LayerId[] = ["veu", "solarVictoria", "stc"];

  return (
    <div className="space-y-8">
      {/* Verdict */}
      <div className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
          <CheckIcon className="h-4 w-4" /> Good news — you look eligible
        </span>

        {isBusiness ? (
          <>
            <h2 className="mt-5 text-h2">
              This looks like a strong commercial fit.
            </h2>
            <p className="mt-3 text-lead">
              Based on your answers, your site is a good candidate for a managed
              VEU project. Commercial value is modelled per project — and it can
              reach six figures — so the next step is a site assessment, not a
              calculator.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-5 text-h2">
              Here's what you could stack — indicatively.
            </h2>
            <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
              <span className="text-sm text-text-muted">up to</span>
              <span className="figure text-5xl font-semibold leading-none sm:text-6xl">
                {formatAUD(stack.combined.max)}
              </span>
              <IndicativeChip />
            </div>
            <p className="mt-2 text-body">
              combined indicative value across your selected upgrades
              {answers.sv === "no" && " (excluding Solar Victoria — over the threshold)"}
              {answers.sv === "unsure" && " (we'll confirm your Solar Victoria eligibility)"}
              .
            </p>

            {/* Layer chips */}
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

        {/* Recommended upgrades */}
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
                  <UpgradeGlyph
                    icon={u.icon}
                    className="text-brand-ink [&>svg]:h-4 [&>svg]:w-4"
                  />
                  {u.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7">
          <IndicativeDisclaimer variant="full" />
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 text-sm font-medium text-text-muted underline underline-offset-4 hover:text-ink"
        >
          Start over
        </button>
      </div>

      {/* Lead capture */}
      <div>
        <h3 className="text-h3">
          {isBusiness ? "Book a site assessment" : "Confirm it with our team"}
        </h3>
        <p className="mt-2 text-body">
          Leave your details and an accredited team member will confirm exactly
          what you qualify for — and what you'd actually pay. No obligation.
        </p>
        <LeadForm
          context={`eligibility-quiz:${answers.audience ?? "unknown"}`}
          defaults={leadDefaults}
          submitLabel={isBusiness ? "Request a site assessment" : "Confirm my eligibility"}
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

function StepHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-h3 sm:text-[1.625rem]">{title}</h2>
      {hint && <p className="mt-2 text-body">{hint}</p>}
    </div>
  );
}
