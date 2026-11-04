import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { WovenLabel } from '@/components/brand/WovenLabel'
import { AdminNavLink } from '@/components/layout/AdminNavLink'
import { WordLink } from '@/components/notices/WordLink'
import { useCart } from '@/lib/cart'
import { houseMenuAccount, houseMenuHome, houseMenuTree } from '@/data/house-menu'
import { colourOfPiece } from '@/data/products'
import { thisWeekShopPlate } from '@/lib/instagram-plates'
import { useInstalledHouse } from '@/lib/shell'
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
  const week = thisWeekShopPlate()
  const sections = houseMenuTree()
  const installed = useInstalledHouse()
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
        'fixed inset-0 z-40 overflow-y-auto bg-ivory text-ink transition-opacity duration-500',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
        !installed && 'xl:hidden',
      )}
      aria-hidden={!open}
    >
      <nav
        className="flex min-h-full flex-col justify-center px-8 py-28 pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4.75rem))] pb-[max(3rem,env(safe-area-inset-bottom,0px))]"
        aria-label="House"
      >
        <ul className={cn('space-y-8', open && 'stagger-in')}>
          <li>
            <RoomLink to={houseMenuHome.to} onClose={onClose} large>
              {houseMenuHome.label}
            </RoomLink>
          </li>
          {sections.map((block) => (
            <li key={block.id} className="space-y-3">
              <SectionLabel>{block.section}</SectionLabel>
              {block.hub ? (
                <RoomLink to={block.hub.to} onClose={onClose} large>
                  {block.hub.label}
                </RoomLink>
              ) : null}
              <ul className={cn('space-y-1', block.hub && 'pt-1')}>
                {block.lines.map((line) => (
                  <li key={line.to}>
                    <RoomLink to={line.to} onClose={onClose} large={!block.hub}>
                      {line.label}
                    </RoomLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li>
            <RoomLink to={houseMenuAccount.to} onClose={onClose} large>
              {houseMenuAccount.label}
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
        <NavLink to="/stills" onClick={onClose} className="mt-16 block max-w-[14rem]">
          <span className="relative block aspect-[4/5] overflow-hidden bg-ivory-deep">
            <img
              src={week.src}
              alt={week.alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: week.objectPosition }}
            />
            <WovenLabel
              size="sm"
              colour={colourOfPiece(week.id)}
              className="pointer-events-none absolute bottom-3 left-3 z-10"
            />
          </span>
          <span className="mt-4 block text-[11px] uppercase tracking-[0.22em] text-stone">
            Lookbook · this week
          </span>
          <span className="mt-2 block font-display text-2xl font-light tracking-[-0.02em]">
            {week.name}
          </span>
        </NavLink>
        <div className="mt-10">
          <WovenLabel size="md" />
        </div>
      </nav>
    </div>
  )
}
