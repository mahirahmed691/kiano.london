import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CookieNotice } from '@/components/notices/CookieNotice'
import { SubscribeDialog } from '@/components/notices/SubscribeDialog'
import { useHouseApp } from '@/lib/shell'
import {
  countLetterPath,
  dismissLetters,
  lettersDismissed,
  lettersJoined,
  quietLetterPaths,
  readConsent,
} from '@/lib/notices'

export function HouseNotices() {
  const app = useHouseApp()
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

    // Never on the first page of a visit. From the second, ask only once the visitor is
    // reading: 15 seconds on the page, or two thirds of the way down it. Never over the
    // bag, the sign-in panel or the menu.
    const pages = countLetterPath(pathname)
    if (pages < 2) return

    let done = false
    const busy = () =>
      document.body.style.overflow === 'hidden' ||
      Boolean(document.querySelector('[role="dialog"][aria-hidden="false"]'))
    const ask = () => {
      if (done || busy()) return
      done = true
      setLettersOpen(true)
    }
    const timer = window.setTimeout(ask, 15000)
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && window.scrollY / max >= 0.66) ask()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      done = true
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [hasConsent, pathname])

  return (
    <>
      <CookieNotice />
      {app ? null : (
        <SubscribeDialog
          open={lettersOpen}
          onClose={() => {
            dismissLetters()
            setLettersOpen(false)
          }}
        />
      )}
    </>
  )
}
