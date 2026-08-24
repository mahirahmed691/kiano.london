import { Link } from 'react-router-dom'
import { type Product } from '@/data/products'
import { cn } from '@/lib/cn'

type Props = {
  product: Product
  index?: string
  className?: string
}

export function ProductCard({ product, index, className }: Props) {
  return (
    <article className={cn('group', className)}>
      <Link to="/collection" className="block" aria-label={`${product.name}, ${product.price}`}>
        <div className="img-zoom aspect-[3/4] bg-ivory-deep">
          <img
            src={product.image}
            alt={product.imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <div>
            {index ? (
              <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-stone">{index}</p>
            ) : null}
            <h3 className="font-display text-2xl font-light leading-tight">{product.name}</h3>
            <p className="mt-1 text-[13px] font-light text-stone">{product.cloth}</p>
          </div>
          <p className="shrink-0 text-[12px] tracking-[0.08em] text-ink-soft">{product.price}</p>
        </div>
      </Link>
    </article>
  )
}
