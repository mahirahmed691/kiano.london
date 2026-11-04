import { Link } from 'react-router-dom'
import { HouseRoom } from '@/components/editorial/HouseRoom'
import { ReturnForm } from '@/components/visit/ReturnForm'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { site } from '@/data/site'
import { packingNote } from '@/data/packing'
import { returnsPolicy, returnsSummary } from '@/data/policies'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function ReturnsPage() {
  usePageMeta(getShareMeta('/returns'))

  return (
    <HouseRoom
      kicker="Returns"
      title="Returns."
      image="/images/pack-bag.jpg"
      imageAlt="A Kiano London garment bag, ready for a piece to be sent."
      objectPosition="center 18%"
      containerClassName="max-w-2xl"
    >
        <Eyebrow>Returns</Eyebrow>
        <Display as="h1" className="mt-4 text-4xl md:text-5xl">
          Returns.
        </Display>
        <Body className="mt-6">{returnsSummary}</Body>

        <ul className="mt-14 space-y-10">
          {returnsPolicy.map((item) => (
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

        <div className="mt-16 border-t border-rule pt-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Start a return</p>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            Tell us first.
          </Display>
          <Body className="mt-6">
            Use the form with your order reference and we will reply with how to send the piece
            back. If you would rather email:{' '}
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </Body>
          <div className="mt-10">
            <ReturnForm />
          </div>
        </div>

        <p className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          <Link to="/reservation" className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70">
            Ask after a reserved cut
          </Link>
          <Link to="/account" className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70">
            Account
          </Link>
        </p>
    </HouseRoom>
  )
}
