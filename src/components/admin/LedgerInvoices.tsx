import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { TextLink } from '@/components/ui/Button'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { isAdminUser } from '@/lib/admin'
import { formatLedgerDate } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'

type Row = {
  id: number
  number: string
  email: string
  customerName: string
  issuedAt: string
  netPence: number
  vatPence: number
  grossPence: number
}

export function LedgerInvoices() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [invoices, setInvoices] = useState<Row[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=invoices', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { invoices?: Row[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The records could not be read.')
          return
        }
        setInvoices(data.invoices ?? [])
      } catch {
        if (!cancelled) setError('The records could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  return (
    <div id="ledger-invoices" className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
      <Reveal>
        <Eyebrow>Invoices</Eyebrow>
        <Display as="h2" className="mt-4 text-4xl md:text-5xl">
          A record of the cut.
        </Display>
        <Body className="mt-6">
          Written when Stripe marks a session paid. Open one to print. Not a Making Tax Digital
          suite.
        </Body>
      </Reveal>
      {error ? (
        <p className="mt-8 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      {invoices.length === 0 && !error ? (
        <p className="mt-12 text-[15px] font-light text-ink-soft">No records yet.</p>
      ) : (
        <ul className="mt-12 divide-y divide-rule border-y border-ink">
          {invoices.map((row) => (
            <li key={row.number} className="grid gap-4 py-6 lg:grid-cols-12 lg:items-baseline">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">
                {formatLedgerDate(row.issuedAt)}
              </p>
              <div className="lg:col-span-5">
                <TextLink to={`/admin/invoices/${row.number}`}>{row.number}</TextLink>
                <p className="mt-2 text-[13px] font-light text-ink-soft">
                  {row.customerName}
                  <span className="mt-1 block">{row.email}</span>
                </p>
              </div>
              <p className="text-[13px] font-light text-ink-soft lg:col-span-2">
                VAT {formatGbpExact(row.vatPence)}
              </p>
              <p className="font-display text-2xl font-light lg:col-span-3 lg:text-right">
                {formatGbpExact(row.grossPence)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
