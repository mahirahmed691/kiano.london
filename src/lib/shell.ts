import { useEffect, useState } from 'react'

export function houseAppNow() {
  return typeof window !== 'undefined' && Boolean(window.__KIANO_NATIVE)
}

export function useHouseApp() {
  const [app, setApp] = useState(houseAppNow)

  useEffect(() => {
    const sync = () => setApp(houseAppNow())
    sync()
    window.addEventListener('kiano-native', sync)
    return () => window.removeEventListener('kiano-native', sync)
  }, [])

  return app
}
