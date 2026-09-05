import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateLead } from "@/lib/leads/validation";
import { sendTelegramNotification } from "@/lib/leads/telegram";
import { SITE } from "@/lib/site";

/**
 * Lead intake for both capture flows on the site:
 *   1. "Book an assessment"  (context = "book-an-assessment")
 *   2. Eligibility check     (context = "eligibility-quiz:<state>")
 *
 * Implements the Lead Backend Dev Handoff §5. The processing order in POST()
 * below is load-bearing: the Supabase insert is the point of no return. Once it
 * succeeds the lead is safe, and everything after it (Telegram now, WhatsApp in
 * Phase 2) is best-effort — those failures are recorded on the row and never
 * surface to the customer, who has already been told the booking went through.
 *
 * Required env (see .env.example):
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

/** Duplicate window: the same phone or email inside this many minutes is a re-submit. */
const DEDUPE_MINUTES = 5;

const SERVER_ERROR_MESSAGE = `Something went wrong on our end. Please try again or call us on ${SITE.phone}.`;

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status });
}

/**
 * The service role key bypasses RLS, which is the only way into this table —
 * `leads` has RLS on with no policies. It must never reach the browser, so it
 * is read here (server-only module) and the client is built per request rather
 * than at module scope, so a missing env var is a handled 500 and not a crash
 * at import time.
 */
function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Bare IPv4/IPv6 literals. Anything else is dropped rather than risked. */
const IP_RE = /^(?:\d{1,3}(?:\.\d{1,3}){3}|[0-9a-f:]+)$/i;

/**
 * Vercel puts the real client IP first in a comma-separated forwarding chain.
 * `ip_address` is INET, so a malformed header would make Postgres reject the
 * whole insert and lose the lead — a header we can't parse is simply omitted.
 */
function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const candidate =
    forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim();
  if (!candidate) return null;
  return IP_RE.test(candidate) ? candidate : null;
}

export async function POST(request: Request) {
  // 2 — Parse the body.
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("body is not an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return json(
      {
        success: false,
        error: "validation_error",
        message: "Please fix the following issues",
        fields: {},
      },
      400,
    );
  }

  // 3, 4 — Validate and normalise. Note that `source` and `status` are never
  // read from the body; they are hardcoded server-side at insert.
  const { values, errors } = validateLead(body);
  if (Object.keys(errors).length > 0) {
    return json(
      {
        success: false,
        error: "validation_error",
        message: "Please fix the following issues",
        fields: errors,
      },
      400,
    );
  }

  const supabase = supabaseAdmin();
  if (!supabase) {
    console.error("[leads] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
    return json(
      { success: false, error: "server_error", message: SERVER_ERROR_MESSAGE },
      500,
    );
  }

  // 5, 6 — Request metadata, read server-side only.
  const userAgent = request.headers.get("user-agent");
  const ipAddress = clientIp(request);

  // 7 — Duplicate detection: same phone OR same email inside the window.
  // Catches double-clicks, refresh-after-submit and accidental re-sends; a
  // genuine second enquiry tomorrow is deliberately still allowed through.
  // Two `.eq()` lookups rather than one `.or()` string: the latter would mean
  // interpolating customer input into a PostgREST filter expression, where a
  // comma or parenthesis in an address changes what the filter means. Both
  // queries are index-covered (idx_leads_phone, idx_leads_email).
  const since = new Date(Date.now() - DEDUPE_MINUTES * 60_000).toISOString();
  const [byPhone, byEmail] = await Promise.all([
    supabase
      .from("leads")
      .select("id")
      .eq("phone", values.phone)
      .gt("created_at", since)
      .limit(1),
    supabase
      .from("leads")
      .select("id")
      .eq("email", values.email)
      .gt("created_at", since)
      .limit(1),
  ]);

  if (byPhone.error || byEmail.error) {
    console.error("[leads] duplicate check failed:", byPhone.error ?? byEmail.error);
    return json(
      { success: false, error: "server_error", message: SERVER_ERROR_MESSAGE },
      500,
    );
  }
  if ((byPhone.data?.length ?? 0) > 0 || (byEmail.data?.length ?? 0) > 0) {
    return json(
      {
        success: false,
        error: "duplicate_submission",
        message:
          "This assessment request has already been submitted. We will be in touch shortly.",
      },
      409,
    );
  }

  // 8, 9 — Insert. A failure here is a hard failure: the database is the source
  // of truth, and we will not tell someone we have their booking when we don't.
  const { data: lead, error: insertError } = await supabase
    .from("leads")
    .insert({
      ...values,
      source: "website",
      status: "new",
      user_agent: userAgent,
      ip_address: ipAddress,
    })
    .select("id, created_at")
    .single();

  if (insertError || !lead) {
    console.error("[leads] insert failed:", insertError, values);
    return json(
      { success: false, error: "server_error", message: SERVER_ERROR_MESSAGE },
      500,
    );
  }

  // 10 — Telegram. Best effort; the outcome is recorded, never returned.
  const telegram = await sendTelegramNotification({
    id: lead.id,
    created_at: lead.created_at,
    full_name: values.full_name,
    email: values.email,
    phone: values.phone,
    postcode: values.postcode,
    preferred_date: values.preferred_date,
    preferred_time: values.preferred_time,
    notes: values.notes,
    utm_source: values.utm_source,
    utm_campaign: values.utm_campaign,
    utm_content: values.utm_content,
  });

  const { error: notifyUpdateError } = await supabase
    .from("leads")
    .update(
      telegram.sent
        ? { telegram_sent: true, telegram_error: null }
        : { telegram_sent: false, telegram_error: telegram.error },
    )
    .eq("id", lead.id);

  if (!telegram.sent) {
    console.error("[leads] telegram notification failed:", telegram.error);
  }
  if (notifyUpdateError) {
    // The lead is saved and the notification result is in the logs; a failure
    // to write the flag back is not worth failing the request over.
    console.error("[leads] telegram status writeback failed:", notifyUpdateError);
  }

  // ===== WHATSAPP INTEGRATION (PHASE 2) =====
  // When WhatsApp Cloud API is configured:
  // 1. Read WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN from environment variables
  // 2. Send a template message to the lead's phone number
  // 3. On success: UPDATE leads SET whatsapp_sent = true WHERE id = lead_id
  // 4. On failure: UPDATE leads SET whatsapp_error = error.message WHERE id = lead_id
  // 5. Never throw from this block — same fire-and-forget pattern as Telegram
  // ===== END WHATSAPP PLACEHOLDER =====

  // 12 — Success. The customer is told the lead landed, which it has.
  return json(
    {
      success: true,
      lead_id: lead.id,
      message:
        "Your assessment request has been submitted. We will confirm your booking shortly.",
    },
    201,
  );
}

/** 1 — Anything that is not a POST (handoff §5.3). */
function methodNotAllowed() {
  return json(
    {
      success: false,
      error: "method_not_allowed",
      message: "Only POST requests are accepted",
    },
    405,
  );
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
