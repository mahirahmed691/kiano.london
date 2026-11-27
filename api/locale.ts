/**
 * Visitor currency for showing an approximate local price beside GBP.
 * Display only: checkout charges GBP (or the visitor's currency if Stripe
 * Adaptive Pricing is on). Country comes from the host's geo header; no cookie.
 */

type Currency = 'GBP' | 'USD' | 'EUR' | 'AED' | 'SAR' | 'QAR' | 'KWD' | 'BHD' | 'OMR'

const byCountry: Record<string, Currency> = {
  GB: 'GBP', US: 'USD', FR: 'EUR', DE: 'EUR', IT: 'EUR', IE: 'EUR', NL: 'EUR', ES: 'EUR', BE: 'EUR',
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR',
}

// Gulf currencies are pegged to the dollar (KWD is a basket; close enough for "≈").
const perUsd: Record<string, number> = { AED: 3.6725, SAR: 3.75, QAR: 3.64, KWD: 0.307, BHD: 0.376, OMR: 0.3845 }

// Fallback if the rate service is down: dated, conservative.
const fallback = { USD: 1.27, EUR: 1.17 }

let cache: { at: number; usd: number; eur: number } | null = null
const SIX_HOURS = 6 * 60 * 60 * 1000

async function gbpRates() {
  if (cache && Date.now() - cache.at < SIX_HOURS) return cache
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=GBP&to=USD,EUR', {
      signal: AbortSignal.timeout(2500),
    })
    if (!res.ok) throw new Error(`rates ${res.status}`)
    const body = (await res.json()) as { rates?: { USD?: number; EUR?: number } }
    const usd = Number(body.rates?.USD)
    const eur = Number(body.rates?.EUR)
    if (!(usd > 0 && eur > 0)) throw new Error('rates missing')
    cache = { at: Date.now(), usd, eur }
  } catch (caught) {
    console.error('locale: rate fetch failed, using fallback', caught)
    cache = cache ?? { at: Date.now() - SIX_HOURS + 10 * 60 * 1000, usd: fallback.USD, eur: fallback.EUR }
  }
  return cache
}

export async function GET(request: Request) {
  const country = (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country') ||
    request.headers.get('cf-ipcountry') ||
    ''
  ).toUpperCase()
  const currency: Currency = byCountry[country] ?? 'GBP'

  let rate = 1
  if (currency !== 'GBP') {
    const r = await gbpRates()
    rate = currency === 'USD' ? r.usd : currency === 'EUR' ? r.eur : r.usd * perUsd[currency]
  }

  return Response.json(
    { country: country || null, currency, rate: Math.round(rate * 10000) / 10000 },
    { headers: { 'Cache-Control': 'private, max-age=3600' } },
  )
}
