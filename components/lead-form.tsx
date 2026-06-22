"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Shared lead-capture form (PRD §6 global element; reused by Eligibility,
 * Contact and inline CTAs). In the prototype it captures and shows a success
 * state — the real CRM/email/booking destination is a §9 "client to confirm"
 * item, so there's no live submit endpoint.
 */

export interface LeadFormDefaults {
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  audience?: "home" | "business";
  message?: string;
}

interface LeadFormProps {
  /** Where this instance lives — stored with the (mock) submission. */
  context: string;
  /** Pre-fill from upstream flows (e.g. the eligibility quiz). */
  defaults?: LeadFormDefaults;
  /** Optional summary block shown above the fields (e.g. quiz result). */
  summary?: React.ReactNode;
  submitLabel?: string;
  compact?: boolean;
  className?: string;
}

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadForm({
  context,
  defaults,
  summary,
  submitLabel = "Request my callback",
  compact = false,
  className,
}: LeadFormProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Please tell us your name.";
    if (!email && !phone) {
      next.email = "Add an email or phone so we can reach you.";
    } else if (email && !EMAIL_RE.test(email)) {
      next.email = "That email doesn't look right.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setSubmitting(true);
    // Prototype: no live endpoint. Simulate a network round-trip, then succeed.
    await new Promise((r) => setTimeout(r, 650));
    // eslint-disable-next-line no-console
    console.info("[lead-form] captured (prototype, not sent)", {
      context,
      ...Object.fromEntries(data.entries()),
    });
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-hairline bg-surface p-8 text-center",
          className,
        )}
        role="status"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/12 text-success">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-h3">You're all set.</h3>
        <p className="mx-auto mt-2 max-w-sm text-body">
          Thanks — we've got your details. One of our accredited team will be in
          touch shortly to confirm what you qualify for. No obligation.
        </p>
        <p className="mt-4 text-caption">
          Prototype note: this is a demo success state — no message was actually
          sent.
        </p>
      </div>
    );
  }

  const fieldCls =
    "w-full rounded-xl border bg-surface px-4 py-3 text-ink placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand/40";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "rounded-2xl border border-hairline bg-surface p-6 sm:p-8",
        className,
      )}
    >
      {summary && <div className="mb-6">{summary}</div>}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          defaultValue={defaults?.name}
          error={errors.name}
          required
          className={fieldCls}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={defaults?.email}
          error={errors.email}
          className={fieldCls}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={defaults?.phone}
          error={errors.phone}
          className={fieldCls}
        />
        <Field
          label="Postcode"
          name="postcode"
          inputMode="numeric"
          autoComplete="postal-code"
          defaultValue={defaults?.postcode}
          optional
          className={fieldCls}
        />
      </div>

      {!compact && (
        <div className="mt-4">
          <label
            htmlFor="lf-message"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Anything else?{" "}
            <span className="font-normal text-text-muted">(optional)</span>
          </label>
          <textarea
            id="lf-message"
            name="message"
            rows={3}
            defaultValue={defaults?.message}
            className={cn(fieldCls, "border-hairline resize-y")}
            placeholder="Which upgrades you're considering, timing, anything we should know…"
          />
        </div>
      )}

      <input type="hidden" name="context" value={context} />
      {defaults?.audience && (
        <input type="hidden" name="audience" value={defaults.audience} />
      )}

      <div className="mt-6 flex flex-col gap-4">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending…" : submitLabel}
        </Button>
        <p className="text-caption">
          By submitting you agree to be contacted about your enquiry. We'll never
          imply an upgrade is “free” — we'll show you what you'd actually pay. See
          our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            privacy notice
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  required,
  className,
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `lf-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}{" "}
        {optional && <span className="font-normal text-text-muted">(optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(className, error ? "border-danger" : "border-hairline")}
        {...rest}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
