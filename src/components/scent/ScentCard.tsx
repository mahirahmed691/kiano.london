import { WovenLabel } from '@/components/brand/WovenLabel'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { notesJoin, scentComing, scentPath, type Scent } from '@/data/scent'

type Props = {
  scent: Scent
  index?: string
  className?: string
  delay?: number
}

export function ScentCard({ scent, index, className, delay = 0 }: Props) {
  return (
    <Reveal delay={delay} className={className}>
      <article className="group">
        <Link to={scentPath(scent)} className="block" aria-label={`${scent.name}, coming`}>
          <div className="img-zoom relative aspect-[3/4] overflow-hidden bg-ivory-deep">
            <img
              src={scent.image}
              alt={scent.imageAlt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
              style={scent.objectPosition ? { objectPosition: scent.objectPosition } : undefined}
            />
            <WovenLabel size="sm" className="pointer-events-none absolute bottom-3 left-3 z-10" />
          </div>
          <div className="mt-6 flex items-baseline justify-between gap-4">
            <div>
              {index ? (
                <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-stone">{index}</p>
              ) : null}
              <h3 className="font-display text-2xl font-light leading-tight tracking-[-0.02em] md:text-[1.65rem]">
                {scent.name}
              </h3>
              <p className="mt-1.5 text-[11px] font-light tracking-[0.16em] text-stone">
                {notesJoin(scent)}
              </p>
            </div>
            <p className="shrink-0 text-[11px] tracking-[0.16em] text-ink-soft">{scentComing}</p>
          </div>
        </Link>
      </article>
    </Reveal>
  )
}
