import { useEffect, useState } from 'react'

export function houseAppNow() {
  return typeof window !== 'undefined' && Boolean(window.__KIANO_NATIVE)
}

export function installedHouseNow() {
  if (typeof window === 'undefined') return false
  const standalone = window.matchMedia('(display-mode: standalone)').matches
  const fullscreen = window.matchMedia('(display-mode: fullscreen)').matches
  const ios = Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  return standalone || fullscreen || ios
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

/** Add-to-Home-Screen / installed PWA. The native shell hides this header and draws its own. */
export function useInstalledHouse() {
  const [installed, setInstalled] = useState(installedHouseNow)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)')
    const fullscreen = window.matchMedia('(display-mode: fullscreen)')
    const sync = () => {
      const next = installedHouseNow()
      document.documentElement.classList.toggle('shell-installed', next)
      setInstalled(next)
    }
    sync()
    standalone.addEventListener('change', sync)
    fullscreen.addEventListener('change', sync)
    return () => {
      standalone.removeEventListener('change', sync)
      fullscreen.removeEventListener('change', sync)
      document.documentElement.classList.remove('shell-installed')
    }
  }, [])

  return installed
}
