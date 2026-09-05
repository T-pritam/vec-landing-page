# Telegram lead alerts — setup, end to end

Every time someone submits a form on the site, a message lands in a private
Telegram channel that the team reads. This document is the complete setup: what
to create, in what order, how to get the two keys, and how to prove it works.

**Time:** about 15 minutes.
**You need:** a Telegram account. That's it — no payment, no business account,
no verification, no client involvement (see [Who needs to do what](#who-needs-to-do-what)).

---

## What you are building

```
Someone submits a form
        │
        ▼
  POST /api/leads  ──► saves the lead to Supabase   ← the lead is now safe
        │
        ▼
  POST api.telegram.org/bot<TOKEN>/sendMessage
        │  chat_id: <CHANNEL_ID>
        ▼
  ┌──────────────────────────────┐
  │  AEM Energy — Leads          │   private channel
  │  ────────────────────────    │
  │  🔔 NEW LEAD                 │   ← the bot posts (admin)
  │  👤 John Smith               │
  │  📞 +61412345678             │
  │  …                           │
  └──────────────────────────────┘
        │
        ▼
  Team reads it. Nobody can reply — it's a broadcast.
```

Two pieces have to exist: a **bot** (the thing that posts) and a **channel**
(where it posts). They give you the two keys the app needs:

| Key | What it is | Comes from |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Authenticates the bot | @BotFather, Part A |
| `TELEGRAM_CHAT_ID` | Says where to post | The channel, Part D |

> **Why a channel and not a group?** Channel IDs are permanent. A group's ID
> silently changes the moment it's upgraded to a supergroup — which happens when
> you add an admin or make it public — and notifications stop with no error and
> no warning. Channels also give you read-only subscribers for free, which is
> the model you want: the team reads leads, nobody chats over them.

---

## Part A — Create the bot

**A1.** In Telegram, search for **@BotFather** (the one with the blue
verified check) and press **Start**.

**A2.** Send:

```
/newbot
```

**A3.** It asks for a **display name**. This is what people see. Send:

```
AEM Energy Leads
```

**A4.** It asks for a **username**. This must be globally unique across all of
Telegram and must end in `bot`. Send something like:

```
aem_energy_leads_bot
```

If it's taken, BotFather says so and you try again. Add a suffix — `aemenergy_leads_bot`,
`aem_leads_alert_bot`.

**A5.** BotFather replies with the token:

```
Done! Congratulations on your new bot…

Use this token to access the HTTP API:
8123456789:AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0
```

**That string is `TELEGRAM_BOT_TOKEN`.** Copy it somewhere safe now — you can
always retrieve it later with `/mybots` → your bot → **API Token**.

### Token anatomy

```
8123456789 : AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0
└────┬───┘   └──────────────┬────────────────────┘
  bot id            secret (~35 chars)
```

The whole thing, colon included, is the token.

> **Treat it exactly like a password.** Anyone holding it can post as your bot
> and read everything it can see. If it ever leaks — pasted in a chat, committed
> to git, in a screenshot — run `/revoke` in BotFather immediately. That issues a
> new token and kills the old one. Then update the env var and redeploy.

### Optional — make the bot look finished

Worth two minutes if the client will ever see it. All in BotFather:

| Command | Sets |
|---|---|
| `/setuserpic` | Profile photo — send the AEM logo |
| `/setdescription` | Shown on the bot's empty-chat screen |
| `/setabouttext` | Short line on its profile |

Skip `/setprivacy` — privacy mode only affects what a bot can read in **groups**,
and this bot only posts to a channel. It's a common wrong turn.

---

## Part B — Create the channel

**B1.** Telegram → the pencil / **New Message** button → **New Channel**.

**B2.** Name it:

```
AEM Energy — Leads
```

**B3.** When asked for channel type, choose **Private**.

> **This is not optional.** These messages carry customer names, phone numbers
> and email addresses. A public channel is world-readable, searchable inside
> Telegram, and indexed by search engines. Private is the only correct answer.

**B4.** It offers to add subscribers. **Skip** — do that in Part E, after the
bot works.

---

## Part C — Add the bot as a channel admin

**A bot cannot post to a channel unless it is an admin.** Unlike a group, there
is no "just add it as a member". This is the single most-missed step; if you skip
it, everything looks fine until you get `403 bot is not a member of the channel chat`.

**C1.** Open the channel → tap the channel name at the top.

**C2.** **Administrators** → **Add Admin**.

**C3.** Search your bot by its username (`aem_energy_leads_bot`) and select it.

**C4.** It needs **Post Messages** and nothing else. Turn every other permission
off — the bot has no business editing, deleting, or managing subscribers.

**C5.** Save.

---

## Part D — Get the channel's chat ID

Channels don't show their ID anywhere in the interface. Three ways to get it —
the first works every time.

### Method 1 — `getUpdates` (recommended)

**D1.** Post any message in the channel yourself. `test` will do.

**D2.** Open this in a browser, replacing `<TOKEN>` with your bot token:

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

Note the URL is `/bot<TOKEN>/` — the word `bot` runs straight into the token
with no slash or space.

**D3.** Find the `channel_post` block:

```jsonc
{
  "ok": true,
  "result": [{
    "update_id": 123456789,
    "channel_post": {
      "message_id": 2,
      "chat": {
        "id": -1001234567890,      ◄── this
        "title": "AEM Energy — Leads",
        "type": "channel"
      },
      "date": 1757068800,
      "text": "test"
    }
  }]
}
```

**`-1001234567890` is `TELEGRAM_CHAT_ID`** — including the minus sign and the
`-100` prefix. Both are part of the ID, not formatting.

**If `result` is empty (`"result":[]`):** post a *fresh* message in the channel
and reload. Telegram only retains updates for about 24 hours, and reading them
once can clear them.

**If you get `409 Conflict — can't use getUpdates while webhook is active`:**
something set a webhook on this bot. Clear it with
`https://api.telegram.org/bot<TOKEN>/deleteWebhook`, then retry.

### Method 2 — forward a message

Forward any message *from the channel* to **@RawDataBot** or **@userinfobot**.
It replies with the raw update, including `forward_from_chat.id`.

### Method 3 — Telegram Web

Open the channel at `web.telegram.org`. The URL contains the internal id
(e.g. `#-1234567890`). Prefix the numeric part with `-100` to get the API form.
Fiddlier than Method 1; use it as a cross-check.

---

## Part E — Add the team

Channel → tap the name → **Subscribers** → **Add Subscribers**.

Adding people directly requires them in your contacts. Easier: channel →
**Invite Links** → create one and send it. They join themselves, no contact
exchange needed.

**Nothing to configure for read-only.** In a channel, subscribers can't post —
only admins can. That's the broadcast model, out of the box.

One toggle to check: channel → **Administrators** → **Sign messages** should be
**off** (the default). With it off, posts are attributed to the channel itself
rather than to whoever posted, so no individual's name appears on any message.

---

## Part F — Put the keys in the app

### Local

`.env.local` in the project root (already gitignored via `.env*.local`):

```env
TELEGRAM_BOT_TOKEN=8123456789:AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0
TELEGRAM_CHAT_ID=-1001234567890
```

No quotes, no spaces around the `=`. Restart `npm run dev` after editing.

### Production

Vercel → the project → **Settings** → **Environment Variables** → add both.
Tick **Production** (and **Preview** if you want to test on preview deploys).

> **Adding an environment variable does not deploy anything.** Go to
> **Deployments** → the latest one → **⋯** → **Redeploy**. Without this, the
> live site keeps running with the old, empty values and every lead records
> `telegram_error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set`.

---

## Part G — Verify

Work down this list. Each step isolates one thing, so a failure tells you
exactly which part broke.

### G1 — Is the token valid?

```bash
curl -s "https://api.telegram.org/bot<TOKEN>/getMe"
```

```jsonc
{"ok":true,"result":{"id":8123456789,"is_bot":true,
 "first_name":"AEM Energy Leads","username":"aem_energy_leads_bot", …}}
```

`401 Unauthorized` → the token is wrong, or was revoked.

### G2 — Can the bot post to the channel?

```bash
curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H 'Content-Type: application/json' \
  -d '{"chat_id":"-1001234567890","text":"AEM lead alerts wired up ✅"}'
```

`{"ok":true, …}` and the message appears in the channel. If not, see
[Troubleshooting](#troubleshooting).

### G3 — Does formatting render?

The app sends `parse_mode: "HTML"`. Confirm the channel renders it:

```bash
curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H 'Content-Type: application/json' \
  -d '{"chat_id":"-1001234567890",
       "text":"🔔 <b>NEW LEAD</b>\n\n👤 Test Person\n💬 <a href=\"https://wa.me/61412345678\">Chat on WhatsApp</a>",
       "parse_mode":"HTML","disable_web_page_preview":true}'
```

**NEW LEAD** should be bold and *Chat on WhatsApp* a tappable link. If you see
raw `<b>` tags, `parse_mode` didn't reach the API.

### G4 — Does a real lead work?

Submit the form on `/book-an-assessment`, then check all three:

1. The channel shows a `🔔 NEW LEAD` message
2. Supabase → Table Editor → `leads` has the row
3. That row's `telegram_sent` is `true` and `telegram_error` is `null`

**The setup is not done until a real submission on the live URL produces all
three.** A passing G2 only proves the bot can post — it doesn't prove the
deployed app has the right env vars.

---

## Troubleshooting

| Response / symptom | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Token wrong, or revoked | Re-copy from BotFather `/mybots` → API Token |
| `400 Bad Request: chat not found` | Chat ID wrong, or bot isn't in the channel | Check the `-100` prefix; redo Part C |
| `403 Forbidden: bot is not a member of the channel chat` | Bot isn't a channel admin | Part C |
| `403 Forbidden: not enough rights to send text messages` | Bot is admin but lacks **Post Messages** | Part C4 |
| `400 Bad Request: can't parse entities` | Malformed HTML in the message | The app escapes `&`, `<`, `>` — if you hit this by hand, check your quoting |
| `409 Conflict: can't use getUpdates…` | A webhook is set on the bot | `/deleteWebhook`, then retry |
| `getUpdates` returns `"result":[]` | No recent updates, or already consumed | Post a fresh message in the channel, reload |
| Everything returns `{"ok":true}` but nothing appears | Posting to the wrong chat | Compare the ID against a fresh `getUpdates` |
| Works locally, silent in production | Env vars not in Vercel, or not redeployed | Part F, then **redeploy** |
| Leads save, no Telegram, no error visible | Look at the row | `select telegram_error from leads order by created_at desc limit 5;` |

Whatever went wrong, `telegram_error` on the lead row holds the Telegram API's
own words. Start there — it's more specific than any guess.

Server-side failures are also logged with a `[leads]` prefix in
Vercel → Deployment → **Runtime Logs**.

---

## Reference

### The two keys

| | `TELEGRAM_BOT_TOKEN` | `TELEGRAM_CHAT_ID` |
|---|---|---|
| Looks like | `8123456789:AAHfiq…` | `-1001234567890` |
| From | BotFather | `getUpdates` |
| Changes if | You `/revoke` it | Never, for a channel |
| Secret? | **Yes** — password-grade | No, but don't publish it |
| Used in | `lib/leads/telegram.ts` | `lib/leads/telegram.ts` |

Neither is ever sent to the browser. Both are read server-side only, inside the
API route.

### Rate limits

Telegram allows roughly 30 messages/second overall and about 20 per minute to a
single chat. Lead volume will not come close. If a campaign ever did, Telegram
returns `429` with a `retry_after` — the app records it in `telegram_error` and
the lead is still saved.

### Things that don't apply here

- **Privacy mode** (`/setprivacy`) — groups only, irrelevant for a channel
- **Webhooks** — the app pushes to Telegram, it never receives; no webhook needed
- **`/start`** — that's for users messaging a bot; the bot posts to a channel

---

## Who needs to do what

**You can do all of Parts A–G on your own account, today, with no client
involvement.**

The client needs to supply exactly one thing, and only for Part E: their team's
Telegram usernames — or nothing at all, if you send an invite link.

### Ownership and handover

**Bots cannot be transferred between Telegram accounts.** BotFather has no such
command; a bot belongs permanently to the account that ran `/newbot`.

This matters less than it sounds:

- **Nothing exposes a bot's creator.** Not the Bot API (`getMe` returns only the
  bot's id, name, username and capability flags), not BotFather, not the channel.
  Your name and number don't appear anywhere as a result of creating it.
- **The bot holds no data.** Every lead is in Supabase. The bot is a delivery
  pipe reading two env vars.
- **Replacing it takes five minutes.** The client runs `/newbot`, sends you the
  token, you change `TELEGRAM_BOT_TOKEN` and redeploy. No history is lost —
  history lives in the channel, not the bot.

**Channels *can* be transferred** — channel → **Administrators** → **Transfer
Ownership** — and the channel is the piece that actually holds the message
history and the subscriber list. After transferring you can leave, and nothing
of yours remains.

> Telegram requires two-step verification enabled on the transferring account
> for **at least 7 days** before it will allow a transfer, and the recipient must
> already be an admin. If handover is likely, turn 2FA on now so the clock is
> already running when you need it.

**Cleanest arrangement, if the client is reachable at setup time:** have them
create both the bot and the channel and hand you the token. Then there is never
a transfer to perform.

---

## Security checklist

- [ ] Channel is **Private**, not public
- [ ] Bot has **Post Messages** only — no other admin rights
- [ ] Token is in `.env.local` and Vercel env vars, nowhere else
- [ ] Token has never been pasted into chat, a ticket, or a commit
- [ ] `.env.local` is gitignored — confirm with `git check-ignore -v .env.local`
- [ ] No `NEXT_PUBLIC_` prefix on either variable
- [ ] Subscribers are people who should see customer contact details
- [ ] **Sign messages** is off

If the token is ever exposed: `/revoke` in BotFather **first**, then update the
env var, then redeploy. Revoking is instant and free; the old token dies the
moment the new one is issued.

---

## What a real notification looks like

```
🔔 NEW LEAD

👤 John Smith
📞 +61412345678
📧 john@example.com
📍 3000
📅 15 Sep 2026 | 8:00 AM – 11:00 AM
📝 Interested in solar for our 4-bedroom home

💬 Chat on WhatsApp

📊 Source: facebook | Campaign: spring_solar | Ad: carousel_v2
🕐 4 Sep 2026, 3:45 PM AEST
🆔 a1b2c3d4
```

- **Chat on WhatsApp** opens a WhatsApp conversation with that lead's number —
  the team contacting them, not an automated message.
- Lines are omitted rather than padded: no notes means no 📝 line at all, no
  campaign data means no 📊 line. Missing postcode shows `Not provided`.
- The timestamp is Melbourne time.
- 🆔 is the first 8 characters of the lead's UUID — enough to find the full row
  in Supabase.

Message construction lives in `lib/leads/telegram.ts`; the wider flow is in
[`LEAD-CAPTURE.md`](./LEAD-CAPTURE.md).

---

## BotFather command reference

| Command | Does |
|---|---|
| `/newbot` | Create a bot |
| `/mybots` | List your bots — token, settings, delete |
| `/token` | Show the token for a bot |
| `/revoke` | Invalidate the current token, issue a new one |
| `/setname` | Change the display name |
| `/setdescription` | Text on the bot's empty-chat screen |
| `/setabouttext` | Short profile line |
| `/setuserpic` | Profile photo |
| `/deletebot` | Delete permanently |
