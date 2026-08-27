import { Show } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { packingNote } from '@/data/packing'
import { getProduct, productPath } from '@/data/products'
import { useCart } from '@/lib/cart'
import {
  clearStoredCheckout,
  formatOrderAddress,
  orderReference,
  type CheckoutOrder,
} from '@/lib/checkout'
import { clerkEnabled } from '@/lib/clerk'
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
  const first = order.lines.find((line) => line.productId)
  if (!first?.productId) return '/visit'
  const query = new URLSearchParams({ piece: first.productId })
  if (first.size && first.size > 0) query.set('size', String(first.size))
  return `/visit?${query.toString()}`
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
        let data: CheckoutOrder & { error?: string }
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
          clearStoredCheckout()
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
      <Section className="pt-32 md:pt-40">
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
      <Section className="pt-32 md:pt-40">
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
      <Section className="pt-32 md:pt-40">
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
    <Section className="pt-32 md:pt-40">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Order</Eyebrow>
            <Display as="h1" className="mt-4 max-w-3xl text-5xl md:text-6xl lg:text-7xl">
              The cut is reserved.
            </Display>
            <Body className="mt-8">
              Payment is held. Cloth will be cut from the house block in four to eight weeks. A
              note will follow if a fitting is needed before it is packed.{' '}
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
              {sessionId ? (
                <TextLink to={`/order/invoice?session_id=${encodeURIComponent(sessionId)}`}>
                  A record of the cut
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
                      A note
                    </p>
                    <p className="mt-3 text-[14px] font-light leading-relaxed text-ink-soft">
                      {order.note}
                    </p>
                  </div>
                ) : null}
                <p className="mt-8 text-[12px] font-light leading-relaxed text-stone">
                  Carriage included. Cut to order, four to eight weeks. Leaves unscented.
                </p>
              </div>
            </aside>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
