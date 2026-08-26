import { Show, useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { InvoiceSheet } from '@/components/invoice/InvoiceSheet'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { isAdminUser } from '@/lib/admin'
import { clerkEnabled } from '@/lib/clerk'
import type { LedgerInvoice } from '@/lib/ledger'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function AdminInvoicePage() {
  const { number = '' } = useParams()
  usePageMeta({
    ...getShareMeta('/admin'),
    title: number ? `${number} — Kiano London` : 'Invoice — Kiano London',
    robots: 'noindex, nofollow',
  })

  return (
    <Section className="pt-32 md:pt-40">
      <Container>
        {clerkEnabled ? (
          <AdminInvoiceGate number={number} />
        ) : (
          <Body className="mt-6">Account is not configured.</Body>
        )}
      </Container>
    </Section>
  )
}

function AdminInvoiceGate({ number }: { number: string }) {
  const { user, isLoaded } = useUser()
  if (!isLoaded) {
    return <p className="text-[15px] font-light text-ink-soft">Reading the house.</p>
  }
  const listed = isAdminUser(user)

  return (
    <>
      <Show when="signed-out">
        <Eyebrow>The ledger</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          The ledger is for the house.
        </Display>
        <Body className="mt-6">Sign in with the address that keeps the house.</Body>
        <div className="mt-10">
          <Button to={`/sign-in?redirect_url=/admin/invoices/${encodeURIComponent(number)}`}>
            Sign in
          </Button>
        </div>
      </Show>
      <Show when="signed-in">
        {listed ? (
          <OpenInvoice number={number} />
        ) : (
          <>
            <Eyebrow>The ledger</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl">
              This account cannot open the record.
            </Display>
            <div className="mt-10">
              <TextLink to="/account">Your cuts</TextLink>
            </div>
          </>
        )}
      </Show>
    </>
  )
}

function OpenInvoice({ number }: { number: string }) {
  const { getToken } = useAuth()
  const [invoice, setInvoice] = useState<LedgerInvoice | null>(null)
  const [error, setError] = useState('')

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
          <TextLink to="/admin">Return to the ledger</TextLink>
        </div>
      </>
    )
  }

  if (!invoice) {
    return <p className="text-[15px] font-light text-ink-soft">Reading the record.</p>
  }

  return (
    <>
      <div className="no-print mb-12 flex flex-wrap items-center gap-6">
        <TextLink to="/admin">The ledger</TextLink>
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
        <Link to="/admin" className="text-[11px] uppercase tracking-[0.22em] text-stone">
          Return to the ledger
        </Link>
      </p>
    </>
  )
}
