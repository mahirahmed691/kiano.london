import { ImageFrame } from '@/components/editorial/ImageFrame'
import { Reveal } from '@/components/ui/Reveal'
import { houseCreed } from '@/data/creed'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
}

export function HouseCreed({ className }: Props) {
  return (
    <div
      className={cn(
        'max-sm:-mx-6 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-5 max-sm:overflow-x-auto max-sm:px-6 max-sm:pb-2 max-sm:[scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-10 lg:gap-16',
        className,
      )}
    >
      {houseCreed.map((item, index) => (
        <Reveal key={item.word} delay={index * 90} className="max-sm:w-[78%] max-sm:shrink-0 max-sm:snap-start">
          <article>
            <ImageFrame
              src={item.image}
              alt={item.imageAlt}
              objectPosition={item.objectPosition}
              className="aspect-[4/5] w-full"
            />
            <p className="mt-7 text-[10px] uppercase tracking-[0.34em] text-stone">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-3 font-display text-3xl font-light tracking-[-0.02em] md:text-4xl">
              {item.word}
            </h3>
            <p className="mt-4 max-w-sm text-[15px] font-light leading-[1.85] text-ink-soft">
              {item.line}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  )
}
