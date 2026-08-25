import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CookieNotice } from '@/components/notices/CookieNotice'
import { SubscribeDialog } from '@/components/notices/SubscribeDialog'
import {
  countLetterPath,
  dismissLetters,
  lettersDismissed,
  lettersJoined,
  quietLetterPaths,
  readConsent,
} from '@/lib/notices'

export function HouseNotices() {
  const { pathname } = useLocation()
  const [hasConsent, setHasConsent] = useState(false)
  const [lettersOpen, setLettersOpen] = useState(false)

  useEffect(() => {
    const sync = () => setHasConsent(Boolean(readConsent()))
    sync()
    window.addEventListener('kiano-consent', sync)
    return () => window.removeEventListener('kiano-consent', sync)
  }, [])

  useEffect(() => {
    if (!hasConsent) {
      setLettersOpen(false)
      return
    }
    if (lettersJoined() || lettersDismissed()) return
    if (quietLetterPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      setLettersOpen(false)
      return
    }

    const pages = countLetterPath(pathname)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = reduce ? 400 : pages >= 2 ? 2500 : 8000
    const timer = window.setTimeout(() => setLettersOpen(true), delay)
    return () => window.clearTimeout(timer)
  }, [hasConsent, pathname])

  return (
    <>
      <CookieNotice />
      <SubscribeDialog
        open={lettersOpen}
        onClose={() => {
          dismissLetters()
          setLettersOpen(false)
        }}
      />
    </>
  )
}
