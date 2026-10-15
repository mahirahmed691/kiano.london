import { ImageFrame } from '@/components/editorial/ImageFrame'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Display, Body } from '@/components/ui/Heading'
import { usePageMeta } from '@/lib/usePageMeta'

export function NotFoundPage() {
  usePageMeta({
    title: 'Page not found — Kiano London',
    description: 'This page does not exist on the Kiano London website.',
    path: '/404',
  })

  return (
    <Section fill className="flex items-center pt-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">404</p>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl">
              This room is empty.
            </Display>
            <Body className="mt-6">The page you asked for is not under Kiano London.</Body>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button to="/shop">The Shop</Button>
              <TextLink to="/collection">The Collection</TextLink>
              <TextLink to="/scent">The Scent</TextLink>
              <TextLink to="/visit">Visit</TextLink>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <ImageFrame
              src="/images/atelier-rail.jpg"
              alt="The house line on the rail."
              className="aspect-[4/5] w-full"
              objectPosition="18% 40%"
              caption="The line."
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
