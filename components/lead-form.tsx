"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { BookingDateTime } from "@/components/booking-datetime";
import { readUtmData } from "@/components/utm-capture";
import { trackConversion, type PixelConversion } from "@/components/meta-pixel";
import { validateLead, type LeadFieldErrors } from "@/lib/leads/validation";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Shared lead-capture form. Both live capture flows render it — the booking
 * page and the end of the eligibility quiz — and both POST to `/api/leads`,
 * which validates independently and writes to Supabase.
 *
 * Client-side validation runs the same `validateLead` the server does, so the
 * user sees every problem at once without a round trip; the server result still
 * wins, and a 400 repaints the field errors from the response.
 *
 * Spam-proofed without a CAPTCHA (AEM handoff §5): a honeypot field bots tend
 * to fill, and a timing gate that rejects near-instant submits. Duplicate
 * submissions are caught server-side by a 5-minute phone/email window.
 */

/** Submits faster than this (ms) after mount are treated as bots. */
const MIN_FILL_MS = 2000;

/** Give up on the request after this and show the error banner (handoff §6.2). */
const REQUEST_TIMEOUT_MS = 15_000;

const ERROR_MESSAGE = `Something went wrong. Please try again, or call us directly on ${SITE.phone}.`;
const DUPLICATE_MESSAGE =
  "It looks like this request was already submitted. We will be in touch shortly to confirm your booking.";

export interface LeadFormDefaults {
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  audience?: "home" | "business";
  message?: string;
}

interface LeadFormProps {
  /** Where this instance lives — stored on the lead as `context`. */
  context: string;
  /** Meta Pixel event fired only after the lead is accepted by /api/leads. */
  conversion: PixelConversion;
  /** Pre-fill from upstream flows (e.g. the eligibility quiz). */
  defaults?: LeadFormDefaults;
  /** Booking mode — adds the preferred date + time-slot picker. */
  booking?: boolean;
  submitLabel?: string;
  compact?: boolean;
  className?: string;
}

/** What the user typed, keyed by the API's field names. */
type Banner = { kind: "error" | "duplicate"; text: string } | null;

/** "15 September 2026" — echoed back in the success message. */
function formatLongDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${isoDate}T00:00:00Z`));
  } catch {
    return isoDate;
  }
}

export function LeadForm({
  context,
  conversion,
  defaults,
  booking = false,
  submitLabel = "Request my callback",
  compact = false,
  className,
}: LeadFormProps) {
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [banner, setBanner] = useState<Banner>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ firstName: string; date: string | null } | null>(
    null,
  );
  const mountedAt = useRef(Date.now());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Spam layer 1 — honeypot: a hidden field only bots fill. If set, pretend
    // success and silently drop (don't tip off the bot).
    if (String(data.get("company_website") ?? "").trim() !== "") {
      setDone({ firstName: "", date: null });
      return;
    }
    // Spam layer 2 — timing gate: humans take longer than this to fill a form.
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setDone({ firstName: "", date: null });
      return;
    }

    // Map the form's field names onto the API's, then run the shared rules.
    const payload: Record<string, unknown> = {
      full_name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      postcode: data.get("postcode"),
      preferred_date: data.get("preferred_date"),
      preferred_time: data.get("preferred_time"),
      notes: data.get("message"),
      context,
      audience: data.get("audience"),
    };

    const { values, errors: clientErrors } = validateLead(payload);
    // Only booking instances collect a date and time; don't demand them elsewhere.
    if (!booking) {
      delete clientErrors.preferred_date;
      delete clientErrors.preferred_time;
    }
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setBanner(null);
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    // Disabled before any async work starts, so a double-click can't get through.
    setSubmitting(true);
    setBanner(null);

    const { utm, landingPage } = readUtmData();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        body: JSON.stringify({
          ...values,
          ...utm,
          landing_page_url: landingPage,
          page_url: window.location.href,
          referrer: document.referrer,
        }),
      });

      if (res.status === 201) {
        trackConversion(conversion);
        setDone({
          firstName: values.full_name.split(" ")[0] || values.full_name,
          date: values.preferred_date,
        });
        return;
      }

      const body = await res.json().catch(() => null);

      if (res.status === 400 && body?.fields) {
        // The server found something the client didn't. Repaint the fields and
        // leave every value the user typed exactly where it is.
        setErrors(body.fields as LeadFieldErrors);
        form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      } else if (res.status === 409) {
        setBanner({ kind: "duplicate", text: body?.message ?? DUPLICATE_MESSAGE });
      } else {
        setBanner({ kind: "error", text: ERROR_MESSAGE });
      }
    } catch {
      // Network failure, or the 15s timeout fired.
      setBanner({ kind: "error", text: ERROR_MESSAGE });
    } finally {
      setSubmitting(false);
    }
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
        <h3 className="mt-5 text-h3">
          {done.firstName ? `Thank you, ${done.firstName}.` : "You're all set."}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-body">
          {done.date
            ? `Your assessment request for ${formatLongDate(done.date)} has been submitted. An accredited team member will confirm your booking shortly.`
            : "Thanks, we've got your details. An accredited team member will confirm your booking shortly."}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-caption">
          If you need to reach us sooner, call{" "}
          <a href={SITE.phoneHref} className="underline underline-offset-2">
            {SITE.phone}
          </a>
          .
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
      {banner && (
        <div
          role={banner.kind === "error" ? "alert" : "status"}
          className={cn(
            "mb-6 rounded-xl border px-4 py-3 text-sm",
            banner.kind === "error"
              ? "border-danger bg-danger/10 text-danger"
              : "border-hairline bg-surface-muted text-ink",
          )}
        >
          {banner.text}
        </div>
      )}

      {booking && (
        <div className="mb-6 border-b border-hairline pb-6">
          <BookingDateTime
            dateError={errors.preferred_date}
            timeError={errors.preferred_time}
          />
        </div>
      )}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          defaultValue={defaults?.name}
          error={errors.full_name}
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
          required
          className={fieldCls}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={defaults?.phone}
          error={errors.phone}
          required
          className={fieldCls}
        />
        <Field
          label="Postcode"
          name="postcode"
          inputMode="numeric"
          autoComplete="postal-code"
          defaultValue={defaults?.postcode}
          error={errors.postcode}
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
            aria-invalid={errors.notes ? "true" : undefined}
            aria-describedby={errors.notes ? "lf-message-err" : undefined}
            className={cn(
              fieldCls,
              "resize-y",
              errors.notes ? "border-danger" : "border-hairline",
            )}
            placeholder="Which upgrades you're considering, timing, anything we should know…"
          />
          {errors.notes && (
            <p id="lf-message-err" className="mt-1.5 text-sm text-danger">
              {errors.notes}
            </p>
          )}
        </div>
      )}

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="lf-company-website">Company website</label>
        <input
          id="lf-company-website"
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {defaults?.audience && (
        <input type="hidden" name="audience" value={defaults.audience} />
      )}

      <div className="mt-6 flex flex-col gap-4">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Submitting…" : submitLabel}
        </Button>
        <p className="text-caption">
          By submitting this form, you consent to AEM Energy contacting you by
          phone, SMS and email regarding your enquiry and related energy upgrade
          products and services. See our{" "}
          <a href="/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </a>{" "}
          for details.
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
