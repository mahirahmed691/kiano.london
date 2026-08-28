import { Link } from 'react-router-dom'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { site } from '@/data/site'
import { social } from '@/data/social'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function PrivacyPage() {
  usePageMeta(getShareMeta('/privacy'))

  return (
    <Section className="pt-32 md:pt-40">
      <Container className="max-w-2xl">
        <Eyebrow>The house</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          Privacy.
        </Display>
        <Body className="mt-6">
          We hold what is needed to cut a garment, keep an account, or write when you asked us to.
          We do not sell a list.
        </Body>

        <ul className="mt-14 space-y-10">
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">A visit or a note</p>
            <Body className="mt-3">
              The appointment form opens mail to {site.email}. That letter lives in the atelier
              inbox.
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Account</p>
            <Body className="mt-3">
              Member sign-in is Clerk. Name and email sit there, and on this site so a reservation
              can be shown against the same address.
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">A reservation</p>
            <Body className="mt-3">
              Payment is Stripe. The order, the size, and the delivery address are kept in our
              database so the cloth can be cut and sent. You can ask after a reserved cut with the
              eight-letter reference and the email used at the till, on{' '}
              <Link to="/reservation" className="border-b border-current pb-px">
                a reserved cut
              </Link>
              . If a reserved cut cannot be worn, write as set out on{' '}
              <Link to="/returns" className="border-b border-current pb-px">
                if it must return
              </Link>
              .
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The list</p>
            <Body className="mt-3">
              If you join the list, we store the email and wait for you to confirm it. Letters are
              about cloth and when a piece can be reserved. Leave by writing to {site.email}.
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Word from the house</p>
            <Body className="mt-3">
              If you keep an account, notices of a reserved cut sit against it. The ledger receives
              word of visits, the list, and remaining cuts. On the installable app, that word can
              also arrive as a device notice, if you allow it.
            </Body>
          </li>
          {social.length ? (
            <li>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Elsewhere</p>
              <Body className="mt-3">
                Public pages of the house sit on those services. We do not place their pixels on
                this site.
              </Body>
            </li>
          ) : null}
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Cookies</p>
            <Body className="mt-3">
              The bag, this notice, and the line on this device stay in the browser. Detail sits on the{' '}
              <Link to="/cookies" className="border-b border-current pb-px">
                cookies
              </Link>{' '}
              page.
            </Body>
          </li>
        </ul>

        <Body className="mt-14">
          Questions, a correction, or a request to forget an address: {site.email}.
        </Body>
      </Container>
    </Section>
  )
}
