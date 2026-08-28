import { useEffect, useState } from 'react'

export function useLineHeld() {
  const [held, setHeld] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)

  useEffect(() => {
    const sync = () => setHeld(!navigator.onLine)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  return held
}
