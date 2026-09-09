/**
 * Lead validation and normalisation — the single source of truth for both ends
 * of the wire. `app/api/leads/route.ts` runs this on every request (the server
 * never trusts the client), and `components/lead-form.tsx` runs the same
 * functions before submitting so the user sees errors without a round trip.
 *
 * Rules are from the Lead Backend Dev Handoff §5.4. Where the handoff gives an
 * exact user-facing message, it is reproduced verbatim.
 */

/**
 * The four assessment windows. Defined here rather than in the picker so the
 * server's allow-list and the buttons the user sees can never drift apart —
 * the handoff calls out the en dash (–, not a hyphen) as load-bearing.
 */
export const TIME_SLOTS = [
  { label: "8:00 AM – 11:00 AM", startHour: 8 },
  { label: "11:00 AM – 2:00 PM", startHour: 11 },
  { label: "2:00 PM – 5:00 PM", startHour: 14 },
  { label: "5:00 PM – 8:00 PM", startHour: 17 },
] as const;

export const TIME_SLOT_LABELS: readonly string[] = TIME_SLOTS.map((s) => s.label);

/** Bookings are accepted from today up to this many days ahead. */
export const MAX_DAYS_AHEAD = 90;

/**
 * The business's timezone. Date bounds are evaluated here, not in UTC: at 11pm
 * on the 4th in Melbourne it is already the 5th in UTC, and "today" must still
 * mean the 4th for the person filling in the form.
 */
export const TIMEZONE = "Australia/Melbourne";

/** Columns the API route accepts from the client. Everything else is ignored. */
export interface LeadFields {
  full_name: string;
  email: string;
  phone: string;
  postcode: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  context: string | null;
  audience: string | null;
  landing_page_url: string | null;
  page_url: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

export type LeadFieldErrors = Partial<Record<keyof LeadFields, string>>;

export interface ValidationResult {
  values: LeadFields;
  errors: LeadFieldErrors;
}

/* ------------------------------------------------------------------ helpers */

function asString(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}

/** Optional text columns store NULL, never an empty string (handoff §5.2). */
function nullIfEmpty(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : t;
}

/** Basic XSS defence — the database stores plain text only (handoff §9.5). */
function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, "");
}

/** System-captured URL/UTM values: trim, cap length, empty becomes NULL. */
function capturedValue(v: unknown): string | null {
  const t = nullIfEmpty(stripTags(asString(v)));
  return t === null ? null : t.slice(0, 2000);
}

