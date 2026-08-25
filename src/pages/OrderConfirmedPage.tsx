import { useEffect } from 'react'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { useCart } from '@/lib/cart'
import { usePageMeta } from '@/lib/usePageMeta'

export function OrderConfirmedPage() {
  const { clear } = useCart()

  usePageMeta({
    title: 'The cut is reserved — Kiano London',
    description: 'Your piece is reserved. Cut in London, four to eight weeks.',
    path: '/order/confirmed',
  })

  useEffect(() => {
    clear()
  }, [clear])

  return (
    <Section className="pt-32 md:pt-40">
      <Container>
        <Eyebrow>Order</Eyebrow>
        <Display as="h1" className="mt-4 max-w-3xl text-5xl md:text-6xl lg:text-7xl">
          The cut is reserved.
        </Display>
        <Body className="mt-8">
          Payment is held. Cloth will be cut from the house block in four to eight weeks.
          A note will follow if a fitting is needed before it leaves the workroom.
        </Body>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Button to="/collection">The Collection</Button>
          <TextLink to="/visit">Visit the atelier</TextLink>
        </div>
      </Container>
    </Section>
  )
}
