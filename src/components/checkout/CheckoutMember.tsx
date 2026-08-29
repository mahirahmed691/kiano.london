import { useAuth, useUser } from '@clerk/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { clerkContact } from '@/lib/clerk'
import { fetchHouseProfile, type HouseProfile } from '@/lib/house-profile'

type Props = {
  onPrefill: (patch: Partial<HouseProfile>) => void
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
    const member = user
    let cancelled = false

    async function load() {
      onPrefill(clerkContact(member))
      const token = await getToken()
      if (token) {
        await fetch('/api/member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: member.primaryEmailAddress?.emailAddress ?? '',
            name: member.fullName ?? '',
          }),
        })
      }
      const profile = await fetchHouseProfile(token)
      if (!cancelled && profile) onPrefill(profile)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, onPrefill, user])

  if (isSignedIn) {
    return (
      <p className="mt-6 text-[14px] font-light text-ink-soft">
        Signed in. Kept details will fill the till.{' '}
        <Link to="/account" className="border-b border-current pb-px">
          Change them
        </Link>
        .
      </p>
    )
  }

  return (
    <p className="mt-6 text-[14px] font-light text-ink-soft">
      Optional:{' '}
      <Link to="/sign-in" className="border-b border-current pb-px">
        sign in
      </Link>{' '}
      so the cut is kept against your account. This browser keeps the details for the next time.
    </p>
  )
}
