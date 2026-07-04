import { NextResponse } from "next/server";

/**
 * Lead intake for both flows that must be captured to Google Sheets:
 *   1. "Book an assessment"  (context = "book-an-assessment")
 *   2. Eligibility check     (context = "eligibility-quiz:<state>")
 *
 * The lead is POSTed to a Google Apps Script Web App, which appends a row to a
 * Google Sheet. Point the app at it with one env var — no code changes:
 *   LEADS_WEBHOOK_URL = https://script.google.com/macros/s/…/exec
 * If it's unset, the lead is logged and still accepted so the UI keeps working.
 *
 * Setup steps: see docs/LEADS-TO-GOOGLE-SHEETS.md
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The exact field set sent to the sheet (Apps Script maps these to columns).
const FIELDS = [
  "submittedAt",
  "type",
  "qualified",
  "name",
  "email",
  "phone",
  "postcode",
  "preferred_date",
  "preferred_time",
  "audience",
  "message",
  "context",
] as const;

type Lead = Record<(typeof FIELDS)[number], string>;

/**
 * Readable, sortable local timestamp in the business's timezone (Victoria),
 * e.g. "2026-07-04 19:30:00" — not a raw UTC "…Z" string. The sv-SE locale
 * conveniently formats as ISO-like `YYYY-MM-DD HH:mm:ss`.
 */
function nowLocal(): string {
  return new Date().toLocaleString("sv-SE", {
    timeZone: "Australia/Melbourne",
  });
}

function buildLead(body: Record<string, unknown>): Lead {
  const get = (k: string) => String(body[k] ?? "").trim();
  const context = get("context");
  const type = context.startsWith("eligibility")
    ? "eligibility"
    : context.startsWith("book-an-assessment")
      ? "booking"
      : "enquiry";
  // For eligibility leads, flag whether they passed all checks ("qualify").
  const qualified =
    type === "eligibility" ? String(context.endsWith("qualify")) : "";

  return {
    submittedAt: nowLocal(),
    type,
    qualified,
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    postcode: get("postcode"),
    preferred_date: get("preferred_date"),
    preferred_time: get("preferred_time"),
    audience: get("audience"),
    message: get("message"),
    context,
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const lead = buildLead(body);

  // Minimal server-side validation (mirrors the client).
  if (!lead.name || (!lead.email && !lead.phone)) {
    return NextResponse.json(
      { ok: false, error: "Missing name or contact" },
      { status: 422 },
    );
  }
  if (lead.email && !EMAIL_RE.test(lead.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
  }

  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) {
    // Not wired to Sheets yet — accept so the UI works, but make it visible.
    console.info("[leads] captured (LEADS_WEBHOOK_URL not set):", lead);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`Sheets webhook returned ${res.status}`);
  } catch (err) {
    // Don't lose the lead silently — log it so it can be recovered from logs.
    console.error("[leads] failed to send to Google Sheets:", err, lead);
    return NextResponse.json({ ok: false, error: "Storage failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
