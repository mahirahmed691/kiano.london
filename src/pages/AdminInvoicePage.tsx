import { useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { InvoiceSheet } from '@/components/invoice/InvoiceSheet'
import { TextLink } from '@/components/ui/Button'
import { Display, Eyebrow } from '@/components/ui/Heading'
import type { LedgerInvoice } from '@/lib/ledger'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function AdminInvoicePage() {
  const { number = '' } = useParams()
  const { getToken } = useAuth()
  const [invoice, setInvoice] = useState<LedgerInvoice | null>(null)
  const [error, setError] = useState('')

  usePageMeta({
    ...getShareMeta('/admin'),
    title: number ? `${number} — Kiano London` : 'Invoice — Kiano London',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch(
          `/api/admin?section=invoices&id=${encodeURIComponent(number)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined },
        )
        const data = (await response.json()) as { invoice?: LedgerInvoice; error?: string }
        if (cancelled) return
        if (!response.ok || !data.invoice) {
          setError(data.error || 'That record could not be found.')
          return
        }
        setInvoice(data.invoice)
      } catch {
        if (!cancelled) setError('That record could not be found.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, number])

  if (error) {
    return (
      <>
        <Eyebrow>Invoice</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          {error}
        </Display>
        <div className="mt-10">
          <TextLink to="/admin/invoices">Return to the records</TextLink>
        </div>
      </>
    )
  }

  if (!invoice) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the record.</p>
  }

  return (
    <>
      <div className="no-print mb-12 flex flex-wrap items-center gap-6">
        <TextLink to="/admin/invoices">The records</TextLink>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          Print
        </button>
      </div>
      <InvoiceSheet invoice={invoice} />
      <p className="no-print mt-12">
        <Link to="/admin/invoices" className="text-[11px] uppercase tracking-[0.22em] text-stone">
          Return to the records
        </Link>
      </p>
    </>
  )
}
