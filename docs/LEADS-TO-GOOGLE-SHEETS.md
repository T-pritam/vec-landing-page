# Sending leads to Google Sheets

Both lead flows on the site POST to the internal API route
[`app/api/leads/route.ts`](../app/api/leads/route.ts):

1. **Book an assessment** (`/book-an-assessment`) — name, contact, `preferred_date`, `preferred_time`.
2. **Check eligibility** (`/check-eligibility`) — every submission, with a
   `qualified` column that is `true` only when the visitor passed all checks.

The route forwards each lead as JSON to a **Google Apps Script Web App**, which
appends one row to a Google Sheet. You wire it up with a single environment
variable — no code changes.

The columns, in order, are:

```
submittedAt | type | qualified | name | email | phone | postcode | preferred_date | preferred_time | audience | message | context
```

- `type` = `booking` | `eligibility` | `enquiry` (contact form)
- `qualified` = `true` / `false` for eligibility leads, blank otherwise

---

## Step 1 — Create the Sheet

1. Go to <https://sheets.google.com> and create a new spreadsheet, e.g. **"AEM Leads"**.
2. Leave it empty — the script writes the header row automatically on the first lead.
   (Optional: rename the first tab to `Leads`; the script uses the first sheet either way.)

## Step 2 — Add the Apps Script

1. In the sheet: **Extensions → Apps Script**.
2. Delete the placeholder and paste this:

```javascript
// Fixed column order — must match the API route's field list.
const FIELDS = [
  'submittedAt','type','qualified','name','email','phone',
  'postcode','preferred_date','preferred_time','audience','message','context'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // serialise concurrent submissions
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(FIELDS); // header row once
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow(FIELDS.map(function (k) { return data[k] || ''; }));
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. **Save** (💾).

## Step 3 — Deploy as a Web App

1. **Deploy → New deployment**.
2. Gear icon → **Web app**.
3. Set:
   - **Description:** `AEM leads intake`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**  ← required so the server can POST to it
4. **Deploy**, approve the permissions prompt (choose your Google account →
   Advanced → "Go to project (unsafe)" → Allow — this is your own script).
5. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy……/exec`

> Re-deploying: if you edit the script later, use **Deploy → Manage deployments →
> ✏️ Edit → Version: New version** so the same URL keeps working.

## Step 4 — Point the site at it

Set the URL as an environment variable named `LEADS_WEBHOOK_URL`.

**Local development** — create `.env.local` in the project root:

```bash
LEADS_WEBHOOK_URL=https://script.google.com/macros/s/AKfy……/exec
```

Then restart `npm run dev`.

**Production** — add the same variable in your host's dashboard:
- **Vercel:** Project → Settings → Environment Variables → add `LEADS_WEBHOOK_URL` → redeploy.
- **Netlify / other:** Site settings → Environment variables → add it → redeploy.

`.env.local` is already git-ignored, so the URL never gets committed.

## Step 5 — Test

With the variable set, submit a booking or the eligibility form (or from a terminal):

```bash
curl -X POST http://localhost:3000/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"context":"book-an-assessment","name":"Test","email":"t@example.com","preferred_date":"2026-07-10","preferred_time":"2:00 PM – 5:00 PM"}'
```

A new row should appear in the sheet within a second or two.

---

## Notes

- **If `LEADS_WEBHOOK_URL` is not set**, the API still returns success and logs
  the lead to the server console — so the forms work before you finish setup,
  and no lead 500s the user.
- **Only qualified eligibility leads?** They're all sent so you don't lose
  partial leads, but you can filter the sheet (or a Looker/pivot view) on
  `type = eligibility` AND `qualified = true`. To send *only* qualified ones,
  change the script's `doPost` to `if (data.type === 'eligibility' && data.qualified !== 'true') return ...`.
- **Want a real Excel file?** Google Sheets exports to `.xlsx` any time via
  **File → Download → Microsoft Excel (.xlsx)**, or connect the sheet to Excel
  with **Data → Get Data → From Web** in Excel for a live link.
- **Spam:** the form already has a honeypot + timing gate. For more, add a
  shared-secret header check in `doPost`.
```
