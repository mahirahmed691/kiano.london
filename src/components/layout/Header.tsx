import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { HouseMark } from '@/components/brand/HouseMark'
import { MobileNav } from '@/components/layout/MobileNav'
import { overlayPaths, primaryNav } from '@/data/navigation'
import { cn } from '@/lib/cn'

export function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const overlay = overlayPaths.includes(pathname as (typeof overlayPaths)[number])
  const inverted = overlay && !scrolled && !open

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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          inverted ? 'bg-transparent text-ivory' : 'bg-ivory/95 text-ink backdrop-blur-[2px]',
          !inverted && 'border-b border-rule/80',
        )}
      >
        <div className="flex h-[4.5rem] items-center justify-between gap-4 px-5 md:h-20 md:px-12 lg:px-16">
          <HouseMark inverted={inverted} />

          <nav className="hidden md:block" aria-label="Primary">
            <ul className="flex items-center gap-10">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'relative text-[11px] uppercase tracking-[0.22em] transition-opacity',
                        inverted && 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]',
                        isActive ? 'opacity-100' : 'opacity-90 hover:opacity-100',
                        isActive &&
                          'after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-current',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className={cn(
              'relative z-50 flex h-11 w-11 shrink-0 items-center justify-center md:hidden',
              inverted && 'drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)]',
            )}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="relative block h-3 w-6">
              <span
                className={cn(
                  'absolute left-0 block h-px w-6 bg-current transition-transform duration-300',
                  open ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 block h-px w-6 bg-current transition-transform duration-300',
                  open ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>
        </div>
      </header>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  )
}
