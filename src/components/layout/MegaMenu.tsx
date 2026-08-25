import { useEffect, useId, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { TextLink } from '@/components/ui/Button'
import { jubbahs, productLineName, productPath, thobes } from '@/data/products'
import { cn } from '@/lib/cn'

type MegaId = 'shop' | 'collection' | 'craft'

type MegaItem = {
  id: MegaId
  label: string
  to: string
}

const megaItems: MegaItem[] = [
  { id: 'shop', label: 'Shop', to: '/shop' },
  { id: 'collection', label: 'Collection', to: '/collection' },
  { id: 'craft', label: 'Craftsmanship', to: '/craftsmanship' },
]

const simpleNav = [
  { label: 'Story', to: '/story' },
  { label: 'Visit', to: '/visit' },
] as const

const OPEN_MS = 140
const CLOSE_MS = 240

function PieceStill({
  to,
  src,
  alt,
  objectPosition,
  name,
  kicker,
}: {
  to: string
  src: string
  alt: string
  objectPosition?: string
  name: string
  kicker?: string
}) {
  return (
    <li>
      <NavLink to={to} className="group block">
        <span className="relative block aspect-[3/4] overflow-hidden bg-ivory-deep">
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out motion-safe:group-hover:scale-[1.04]"
            style={objectPosition ? { objectPosition } : undefined}
          />
        </span>
        {kicker ? (
          <span className="mt-4 block text-[11px] uppercase tracking-[0.22em] text-stone">
            {kicker}
          </span>
        ) : null}
        <span className="mt-2 block font-display text-xl font-light tracking-[-0.02em] text-ink md:text-2xl">
          {name}
        </span>
      </NavLink>
    </li>
  )
}

function HouseLinks() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The house</p>
      <ul className="mt-5 space-y-3">
        <li>
          <TextLink to="/story">Story</TextLink>
        </li>
        <li>
          <TextLink to="/craftsmanship">Craftsmanship</TextLink>
        </li>
        <li>
          <TextLink to="/visit">Visit</TextLink>
        </li>
      </ul>
    </div>
  )
}

function ShopPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid gap-12 lg:grid-cols-12" onClick={onNavigate}>
      <div className="lg:col-span-9">
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The jubbah</p>
        <ul className="mt-6 grid grid-cols-3 gap-4 md:gap-6">
          {jubbahs.map((piece) => (
            <PieceStill
              key={piece.id}
              to={productPath(piece)}
              src={piece.image}
              alt={piece.imageAlt}
              objectPosition={piece.objectPosition}
              kicker={piece.colour}
              name={productLineName(piece)}
            />
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-between gap-10 lg:col-span-3 lg:border-l lg:border-rule lg:pl-10">
        <HouseLinks />
        <TextLink to="/shop">The Shop</TextLink>
      </div>
    </div>
  )
}

function CollectionPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid gap-12 lg:grid-cols-12" onClick={onNavigate}>
      <div className="lg:col-span-9">
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The thobes</p>
        <ul className="mt-6 grid grid-cols-3 gap-4 md:gap-5 lg:grid-cols-5">
          {thobes.map((piece) => (
            <PieceStill
              key={piece.id}
              to={productPath(piece)}
              src={piece.image}
              alt={piece.imageAlt}
              objectPosition={piece.objectPosition}
              name={piece.name}
            />
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-between gap-10 lg:col-span-3 lg:border-l lg:border-rule lg:pl-10">
        <HouseLinks />
        <TextLink to="/collection">The Collection</TextLink>
      </div>
    </div>
  )
}

function CraftPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid gap-12 lg:grid-cols-12" onClick={onNavigate}>
      <div className="lg:col-span-7">
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The making</p>
        <p className="mt-6 max-w-xl font-display text-3xl font-light leading-snug tracking-[-0.02em] text-ink md:text-4xl">
          How the column is cut, and the rooms where it is finished.
        </p>
        <ul className="mt-10 space-y-4">
          <li>
            <TextLink to="/craftsmanship">Craftsmanship</TextLink>
          </li>
          <li>
            <TextLink to="/craftsmanship-details">The making, in detail</TextLink>
          </li>
        </ul>
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        <HouseLinks />
      </div>
    </div>
  )
}

type Props = {
  inverted: boolean
}

export function MegaMenu({ inverted }: Props) {
  const [open, setOpen] = useState<MegaId | null>(null)
  const openTimer = useRef(0)
  const closeTimer = useRef(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  function clearTimers() {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
  }

  function openNow(id: MegaId) {
    clearTimers()
    setOpen(id)
  }

  function scheduleOpen(id: MegaId) {
    window.clearTimeout(closeTimer.current)
    if (open === id) return
    if (open) {
      setOpen(id)
      return
    }
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => setOpen(id), OPEN_MS)
  }

  function scheduleClose() {
    window.clearTimeout(openTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(null), CLOSE_MS)
  }

  function closeNow() {
    clearTimers()
    setOpen(null)
  }

  useEffect(() => () => clearTimers(), [])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      closeNow()
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeNow()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const triggerClass = (isActive: boolean) =>
    cn(
      'relative text-[11px] uppercase tracking-[0.22em] transition-opacity',
      inverted && 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]',
      isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100',
      isActive && 'after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-current',
    )

  return (
    <div
      ref={rootRef}
      className="hidden md:block"
      onMouseLeave={scheduleClose}
      onMouseEnter={() => window.clearTimeout(closeTimer.current)}
    >
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:gap-x-9">
          {megaItems.map((item) => {
            const expanded = open === item.id
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  aria-haspopup="true"
                  className={({ isActive }) => triggerClass(isActive || expanded)}
                  onMouseEnter={() => scheduleOpen(item.id)}
                  onFocus={() => openNow(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault()
                      openNow(item.id)
                      window.requestAnimationFrame(() => {
                        panelRef.current
                          ?.querySelector<HTMLAnchorElement>('a[href]')
                          ?.focus()
                      })
                    }
                    if (event.key === 'Escape') closeNow()
                  }}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          })}
          {simpleNav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => triggerClass(isActive)}
                onMouseEnter={scheduleClose}
                onFocus={scheduleClose}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-label="The line"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          'absolute inset-x-0 top-full bg-ivory text-ink transition-[opacity,transform] duration-300 ease-out',
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible pointer-events-none -translate-y-1 opacity-0',
          'motion-reduce:transform-none',
        )}
      >
        <div className="border-t border-rule px-6 py-10 md:px-12 md:py-12 lg:px-16 xl:px-24">
          {open === 'shop' ? <ShopPanel onNavigate={closeNow} /> : null}
          {open === 'collection' ? <CollectionPanel onNavigate={closeNow} /> : null}
          {open === 'craft' ? <CraftPanel onNavigate={closeNow} /> : null}
        </div>
      </div>
    </div>
  )
}
