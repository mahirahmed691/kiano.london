import { cn } from '@/lib/cn'
import { formatLocal, useLocale } from '@/lib/local-price'

type Props = { pence: number; className?: string; note?: boolean }

/** "≈ AED 370" beside a GBP price, for visitors outside the UK. Renders nothing in the UK. */
export function LocalPrice({ pence, className, note = false }: Props) {
  const locale = useLocale()
  if (!locale) return null
  return (
    <span className={cn('text-stone', className)} title="Approximate. Charged in pounds sterling.">
      ≈ {formatLocal(pence, locale)}
      {note ? ' · charged in £' : null}
    </span>
  )
}
