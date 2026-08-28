import { cn } from '@/lib/cn'
import type { ColourFilterValue } from '@/lib/colour-param'
import type { ProductColour } from '@/data/products'

type Props = {
  value: ColourFilterValue
  options: Array<'All' | ProductColour>
  onChange: (value: ColourFilterValue) => void
}

export function ColourFilter({ value, options, onChange }: Props) {
  return (
    <div
      className="mb-12 flex flex-wrap gap-x-8 gap-y-3 md:mb-16"
      role="group"
      aria-label="Colour"
    >
      {options.map((option) => {
        const selected = value === option
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cn(
              'relative text-[11px] uppercase tracking-[0.22em] transition-opacity focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]',
              selected ? 'opacity-100 after:scale-x-100' : 'opacity-45 after:scale-x-0 hover:opacity-100',
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
