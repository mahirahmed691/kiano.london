import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { HouseClock } from '@/components/brand/HouseClock'
import { Wordmark } from '@/components/brand/Wordmark'
import { AdminNavLink } from '@/components/layout/AdminNavLink'
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

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <header
        className="fixed inset-x-0 top-0 z-50 bg-black text-ivory"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="relative flex h-16 items-center justify-between border-b border-ivory/10 px-5 md:h-[4.5rem] md:px-12 lg:px-16">
          <Wordmark className="pointer-events-auto absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2" />

          <div className="flex min-w-0 items-center">
            <MegaMenu key={pathname} inverted installed={installed} />

            <button
              type="button"
              className={cn(
                'house-app-menu relative z-50 flex h-11 w-11 items-center justify-center',
                !installed && 'xl:hidden',
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

          <div className="relative z-20 flex items-center justify-end gap-6 lg:gap-9">
            <AdminNavLink
              className={cn(
                'house-installed-hide hidden text-[10px] uppercase tracking-[0.28em] transition-opacity hover:opacity-70 md:inline',
                installed && '!hidden',
              )}
            />
            <NavLink
              to="/account"
              className={cn(
                'house-installed-hide hidden text-[10px] uppercase tracking-[0.28em] transition-opacity hover:opacity-70 md:inline',
                installed && '!hidden',
              )}
            >
              Account
            </NavLink>
            <span className="flex items-center gap-3 md:gap-3.5">
              <HouseClock />
              <button
                type="button"
                className="text-[10px] uppercase tracking-[0.28em] transition-opacity hover:opacity-70"
                aria-label={count ? `Open bag, ${count} pieces` : 'Open bag'}
                onClick={() => setOpen(true)}
              >
                Bag{count ? ` ${String(count).padStart(2, '0')}` : ''}
              </button>
            </span>
            <WordLink className="text-[10px] uppercase tracking-[0.28em]" />
          </div>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
