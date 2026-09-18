import { Link } from 'react-router-dom'
import { Lockup } from '@/components/brand/Lockup'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  to?: string
  inverted?: boolean
  compact?: boolean
  align?: 'center' | 'start'
  className?: string
}

export function HouseMark({
  to = '/',
  inverted = false,
  compact = true,
  align = 'center',
  className,
}: Props) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex',
        inverted && 'drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]',
        className,
      )}
      aria-label={`${site.fullName}, home`}
    >
      <Lockup compact={compact} align={align} />
    </Link>
  )
}
