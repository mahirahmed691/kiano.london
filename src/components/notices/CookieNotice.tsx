import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { readConsent, writeConsent, type ConsentChoice } from '@/lib/notices'

export function CookieNotice() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => setOpen(!readConsent())
    sync()
    window.addEventListener('kiano-consent', sync)
    return () => window.removeEventListener('kiano-consent', sync)
  }, [])

  function choose(choice: ConsentChoice) {
    writeConsent(choice)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-rule bg-ivory/95 px-5 py-4 backdrop-blur-[2px] md:px-12"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      role="dialog"
      aria-label="Cookies"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Cookies</p>
          <p className="mt-2 text-[15px] font-light leading-relaxed text-ink-soft">
            The bag, your account, and this notice. Nothing is sold to advertisers.{' '}
            <Link to="/cookies" className="border-b border-current pb-px">
              What we keep
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="solid" onClick={() => choose('all')}>
            Accept
          </Button>
          <Button onClick={() => choose('necessary')}>Necessary only</Button>
        </div>
      </div>
    </div>
  )
}
