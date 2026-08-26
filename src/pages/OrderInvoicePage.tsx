import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { InvoiceSheet } from '@/components/invoice/InvoiceSheet'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import type { CheckoutOrder } from '@/lib/checkout'
import { orderReference } from '@/lib/checkout'
import type { LedgerInvoice } from '@/lib/ledger'
import { splitVat } from '@/lib/vat'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

function invoiceFromOrder(order: CheckoutOrder): LedgerInvoice | null {
  if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'no_payment_required') return null
  const split = splitVat(order.amountTotal)
  return {
    id: 0,
    number: order.invoice?.number ?? `KL-${orderReference(order.id)}`,
    orderId: order.id,
    email: order.customerEmail ?? '',
    customerName: order.customerName ?? order.customerEmail ?? '',
    issuedAt: order.invoice?.issuedAt ?? new Date().toISOString(),
    netPence: order.invoice?.netPence ?? split.netPence,
    vatPence: order.invoice?.vatPence ?? split.vatPence,
    grossPence: order.invoice?.grossPence ?? split.grossPence,
    currency: order.currency,
    shipping: order.shipping,
    lines: order.lines.map((line) => ({
      productId: '',
      size: 0,
      quantity: line.quantity,
      description: line.description,
      ...splitVat(line.amount),
    })),
  }
}

export function OrderInvoicePage() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const [invoice, setInvoice] = useState<LedgerInvoice | null>(null)
  const [missing, setMissing] = useState(!sessionId)

  usePageMeta({
    ...getShareMeta('/order/confirmed'),
    title: invoice ? `${invoice.number} — Kiano London` : 'A record of the cut — Kiano London',
    path: '/order/invoice',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    if (!sessionId) {
      setMissing(true)
      return
    }
    let cancelled = false
    async function load() {
      try {
        const response = await fetch(
          `/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
        )
        const data = (await response.json()) as CheckoutOrder & {
          error?: string
          record?: LedgerInvoice | null
        }
        if (cancelled) return
        if (!response.ok) {
          setMissing(true)
          return
        }
        const next = data.record ?? invoiceFromOrder(data)
        if (!next) {
          setMissing(true)
          return
        }
        setInvoice(next)
      } catch {
        if (!cancelled) setMissing(true)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  if (missing) {
    return (
      <Section className="pt-32 md:pt-40">
        <Container>
          <Eyebrow>Invoice</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl md:text-6xl">
            This record could not be found.
          </Display>
          <Body className="mt-8">
            Open it from the confirmation, with the session the till returned.
          </Body>
          <div className="mt-12">
            <TextLink to="/">Return to the house</TextLink>
          </div>
        </Container>
      </Section>
    )
  }

  if (!invoice) {
    return (
      <Section className="pt-32 md:pt-40">
        <Container>
          <p className="text-[15px] font-light text-ink-soft">Reading the record.</p>
        </Container>
      </Section>
    )
  }

  return (
    <Section className="pt-32 md:pt-40">
      <Container>
        <div className="no-print mb-12 flex flex-wrap items-center gap-6">
          <Button
            to={`/order/confirmed?session_id=${encodeURIComponent(sessionId)}`}
            variant="ghost"
          >
            The reservation
          </Button>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
          >
            Print
          </button>
        </div>
        <InvoiceSheet invoice={invoice} reference={orderReference(sessionId)} />
      </Container>
    </Section>
  )
}
