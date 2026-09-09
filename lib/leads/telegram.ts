/**
 * Telegram notification for a new lead (Lead Backend Dev Handoff §7).
 *
 * One HTTP POST, no SDK. This is best-effort by design: the lead is already
 * committed to Supabase before this runs, so nothing in here may throw — the
 * caller records the outcome on the row and returns success either way.
 */

import { TIMEZONE, phoneKind } from "./validation";

const TELEGRAM_TIMEOUT_MS = 8000;

export interface TelegramLead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  postcode: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
}

export type TelegramResult = { sent: true } | { sent: false; error: string };

/**
 * `parse_mode: "HTML"` means any &, < or > a customer typed would corrupt the
 * message (or be silently dropped by Telegram). Escape everything interpolated.
 */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** "15 Sep 2026" — the date the customer picked, rendered as stored. */
function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** "4 Sep 2026, 3:45 PM AEST" — Melbourne time, never UTC. */
function formatTimestamp(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const zone = get("timeZoneName").replace("GMT+10", "AEST").replace("GMT+11", "AEDT");
  return `${get("day")} ${get("month")} ${get("year")}, ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()} ${zone}`;
}

/** Builds the §7.2 message. Exported so it can be unit-checked without sending. */
export function buildTelegramMessage(lead: TelegramLead): string {
  const kind = phoneKind(lead.phone);
  const lines: string[] = [
    "🔔 <b>NEW LEAD</b>",
    "",
    `👤 ${esc(lead.full_name)}`,
    // Flagged inline so nobody wastes a text on a landline.
    `📞 ${esc(lead.phone)}${kind === "landline" ? " (landline)" : ""}`,
    `📧 ${esc(lead.email)}`,
    `📍 ${lead.postcode ? esc(lead.postcode) : "Not provided"}`,
  ];

  if (lead.preferred_date && lead.preferred_time) {
    lines.push(`📅 ${formatDate(lead.preferred_date)} | ${esc(lead.preferred_time)}`);
  }
  // No notes means no line at all — never "Not provided".
  if (lead.notes) lines.push(`📝 ${esc(lead.notes)}`);

  // One-tap action to reach the lead. WhatsApp only for mobiles — a wa.me link
  // for a landline opens a chat nobody will ever answer, so landlines get a
  // dial link instead. Either way this is the team contacting the lead, not an
  // automated message.
  if (kind === "mobile") {
    // wa.me takes digits only, so the leading "+" is stripped.
    const waDigits = lead.phone.replace(/\D/g, "");
    lines.push("", `💬 <a href="https://wa.me/${waDigits}">Chat on WhatsApp</a>`);
  } else {
    lines.push("", `☎️ <a href="tel:${lead.phone}">Call ${esc(lead.phone)}</a>`);
  }

  if (lead.utm_source || lead.utm_campaign || lead.utm_content) {
    lines.push(
      "",
      `📊 Source: ${esc(lead.utm_source ?? "—")} | Campaign: ${esc(lead.utm_campaign ?? "—")} | Ad: ${esc(lead.utm_content ?? "—")}`,
    );
  }

  lines.push(
    `🕐 ${formatTimestamp(lead.created_at)}`,
    `🆔 <code>${esc(lead.id.slice(0, 8))}</code>`,
  );

  return lines.join("\n");
}

/**
 * Sends the notification. Never throws — every failure path returns
 * `{ sent: false, error }` for the caller to store in `telegram_error`.
 */
export async function sendTelegramNotification(
  lead: TelegramLead,
): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { sent: false, error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(lead),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      // Vercel Hobby functions are capped at 10s; a hanging Telegram call must
      // not be what burns it, since the lead is already saved.
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    });

    if (!res.ok) {
      // Telegram puts the useful part in the body ("chat not found", etc.).
      const detail = await res.text().catch(() => "");
      return {
        sent: false,
        error: `Telegram API returned status ${res.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
      };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}
