import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function LettersConfirmedPage() {
  usePageMeta(getShareMeta('/letters/confirmed'))

  return (
    <Section className="pt-32 md:pt-40">
      <Container className="max-w-2xl">
        <Eyebrow>The list</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          The address is held.
        </Display>
        <Body className="mt-6">
          Thank you. A few letters a year: cloth, a name, and when a piece can be reserved.
        </Body>
        <div className="mt-10">
          <Button to="/shop">The Shop</Button>
        </div>
      </Container>
    </Section>
  )
}
