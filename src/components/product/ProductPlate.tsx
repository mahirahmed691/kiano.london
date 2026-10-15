import { type Ref } from 'react'
import { WovenLabel } from '@/components/brand/WovenLabel'
import { type ProductColour, type ProductImage } from '@/data/products'
import { cn } from '@/lib/cn'

type Props = {
  image: ProductImage
  colour?: ProductColour
  first?: boolean
  onLook: () => void
}

export function PieceHero({
  image,
  colour,
  onLook,
  ref,
}: {
  image: ProductImage
  colour?: ProductColour
  onLook: () => void
  ref?: Ref<HTMLElement>
}) {
  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] snap-start overflow-hidden bg-night"
    >
      <img
        src={image.src}
        alt={image.alt}
        className="still-in absolute inset-0 size-full object-cover"
        style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
      <div className="scrim-night-top absolute inset-x-0 top-0 h-40" aria-hidden="true" />
      <WovenLabel
        size="md"
        colour={colour}
        className="pointer-events-none absolute bottom-5 left-5 z-10 md:bottom-8 md:left-8"
      />
      <button
        type="button"
        className="absolute inset-0 z-[1]"
        aria-label={`Look closer: ${image.alt}`}
        onClick={onLook}
      />
    </section>
  )
}

export function ProductPlate({ image, colour, first = false, onLook }: Props) {
  return (
    <div
      className={cn(
        'relative w-full snap-start overflow-hidden bg-ivory-deep img-zoom',
        first ? 'xl:min-h-[calc(100svh-7rem)]' : 'aspect-3/4',
      )}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading={first ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('absolute inset-0 size-full object-cover', first && 'still-in')}
        style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
      />
      <WovenLabel
        size={first ? 'md' : 'sm'}
        colour={colour}
        className="pointer-events-none absolute bottom-5 left-5 z-10 md:bottom-8 md:left-8"
      />
      <button
        type="button"
        className="absolute inset-0 z-[1]"
        aria-label={`Look closer: ${image.alt}`}
        onClick={onLook}
      />
    </div>
  )
}
