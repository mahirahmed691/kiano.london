import { SignUp } from '@clerk/react'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { clerkEnabled } from '@/lib/clerk'
import { clerkAppearance } from '@/lib/clerkAppearance'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function SignUpPage() {
  usePageMeta(getShareMeta('/sign-up'))

  return (
    <Section className="pt-32 md:pt-40">
      <Container className="max-w-xl">
        <Eyebrow>Account</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          Open an account.
        </Display>
        <Body className="mt-6">
          Use the same email you give at checkout so earlier cuts sit on this page.
        </Body>
        <div className="mt-12">
          {clerkEnabled ? (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
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
