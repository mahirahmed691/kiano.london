import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  to?: string
  inverted?: boolean
  className?: string
}

export function HouseMark({ to = '/', inverted = false, className }: Props) {
  return (
    <Link
      to={to}
      className={cn(
        'flex flex-col leading-none',
        inverted && 'drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]',
        className ?? 'items-start',
      )}
      aria-label={`${site.name}, home`}
    >
      <span className="font-display text-[1.05rem] font-medium uppercase tracking-[0.32em] md:text-[1.28rem] md:tracking-[0.42em]">
        {site.name}
      </span>
      <span
        lang="ar"
        dir="rtl"
        className="mt-1 font-arabic text-[0.78rem] font-normal tracking-normal text-current opacity-70"
      >
        {site.arabicName}
      </span>
    </Link>
  )
}
