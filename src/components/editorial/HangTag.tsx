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
        'mx-auto flex max-w-[20rem] flex-col items-center border border-ivory/20 bg-night px-11 py-16 text-ivory md:px-14 md:py-20',
        className,
      )}
    >
      <Lockup className="text-bronze" />
      <span className="mt-12 h-px w-10 bg-bronze/25" aria-hidden="true" />
      <p className="mt-10 text-center text-[10px] uppercase tracking-[0.34em] text-bronze/50">
        {creedJoin}
      </p>
      <p className="mt-8 max-w-[16.5rem] text-center text-[14px] font-light leading-[1.85] text-bronze/80">
        {creedWoven} {creedIntent}
      </p>
      <span className="mt-12 h-px w-10 bg-bronze/25" aria-hidden="true" />
      <p className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-bronze/55">
        {creedMotto}
      </p>
    </article>
  )
}
