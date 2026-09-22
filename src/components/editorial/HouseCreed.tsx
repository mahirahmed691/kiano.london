import { ImageFrame } from '@/components/editorial/ImageFrame'
import { Reveal } from '@/components/ui/Reveal'
import { houseCreed } from '@/data/creed'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
}

export function HouseCreed({ className }: Props) {
  return (
    <div className={cn('grid gap-12 sm:grid-cols-3 sm:gap-8 lg:gap-12', className)}>
      {houseCreed.map((item, index) => (
        <Reveal key={item.word} delay={index * 70}>
          <article>
            <ImageFrame
              src={item.image}
              alt={item.imageAlt}
              objectPosition={item.objectPosition}
              className="aspect-[4/5] w-full"
            />
            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-stone">{item.word}</p>
            <p className="mt-3 max-w-sm text-[15px] font-light leading-relaxed text-ink-soft">
              {item.line}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  )
}
