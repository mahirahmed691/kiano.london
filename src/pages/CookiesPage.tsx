import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { clearConsent } from '@/lib/notices'
import { site } from '@/data/site'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function CookiesPage() {
  usePageMeta(getShareMeta('/cookies'))

  return (
    <Section className="pt-32 md:pt-40">
      <Container className="max-w-2xl">
        <Eyebrow>The house</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          Cookies.
        </Display>
        <Body className="mt-6">
          We keep as little as the site needs to work. Nothing is sold to advertisers. Nothing is
          used to follow you onto other sites.
        </Body>

        <ul className="mt-14 space-y-10">
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The bag</p>
            <Body className="mt-3">
              Pieces you hold are stored in this browser so the bag is still there if you return.
              That is not a tracking cookie.
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Account</p>
            <Body className="mt-3">
              Sign-in is run by Clerk. Their cookies keep you signed in. The shop works without an
              account.
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">This notice</p>
            <Body className="mt-3">
              Your choice is stored locally so we do not ask again on every page. It does not
              identify you.
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Payment</p>
            <Body className="mt-3">
              Stripe runs checkout on their own pages. We do not place advertising cookies for
              payment.
            </Body>
          </li>
        </ul>

        <Body className="mt-14">
          Necessary only and Accept do the same work today: the site has no optional advertising
          cookies to turn on. Write to {site.email} if you want a record erased.
        </Body>

        <div className="mt-10">
          <Button
            onClick={() => {
              clearConsent()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Ask again
          </Button>
        </div>
      </Container>
    </Section>
  )
}
