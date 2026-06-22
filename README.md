# Accredited Energy — VEU Accredited Person website (prototype)

A multi-page marketing site for a Victorian **Accredited Person** under the
**Victorian Energy Upgrades (VEU)** program. Built to the PRD (`VEU Website PRD.pdf`)
and the single-phase brief — **everything is built now, nothing deferred**:
all six upgrade pages, the interactive stacking calculator, and the Tier B
branching eligibility quiz are live.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme`; tokens in `app/globals.css`)
- **Fonts** via `next/font`, no manual files: **Geist Sans** (headings + body)
  and **Geist Mono** (figures) from the `geist` package; **Fraunces**
  (`next/font/google`) for the hero display only.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all 18 routes prerender static)
npm run start    # serve the production build
```

## Build philosophy (per PRD §1)

Everything is **component-based and modular** — each page section is an
independent, swappable block, and content is separated from layout. Reordering,
adding or removing a section never requires reworking the rest of the site.

## Where things live

```
app/
  layout.tsx               Global shell: fonts, header, footer, sticky mobile CTA, metadata
  page.tsx                 Home — self-select hub (all 10 blocks, PRD §7.1)
  how-it-works/            The money mechanism + stacking + timelines (§7.2)
  residential/             Residential hub (§6)
  business/                Business / C&I — navy, ROI-driven journey (§7.5)
  check-eligibility/       The Tier B eligibility quiz (§7.3, centerpiece)
  upgrades/[slug]/         ONE reusable upgrade template → 6 pages (§7.4)
  about/  faq/  contact/  privacy/

components/
  site-header / site-footer / sticky-mobile-cta / trust-strip   Global elements (§6)
  lead-form.tsx            Shared lead-capture (Eligibility, Contact, inline) — §6
  indicative.tsx           "Indicative / up to" chips + disclaimers (compliance, §3.4)
  calculator/              Interactive stacking-savings calculator (§8.1, built now)
  eligibility/             Branching Tier B quiz (§7.3)
  upgrade-template.tsx     The reusable upgrade page (§7.4)
  sections/                Reorderable content blocks (hero, money-flow, full-chain,
                           upgrades-grid, stacking, audience-split, social-proof, cta-band)

lib/
  rebates.ts               ⭐ SINGLE SOURCE OF TRUTH for every dollar figure
  upgrades.ts              Per-upgrade page content (drives the template)
  faq.ts                   FAQ content, categorised
  site.ts                  Site name, nav, contact + CTA constants
```

## ⭐ The single rebate config (`lib/rebates.ts`)

Per PRD §8.1, **no dollar figure is hardcoded in markup**. The calculator, the
quiz, the upgrade pages and the home/how-it-works teasers all read from
`lib/rebates.ts`. To update figures, edit that one file:

- `UPGRADE_REBATES` — indicative `min`/`max` per incentive layer, per upgrade.
- `INCENTIVE_LAYERS` — names/blurbs for VEU, Solar Victoria, STC.
- `REBATE_META` — disclaimer text + `lastReviewed` date.

All figures are framed **"up to / indicative"** and never as guarantees, and the
word **"free"** is never used to imply zero cost (PRD §3.2). Solar Victoria is the
only income-tested layer; VEU and STC are not — the code keeps them distinct.

## Adding / editing / removing an upgrade page

It's all data. In `lib/upgrades.ts` add/edit an entry in `UPGRADES`, and in
`lib/rebates.ts` add a matching entry in `UPGRADE_REBATES` (same `slug`). The
page at `/upgrades/<slug>`, the nav, the footer, the home grid and the
calculator pick it up automatically. Set `flagship: true` for the
residential-vs-commercial split (currently Solar).

## Placeholders to swap before launch (PRD §9)

Search for these — all clearly labelled in code:

| Item | Where |
| --- | --- |
| Brand assets (logo, colors, fonts) | `components/icons.tsx` `Logo`, `public/*.svg`, `app/globals.css` tokens |
| Lead destination (CRM/email/booking) | `components/lead-form.tsx` (currently a mock success state) |
| Contact details (phone/email/area) | `lib/site.ts` |
| Indicative rebate figures | `lib/rebates.ts` |
| Social proof / case studies / logos | `components/sections/social-proof.tsx`, `app/business/page.tsx` |
| Legal copy (Privacy, T&Cs) | `app/privacy/page.tsx` |
| Trading name & accreditation no. | `lib/site.ts` |
| Analytics IDs | not added (omit in prototype) |

## Design tokens

Defined once in `app/globals.css` `:root` (PRD §5 palette + type scale) and
mapped into the Tailwind theme via `@theme inline`, so `var(--brand)` and
utilities like `bg-brand` always resolve to the same value. Amber (`--brand`) is
the single accent; dark sections use `--ink` + white text + amber accents; navy
(`--business`) is reserved for C&I credibility sections.
