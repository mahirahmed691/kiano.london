import { HowToMeasure } from '@/components/product/HowToMeasure'
import { SizeGuide } from '@/components/product/SizeGuide'
import { HouseRoom } from '@/components/editorial/HouseRoom'
import { TextLink } from '@/components/ui/Button'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { AppointmentForm } from '@/components/visit/AppointmentForm'
import { site } from '@/data/site'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

/** Contact. There is no shop or fitting room: every piece is made to order and sent. */
export function VisitPage() {
  usePageMeta(getShareMeta('/contact'))

  return (
    <HouseRoom
      kicker="Contact"
      title="Contact."
      image="/images/cutting-room.jpg"
      imageAlt="Paper, shears, and cloth: the work of a thobe."
      objectPosition="center 40%"
      containerClassName="max-w-5xl"
    >
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>Contact</Eyebrow>
          <Display as="h1" className="mt-4 text-4xl md:text-5xl">
            Contact.
          </Display>
          <Body className="mt-6">
            Questions about sizing, an order or delivery? Write to us and we will reply within two
            working days. Every piece is made to order and sent to you; there is no shop to visit.
          </Body>
          <p className="mt-8 text-[15px] font-light">
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <ul className="mt-10 space-y-4">
            <li>
              <TextLink to="/reservation">Find an order</TextLink>
            </li>
            <li>
              <TextLink to="/delivery">Delivery</TextLink>
            </li>
            <li>
              <TextLink to="/returns">Returns</TextLink>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <AppointmentForm />
        </div>
      </div>

      <div className="mt-24">
        <HowToMeasure />
        <div className="mt-16 max-w-2xl">
          <SizeGuide />
        </div>
      </div>
    </HouseRoom>
  )
}
