import { products, productLineName, thobeSizes } from '@/data/products'
import { site } from '@/data/site'

export type CutRow = {
  productId: string
  size: number
  quantity: number
}

export function CutsBookSheet({ cuts }: { cuts: CutRow[] }) {
  const remaining = new Map(cuts.map((cut) => [`${cut.productId}:${cut.size}`, cut.quantity]))
  const held = products.flatMap((product) =>
    thobeSizes
      .filter((size) => (remaining.get(`${product.id}:${size}`) ?? 0) <= 0)
      .map((size) => ({ product, size })),
  )

  return (
    <article className="cuts-book mx-auto max-w-3xl">
      <style>{`
        @media print {
          header, footer, #main-content > :not(:has(.cuts-book)), .no-print { display: none !important; }
          body, #root { background: #fff !important; color: #111 !important; }
          .cuts-book { max-width: none; }
        }
      `}</style>
      <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Remaining on the line</p>
      <p className="mt-6 font-display text-4xl font-light md:text-5xl">{site.fullName}</p>
      <p className="mt-4 text-[15px] font-light text-ink-soft">
        {held.length === 0
          ? 'Every size still has a cut.'
          : `${String(held.length).padStart(2, '0')} at none`}
      </p>

      {held.length > 0 ? (
        <section className="mt-14">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">At none</p>
          <ul className="mt-6 divide-y divide-rule border-y border-ink">
            {held.map(({ product, size }) => (
              <li key={`${product.id}-${size}`} className="flex items-baseline justify-between gap-6 py-5">
                <p className="font-display text-2xl font-light">{productLineName(product)}</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{size}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ul className="mt-14 divide-y divide-rule border-y border-ink">
        {products.map((product) => (
          <li key={product.id} className="grid gap-6 py-8 sm:grid-cols-12 sm:items-baseline">
            <div className="sm:col-span-5">
              <p className="font-display text-2xl font-light">{productLineName(product)}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">{product.cut}</p>
            </div>
            <ul className="flex flex-wrap gap-x-8 gap-y-4 sm:col-span-7">
              {thobeSizes.map((size) => {
                const quantity = remaining.get(`${product.id}:${size}`) ?? 0
                return (
                  <li key={size}>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{size}</p>
                    <p
                      className={
                        quantity === 0
                          ? 'mt-1 font-display text-2xl font-light text-stone'
                          : 'mt-1 font-display text-2xl font-light'
                      }
                    >
                      {quantity}
                    </p>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </article>
  )
}
