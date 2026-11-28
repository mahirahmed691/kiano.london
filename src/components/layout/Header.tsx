import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HouseClock } from '@/components/brand/HouseClock'
import { Wordmark } from '@/components/brand/Wordmark'
import { AdminNavLink } from '@/components/layout/AdminNavLink'
import { HeaderSignIn } from '@/components/layout/HeaderSignIn'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { MobileNav } from '@/components/layout/MobileNav'
import { WordLink } from '@/components/notices/WordLink'
import { useCart } from '@/lib/cart'
import { useInstalledHouse } from '@/lib/shell'
import { cn } from '@/lib/cn'

export function Header() {
  const { pathname } = useLocation()
  const { count, setOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const installed = useInstalledHouse()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // After the first screenful the header slims to the mark alone.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])
  const compact = scrolled && !menuOpen

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <header
        className="fixed inset-x-0 top-0 z-50 bg-[rgb(8_7_6/0.88)] text-ivory backdrop-blur-md backdrop-saturate-150"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div
          className={cn(
            'relative flex items-center justify-between border-b border-ivory/10 px-5 transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-12 lg:px-16',
            compact ? 'h-[3.75rem] md:h-[4.25rem]' : 'h-[5.25rem] md:h-[5.75rem]',
          )}
        >
          <Wordmark
            compact={compact}
            className="pointer-events-auto absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          />

          <div className="flex min-w-0 items-center">
            <MegaMenu key={pathname} inverted installed={installed} />

            <button
              type="button"
              className={cn(
                'house-app-menu relative z-50 flex h-11 w-11 items-center justify-center',
                !installed && 'lg:hidden',
              )}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <span className="relative block h-3 w-6">
                <span
                  className={cn(
                    'absolute left-0 block h-px w-6 bg-current transition-transform duration-300',
                    menuOpen ? 'top-1.5 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 block h-px w-6 bg-current transition-transform duration-300',
                    menuOpen ? 'top-1.5 -rotate-45' : 'top-3',
                  )}
                />
              </span>
            </button>
          </div>

          <div className="relative z-20 flex items-center justify-end gap-4 sm:gap-6 lg:gap-9">
            <AdminNavLink
              className={cn(
                'house-installed-hide hidden text-[10px] uppercase tracking-[0.28em] transition-opacity hover:opacity-70 md:inline',
                installed && '!hidden',
              )}
            />
            <HeaderSignIn className={cn('house-installed-hide', installed && '!hidden')} />
            <span className="flex items-center gap-3 md:gap-3.5">
              {/* Decorative; dropped on phones so the right side never runs into the centred mark. */}
              <span className="hidden sm:inline-flex lg:hidden">
                <HouseClock />
              </span>
              <button
                type="button"
                className="text-[10px] uppercase tracking-[0.28em] transition-opacity hover:opacity-70 max-sm:-my-3 max-sm:py-3"
                aria-label={count ? `Open bag, ${count} pieces` : 'Open bag'}
                onClick={() => setOpen(true)}
              >
                Bag{count ? ` ${String(count).padStart(2, '0')}` : ''}
              </button>
            </span>
            <WordLink className="text-[10px] uppercase tracking-[0.28em] max-sm:-m-3 max-sm:p-3" />
          </div>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
