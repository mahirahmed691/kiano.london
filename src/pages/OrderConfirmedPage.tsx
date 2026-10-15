import { Show } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { InvoiceSheet } from '@/components/invoice/InvoiceSheet'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { packingNote } from '@/data/packing'
import { getProduct, productPath } from '@/data/products'
import { useCart } from '@/lib/cart'
import {
  clearCheckoutNote,
  formatOrderAddress,
  orderReference,
  reservationPath,
  type CheckoutOrder,
} from '@/lib/checkout'
import { clerkEnabled } from '@/lib/clerk'
import { invoiceFromOrder } from '@/lib/invoice-from-order'
import type { LedgerInvoice } from '@/lib/ledger'
import { formatGbp } from '@/lib/money'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

type View = 'loading' | 'missing' | 'unpaid' | 'paid'

function keepAccountHref(email: string | null) {
  const query = new URLSearchParams({ redirect_url: '/account' })
  if (email) query.set('email', email)
  return `/sign-up?${query.toString()}`
}

function visitHrefFor(order: CheckoutOrder) {
  const query = new URLSearchParams()
  const first = order.lines.find((line) => line.productId)
  if (first?.productId) query.set('piece', first.productId)
  if (first?.size && first.size > 0) query.set('size', String(first.size))
  if (order.customerName) query.set('name', order.customerName.slice(0, 80))
  if (order.customerEmail) query.set('email', order.customerEmail)
  if (order.customerPhone) query.set('tel', order.customerPhone)
  const qs = query.toString()
  return qs ? `/visit?${qs}` : '/visit'
}

function ReservedName({ line }: { line: CheckoutOrder['lines'][number] }) {
  const product = getProduct(line.productId)
  const label = `${line.description}${line.quantity > 1 ? ` × ${line.quantity}` : ''}`
  if (!product) return <>{label}</>
  return (
    <Link to={productPath(product)} className="transition-opacity hover:opacity-70">
      {label}
    </Link>
  )
}

