import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

export type LookbookPlate = {
  src: string
  alt: string
  objectPosition?: string
  kicker?: string
  name?: string
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
          <figure>
            <div className="img-zoom aspect-[3/4] overflow-hidden bg-ivory-deep max-sm:min-h-[85svh] max-sm:aspect-auto">
              <img
                src={plate.src}
                alt={plate.alt}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
                style={plate.objectPosition ? { objectPosition: plate.objectPosition } : undefined}
              />
            </div>
            {plate.kicker || plate.name ? (
              <figcaption className="bg-ivory px-1 py-5 text-ink">
                {plate.kicker ? (
                  <p className="text-[10px] uppercase tracking-[0.32em] text-stone">{plate.kicker}</p>
                ) : null}
                {plate.name ? (
                  <p className="mt-1 font-display text-xl font-light tracking-[-0.02em] md:text-2xl">
                    {plate.name}
                  </p>
                ) : null}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      ))}
    </div>
  )
}
