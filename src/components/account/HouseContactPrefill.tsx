import { useAuth, useUser } from '@clerk/react'
import { useEffect } from 'react'
import { clerkContact } from '@/lib/clerk'
import { fetchHouseProfile, type HouseProfile } from '@/lib/house-profile'

export function HouseContactPrefill({
  onPrefill,
}: {
  onPrefill: (patch: Partial<HouseProfile>) => void
}) {
  const { getToken } = useAuth()
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (!isSignedIn || !user) return
    const member = user
    let cancelled = false

    async function load() {
      onPrefill(clerkContact(member))
      const profile = await fetchHouseProfile(await getToken())
      if (!cancelled && profile) onPrefill(profile)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, onPrefill, user])

  return null
}
