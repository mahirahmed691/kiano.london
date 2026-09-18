import { Monogram } from '@/components/brand/Monogram'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminNavLink } from '@/components/layout/AdminNavLink'
import { WordLink } from '@/components/notices/WordLink'
import { useCart } from '@/lib/cart'
import { jubbahs, productLineName, productPath, thobes } from '@/data/products'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
}

function SectionLabel({ children }: { children: string }) {
  return <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{children}</p>
}

function RoomLink({
  to,
  onClose,
  children,
  large,
}: {
  to: string
  onClose: () => void
  children: string
  large?: boolean
}) {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          'block font-display font-light tracking-[-0.02em] transition-opacity',
          large ? 'text-4xl' : 'text-2xl',
          isActive ? 'opacity-100' : 'opacity-55 hover:opacity-100',
        )
      }
    >
      {children}
    </NavLink>
  )
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
        'fixed inset-0 z-40 overflow-y-auto bg-ivory transition-opacity duration-500 md:hidden',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <nav
        className="flex min-h-full flex-col justify-center px-8 py-28 pt-[max(7rem,env(safe-area-inset-top,0px))] pb-[max(3rem,env(safe-area-inset-bottom,0px))]"
        aria-label="Mobile"
      >
        <Monogram decorative className="mb-10 h-7 text-ink" />
        <ul className={cn('space-y-8', open && 'stagger-in')}>
          <li>
            <RoomLink to="/" onClose={onClose} large>
              Home
            </RoomLink>
          </li>
          <li className="space-y-3">
            <SectionLabel>The Shop</SectionLabel>
            <RoomLink to="/shop" onClose={onClose} large>
              Shop
            </RoomLink>
            <ul className="space-y-1 pt-1">
              {jubbahs.map((piece) => (
                <li key={piece.id}>
                  <RoomLink to={productPath(piece)} onClose={onClose}>
                    {productLineName(piece)}
                  </RoomLink>
                </li>
              ))}
            </ul>
          </li>
          <li className="space-y-3">
            <SectionLabel>The Collection</SectionLabel>
            <RoomLink to="/collection" onClose={onClose} large>
              Collection
            </RoomLink>
            <ul className="space-y-1 pt-1">
              {thobes.map((piece) => (
                <li key={piece.id}>
                  <RoomLink to={productPath(piece)} onClose={onClose}>
                    {piece.name}
                  </RoomLink>
                </li>
              ))}
            </ul>
          </li>
          <li className="space-y-3">
            <SectionLabel>The house</SectionLabel>
            <ul className="space-y-1">
              <li>
                <RoomLink to="/stills" onClose={onClose} large>
                  Stills
                </RoomLink>
              </li>
              <li>
                <RoomLink to="/story" onClose={onClose} large>
                  Story
                </RoomLink>
              </li>
              <li>
                <RoomLink to="/craftsmanship" onClose={onClose} large>
                  Craftsmanship
                </RoomLink>
              </li>
              <li>
                <RoomLink to="/visit" onClose={onClose} large>
                  Visit
                </RoomLink>
              </li>
            </ul>
          </li>
          <li>
            <RoomLink to="/account" onClose={onClose} large>
              Account
            </RoomLink>
          </li>
          <li>
            <AdminNavLink
              onClick={onClose}
              className="block font-display text-4xl font-light tracking-[-0.02em] opacity-55 transition-opacity hover:opacity-100"
            />
          </li>
          <li>
            <WordLink
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
