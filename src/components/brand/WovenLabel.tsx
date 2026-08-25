import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { Monogram } from '@/components/brand/Monogram'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  size?: Size
  inverted?: boolean
  className?: string
}

const sizeClass: Record<Size, string> = {
  sm: 'w-[4.25rem] px-2 py-2',
  md: 'w-[7.5rem] px-3 py-3',
  lg: 'w-[11.5rem] px-5 py-6',
}

const markClass: Record<Size, string> = {
  sm: 'h-4',
  md: 'h-7',
  lg: 'h-11',
}

const wordClass: Record<Size, string> = {
  sm: 'mt-1 text-[7px] tracking-[0.32em]',
  md: 'mt-2 text-[9px] tracking-[0.38em]',
  lg: 'mt-3 text-[11px] tracking-[0.42em]',
}

const cityClass: Record<Size, string> = {
  sm: 'mt-0.5 text-[6px] tracking-[0.28em]',
  md: 'mt-1 text-[8px] tracking-[0.36em]',
  lg: 'mt-1.5 text-[9px] tracking-[0.4em]',
}

export function WovenLabel({ size = 'sm', inverted = true, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center border',
        inverted ? 'border-ivory/35 bg-ink text-ivory' : 'border-ink/20 bg-ivory text-ink',
        sizeClass[size],
        className,
      )}
      aria-hidden="true"
    >
      <Monogram className={markClass[size]} decorative />
      <p className={cn('font-display font-medium uppercase', wordClass[size])}>{site.name}</p>
      <p className={cn('uppercase opacity-70', cityClass[size])}>{site.lockup}</p>
    </div>
  )
}
