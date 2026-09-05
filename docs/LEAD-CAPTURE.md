# Lead capture — how it works, end to end

Every lead the site captures follows one path: form → `/api/leads` → Supabase →
Telegram. This document covers that path, the setup it needs, and the decisions
that shaped it.

Implements `AEM_Lead_Backend_Dev_Handoff.md`. Where this build deviates from
that document, the deviation is called out and justified — see
[Deviations from the handoff](#deviations-from-the-handoff).

For the Telegram bot and channel setup specifically, work through
[`TELEGRAM-SETUP.md`](./TELEGRAM-SETUP.md).

---

## 1. The flow

```
User clicks an ad (Meta / Instagram / Google)
    │
    ▼
Lands on the site, URL carries ?utm_source=…&utm_campaign=…
    │
    ▼
<UtmCapture> snapshots all five UTM params + the full landing URL
into sessionStorage                        components/utm-capture.tsx
    │
    ▼
User browses, reaches a form (the params are long gone from the URL)
    │
    ▼
Fills it in, clicks submit
    │
    ▼
Client-side validation runs the same rules the server will
                                           lib/leads/validation.ts
    │  ✗ errors → shown next to each field, nothing sent
    ▼  ✓
Button disables, reads UTM data back out of sessionStorage
    │
    ▼
POST /api/leads  (15s timeout)             components/lead-form.tsx
    │
    ▼
┌─────────────────────────────────────────┐
│ 1  method is POST?           else 405    │
│ 2  body parses as JSON?      else 400    │
│ 3  validate every field      else 400    │  app/api/leads/route.ts
│ 4  normalise + sanitise                  │
│ 5  read user-agent from headers          │
│ 6  read IP from x-forwarded-for          │
│ 7  duplicate in last 5 min?  else 409    │
│ 8  INSERT into Supabase      else 500  ◄─┼── point of no return
│ 9  read back id + created_at             │
│ 10 send Telegram (best effort)           │
│ 11 [Phase 2 — WhatsApp placeholder]      │
│ 12 return 201 + lead_id                  │
└─────────────────────────────────────────┘
    │
    ▼
Form is replaced by the success message
```

**Step 8 is the point of no return.** Once the insert succeeds the lead is safe
and the customer is told so. Steps 10 and 11 are best-effort: their failures are
recorded on the row (`telegram_error`) and never surface to the customer or
change the response. The inverse also holds — if the insert fails, the customer
sees an error and a phone number, because we will not claim to have a booking we
don't have.

### Where leads come from

Two live forms, both rendering `components/lead-form.tsx` in `booking` mode, so
both send a preferred date and time slot:

| Route | `context` value | How a visitor reaches it |
|---|---|---|
| `/book-an-assessment` | `book-an-assessment` | Header CTA, mobile sticky bar, product and upgrade pages |
| `/check-eligibility` | `eligibility-quiz:<state>` | Business page → "Book a site assessment" |

`<state>` is the quiz outcome: `qualify`, `partial`, or `outside-scope`.

`/contact` has no form — it links to WhatsApp. The floating WhatsApp chat widget
(`components/whatsapp-fab.tsx`) collects name, suburb, products and ownership
but **does not post to this API**; that data exists only in WhatsApp. See
[Known gaps](#known-gaps).

---

## 2. Setup

### Environment variables

Copy `.env.example` to `.env.local` and fill it in. The same four go into
Vercel → Project Settings → Environment Variables.

```env
SUPABASE_URL=https://kgntyyxlxvzrlbjzabmi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=      # Dashboard → Project Settings → API Keys → service_role
TELEGRAM_BOT_TOKEN=             # @BotFather
TELEGRAM_CHAT_ID=               # channel id, negative, starts with -100
```

> **`SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security.** It is the only
> way into the `leads` table. Never prefix it with `NEXT_PUBLIC_`, never import
> it from a client component, never commit a filled-in `.env.local` (it is
> gitignored via `.env*.local`).

**Changing env vars in Vercel does not trigger a deployment.** Redeploy manually
or they won't take effect.

### Install

```bash
npm install          # @supabase/supabase-js is the only added dependency
npm run dev
```

---

## 3. Database

One table, `public.leads`, in project `kgntyyxlxvzrlbjzabmi`. Created by the
`create_leads_table` migration.

| Column | Type | Set by | Notes |
|---|---|---|---|
| `id` | uuid | database | `gen_random_uuid()`, never set manually |
| `created_at` | timestamptz | database | UTC, never the client's clock |
| `full_name` | text | customer | trimmed, spaces collapsed, letters only |
| `email` | text | customer | trimmed, lowercased |
| `phone` | text | customer | normalised to `+614XXXXXXXX` |
| `postcode` | text | customer | nullable, Victorian ranges only |
| `preferred_date` | date | customer | nullable, ISO, today → +90 days |
| `preferred_time` | text | customer | nullable, one of four exact labels |
| `notes` | text | customer | nullable, ≤1000 chars, HTML stripped |
| `source` | text | **server** | hardcoded `'website'`, never read from the body |
| `context` | text | client | which form produced the lead |
| `audience` | text | client | `home` / `business`, from the quiz |
| `landing_page_url` | text | client | first page of the session, with UTMs |
| `page_url` | text | client | URL at submit time |
| `referrer` | text | client | `document.referrer` |
| `user_agent` | text | **server** | request header |
| `ip_address` | inet | **server** | first entry of `x-forwarded-for` |
| `utm_source` … `utm_term` | text | client | five columns, all nullable |
| `status` | text | **server** | hardcoded `'new'` on creation |
| `telegram_sent` | boolean | server | default `false` |
| `telegram_error` | text | server | why the notification failed |
| `whatsapp_sent` / `whatsapp_error` | boolean / text | server | Phase 2, unused |

Anything the client sends for `source`, `status`, `user_agent`, `ip_address` or
the notification columns is ignored — those are set server-side only.

### Indexes

`(email, created_at desc)` and `(phone, created_at desc)` serve duplicate
detection; `status`, `(source, created_at desc)`, `(utm_campaign, created_at
desc)` and `(context, created_at desc)` serve reporting.

### Security posture

RLS is **enabled with no policies**. `service_role` bypasses RLS entirely;
every other role matches no policy and can read and write nothing. Default table
grants to `anon` and `authenticated` are additionally revoked.

Supabase's linter reports `rls_enabled_no_policy` as INFO for this table. That
is expected and correct — it is the posture we want, not a finding.

### Viewing leads

Supabase Dashboard → Table Editor → `leads`. There is no admin UI; that is out
of scope for this build.

```sql
-- today's leads
select created_at, full_name, phone, preferred_date, preferred_time, context
from leads
where created_at > now() - interval '1 day'
order by created_at desc;

-- notifications that failed
select id, created_at, full_name, telegram_error
from leads
where telegram_sent = false and telegram_error is not null;

-- campaign performance
select utm_campaign, utm_content, count(*)
from leads
where utm_campaign is not null
group by 1, 2
order by 3 desc;
```

---

## 4. API — `POST /api/leads`

### Request

```json
{
  "full_name": "John Smith",
  "email": "john@example.com",
  "phone": "0412 345 678",
  "postcode": "3000",
  "preferred_date": "2026-09-15",
  "preferred_time": "8:00 AM – 11:00 AM",
  "notes": "Interested in solar for our 4-bedroom home",
  "context": "book-an-assessment",
  "audience": "home",
  "landing_page_url": "https://aemenergy.com.au/?utm_source=facebook&…",
  "page_url": "https://aemenergy.com.au/book-an-assessment",
  "referrer": "https://www.facebook.com/",
  "utm_source": "facebook",
  "utm_medium": "cpc",
  "utm_campaign": "spring_solar",
  "utm_content": "carousel_v2",
  "utm_term": ""
}
```

Required: `full_name`, `email`, `phone`, `preferred_date`, `preferred_time`.
Everything else may be absent, `null`, or `""`. Optional strings that arrive
empty or whitespace-only are stored as `NULL`, never as `""`.

### Responses

| Status | `error` | When |
|---|---|---|
| 201 | — | Lead saved. Body carries `lead_id`. |
| 400 | `validation_error` | One or more fields invalid. Body carries `fields`. |
| 409 | `duplicate_submission` | Same phone or email within 5 minutes. |
| 500 | `server_error` | Supabase unreachable or misconfigured. Lead not saved. |
| 405 | `method_not_allowed` | Anything other than POST. |

```jsonc
// 201
{ "success": true,
  "lead_id": "a1b2c3d4-…",
  "message": "Your assessment request has been submitted. We will confirm your booking shortly." }

// 400 — `fields` maps field name to a message the UI shows inline
{ "success": false,
  "error": "validation_error",
  "message": "Please fix the following issues",
  "fields": { "email": "Please enter a valid email address",
              "phone": "Please enter a valid Australian mobile number (starting with 04 or +614)" } }
```

Every failing field is reported at once, so the user fixes everything in one
pass rather than playing whack-a-mole.

### Validation rules

Defined once in `lib/leads/validation.ts` and run on **both** sides — the client
for instant feedback, the server because client validation is never trusted.

| Field | Rule | Message on failure |
|---|---|---|
| `full_name` | trim, collapse spaces, 2–200 chars, letters (incl. accents) + spaces + hyphens + apostrophes. Digits and `@` rejected. | `Please enter your full name (letters only, at least 2 characters)` |
| `email` | trim, lowercase, ≤254, one `@`, a dot in the domain, ≥2-char TLD | `Please enter a valid email address` |
| `phone` | strip spaces/hyphens/parens/dots; accept `04XXXXXXXX`, `614XXXXXXXX`, `+614XXXXXXXX`; store `+614XXXXXXXX` | `Please enter a valid Australian mobile number (starting with 04 or +614)` |
| `postcode` | optional → `NULL`. If given: 4 digits, 3000–3999 or 8000–8999 | `Please enter a valid Victorian postcode (3000-3999 or 8000-8999)` |
| `preferred_date` | ISO `YYYY-MM-DD`, today → +90 days **in Australia/Melbourne** | `Please select a date from today to 90 days ahead` |
| `preferred_time` | exactly one of the four labels below | `Please select a preferred time slot` |
| `notes` | optional → `NULL`. Trim, ≤1000 chars, HTML tags stripped | `Notes must be under 1000 characters` |
| UTM + URL fields | trim, ≤2000 chars, empty → `NULL`. No other validation. | — |

The four time slots, **en dash (–) not hyphen**:

```
8:00 AM – 11:00 AM
11:00 AM – 2:00 PM
2:00 PM – 5:00 PM
5:00 PM – 8:00 PM
```

They are defined once in `lib/leads/validation.ts` and imported by both the
picker and the server allow-list, so the buttons and the validator cannot drift.

**Timezone matters for dates.** At 11pm on the 4th in Melbourne it is already
the 5th in UTC. "Today" is evaluated in `Australia/Melbourne` so a late-evening
booking for today is not rejected as being in the past.

### Duplicate detection

Before inserting, the route looks for a lead with the same normalised phone
**or** the same lowercased email created in the last 5 minutes. If one exists,
it returns 409 and inserts nothing.

This catches double-clicks, refresh-after-submit and accidental re-sends. It
deliberately does **not** stop the same person enquiring again tomorrow.

---

## 5. UTM attribution

`components/utm-capture.tsx` mounts in the root layout, so it runs on every page.

**First touch wins.** The moment a URL carries any UTM parameter, all five plus
the full landing URL are snapshotted to `sessionStorage`. A later page without
UTMs leaves that snapshot alone — someone who clicks an ad, browses for ten
minutes, and then books is still credited to the ad that brought them.

```
aem_utm_data      {"utm_source":"facebook","utm_medium":"cpc", … }
aem_landing_page  https://aemenergy.com.au/?utm_source=facebook&…
```

**sessionStorage, not localStorage, on purpose.** Attribution should die with
the tab. A visitor who returns organically next week must not be credited to
last week's campaign.

Partial parameters are fine: `?utm_source=facebook` with no campaign stores the
source and leaves the rest `null`. A missing parameter never discards the others.

Every read and write is wrapped in try/catch — private browsing and disabled
storage must not break the page. Attribution is best-effort; the lead is not.

> The capture reads `window.location.search` inside an effect keyed on
> `usePathname()`, deliberately **not** `useSearchParams()`. Reading search
> params in the root layout would opt every page in the site out of static
> rendering.

---

## 6. Telegram notification

One HTTP POST to the Bot API. No SDK, no webhook, no polling.

Setup — creating the bot, creating the channel, getting both keys, and verifying
it end to end — is [`TELEGRAM-SETUP.md`](./TELEGRAM-SETUP.md). This section
covers what the app sends and how it behaves.

### Message format

```
🔔 NEW LEAD

👤 John Smith
📞 +61412345678
📧 john@example.com
📍 3000
📅 15 Sep 2026 | 8:00 AM – 11:00 AM
📝 Interested in solar for our 4-bedroom home

💬 Chat on WhatsApp          ← tap to open WhatsApp with this lead

📊 Source: facebook | Campaign: spring_solar | Ad: carousel_v2
🕐 4 Sep 2026, 3:45 PM AEST
🆔 a1b2c3d4
```

- No notes → the 📝 line is omitted entirely, not shown as "Not provided".
- No UTM data → the 📊 line is omitted entirely.
- No postcode → 📍 shows `Not provided`.
- The timestamp is Melbourne time, never UTC.
- 🆔 is the first 8 characters of the UUID; the full one is in the database.
- The WhatsApp link is `wa.me/<digits>` — the team contacting the lead, not an
  automated message to them.

Everything interpolated is HTML-escaped, since `parse_mode: "HTML"` means a `&`
or `<` in a customer's note would otherwise corrupt or truncate the message.

### Failure handling

The send is wrapped in try/catch with an 8-second timeout (Vercel Hobby
functions are capped at 10s, and a hanging Telegram call must not be what burns
it). On success the row gets `telegram_sent = true`; on any failure it gets
`telegram_error`. Either way the customer sees success, because the lead is
already saved.

If Telegram is down, leads still arrive — check the table.

---

## 7. Deployment

1. Push to `main`.
2. Vercel auto-deploys.
3. Add all four environment variables in Vercel → Settings → Environment Variables.
4. **Redeploy** — env changes alone do not trigger one.
5. Submit a real form on the production URL.
6. Confirm the row in Supabase and the message in Telegram.

The work is not done until a real submission on the live URL has produced both.

---

## 8. Testing checklist

Run against the deployed site, not just localhost.

**Happy path**
- [ ] Submit with every field filled → row in Supabase, Telegram message, UUID and timestamp present
- [ ] Submit with postcode and notes blank → both `NULL`, notification still arrives, 📝 line absent

**Attribution**
- [ ] Open with `?utm_source=test&utm_medium=cpc&utm_campaign=test_campaign&utm_content=test_ad`
- [ ] Navigate to a form page (URL no longer carries the params) and submit
- [ ] All five UTM columns populated; `landing_page_url` holds the original URL
- [ ] Open with no UTMs and submit → all UTM columns `NULL`, 📊 line absent

**Validation** — each should block submission and show the error inline
- [ ] Empty name
- [ ] `notanemail`
- [ ] Landline `0398765432`
- [ ] A past date
- [ ] No time slot selected
- [ ] Non-Victorian postcode `2000`
- [ ] Several at once → **all** errors visible simultaneously

**Duplicates**
- [ ] Submit successfully, then re-submit the same email and phone within a minute → 409, informational banner, still exactly one row
- [ ] Wait 6 minutes, submit again → a second row is created

**Failure handling**
- [ ] Set `TELEGRAM_BOT_TOKEN` to garbage, redeploy, submit → user sees success, row exists, `telegram_sent = false`, `telegram_error` populated
- [ ] Restore the token → `telegram_sent = true`

**Edge cases**
- [ ] `José García` stores correctly
- [ ] `+61 412 345 678` and `0412345678` both normalise to `+61412345678`
- [ ] A 500-character note is accepted; a 1001-character one is rejected
- [ ] Tap the WhatsApp link in the Telegram message → opens a chat with the lead

---

## 9. Troubleshooting

| Symptom | Cause |
|---|---|
| Every submission returns 500 | `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` missing or wrong. Check Vercel, then redeploy. |
| Leads save, no Telegram message | Read `telegram_error` on the row — it holds the API's own words. |
| `chat not found` in `telegram_error` | Bot is not an admin of the channel, or the chat ID is wrong. |
| Chat ID looks right but fails | Channel IDs need the full `-100…` prefix and the minus sign. |
| UTM columns always `NULL` | sessionStorage blocked (private browsing), or the landing URL never carried UTMs. |
| Valid Melbourne date rejected as past | Server clock or timezone handling — dates are evaluated in `Australia/Melbourne`. |
| 409 on a genuine second enquiry | Same phone or email within 5 minutes. Working as intended. |

Server-side failures are logged with a `[leads]` prefix — Vercel → Deployment →
Runtime Logs. Telegram-specific errors have their own table in
[`TELEGRAM-SETUP.md`](./TELEGRAM-SETUP.md#troubleshooting).

---

## 10. Deviations from the handoff

**RLS policy.** The handoff's SQL creates `CREATE POLICY … FOR ALL USING (true)`
with no `TO` clause, which applies to `PUBLIC` — the opposite of the intent
stated in its own comment ("the anon key CANNOT access this table"). This build
enables RLS with **no policies**, which achieves the stated intent:
`service_role` bypasses RLS, everyone else gets nothing.

**Duplicate query.** Two `.eq()` lookups instead of one `.or()` filter string.
Building an `or()` expression means interpolating customer input into a
PostgREST filter, where a comma or parenthesis in an address changes what the
filter means.

**Shared validation module.** The handoff's file checklist says no new files
beyond the API route, but §6.2 also requires the client to run "the same rules
as server-side". `lib/leads/validation.ts` is the only way to have one source of
truth rather than two drifting copies.

**Nullable `preferred_date` / `preferred_time`.** Both current forms always send
them, so nothing differs today. Nullable keeps the door open for the Appendix B
sources — `manual`, `referral`, `meta_lead_ad`, `whatsapp` — none of which have
a date or time, and all of which would otherwise need an `ALTER TABLE` first.

**Added `context` and `audience` columns.** The forms already send both. Without
somewhere to put them, every lead looks identical in the table regardless of
which form produced it, and campaign reporting can't separate booking leads from
eligibility leads.

**Google Sheets removed.** The previous route forwarded leads to a Google Apps
Script. Supabase is now the single source of truth; the webhook path and its
documentation were deleted.

---

## 11. Known gaps

**The WhatsApp chat widget captures nothing.** `components/whatsapp-fab.tsx`
appears on every page, collects first name, suburb, products of interest and
home ownership, then hands off to `wa.me` with a pre-filled message. None of it
reaches this API. If the visitor abandons at the handoff step, that lead leaves
no record anywhere. Now that `/contact` is WhatsApp-only, this is the sole
capture path from that page.

**Outside-scope quiz leads cannot submit.** The eligibility quiz's
`outside-scope` state exists to capture people *outside Victoria* and pre-fills
their postcode. Postcode validation rejects anything outside 3000–3999 and
8000–8999, so those visitors see "Please enter a valid Victorian postcode" on a
pre-filled field and can only submit by entering a postcode that isn't theirs.

**Phone and email are both required, and landlines are rejected.** Per handoff
§5.4. The form previously accepted either one. This affects commercial enquiries
that would previously have arrived through `/contact`.

**"Book a site assessment" on `/business` links to `/check-eligibility`.** Both
routes now end in the same form, but the visitor is sent through the quiz first
for no reason they can see.

**No CAPTCHA.** Deliberate. Spam defence is a honeypot field, a 2-second timing
gate, and the 5-minute duplicate window, backed by Vercel's DDoS protection.

**No admin UI, no customer email confirmation, no CRM.** All out of scope; leads
are read in the Supabase dashboard.

---

## 12. Phase 2 — WhatsApp Cloud API

Not built. `app/api/leads/route.ts` carries a marked placeholder where it goes,
and the `whatsapp_sent` / `whatsapp_error` columns already exist.

It will follow the same fire-and-forget pattern as Telegram: never throw, record
the outcome on the row, never change the customer's response.

Prerequisites, none of which are quick:

- A verified Meta Business Manager account
- A WhatsApp Business Account created through it
- A dedicated phone number registered with the Cloud API — it **cannot** be the
  number already used with the WhatsApp Business app
- A message template approved by Meta (1–24 hours)
- `WHATSAPP_PHONE_NUMBER_ID` and a permanent `WHATSAPP_ACCESS_TOKEN`

The call is a POST to `https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages`.

Unlike Telegram, this genuinely blocks on the client — the business verification
and number are theirs to provide.

---

## 13. File map

| File | Role |
|---|---|
| `app/api/leads/route.ts` | The endpoint. Validation → dedup → insert → notify. |
| `lib/leads/validation.ts` | Field rules, normalisation, time-slot definitions. Shared. |
| `lib/leads/telegram.ts` | Message builder and sender. Never throws. |
| `components/lead-form.tsx` | The form. Client validation, response handling, success state. |
| `components/booking-datetime.tsx` | Date input + time-slot buttons. |
| `components/utm-capture.tsx` | sessionStorage snapshot, mounted in the root layout. |
| `app/layout.tsx` | Mounts `<UtmCapture />`. |
| `.env.example` | The four variables, documented. |
| `docs/TELEGRAM-SETUP.md` | Bot + channel setup, keys, verification, handover. |
