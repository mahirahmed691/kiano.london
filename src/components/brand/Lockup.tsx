import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  compact?: boolean
  align?: 'center' | 'start'
  className?: string
}

export function Lockup({ compact = false, align = 'center', className }: Props) {
  return (
    <span
      className={cn(
        'flex flex-col leading-none',
        align === 'start' ? 'items-start' : 'items-center',
        className,
      )}
    >
      <span
        className={cn(
          'font-display font-medium uppercase',
          compact
            ? 'text-[1.02rem] tracking-[0.38em] md:text-[1.18rem] md:tracking-[0.44em]'
            : 'text-[1.35rem] tracking-[0.42em] md:text-[1.55rem] md:tracking-[0.48em]',
        )}
      >
        {site.name}
      </span>
      <span
        className={cn(
          'flex items-center',
          compact ? 'mt-1.5 gap-2' : 'mt-2.5 gap-2.5',
        )}
      >
        <span
          className={cn(
            'h-px bg-current opacity-55',
            compact ? 'w-5 md:w-6' : 'w-8 md:w-10',
          )}
        />
        <span
          className={cn(
            'font-sans font-normal uppercase opacity-70',
            compact
              ? 'text-[0.48rem] tracking-[0.32em] md:text-[0.52rem] md:tracking-[0.36em]'
              : 'text-[0.58rem] tracking-[0.36em] md:text-[0.62rem] md:tracking-[0.4em]',
          )}
        >
          Est. {site.established}
        </span>
        <span
          className={cn(
            'h-px bg-current opacity-55',
            compact ? 'w-5 md:w-6' : 'w-8 md:w-10',
          )}
        />
      </span>
      <span
        className={cn(
          'font-sans font-normal uppercase opacity-80',
          compact
            ? 'mt-1.5 text-[0.58rem] tracking-[0.4em] md:text-[0.64rem] md:tracking-[0.46em]'
            : 'mt-2 text-[0.72rem] tracking-[0.44em] md:text-[0.78rem] md:tracking-[0.5em]',
        )}
      >
        {site.lockup}
      </span>
    </span>
  )
}
