import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { HouseClock } from '@/components/brand/HouseClock'
import { HouseMark } from '@/components/brand/HouseMark'
import { AdminNavLink } from '@/components/layout/AdminNavLink'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { MobileNav } from '@/components/layout/MobileNav'
import { WordLink } from '@/components/notices/WordLink'
import { headerOverlays } from '@/data/navigation'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/cn'

export function Header() {
  const { pathname } = useLocation()
  const { count, setOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const overlay = headerOverlays(pathname)
  const inverted = overlay && !scrolled && !menuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          inverted ? 'bg-transparent text-ivory' : 'bg-ivory text-ink',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div
          className={cn(
            'relative grid h-[5.25rem] grid-cols-[1fr_auto_1fr] items-center border-b border-transparent px-5 md:h-[5.75rem] md:px-12 lg:px-16',
            !inverted && 'border-rule/80',
          )}
        >
          <MegaMenu key={pathname} inverted={inverted} />


          <button
            type="button"
            className={cn(
              'relative z-50 flex h-11 w-11 items-center justify-center md:hidden',
              inverted && 'drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)]',
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

          <HouseMark inverted={inverted} />

          <div className="flex items-center justify-end gap-6 lg:gap-9">
            <AdminNavLink
              className={cn(
                'hidden text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 md:inline',
                inverted && 'drop-shadow-[0_1px_8px_rgba(20,18,16,0.55)]',
              )}
            />
            <NavLink
              to="/account"
              className={cn(
                'hidden text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 md:inline',
                inverted && 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]',
              )}
            >
              Account
            </NavLink>
            <WordLink
              className={cn(
                'text-[11px] uppercase tracking-[0.22em]',
                inverted && 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]',
              )}
            />
            <span className="flex items-center gap-3.5 md:gap-4">
              <HouseClock
                className={cn(inverted && 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]')}
              />
              <button
                type="button"
                className={cn(
                  'text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70',
                  inverted && 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]',
                )}
                aria-label={count ? `Open bag, ${count} pieces` : 'Open bag'}
                onClick={() => setOpen(true)}
              >
                Bag{count ? ` ${String(count).padStart(2, '0')}` : ''}
              </button>
            </span>
          </div>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
