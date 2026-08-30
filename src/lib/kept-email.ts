import { useEffect, useState } from 'react'
import { readStoredCheckout } from '@/lib/checkout'
import { HOUSE_DETAILS_EVENT } from '@/lib/house-profile'

export function useKeptEmail(seed = '') {
  const [email, setEmail] = useState(() => seed.trim() || readStoredCheckout().email)
  const [touched, setTouched] = useState(Boolean(seed.trim()))

  useEffect(() => {
    if (touched) return
    const sync = () => {
      const next = readStoredCheckout().email
      if (next) setEmail((current) => current || next)
    }
    window.addEventListener(HOUSE_DETAILS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(HOUSE_DETAILS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [touched])

  return {
    email,
    setEmail(value: string) {
      setTouched(true)
      setEmail(value)
    },
  }
}
