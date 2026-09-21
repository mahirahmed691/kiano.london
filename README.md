# Kiano London

A bespoke React website for **Kiano London**, a London house of the jubbah and the thobe.

This is not a theme, a WordPress site, or a generic landing page. It is a small, production-ready application: Vite, React, TypeScript and Tailwind CSS, structured so the house can be extended without rewriting pages.

## Pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/shop` | The Shop (jubbah) |
| `/collection` | The Collection |
| `/stills` | The stills (one a week, in order). Home opens on the plate of the week |
| `/story` | Our Story |
| `/craftsmanship` | Craftsmanship |
| `/craftsmanship-details` | The making, in detail |
| `/visit` | Atelier visit |
| `/order/confirmed` | After payment |
| `/order/invoice` | A record of the cut |
| `/order/card` | The house card, for the box |
| `/checkout` | The till |
| `/account` | Reservations, kept details, and the size they wear |
| `/reservation` | Ask after a reserved cut (reference and email) |
| `/admin` | House ledger board (signed-in allowlist) |
| `/admin/figures` | The till |
| `/admin/cuts` | Remaining cuts |
| `/admin/cuts/book` | Print remaining on the line |
| `/admin/prices` | The line in sterling |
| `/admin/accounts` | Tax and the journal |
| `/admin/invoices` | Records of the cut |
| `/admin/invoices/book` | Print the tax invoices |
| `/admin/work` | Reserved, on the table, packed, left the house |
| `/admin/work/table` | Print cuts still in the house |
| `/admin/work/box` | Print the face of the box |
| `/admin/work/card` | Print the house card |
| `/admin/members` | Those who keep an account |
| `/admin/list` | The list, confirmed and held |
| `/admin/field` | Other houses of the column |
| `/admin/diary` | Appointment letters |
| `/admin/diary/book` | Print letters still open |
| `/admin/line` | The line of work |
| `/cookies` | Cookies |
| `/privacy` | Privacy |
| `/returns` | If a reserved cut must return |
| `/letters/confirmed` | List confirmation |
| `/sign-in` | Member sign in |
| `/sign-up` | Open an account |

The logotype returns to the homepage. Collection pieces are driven from `src/data/products.ts`.

## Stack

- React 19 and TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Clerk (member accounts)
- Neon Postgres (stock, orders, members, the list, and appointment letters)
- Resend (list confirmation, once the domain is verified)
- Stripe Checkout
- Semantic HTML, CSS transitions, `prefers-reduced-motion`

The site installs as a standalone app from Safari or Chrome (Add to Home Screen). After a visit, the house, the shop, and the collection can be read without a network; the till and the account need a connection. Native iOS and Android use the Expo shell in `mobile/`, which opens the live house.

## Local development

```bash
npm install
npm run dev
```

The site runs at [http://localhost:5173](http://localhost:5173).

```bash
cd mobile
npm start
```

Scan the QR code with Expo Go from the App Store (SDK 54). The native shell loads [https://www.kiano.london](https://www.kiano.london).

```bash
npm run build
npm run preview
```

## Deploying to Vercel

This repository is ready for a standard Vite deployment.

1. Import the GitHub repository in Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Output directory: `dist`

`vercel.json` rewrites unknown routes to `index.html` so `/collection`, `/story` and the craftsmanship pages work on refresh.

Optional: set `VITE_SITE_URL` to the live origin (no trailing slash) so Open Graph tags and canonical URLs match production.

The house board at `/admin` is for listed emails: `atelier@kiano.london`, `mahirahmed691@gmail.com`, and `kojoabayas@gmail.com`. Set the same comma-separated list in `VITE_ADMIN_EMAILS` (client) and `ADMIN_EMAILS` (server). Vite only exposes `VITE_*`. If those env vars are empty, the same three addresses are the default. On Vercel, set both for Production, Preview, and Development. Allowlisted accounts see **The ledger** in the header and **The house board** on Account. The native shell can also open `kiano://admin` (or set `EXPO_PUBLIC_HOUSE_URL` to a local Vite origin while developing).

Clerk account sync: in the Clerk Dashboard (production), add `https://www.kiano.london/api/clerk-webhook` for `user.created`, `user.updated`, and `user.deleted`. Set `CLERK_WEBHOOK_SIGNING_SECRET` on Vercel.

Stripe: the same webhook as checkout (`POST /api/stripe-webhook`) must also receive `charge.refunded` so a full return restocks the size.

List letters: set `RESEND_API_KEY` and `RESEND_FROM` on Vercel after the sending domain is verified in Resend.

## Project structure

```
src/
  components/   layout, editorial, product and UI
  pages/        one module per route
  data/         typed content (products, craft, site)
  lib/          seo helpers
  styles/       design tokens and motion
public/
  images/       house photography
```

## Design

Visual language, type, colour and spacing are recorded in `DESIGN.md`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | Oxlint |
| `npm run db:migrate` | Create inventory, members, orders, list, webhook, and appointment tables |
| `cd mobile && npm start` | Expo Go shell for the house app |
