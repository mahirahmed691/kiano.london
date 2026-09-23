import { WovenLabel } from '@/components/brand/WovenLabel'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { type Product } from '@/data/products'
import { useQuickAdd } from '@/lib/quickAdd'

type Props = {
  product: Product
  index?: string
  className?: string
  to?: string
  delay?: number
}

function CardImage({ product }: { product: Product }) {
  const hover = product.gallery[1]
  const hoverSrc = hover && hover.src !== product.image ? hover.src : undefined

  return (
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
          className="img-swap size-full object-cover opacity-0 transition-opacity duration-[2.2s] ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:opacity-100"
          style={hover.objectPosition ? { objectPosition: hover.objectPosition } : undefined}
        />
      ) : null}
      <WovenLabel size="sm" className="pointer-events-none absolute bottom-3 left-3 z-10" />
    </div>
  )
}

function CardMeta({ product, index }: Pick<Props, 'product' | 'index'>) {
  return (
    <div className="mt-6 flex items-baseline justify-between gap-4">
      <div>
        {index ? (
          <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-stone">{index}</p>
        ) : null}
        <h3 className="font-display text-2xl font-light leading-tight tracking-[-0.02em] md:text-[1.65rem]">
          {product.name}
        </h3>
        <p className="mt-1.5 text-[11px] font-light tracking-[0.16em] text-stone">{product.colour}</p>
      </div>
      <p className="shrink-0 text-[11px] tracking-[0.16em] text-ink-soft">{product.price}</p>
    </div>
  )
}

export function ProductCard({ product, index, className, to, delay = 0 }: Props) {
  const { open } = useQuickAdd()

  return (
    <Reveal delay={delay} className={className}>
    <article className="group">
      <div className="relative">
        {to ? (
          <Link
            to={to}
            className="block"
            aria-label={`${product.name}, ${product.colour}, ${product.price}`}
          >
            <CardImage product={product} />
          </Link>
        ) : (
          <CardImage product={product} />
        )}
        <button
          type="button"
          aria-label={`Add ${product.name}, ${product.colour}, to the bag`}
          className="absolute right-3 bottom-3 z-10 flex h-10 w-10 items-center justify-center border border-ivory bg-ivory text-[1.35rem] font-light leading-none text-ink opacity-100 transition-[opacity,colors] duration-500 hover:border-ink hover:bg-ink hover:text-ivory hover:[-webkit-text-fill-color:#F2EBDC] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
          onClick={() => open(product)}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      {to ? (
        <Link to={to} className="block">
          <CardMeta product={product} index={index} />
        </Link>
      ) : (
        <CardMeta product={product} index={index} />
      )}
    </article>
    </Reveal>
  )
}
