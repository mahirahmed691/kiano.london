import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { productPath } from '@/data/products'
import { useCart } from '@/lib/cart'
import { formatGbp } from '@/lib/money'
import { usePageMeta } from '@/lib/usePageMeta'

export function CheckoutPage() {
  const { items, subtotalPence, count } = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  usePageMeta({
    title: 'Checkout — Suhail',
    description: 'Reserve a Suhail thobe. Made to order in London, four to eight weeks.',
    path: '/checkout',
  })

  async function pay() {
    setError('')
    setBusy(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      })
      const data = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'The payment page could not be opened.')
      }
      window.location.href = data.url
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The payment page could not be opened.')
      setBusy(false)
    }
  }

  if (items.length === 0) {
    return (
      <Section className="pt-32 md:pt-40">
        <Container>
          <Eyebrow>Checkout</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl md:text-6xl">
            Nothing is held.
          </Display>
          <Body className="mt-6">The bag is empty. Choose a thobe first.</Body>
          <div className="mt-10">
            <Button to="/shop">The Shop</Button>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section className="pt-32 md:pt-40">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow>Checkout</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl">
              Reserve the cut.
            </Display>
            <Body className="mt-6">
              {String(count).padStart(2, '0')} {count === 1 ? 'piece' : 'pieces'}. Each thobe is
              made after payment, from the Suhail block, in four to eight weeks. Carriage is
              included.
            </Body>
            <ul className="mt-12">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="grid grid-cols-[6.5rem_1fr] gap-5 border-t border-rule py-6"
                >
                  <Link
                    to={productPath(item.product)}
                    className="img-zoom aspect-[3/4] overflow-hidden bg-ivory-deep"
                  >
                    <img
                      src={item.product.image}
                      alt=""
                      className="size-full object-cover"
                      style={
                        item.product.objectPosition
                          ? { objectPosition: item.product.objectPosition }
                          : undefined
                      }
                    />
                  </Link>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="font-display text-2xl font-light">{item.product.name}</p>
                      <p className="mt-1 text-[13px] font-light text-stone">
                        Size {item.size} · Qty {item.quantity} · {item.product.cloth}
                      </p>
                    </div>
                    <p className="text-[13px] tracking-[0.06em]">
                      {formatGbp(item.product.pricePence * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
            <div className="border-t border-ink pt-8">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">To pay</p>
                <p className="font-display text-4xl font-light">{formatGbp(subtotalPence)}</p>
              </div>
              <p className="mt-6 text-[14px] font-light leading-relaxed text-ink-soft">
                Card, Apple Pay and Google Pay are taken on Stripe. You will return here when
                the cut is reserved.
              </p>
              {error ? (
                <p className="mt-6 text-[14px] font-light text-ink" role="alert">
                  {error}
                </p>
              ) : null}
              <Button
                variant="solid"
                className="mt-8 w-full justify-center"
                onClick={() => void pay()}
                disabled={busy}
              >
                {busy ? 'Opening payment' : 'Pay by card'}
              </Button>
              <div className="mt-6">
                <TextLink to="/shop">Continue looking</TextLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
