import { useAuth, useUser } from '@clerk/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { CheckoutDetails } from '@/lib/checkout'
import { clerkContact } from '@/lib/clerk'

type Props = {
  onPrefill: (patch: Pick<CheckoutDetails, 'name' | 'email' | 'telephone'>) => void
  onToken: (getToken: () => Promise<string | null>) => void
}

export function CheckoutMember({ onPrefill, onToken }: Props) {
  const { getToken } = useAuth()
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    onToken(getToken)
  }, [getToken, onToken])

  useEffect(() => {
    if (!isSignedIn || !user) return
    onPrefill(clerkContact(user))
  }, [isSignedIn, onPrefill, user])

  if (isSignedIn) {
    return (
      <p className="mt-6 text-[14px] font-light text-ink-soft">
        Signed in. This reservation will sit on your account.
      </p>
    )
  }

  return (
    <p className="mt-6 text-[14px] font-light text-ink-soft">
      Optional:{' '}
      <Link to="/sign-in" className="border-b border-current pb-px">
        sign in
      </Link>{' '}
      so the cut is kept against your account.
    </p>
  )
}
