import { Reveal } from '@/components/ui/Reveal'
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
    <div className={cn('grid grid-cols-1 gap-px bg-rule sm:grid-cols-3', className)}>
      {plates.map((plate, index) => (
        <Reveal key={plate.src} delay={index * 90}>
          <figure className="img-zoom aspect-[3/4] overflow-hidden bg-ivory-deep max-sm:min-h-[85svh] max-sm:aspect-auto">
            <img
              src={plate.src}
              alt={plate.alt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
              style={plate.objectPosition ? { objectPosition: plate.objectPosition } : undefined}
            />
          </figure>
        </Reveal>
      ))}
    </div>
  )
}
