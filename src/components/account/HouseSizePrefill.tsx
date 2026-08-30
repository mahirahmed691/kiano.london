import { useAuth, useUser } from '@clerk/react'
import { useEffect, useRef } from 'react'
import { clerkContact } from '@/lib/clerk'
import {
  fetchHouseProfile,
  readStoredSize,
  writeStoredSize,
} from '@/lib/house-profile'
import type { ThobeSize } from '@/data/products'

export function HouseSizePrefill({
  chosen,
  onSize,
}: {
  chosen: ThobeSize | ''
  onSize: (size: ThobeSize) => void
}) {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const applied = useRef(false)
  const lastSent = useRef<ThobeSize | ''>('')

  useEffect(() => {
    if (chosen || applied.current) return
    const stored = readStoredSize()
    if (stored) {
      applied.current = true
      onSize(stored)
    }
  }, [chosen, onSize])

  useEffect(() => {
    if (chosen || applied.current || !isSignedIn || !user) return
    let cancelled = false

    async function load() {
      const profile = await fetchHouseProfile(await getToken())
      const size = profile?.size
      if (!cancelled && size) {
        applied.current = true
        writeStoredSize(size)
        onSize(size)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [chosen, getToken, isSignedIn, onSize, user])

  useEffect(() => {
    if (!chosen || lastSent.current === chosen) return
    lastSent.current = chosen
    writeStoredSize(chosen)
    if (!isSignedIn || !user) return
    const member = user
    void (async () => {
      const token = await getToken()
      if (!token) return
      const contact = clerkContact(member)
      await fetch('/api/member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: contact.email,
          name: contact.name,
          size: chosen,
        }),
      }).catch(() => undefined)
    })()
  }, [chosen, getToken, isSignedIn, user])

  return null
}
