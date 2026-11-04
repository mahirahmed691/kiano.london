import { Link } from 'react-router-dom'
import { HouseRoom } from '@/components/editorial/HouseRoom'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { packingNote } from '@/data/packing'
import { deliveryPolicy } from '@/data/policies'
import { site } from '@/data/site'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function DeliveryPage() {
  usePageMeta(getShareMeta('/delivery'))

  return (
    <HouseRoom
      kicker="Delivery"
      title="Delivery."
      image="/images/pack-bag.jpg"
      imageAlt="A Kiano London garment bag, ready for a piece to be sent."
      objectPosition="center 18%"
      containerClassName="max-w-2xl"
    >
      <Eyebrow>Delivery</Eyebrow>
      <Display as="h1" className="mt-4 text-4xl md:text-5xl">
        Delivery.
      </Display>
      <Body className="mt-6">Free delivery on every order. Each piece is made to order.</Body>

      <ul className="mt-14 space-y-10">
        {deliveryPolicy.map((item) => (
          <li key={item.title}>
            <h2 className="text-[11px] uppercase tracking-[0.22em] text-stone">{item.title}</h2>
            <Body className="mt-3">{item.body}</Body>
          </li>
        ))}
        <li>
          <h2 className="text-[11px] uppercase tracking-[0.22em] text-stone">Packing</h2>
          <Body className="mt-3">{packingNote}</Body>
        </li>
      </ul>

      <Body className="mt-16 border-t border-rule pt-12">
        Questions about an order:{' '}
        <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        . For returns, see the{' '}
        <Link to="/returns" className="underline underline-offset-4">
          returns policy
        </Link>
        .
      </Body>
    </HouseRoom>
  )
}