/** Today's date in Melbourne as YYYY-MM-DD. `en-CA` formats as ISO. */
export function todayInMelbourne(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function isRealIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  // Round-trips only if the day actually exists (rejects 2026-02-31).
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/* -------------------------------------------------------------- field rules */

/** Letters (any script, incl. accents), spaces, hyphens and apostrophes only. */
const NAME_RE = /^[\p{L}][\p{L}\p{M} '’-]*$/u;

export function normaliseName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/**
 * Conservative address charset. Commas, quotes and parentheses are all legal in
 * an RFC 5322 address but never appear in one a customer types, and they are
 * exactly the characters that would change the meaning of a downstream filter
 * expression — so they are rejected here rather than defended against later.
 */
const EMAIL_CHARS_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~.@-]+$/;

export function isValidEmail(email: string): boolean {
  if (email.length > 254 || !EMAIL_CHARS_RE.test(email)) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (local.length < 1 || !domain.includes(".")) return false;
  return domain.slice(domain.lastIndexOf(".") + 1).length >= 2;
}

export type PhoneKind = "mobile" | "landline";

/**
 * Australian numbers are always 10 digits nationally: a leading 0, then a
 * single prefix digit, then eight subscriber digits.
 *
 *   04xx xxx xxx   mobile
 *   02 xxxx xxxx   landline — NSW/ACT
 *   03 xxxx xxxx   landline — VIC/TAS
 *   07 xxxx xxxx   landline — QLD
 *   08 xxxx xxxx   landline — SA/WA/NT
 *
 * So the prefix digit is one of 2, 3, 4, 7, 8 and everything else is invalid —
 * which is what rejects 01, 05, 06, 09 and the 13/1300/1800 service ranges.
 */
const PHONE_PREFIX = "[23478]";

/** Local form: leading 0, ten digits total. `0412345678`, `0398765432`. */
const AU_LOCAL_RE = new RegExp(`^0(${PHONE_PREFIX}\\d{8})$`);

/**
 * International form, with or without the `+`, and tolerating the leading 0
 * that people often leave in when they add the country code by hand
 * (`+61 0412 345 678`). That input is unambiguous, and rejecting it would cost
 * conversions on an ad-driven form for no benefit.
 */
const AU_INTERNATIONAL_RE = new RegExp(`^\\+?610?(${PHONE_PREFIX}\\d{8})$`);

/**
 * Normalises an Australian mobile or landline to `+61XXXXXXXXX` — exactly 12
 * characters, `+61` followed by the nine national digits with the trunk 0
 * dropped. Returns null if it is not a valid Australian number.
 *
 * The 12-character shape is depended on downstream: the duplicate-detection
 * window matches on it exactly, and the Telegram notification strips the `+`
 * to build a `wa.me` link.
 */
export function normalisePhone(raw: string): string | null {
  const s = raw.replace(/[\s\-().]/g, "");
  const match = AU_LOCAL_RE.exec(s) ?? AU_INTERNATIONAL_RE.exec(s);
  return match ? `+61${match[1]}` : null;
}

/**
 * Mobile or landline, from an already-normalised number. Worth knowing before
 * offering to text or WhatsApp someone — a landline will never answer either.
 */
export function phoneKind(normalised: string): PhoneKind {
  return normalised.startsWith("+614") ? "mobile" : "landline";
}

/** Victorian postcodes: 3000–3999 and 8000–8999. */
export function isVictorianPostcode(pc: string): boolean {
  if (!/^\d{4}$/.test(pc)) return false;
  const n = Number(pc);
  return (n >= 3000 && n <= 3999) || (n >= 8000 && n <= 8999);
}

/* ----------------------------------------------------------------- validate */

/**
 * Validates and normalises one submission.
 *
 * `values` is always fully populated so a caller can insert it directly once
 * `errors` is empty; fields that failed carry their normalised-so-far value.
 * All failing fields are reported at once — the user fixes everything in one
 * pass rather than playing whack-a-mole (handoff §9.3).
 */
export function validateLead(body: Record<string, unknown>): ValidationResult {
  const errors: LeadFieldErrors = {};

  // full_name
  const fullName = normaliseName(stripTags(asString(body.full_name)));
  if (fullName.length < 2 || fullName.length > 200 || !NAME_RE.test(fullName)) {
    errors.full_name =
      "Please enter your full name (letters only, at least 2 characters)";
  }

  // email
  const email = asString(body.email).trim().toLowerCase();
  if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  // phone
  const rawPhone = asString(body.phone).trim();
  const phone = normalisePhone(rawPhone);
  if (!phone) {
    errors.phone =
      "Please enter a valid Australian phone number — mobile (04xx xxx xxx) or landline (02, 03, 07, 08)";
  }

  // postcode — optional, but Victorian when supplied
  const rawPostcode = nullIfEmpty(asString(body.postcode));
  let postcode: string | null = rawPostcode;
  if (rawPostcode !== null && !isVictorianPostcode(rawPostcode)) {
    errors.postcode =
      "Please enter a valid Victorian postcode (3000-3999 or 8000-8999)";
    postcode = rawPostcode;
  }

  // preferred_date — today .. +90 days, evaluated in Melbourne
  const preferredDate = nullIfEmpty(asString(body.preferred_date));
  if (preferredDate === null) {
    errors.preferred_date = "Please select a preferred date";
  } else if (!isRealIsoDate(preferredDate)) {
    errors.preferred_date = "Please select a date from today to 90 days ahead";
  } else {
    const today = todayInMelbourne();
    // ISO dates compare correctly as strings.
    if (preferredDate < today || preferredDate > addDays(today, MAX_DAYS_AHEAD)) {
      errors.preferred_date = "Please select a date from today to 90 days ahead";
    }
  }

  // preferred_time — must be one of the four exact labels
  const preferredTime = nullIfEmpty(asString(body.preferred_time));
  if (preferredTime === null || !TIME_SLOT_LABELS.includes(preferredTime)) {
    errors.preferred_time = "Please select a preferred time slot";
  }

  // notes — optional, 1000 chars, tags stripped
  const notesRaw = nullIfEmpty(stripTags(asString(body.notes)));
  if (notesRaw !== null && notesRaw.length > 1000) {
    errors.notes = "Notes must be under 1000 characters";
  }

  return {
    values: {
      full_name: fullName,
      email,
      phone: phone ?? rawPhone,
      postcode,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      notes: notesRaw,
      context: capturedValue(body.context),
      audience: capturedValue(body.audience),
      landing_page_url: capturedValue(body.landing_page_url),
      page_url: capturedValue(body.page_url),
      referrer: capturedValue(body.referrer),
      utm_source: capturedValue(body.utm_source),
      utm_medium: capturedValue(body.utm_medium),
      utm_campaign: capturedValue(body.utm_campaign),
      utm_content: capturedValue(body.utm_content),
      utm_term: capturedValue(body.utm_term),
    },
    errors,
  };
}
