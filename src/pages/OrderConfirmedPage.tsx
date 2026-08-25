import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { useCart } from '@/lib/cart'
import {
  clearStoredCheckout,
  formatOrderAddress,
  orderReference,
  type CheckoutOrder,
} from '@/lib/checkout'
import { formatGbp } from '@/lib/money'
import { usePageMeta } from '@/lib/usePageMeta'

type View = 'loading' | 'missing' | 'unpaid' | 'paid'

export function OrderConfirmedPage() {
  const { clear } = useCart()
  const [params] = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const [view, setView] = useState<View>(sessionId ? 'loading' : 'missing')
  const [order, setOrder] = useState<CheckoutOrder | null>(null)

  usePageMeta({
    title:
      view === 'paid'
        ? 'The cut is reserved — Kiano London'
        : 'Order — Kiano London',
    description: 'Your piece is reserved. Cut in London, four to eight weeks.',
    path: '/order/confirmed',
  })

  useEffect(() => {
    if (!sessionId) {
      setView('missing')
      return
    }

    let cancelled = false

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
          if (!cancelled) setView('missing')
          return
        }
        if (cancelled) return
        if (!response.ok) {
          setView('missing')
          return
        }
        setOrder(data)
        if (data.paymentStatus === 'paid') {
          clear()
          clearStoredCheckout()
          setView('paid')
          return
        }
        setView('unpaid')
      } catch {
        if (!cancelled) setView('missing')
      }
    }

    void load()
    return () => {
      cancelled = true
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
              note will follow if a fitting is needed before it leaves the workroom.
            </Body>
            {order?.customerEmail ? (
              <Body className="mt-6">
                A receipt has been sent to {order.customerEmail}.
              </Body>
            ) : null}
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Button to="/collection">The Collection</Button>
              <TextLink to="/visit">Visit the atelier</TextLink>
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
                        {line.description}
                        {line.quantity > 1 ? ` × ${line.quantity}` : ''}
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
                      Workroom note
                    </p>
                    <p className="mt-3 text-[14px] font-light leading-relaxed text-ink-soft">
                      {order.note}
                    </p>
                  </div>
                ) : null}
                <p className="mt-8 text-[12px] font-light leading-relaxed text-stone">
                  Carriage included. Cut to order, four to eight weeks.
                </p>
              </div>
            </aside>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
