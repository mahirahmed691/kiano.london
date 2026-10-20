import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { productLineName, productPath } from '@/data/products'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/cn'
import { formatGbp } from '@/lib/money'

export function CartDrawer() {
  const { items, count, subtotalPence, open, setOpen, setQuantity, remove } = useCart()
  const proofOnly = items.length > 0 && items.every((item) => item.product.proof)

  return (
    <div className={cn('fixed inset-0 z-[60]', open ? 'visible' : 'invisible')}>
      <button
        type="button"
        aria-label="Close bag"
        className={cn(
          'absolute inset-0 bg-night/40 transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          'shell-sheet absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col border-l border-rule bg-ivory text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!open}
        aria-label="Bag"
      >
        <div className="flex items-center justify-between border-b border-rule px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.22em]">
            Bag{count ? ` · ${String(count).padStart(2, '0')}` : ''}
          </p>
          <button
            type="button"
            className="text-[11px] uppercase tracking-[0.22em] opacity-60 transition-opacity hover:opacity-100"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center px-8">
            <p className="font-display text-3xl font-light">The bag is empty.</p>
            <p className="mt-4 max-w-xs text-[14px] font-light leading-relaxed text-ink-soft">
              A piece is cut when you ask for it. Choose a cloth and a size, then return here.
            </p>
            <div className="mt-8">
              <Button to="/shop" onClick={() => setOpen(false)}>
                The Shop
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ul className={cn('flex-1 overflow-y-auto px-6 py-6', open && 'stagger-in')}>
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="grid grid-cols-[5rem_1fr] gap-4 border-b border-rule py-5 first:pt-0"
                >
                  <Link
                    to={productPath(item.product)}
                    className="img-zoom aspect-[3/4] overflow-hidden bg-ivory-deep"
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src={item.product.image}
                      alt=""
                      className="size-full object-cover"
                      style={
                        item.product.objectPosition
                          ? { objectPosition: item.product.objectPosition }
                          : undefined
                      }
                    />
                  </Link>
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          to={productPath(item.product)}
                          className="font-display text-xl font-light leading-tight"
                          onClick={() => setOpen(false)}
                        >
                          {productLineName(item.product)}
                        </Link>
                        <p className="mt-1 text-[12px] font-light text-stone">
                          Size {item.size} · {item.product.colour}
                        </p>
                      </div>
                      <p className="shrink-0 text-[12px] tracking-[0.06em]">
                        {formatGbp(item.product.pricePence * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-rule">
                        <button
                          type="button"
                          className="h-8 w-8 text-[12px]"
                          aria-label="Reduce quantity"
                          onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-[12px]">{item.quantity}</span>
                        <button
                          type="button"
                          className="h-8 w-8 text-[12px]"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-[11px] uppercase tracking-[0.18em] text-stone transition-opacity hover:opacity-70"
                        onClick={() => remove(item.productId, item.size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-rule px-6 py-6">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Subtotal</p>
                <p className="font-display text-2xl font-light">{formatGbp(subtotalPence)}</p>
              </div>
              <p className="mt-3 text-[12px] font-light leading-relaxed text-stone">
                {proofOnly
                  ? 'One pound to open the live till. Not a garment. Refund the charge from Stripe once it has landed.'
                  : 'Carriage included. Cut to order. Leaves unscented, in a garment bag and a rigid box.'}
              </p>
              <Button
                to="/checkout"
                variant="solid"
                className="mt-6 w-full justify-center"
                onClick={(event) => {
                  if (window.ReactNativeWebView) {
                    event.preventDefault()
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'kiano-checkout' }))
                    setOpen(false)
                    return
                  }
                  setOpen(false)
                }}
              >
                {proofOnly ? 'Pay one pound' : 'Reserve the cut'}
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