export function OrderConfirmedPage() {
  const { clear } = useCart()
  const [params] = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const [view, setView] = useState<View>(sessionId ? 'loading' : 'missing')
  const [order, setOrder] = useState<CheckoutOrder | null>(null)
  const [invoice, setInvoice] = useState<LedgerInvoice | null>(null)

  usePageMeta({
    ...getShareMeta('/order/confirmed'),
    title:
      view === 'paid'
        ? 'The cut is reserved — Kiano London'
        : 'Order — Kiano London',
  })

  useEffect(() => {
    if (!sessionId) {
      setView('missing')
      return
    }

    let cancelled = false
    let attempt = 0
    const waits = [0, 800, 1200, 1600, 2000, 2500, 3000, 4000]
    let timer = 0

    async function load() {
      try {
        const response = await fetch(
          `/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
        )
        const text = await response.text()
        let data: CheckoutOrder & {
          error?: string
          record?: LedgerInvoice | null
        }
        try {
          data = JSON.parse(text) as CheckoutOrder & { error?: string }
        } catch {
          if (!cancelled) retryOr('missing')
          return
        }
        if (cancelled) return
        if (!response.ok) {
          retryOr(response.status >= 500 ? 'missing' : 'missing')
          return
        }
        setOrder(data)
        if (data.paymentStatus === 'paid') {
          clear()
          clearCheckoutNote()
          setInvoice(data.record ?? invoiceFromOrder(data))
          setView('paid')
          return
        }
        retryOr('unpaid')
      } catch {
        if (!cancelled) retryOr('missing')
      }
    }

    function retryOr(next: View) {
      if (cancelled) return
      if (attempt < waits.length - 1) {
        attempt += 1
        timer = window.setTimeout(() => {
          void load()
        }, waits[attempt])
        return
      }
      setView(next)
    }

    void load()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [sessionId, clear])

  if (view === 'loading') {
    return (
      <Section fill className="pt-32 md:pt-40">
        <Container>
          <Eyebrow>Order</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl md:text-6xl">
            Reading the reservation.
          </Display>
          <Body className="mt-8">A moment, while the payment is confirmed.</Body>
        </Container>
      </Section>
    )
  }

  if (view === 'missing') {
    return (
      <Section fill className="pt-32 md:pt-40">
        <Container>
          <Eyebrow>Order</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl md:text-6xl">
            This confirmation could not be found.
          </Display>
          <Body className="mt-8">
            If you have just paid, wait a moment and refresh. If the bag is still held, return to
            checkout.
          </Body>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Button to="/checkout">Return to checkout</Button>
            <TextLink to="/shop">The Shop</TextLink>
          </div>
        </Container>
      </Section>
    )
  }

  if (view === 'unpaid') {
    return (
      <Section fill className="pt-32 md:pt-40">
        <Container>
          <Eyebrow>Order</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl md:text-6xl">
            Payment was not completed.
          </Display>
          <Body className="mt-8">
            Nothing has been taken. The bag is still held. Return to checkout when you are ready
            to reserve the cut.
          </Body>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Button to="/checkout">Return to checkout</Button>
            <TextLink to="/shop">Continue looking</TextLink>
          </div>
        </Container>
      </Section>
    )
  }

  const shippingLines = order?.shipping ? formatOrderAddress(order.shipping) : []

  return (
    <Section fill className="pt-32 md:pt-40">
      <Container>
        <div className="no-print grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Order</Eyebrow>
            <Display as="h1" className="mt-4 max-w-3xl text-5xl md:text-6xl lg:text-7xl">
              The cut is reserved.
            </Display>
            <Body className="mt-8">
              Payment is held. Cloth is reserved, not yet on the table. The account will show when
              it is being cut, when it is packed, and when it has left. Made to order.{' '}
              {packingNote}
            </Body>
            {order?.customerEmail ? (
              <Body className="mt-6">
                A receipt, and a letter from the house, have been sent to {order.customerEmail}.
              </Body>
            ) : null}
            {order && order.lines.length > 0 ? (
              <div className="mt-10 max-w-prose lg:hidden">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Reserved</p>
                <ul className="mt-4 border-t border-rule">
                  {order.lines.map((line, index) => (
                    <li
                      key={`${line.description}-${index}`}
                      className="border-b border-rule py-3 text-[15px] font-light leading-relaxed"
                    >
                      <ReservedName line={line} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-12 flex flex-wrap items-center gap-6">
              {clerkEnabled ? (
                <>
                  <Show when="signed-in">
                    <Button to="/account">Account</Button>
                  </Show>
                  <Show when="signed-out">
                    <Button to={keepAccountHref(order?.customerEmail ?? null)}>
                      Keep it on the account
                    </Button>
                  </Show>
                </>
              ) : (
                <Button to="/collection">The Collection</Button>
              )}
              {invoice ? (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
                >
                  Print the receipt
                </button>
              ) : null}
              {sessionId ? (
                <TextLink to={`/order/invoice?session_id=${encodeURIComponent(sessionId)}`}>
                  A record of the cut
                </TextLink>
              ) : null}
              {sessionId ? (
                <TextLink to={`/order/card?session_id=${encodeURIComponent(sessionId)}`}>
                  The house card
                </TextLink>
              ) : null}
              {order ? (
                <TextLink
                  to={reservationPath({
                    reference: orderReference(order.id),
                    email: order.customerEmail ?? undefined,
                  })}
                >
                  Ask after this cut
                </TextLink>
              ) : null}
              {order ? (
                <TextLink to={visitHrefFor(order)}>Enquire to visit</TextLink>
              ) : (
                <TextLink to="/visit">Visit by appointment</TextLink>
              )}
            </div>
          </div>

          {order ? (
            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="border-t border-ink pt-8">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                  Reference · {orderReference(order.id)}
                </p>
                <ul className="mt-8">
                  {order.lines.map((line, index) => (
                    <li
                      key={`${line.description}-${index}`}
                      className="flex items-baseline justify-between gap-4 border-t border-rule py-4"
                    >
                      <p className="text-[14px] font-light leading-relaxed">
                        <ReservedName line={line} />
                      </p>
                      <p className="shrink-0 text-[13px] tracking-[0.06em]">
                        {formatGbp(line.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="flex items-baseline justify-between border-t border-ink pt-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Paid</p>
                  <p className="font-display text-3xl font-light">
                    {formatGbp(order.amountTotal)}
                  </p>
                </div>
                {shippingLines.length > 0 ? (
                  <div className="mt-8">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                      Delivery
                    </p>
                    <p className="mt-3 text-[14px] font-light leading-relaxed text-ink-soft">
                      {shippingLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                ) : null}
                {order.note ? (
                  <div className="mt-8">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                      On the house card
                    </p>
                    <p className="mt-3 text-[14px] font-light leading-relaxed text-ink-soft">
                      {order.note}
                    </p>
                  </div>
                ) : null}
                <p className="mt-8 text-[12px] font-light leading-relaxed text-stone">
                  Cloth is held. Not yet on the table. Carriage included. Leaves unscented.
                </p>
              </div>
            </aside>
          ) : null}
        </div>
        {invoice ? (
          <div className="hidden print:block">
            <InvoiceSheet invoice={invoice} reference={order ? orderReference(order.id) : undefined} />
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
