import { HouseRoom } from '@/components/editorial/HouseRoom'
import { Button, TextLink } from '@/components/ui/Button'
import { Body, Display } from '@/components/ui/Heading'
import { usePageMeta } from '@/lib/usePageMeta'

export function NotFoundPage() {
  usePageMeta({
    title: 'This room is empty — Kiano London',
    description: 'This page does not exist on the Kiano London website.',
    path: '/404',
  })

  return (
    <HouseRoom
      kicker="The house"
      title="This room is empty."
      image="/images/atelier-rail.jpg"
      imageAlt="The house line on the rail."
      objectPosition="18% 40%"
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The house</p>
      <Display as="h1" className="mt-4 text-4xl md:text-5xl">
        This room is empty.
      </Display>
      <Body className="mt-6">The page you asked for is not under Kiano London.</Body>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button to="/shop">The Shop</Button>
        <TextLink to="/collection">The Collection</TextLink>
        <TextLink to="/scent">The Scent</TextLink>
        <TextLink to="/visit">Visit</TextLink>
      </div>
    </HouseRoom>
  )
}
