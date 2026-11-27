import { useSearchParams } from 'react-router-dom'
import { HouseRoom } from '@/components/editorial/HouseRoom'
import { Button } from '@/components/ui/Button'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { site } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export function LettersUnsubscribedPage() {
  const [params] = useSearchParams()
  const unknown = params.get('unknown') === '1'
  usePageMeta({
    title: 'Unsubscribed — Kiano London',
    description: 'You will not receive letters from the Kiano London list.',
    path: '/letters/unsubscribed',
    robots: 'noindex',
  })

  return (
    <HouseRoom kicker="The list" title="Unsubscribed." containerClassName="max-w-2xl">
      <Eyebrow>The list</Eyebrow>
      <Display as="h1" className="mt-4 text-4xl md:text-5xl">
        {unknown ? 'This link has passed.' : 'You are off the list.'}
      </Display>
      <Body className="mt-6">
        {unknown
          ? `We could not find that address. If letters still reach you, write to ${site.email} and we will remove it by hand.`
          : 'No more letters from the list. Order emails, if you buy a piece, still arrive. If this was a mistake, you can join again from any page.'}
      </Body>
      <div className="mt-10">
        <Button to="/shop">The Shop</Button>
      </div>
    </HouseRoom>
  )
}
