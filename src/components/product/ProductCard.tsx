import { WovenLabel } from '@/components/brand/WovenLabel'
import { Link } from 'react-router-dom'
import { type Product } from '@/data/products'
import { cn } from '@/lib/cn'

type Props = {
  product: Product
  index?: string
  className?: string
  to?: string
}

function CardBody({ product, index }: Pick<Props, 'product' | 'index'>) {
  const hover = product.gallery[1]
  const hoverSrc = hover && hover.src !== product.image ? hover.src : undefined

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
        {hoverSrc ? (
          <img
            src={hoverSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="img-swap size-full object-cover opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:opacity-100"
            style={hover.objectPosition ? { objectPosition: hover.objectPosition } : undefined}
          />
        ) : null}
        <WovenLabel size="sm" className="pointer-events-none absolute bottom-3 left-3 z-10" />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          {index ? (
            <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-stone">{index}</p>
          ) : null}
          <h3 className="font-display text-2xl font-light leading-tight">{product.name}</h3>
          <p className="mt-1 text-[12px] font-light tracking-[0.04em] text-stone">{product.colour}</p>
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
        <Link to={to} className="block" aria-label={`${product.name}, ${product.colour}, ${product.price}`}>
          <CardBody product={product} index={index} />
        </Link>
      ) : (
        <CardBody product={product} index={index} />
      )}
    </article>
  )
}
