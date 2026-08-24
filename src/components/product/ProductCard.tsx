import { Link } from 'react-router-dom'
import { type Product, thobeSizes } from '@/data/products'
import { cn } from '@/lib/cn'

type Props = {
  product: Product
  index?: string
  className?: string
  to?: string
}

function CardBody({ product, index }: Pick<Props, 'product' | 'index'>) {
  return (
    <>
      <div className="img-zoom relative aspect-[3/4] overflow-hidden bg-ivory-deep">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
          style={product.objectPosition ? { objectPosition: product.objectPosition } : undefined}
        />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div>
          {index ? (
            <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-stone">{index}</p>
          ) : null}
          <h3 className="font-display text-2xl font-light leading-tight">{product.name}</h3>
          <p className="mt-1 text-[13px] font-light text-stone">
            {product.colour} · {product.cloth}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone">
            Sizes {thobeSizes[0]}–{thobeSizes[thobeSizes.length - 1]}
          </p>
        </div>
        <p className="shrink-0 text-[12px] tracking-[0.08em] text-ink-soft">{product.price}</p>
      </div>
    </>
  )
}

export function ProductCard({ product, index, className, to }: Props) {
  return (
    <article className={cn('group', className)}>
      {to ? (
        <Link to={to} className="block" aria-label={`${product.name}, ${product.price}`}>
          <CardBody product={product} index={index} />
        </Link>
      ) : (
        <CardBody product={product} index={index} />
      )}
    </article>
  )
}
