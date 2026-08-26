import { WovenLabel } from '@/components/brand/WovenLabel'
import { type ProductImage } from '@/data/products'
import { cn } from '@/lib/cn'

type Props = {
  image: ProductImage
  first?: boolean
  onLook: () => void
}

export function ProductPlate({ image, first = false, onLook }: Props) {
  return (
    <div
      className={cn(
        'relative w-full snap-start overflow-hidden bg-ivory-deep',
        first
          ? 'max-xl:min-h-[calc(100svh-var(--header-offset))] max-xl:scroll-mt-[var(--header-offset)] xl:min-h-[calc(100svh-7rem)]'
          : 'aspect-3/4',
      )}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading={first ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
      />
      {first ? (
        <WovenLabel
          size="md"
          className="pointer-events-none absolute bottom-5 left-5 z-10 md:bottom-8 md:left-8"
        />
      ) : null}
      <button
        type="button"
        className="absolute inset-0 z-[1]"
        aria-label={`Look closer: ${image.alt}`}
        onClick={onLook}
      />
    </div>
  )
}
