import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HouseCardSheet } from '@/components/packing/HouseCardSheet'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import type { CheckoutOrder } from '@/lib/checkout'
import { houseCardFromCheckout, type HouseCard } from '@/lib/house-card'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function OrderCardPage() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const [card, setCard] = useState<HouseCard | null>(null)
  const [missing, setMissing] = useState(!sessionId)

  usePageMeta({
    ...getShareMeta('/order/card'),
    title: card ? `${card.reference} — Kiano London` : 'The house card — Kiano London',
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
        const data = (await response.json()) as CheckoutOrder & { error?: string }
        if (cancelled) return
        if (
          !response.ok ||
          (data.paymentStatus !== 'paid' && data.paymentStatus !== 'no_payment_required')
        ) {
          setMissing(true)
          return
        }
        setCard(houseCardFromCheckout(data))
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
          <Eyebrow>House card</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl md:text-6xl">
            This card could not be found.
          </Display>
          <Body className="mt-8">
            Open it from the confirmation, with the session from payment.
          </Body>
          <div className="mt-12">
            <TextLink to="/">Return to the house</TextLink>
          </div>
        </Container>
      </Section>
    )
  }

  if (!card) {
    return (
      <Section className="pt-32 md:pt-40">
        <Container>
          <p className="text-[15px] font-light text-ink-soft">Reading the card.</p>
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
        <HouseCardSheet card={card} />
      </Container>
    </Section>
  )
}
