import { useCallback, useEffect, useMemo, useState } from 'react'
import { HouseSizePrefill } from '@/components/account/HouseSizePrefill'
import { SizeGuide } from '@/components/product/SizeGuide'
import { Button, TextLink } from '@/components/ui/Button'
import { Display, Eyebrow } from '@/components/ui/Heading'
import {
  colourVariants,
  productPath,
  thobeSizes,
  type Product,
  type ThobeSize,
} from '@/data/products'
import { packingNote } from '@/data/packing'
import { clerkEnabled } from '@/lib/clerk'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/cn'
import { readStoredSize, writeStoredSize } from '@/lib/house-profile'
import { useQuickAdd } from '@/lib/quickAdd'
import { remainingCopy, useProductStock } from '@/lib/useProductStock'

export function QuickAddDialog() {
  const { product: opened, close } = useQuickAdd()
  const { add } = useCart()
  const [current, setCurrent] = useState<Product | null>(opened)
  const [size, setSize] = useState<ThobeSize | ''>('')
  const [guideOpen, setGuideOpen] = useState(false)
  const stock = useProductStock(current?.id ?? '')
  const variants = useMemo(() => (current ? colourVariants(current) : []), [current])

  useEffect(() => {
    setCurrent(opened)
    setSize(readStoredSize() ?? '')
    setGuideOpen(false)
  }, [opened])

  const chooseSize = useCallback((value: ThobeSize) => {
    setSize(value)
    writeStoredSize(value)
  }, [])

  useEffect(() => {
    if (!opened) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [opened, close])

  const remaining = current && size && stock ? stock[size] : undefined
  const held = remaining === 0
  const waitTo = current && size ? `${productPath(current)}?size=${size}` : current ? productPath(current) : '/shop'

  function addToBag() {
    if (!current || !size || held) return
    add(current.id, size)
    close()
  }

  const open = Boolean(opened && current)

  return (
    <div className={`fixed inset-0 z-[57] ${open ? 'visible' : 'pointer-events-none invisible'}`}>
      <button
        type="button"
        aria-label="Close add to bag"
        className={`absolute inset-0 bg-night/45 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center md:items-center md:p-8">
        <div
          className={`pointer-events-auto max-h-[92svh] w-full overflow-y-auto border-t border-rule bg-ivory text-ink transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:w-[min(48rem,calc(100vw-3rem))] md:border ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-add-title"
          aria-hidden={!open}
        >
          {current ? (
            <div className="grid md:grid-cols-2">
              <div className="relative hidden bg-ivory-deep md:block">
                <img
                  src={current.image}
                  alt=""
                  className="h-full min-h-[32rem] w-full object-cover"
                  style={current.objectPosition ? { objectPosition: current.objectPosition } : undefined}
                />
              </div>
              <div className="px-6 py-8 md:px-10 md:py-12">
                <div className="flex items-start justify-between gap-4">
                  <Eyebrow>To the bag</Eyebrow>
                  <button
                    type="button"
                    className="text-[11px] uppercase tracking-[0.22em] opacity-60 transition-opacity hover:opacity-100"
                    onClick={close}
                  >
                    Close
                  </button>
                </div>
                <Display id="quick-add-title" as="h2" className="mt-4 text-4xl">
                  {current.name}
                </Display>
                <p lang="ar" dir="rtl" className="mt-2 w-fit font-arabic text-xl text-ink/55">
                  {current.arabicName}
                </p>
                <p className="mt-4 font-display text-3xl font-light">{current.price}</p>
                <p className="mt-2 text-[13px] font-light text-stone">
                  {current.colour} · {current.cloth}
                </p>

                {variants.length > 1 ? (
                  <div className="mt-8">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Colour</p>
                    <div className="mt-4 flex items-center gap-3">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          aria-label={variant.colour}
                          aria-current={variant.id === current.id ? 'true' : undefined}
                          className={cn(
                            'block h-7 w-7 border transition-opacity',
                            variant.id === current.id
                              ? 'border-ink'
                              : 'border-rule opacity-70 hover:opacity-100',
                          )}
                          style={{ backgroundColor: variant.swatch ?? '#1B1714' }}
                          onClick={() => {
                            setCurrent(variant)
                          }}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-light text-stone">{current.colour}</p>
                  </div>
                ) : null}

                <div className="mt-8">
                  {clerkEnabled ? (
                    <HouseSizePrefill chosen={size} onSize={chooseSize} />
                  ) : null}
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Size</p>
                  <div className="mt-4 grid max-w-[20rem] grid-cols-5 gap-px bg-rule">
                    {thobeSizes.map((value) => {
                      const sizeHeld = stock?.[value] === 0
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={size === value}
                          onClick={() => chooseSize(value)}
                          className={cn(
                            'flex aspect-square items-center justify-center text-[12px] tracking-[0.08em] transition-colors duration-300',
                            size === value ? 'bg-ink text-ivory' : 'bg-ivory hover:bg-ivory-deep',
                            sizeHeld && size !== value && 'opacity-35',
                          )}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-3 text-[13px] font-light text-stone">
                    {size && remaining !== undefined ? remainingCopy(remaining) : current.leadTime}
                  </p>
                </div>

                {held ? (
                  <Button variant="solid" className="mt-8 w-full justify-center" to={waitTo} onClick={close}>
                    Write if this size returns
                  </Button>
                ) : (
                  <Button
                    variant="solid"
                    className="mt-8 w-full justify-center"
                    disabled={!size}
                    onClick={addToBag}
                  >
                    {size ? 'Add to bag' : 'Choose a size'}
                  </Button>
                )}

                <div className="mt-8 space-y-4 border-t border-rule pt-6">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-[11px] uppercase tracking-[0.22em]"
                    aria-expanded={guideOpen}
                    onClick={() => setGuideOpen((value) => !value)}
                  >
                    Size guide
                    <span aria-hidden="true">{guideOpen ? '−' : '+'}</span>
                  </button>
                  {guideOpen ? <SizeGuide className="pb-2" compact /> : null}
                  <p className="border-t border-rule pt-4 text-[13px] font-light leading-relaxed text-stone">
                    Carriage included. Made to order, four to eight weeks. {packingNote}
                  </p>
                  <TextLink to={productPath(current)}>The piece</TextLink>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
