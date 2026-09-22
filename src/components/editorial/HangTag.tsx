import { Lockup } from '@/components/brand/Lockup'
import { creedIntent, creedJoin, creedMotto, creedWoven } from '@/data/creed'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
}

export function HangTag({ className }: Props) {
  return (
    <article
      className={cn(
        'mx-auto flex max-w-sm flex-col items-center bg-night px-10 py-14 text-ivory md:px-12 md:py-16',
        className,
      )}
    >
      <Lockup />
      <p className="mt-10 text-center text-[11px] uppercase tracking-[0.28em] text-ivory/50">
        {creedJoin}
      </p>
      <p className="mt-8 max-w-[18rem] text-center text-[14px] font-light leading-relaxed text-ivory/80">
        {creedWoven} {creedIntent}
      </p>
      <p className="mt-10 text-center text-[11px] uppercase tracking-[0.22em] text-ivory/55">
        {creedMotto}
      </p>
    </article>
  )
}
