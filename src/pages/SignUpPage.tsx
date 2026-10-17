import { SignUp } from '@clerk/react'
import { useSearchParams } from 'react-router-dom'
import { HouseRoom } from '@/components/editorial/HouseRoom'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { clerkEnabled, emailFromSearch } from '@/lib/clerk'
import { clerkAppearance } from '@/lib/clerkAppearance'
import { isHouseRedirect } from '@/lib/house-redirect'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function SignUpPage() {
  const [params] = useSearchParams()
  const requested = params.get('redirect_url')
  const fallbackRedirectUrl = isHouseRedirect(requested) ? requested : '/account'
  const email = emailFromSearch(params)
  usePageMeta(getShareMeta('/sign-up'))

  return (
    <HouseRoom kicker="The house" title="Open an account." containerClassName="max-w-xl">
      <Eyebrow>The house</Eyebrow>
      <Display as="h1" className="mt-4 text-4xl md:text-5xl">
        Open an account.
      </Display>
      <Body className="mt-6">
        Use the same email you give at the till so earlier cuts sit on this page.
      </Body>
      <div className="mt-12">
        {clerkEnabled ? (
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl={email ? `/sign-in?email=${encodeURIComponent(email)}` : '/sign-in'}
            fallbackRedirectUrl={fallbackRedirectUrl}
            appearance={clerkAppearance}
            initialValues={email ? { emailAddress: email } : undefined}
          />
        ) : (
          <p className="text-[15px] font-light text-ink">Account is not configured yet.</p>
        )}
      </div>
    </HouseRoom>
  )
}
