import { WovenLabel } from '@/components/brand/WovenLabel'
import { type ProductColour } from '@/data/products'
import { cn } from '@/lib/cn'

type Props = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  eager?: boolean
  objectPosition?: string
  caption?: string
  colour?: ProductColour
}

export function ImageFrame({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
  objectPosition = 'center',
  caption,
  colour,
}: Props) {
  return (
    <figure className={cn(className)}>
      <div className="img-zoom relative h-full w-full overflow-hidden bg-ivory-deep">
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={cn('size-full object-cover', imgClassName)}
          style={{ objectPosition }}
        />
        {colour ? (
          <WovenLabel
            size="sm"
            colour={colour}
            className="pointer-events-none absolute bottom-3 left-3 z-10"
          />
        ) : null}
      </div>
      {caption ? (
        <figcaption className="mt-4 text-[10px] uppercase tracking-[0.28em] text-stone">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
