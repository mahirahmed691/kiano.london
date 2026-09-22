import { Lockup } from '@/components/brand/Lockup'
import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  size?: Size
  inverted?: boolean
  className?: string
}

const sizeClass: Record<Size, string> = {
  sm: 'w-[4.75rem] px-1.5 py-2.5',
  md: 'w-[7.75rem] px-3 py-3.5',
  lg: 'w-[13rem] px-5 py-7',
}

export function WovenLabel({ size = 'sm', inverted = true, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border',
        inverted ? 'border-bronze/35 bg-night text-bronze' : 'border-ink/20 bg-ivory text-ink',
        sizeClass[size],
        className,
      )}
      aria-hidden="true"
    >
      <Lockup
        compact={size !== 'lg'}
        className={
          size === 'sm'
            ? 'scale-[0.72] origin-center'
            : size === 'md'
              ? 'scale-[0.9] origin-center'
              : undefined
        }
      />
    </div>
  )
}
