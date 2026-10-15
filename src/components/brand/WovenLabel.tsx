import { Monogram } from '@/components/brand/Monogram'
import { clothSwatch, clothThread, type ProductColour } from '@/data/products'
import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  size?: Size
  colour?: ProductColour
  className?: string
}

const sizeClass: Record<Size, string> = {
  sm: 'h-[3.25rem] w-[3.25rem]',
  md: 'h-[4.5rem] w-[4.5rem]',
  lg: 'h-[6.5rem] w-[6.5rem]',
}

export function WovenLabel({ size = 'sm', colour = 'Cream', className }: Props) {
  const cloth = clothSwatch[colour]
  const thread = clothThread

  return (
    <div
      className={cn('relative shrink-0', sizeClass[size], className)}
      style={{ backgroundColor: cloth, color: thread }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-[9%] h-[82%] w-[82%]"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="0.7"
          y="0.7"
          width="98.6"
          height="98.6"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeDasharray="2.3 2.8"
          strokeLinecap="butt"
        />
      </svg>
      <Monogram decorative className="absolute inset-[22%] m-auto h-auto w-auto" />
    </div>
  )
}
