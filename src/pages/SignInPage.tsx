import { SignIn } from '@clerk/react'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { clerkEnabled } from '@/lib/clerk'
import { clerkAppearance } from '@/lib/clerkAppearance'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function SignInPage() {
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
              fallbackRedirectUrl="/account"
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
