import { Link } from 'react-router-dom'
import { HouseRoom } from '@/components/editorial/HouseRoom'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { termsBlocks, termsLead } from '@/data/terms'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function TermsPage() {
  usePageMeta(getShareMeta('/terms'))

  return (
    <HouseRoom kicker="The house" title="Terms." containerClassName="max-w-2xl">
      <Eyebrow>The house</Eyebrow>
      <Display as="h1" className="mt-4 text-4xl md:text-5xl">
        Terms.
      </Display>
      <Body className="mt-6">{termsLead}</Body>

      <ul className="mt-14 space-y-10">
        {termsBlocks.map((item) => (
          <li key={item.title}>
            <h2 className="text-[11px] uppercase tracking-[0.22em] text-stone">{item.title}</h2>
            <Body className="mt-3">{item.body}</Body>
          </li>
        ))}
      </ul>

      <p className="mt-16 flex flex-wrap gap-x-8 gap-y-3 text-[14px] font-light">
        <Link to="/delivery" className="border-b border-current pb-px">Delivery</Link>
        <Link to="/returns" className="border-b border-current pb-px">Returns</Link>
        <Link to="/privacy" className="border-b border-current pb-px">Privacy</Link>
      </p>
    </HouseRoom>
  )
}
