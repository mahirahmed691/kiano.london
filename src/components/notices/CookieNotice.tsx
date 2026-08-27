import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { overlayPaths } from '@/data/navigation'
import { readConsent, writeConsent, type ConsentChoice } from '@/lib/notices'

const platePaths = new Set<string>([...overlayPaths, '/shop', '/visit'])

export function CookieNotice() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const overlay = platePaths.has(pathname)
  const [scrolled, setScrolled] = useState(false)
  const [seenPath, setSeenPath] = useState(pathname)
  if (seenPath !== pathname) {
    setSeenPath(pathname)
    setScrolled(false)
  }
  const plateClear = !overlay || scrolled

  useEffect(() => {
    const sync = () => setOpen(!readConsent())
    sync()
    window.addEventListener('kiano-consent', sync)
    return () => window.removeEventListener('kiano-consent', sync)
  }, [])

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => {
      if (window.scrollY > 32) setScrolled(true)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay, pathname])

  function choose(choice: ConsentChoice) {
    writeConsent(choice)
    setOpen(false)
  }

  if (!open || !plateClear) return null

  return (
    <div
      className="shell-lift fixed inset-x-0 bottom-0 z-[55] border-t border-rule bg-ivory/95 px-5 py-2.5 md:px-12"
      role="dialog"
      aria-label="Cookies"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="min-w-0 text-[13px] font-light leading-snug text-ink-soft md:text-[15px] md:leading-relaxed">
          <span className="mr-3 text-[11px] uppercase tracking-[0.22em] text-stone">Cookies</span>
          The bag, your account, and this notice. Nothing is sold to advertisers.{' '}
          <Link to="/cookies" className="border-b border-current pb-px">
            What we keep
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button className="min-h-9 px-4 py-1.5" variant="solid" onClick={() => choose('all')}>
            Accept
          </Button>
          <Button className="min-h-9 px-4 py-1.5" onClick={() => choose('necessary')}>
            Necessary
          </Button>
        </div>
      </div>
    </div>
  )
}
