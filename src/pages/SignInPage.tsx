import { SignIn } from '@clerk/react'
import { useSearchParams } from 'react-router-dom'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { clerkEnabled, emailFromSearch } from '@/lib/clerk'
import { clerkAppearance } from '@/lib/clerkAppearance'
import { isHouseRedirect } from '@/lib/house-redirect'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function SignInPage() {
  const [params] = useSearchParams()
  const requested = params.get('redirect_url')
  const fallbackRedirectUrl = isHouseRedirect(requested) ? requested : '/account'
  const email = emailFromSearch(params)
  usePageMeta(getShareMeta('/sign-in'))

  return (
    <Section fill className="pt-32 md:pt-40">
      <Container className="max-w-xl">
        <Eyebrow>Account</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          Sign in.
        </Display>
        <Body className="mt-6">
          The shop stays open without an account. Sign in to keep reservations against your name.
        </Body>
        <div className="mt-12">
          {clerkEnabled ? (
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl={email ? `/sign-up?email=${encodeURIComponent(email)}` : '/sign-up'}
              fallbackRedirectUrl={fallbackRedirectUrl}
              appearance={clerkAppearance}
              initialValues={email ? { emailAddress: email } : undefined}
            />
          ) : (
            <p className="text-[15px] font-light text-ink">Account is not configured yet.</p>
          )}
        </div>
      </Container>
    </Section>
  )
}
