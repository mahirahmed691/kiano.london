import { WovenLabel } from '@/components/brand/WovenLabel'
import { HouseFilm } from '@/components/editorial/HouseFilm'
import { type ProductImage } from '@/data/products'
import { cn } from '@/lib/cn'

type Props = {
  image: ProductImage
  film?: string
  first?: boolean
  onLook: () => void
}

export function ProductPlate({ image, film, first = false, onLook }: Props) {
  return (
    <div
      className={cn(
        'relative w-full snap-start overflow-hidden bg-ivory-deep max-xl:min-h-[calc(100svh-5.25rem)] max-xl:scroll-mt-[5.25rem] md:max-xl:min-h-[calc(100svh-5.75rem)] md:max-xl:scroll-mt-[5.75rem]',
        first ? 'xl:min-h-[calc(100svh-7rem)]' : 'xl:aspect-3/4',
      )}
    >
      {film ? (
        <HouseFilm
          src={film}
          poster={image.src}
          alt={image.alt}
          objectPosition={image.objectPosition}
          priority={first}
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          loading={first ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
          style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
        />
      )}
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
