import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { isAdminUser } from '@/lib/admin'
import type { PriceRow } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'

export function LedgerPrices() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [prices, setPrices] = useState<PriceRow[]>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=prices', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as {
          prices?: PriceRow[]
          source?: string
          error?: string
        }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The price list could not be read.')
          return
        }
        setPrices(data.prices ?? [])
        setNote(data.source ?? '')
      } catch {
        if (!cancelled) setError('The price list could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  return (
    <LedgerFold title="The catalogue" className="mt-16">
      {error ? (
        <p className="text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      {note ? <p className="text-[15px] font-light leading-relaxed text-ink-soft">{note}</p> : null}
      <ul className="mt-8 divide-y divide-rule border-y border-ink">
        {prices.map((row) => (
          <li key={row.productId} className="grid gap-4 py-6 lg:grid-cols-12 lg:items-baseline">
            <div className="lg:col-span-5">
              <p className="font-display text-2xl font-light">{row.name}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">
                {row.cut} · {row.colour}
              </p>
            </div>
            <p className="text-[13px] font-light text-ink-soft lg:col-span-2">
              Net {formatGbpExact(row.netPence)}
            </p>
            <p className="text-[13px] font-light text-ink-soft lg:col-span-2">
              VAT {formatGbpExact(row.vatPence)}
            </p>
            <p className="font-display text-2xl font-light lg:col-span-3 lg:text-right">
              {formatGbpExact(row.grossPence)}
            </p>
          </li>
        ))}
      </ul>
    </LedgerFold>
  )
}
