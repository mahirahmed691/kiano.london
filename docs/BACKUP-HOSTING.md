# Backup hosting: Netlify standby

Vercel (project `cavendish-house`) is the primary host. This runbook brings the
same code up on Netlify's free plan, which allows commercial sites, and moves
kiano.london over if the Vercel team is paused (for example, an unpaid invoice).

Nothing here changes the live site until step 4, the DNS switch.

## What is already in the repo

| File | Replaces on Vercel |
| --- | --- |
| `netlify.toml` | `vercel.json` headers, redirects, SPA fallback |
| `netlify/functions/api.mts` | every `api/*.ts` function and the `/api/...` rewrites |
| `netlify/functions/week-plate.mts` | the Monday 08:00 cron on `/api/subscribe` |

Both hosts run the same `api/*.ts` handlers. When you change `vercel.json`
(rewrites, headers, crons), make the same change in the Netlify files.

## 1. Create the standby site (once, ~10 min, free)

1. Sign up at netlify.com with GitHub. No card is needed.
2. Add new site → Import from Git → `mahirahmed691/kiano.london`, branch `main`.
   The build settings come from `netlify.toml`.
3. Site configuration → Environment variables. Add the same values as Vercel
   **Production**:
   - `DATABASE_URL` (Neon)
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `VITE_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET`
   - `RESEND_API_KEY`, `RESEND_FROM`
   - `ADMIN_EMAILS`, `VITE_ADMIN_EMAILS`
   - `SITE_URL=https://www.kiano.london`
   - `CRON_SECRET`: any long random string. Netlify has no trusted cron header, so the weekly letter only sends with this set.
4. Deploy. Check `https://<site>.netlify.app/` loads and `/api/inventory?product_id=jubbah-black` returns JSON.

If Vercel has already paused the team, copy the env values from your own
password manager or `.env`. A paused team may still let you view settings, but
don't count on it. **Keep a copy of the production env values outside Vercel now.**

## 2. Smoke test on the netlify.app URL

- [ ] Home, /shop, a product page, /terms render
- [ ] Add to bag → /checkout → "Reserve the cut" opens Stripe (then cancel)
- [ ] /account sign-in loads (Clerk production only accepts kiano.london, so this one is checked after DNS)
- [ ] Functions → `api` logs show requests, no errors

## 3. Point third-party webhooks at the domain (no change needed)

Stripe (`/api/stripe-webhook`) and Clerk (`/api/clerk-webhook`) call
`https://www.kiano.london/...`, so they follow the DNS. Nothing to edit.

## 4. Switch DNS (GoDaddy → kiano.london → DNS)

1. Netlify → Domain management → add `www.kiano.london` and `kiano.london`.
2. GoDaddy, replacing the Vercel values:
   - `CNAME www` → `<site>.netlify.app`
   - `A @` → `75.2.60.5` (Netlify's load balancer; confirm the value Netlify shows)
3. Wait for Netlify to issue HTTPS (minutes to about an hour).
4. Re-run the smoke test on www.kiano.london, including sign-in and a £1 proof order (see `src/lib/till-proof.ts`).

Leave the Clerk records (`clerk`, `accounts`, `clkmail`, `clk*._domainkey`) alone.

**Rollback / return to Vercel:** put the old GoDaddy values back:
`A @ 216.198.79.1` and `CNAME www 55c187cdd8c3a427.vercel-dns-017.com`.

## Known differences on Netlify

- Vercel Web Analytics (`/_vercel/insights/script.js` in `index.html`) does nothing there. It's harmless.
- Function timeout on the free plan is 10 s. Checkout and webhooks finish well within that.
- Preview deploys go to Netlify deploy previews; production deploys come from `main`.
