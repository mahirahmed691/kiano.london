import { useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { InvoiceBookSheet, type InvoiceBookRow } from '@/components/invoice/InvoiceBookSheet'
import { TextLink } from '@/components/ui/Button'
import { Display, Eyebrow } from '@/components/ui/Heading'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function AdminInvoicesBookPage() {
  const { getToken } = useAuth()
  const [invoices, setInvoices] = useState<InvoiceBookRow[] | null>(null)
  const [error, setError] = useState('')

  usePageMeta({
    ...getShareMeta('/admin'),
    title: 'The records — Kiano London',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=invoices', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { invoices?: InvoiceBookRow[]; error?: string }
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
  }, [getToken])

  if (error) {
    return (
      <>
        <Eyebrow>The records</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          {error}
        </Display>
        <div className="mt-10">
          <TextLink to="/admin/invoices">Return to the records</TextLink>
        </div>
      </>
    )
  }

  if (!invoices) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the records.</p>
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
      <InvoiceBookSheet invoices={invoices} />
      <p className="no-print mt-12">
        <Link to="/admin/invoices" className="text-[11px] uppercase tracking-[0.22em] text-stone">
          Return to the records
        </Link>
      </p>
    </>
  )
}
