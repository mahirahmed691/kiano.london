import { useEffect, useState } from 'react'

export type Locale = { currency: string; rate: number }

const KEY = 'kiano:locale'
let pending: Promise<Locale | null> | null = null

function stored(): Locale | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Locale) : null
  } catch {
    return null
  }
}

function load(): Promise<Locale | null> {
  pending ??= fetch('/api/locale')
    .then((res) => (res.ok ? (res.json() as Promise<Locale>) : null))
    .then((locale) => {
      if (locale && locale.rate > 0) {
        try {
          sessionStorage.setItem(KEY, JSON.stringify({ currency: locale.currency, rate: locale.rate }))
        } catch {
          /* storage unavailable */
        }
        return locale
      }
      return null
    })
    .catch(() => null)
  return pending
}

/** The visitor's currency and GBP rate, or null for UK visitors and while loading. */
export function useLocale(): Locale | null {
  const [locale, setLocale] = useState<Locale | null>(() => stored())
  useEffect(() => {
    if (locale) return
    let live = true
    void load().then((value) => {
      if (live) setLocale(value)
    })
    return () => {
      live = false
    }
  }, [locale])
  return locale && locale.currency !== 'GBP' ? locale : null
}

const threeDecimal = new Set(['KWD', 'BHD', 'OMR'])

export function formatLocal(pence: number, locale: Locale) {
  const amount = (pence / 100) * locale.rate
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: locale.currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: threeDecimal.has(locale.currency) ? 1 : 0,
    minimumFractionDigits: 0,
  }).format(amount)
}
