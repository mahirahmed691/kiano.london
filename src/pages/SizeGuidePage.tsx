import { Link } from 'react-router-dom'
import { SizeGuide } from '@/components/product/SizeGuide'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function SizeGuidePage() {
  usePageMeta(getShareMeta('/size-guide'))

  return (
    <Section className="pt-32 md:pt-40">
      <Container className="max-w-3xl">
        <Eyebrow>Size guide</Eyebrow>
        <Display as="h1" className="mt-4 text-4xl md:text-5xl">
          Size guide.
        </Display>
        <Body className="mt-6">
          Garment measurements for each size. If you are between sizes, or would like a fitting,{' '}
          <Link to="/visit" className="underline underline-offset-4">
            book an atelier visit
          </Link>
          .
        </Body>
        <SizeGuide className="mt-12" />
      </Container>
    </Section>
  )
}
