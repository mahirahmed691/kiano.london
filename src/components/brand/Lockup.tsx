import { Monogram } from '@/components/brand/Monogram'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  compact?: boolean
  align?: 'center' | 'start'
  className?: string
}

export function Lockup({ compact = false, align = 'center', className }: Props) {
  const estTracking = compact
    ? 'tracking-[0.32em] md:tracking-[0.36em] pl-[0.32em] md:pl-[0.36em]'
    : 'tracking-[0.36em] md:tracking-[0.4em] pl-[0.36em] md:pl-[0.4em]'

  return (
    <span
      className={cn(
        'inline-flex w-fit flex-col leading-none',
        align === 'start' ? 'items-start' : 'items-center',
        className,
      )}
    >
      <Monogram
        decorative
        className={cn(
          'w-auto',
          compact ? 'h-[1.7rem] md:h-[2.05rem]' : 'h-11 md:h-[3.15rem]',
        )}
      />
      <span
        className={cn(
          'font-display font-medium uppercase',
          compact
            ? 'mt-2 text-[1.02rem] tracking-[0.38em] pl-[0.38em] md:mt-2.5 md:text-[1.18rem] md:tracking-[0.44em] md:pl-[0.44em]'
            : 'mt-3.5 text-[1.35rem] tracking-[0.42em] pl-[0.42em] md:mt-4 md:text-[1.55rem] md:tracking-[0.48em] md:pl-[0.48em]',
        )}
      >
        {site.name}
      </span>
      <span
        className={cn(
          'font-sans font-normal uppercase',
          compact
            ? 'mt-1 text-[0.58rem] tracking-[0.4em] pl-[0.4em] md:mt-[0.28rem] md:text-[0.64rem] md:tracking-[0.46em] md:pl-[0.46em]'
            : 'mt-1.5 text-[0.72rem] tracking-[0.44em] pl-[0.44em] md:text-[0.78rem] md:tracking-[0.5em] md:pl-[0.5em]',
        )}
      >
        {site.lockup}
      </span>
      <span
        className={cn(
          'flex w-full items-center self-stretch',
          compact ? 'mt-2 gap-2 md:mt-2.5' : 'mt-3 gap-2.5',
        )}
      >
        <span className="h-px min-w-4 flex-1 bg-current opacity-55" />
        <span
          className={cn(
            'shrink-0 font-sans font-normal uppercase opacity-70',
            compact ? 'text-[0.48rem] md:text-[0.52rem]' : 'text-[0.58rem] md:text-[0.62rem]',
            estTracking,
          )}
        >
          EST. {site.established}
        </span>
        <span className="h-px min-w-4 flex-1 bg-current opacity-55" />
      </span>
    </span>
  )
}
