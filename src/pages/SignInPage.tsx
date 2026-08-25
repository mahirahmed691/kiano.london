import { SignIn } from '@clerk/react'
import { useSearchParams } from 'react-router-dom'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { clerkEnabled } from '@/lib/clerk'
import { clerkAppearance } from '@/lib/clerkAppearance'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const allowedRedirects = new Set(['/admin', '/account', '/checkout'])

export function SignInPage() {
  const [params] = useSearchParams()
  const requested = params.get('redirect_url')
  const fallbackRedirectUrl = requested && allowedRedirects.has(requested) ? requested : '/account'
  usePageMeta(getShareMeta('/sign-in'))

  return (
    <Section className="pt-32 md:pt-40">
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
              signUpUrl="/sign-up"
              fallbackRedirectUrl={fallbackRedirectUrl}
              appearance={clerkAppearance}
            />
          ) : (
            <p className="text-[15px] font-light text-ink">Account is not configured yet.</p>
          )}
        </div>
      </Container>
    </Section>
  )
}
