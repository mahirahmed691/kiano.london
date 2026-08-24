import { cn } from '@/lib/cn'

export type LookbookPlate = {
  src: string
  alt: string
  objectPosition?: string
}

type Props = {
  plates: LookbookPlate[]
  className?: string
}

export function LookbookStrip({ plates, className }: Props) {
  return (
    <div className={cn('grid grid-cols-3 gap-px bg-rule', className)}>
      {plates.map((plate) => (
        <figure key={plate.src} className="img-zoom aspect-[3/4] overflow-hidden bg-ivory-deep">
          <img
            src={plate.src}
            alt={plate.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
            style={plate.objectPosition ? { objectPosition: plate.objectPosition } : undefined}
          />
        </figure>
      ))}
    </div>
  )
}
