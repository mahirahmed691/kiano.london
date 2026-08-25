import { Monogram } from '@/components/brand/Monogram'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminNavLink } from '@/components/layout/AdminNavLink'
import { useCart } from '@/lib/cart'
import { primaryNav } from '@/data/navigation'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: Props) {
  const { count, setOpen } = useCart()
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      id="mobile-navigation"
      className={cn(
        'fixed inset-0 z-40 bg-ivory transition-opacity duration-500 md:hidden',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <nav
        className="flex h-full flex-col justify-center px-8"
        aria-label="Mobile"
      >
        <Monogram decorative className="mb-10 h-7 text-ink" />
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'font-display text-4xl font-light tracking-[-0.02em] transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-55 hover:opacity-100',
                )
              }
            >
              Home
            </NavLink>
          </li>
          {primaryNav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'font-display text-4xl font-light tracking-[-0.02em] transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-55 hover:opacity-100',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/account"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'font-display text-4xl font-light tracking-[-0.02em] transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-55 hover:opacity-100',
                )
              }
            >
              Account
            </NavLink>
          </li>
          <li>
            <AdminNavLink
              onClick={onClose}
              className="block font-display text-4xl font-light tracking-[-0.02em] opacity-55 transition-opacity hover:opacity-100"
            />
          </li>
          <li>
            <button
              type="button"
              className="font-display text-4xl font-light tracking-[-0.02em] opacity-55 transition-opacity hover:opacity-100"
              onClick={() => {
                onClose()
                setOpen(true)
              }}
            >
              Bag{count ? ` ${String(count).padStart(2, '0')}` : ''}
            </button>
          </li>
        </ul>
        <p className="mt-16 text-[0.68rem] uppercase tracking-[0.42em] text-ink/70">
          {site.lockup}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-stone">
          {site.city} · Est. {site.established}
        </p>
      </nav>
    </div>
  )
}
