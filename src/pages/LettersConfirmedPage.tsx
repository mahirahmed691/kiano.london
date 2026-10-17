import { HouseRoom } from '@/components/editorial/HouseRoom'
import { Button } from '@/components/ui/Button'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function LettersConfirmedPage() {
  usePageMeta(getShareMeta('/letters/confirmed'))

  return (
    <HouseRoom kicker="The list" title="The address is held." containerClassName="max-w-2xl">
      <Eyebrow>The list</Eyebrow>
      <Display as="h1" className="mt-4 text-4xl md:text-5xl">
        The address is held.
      </Display>
      <Body className="mt-6">
        Thank you. A few letters a year: cloth, a name, and when a piece can be reserved.
      </Body>
      <div className="mt-10">
        <Button to="/shop">The Shop</Button>
      </div>
    </HouseRoom>
  )
}
