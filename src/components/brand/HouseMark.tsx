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
        'flex flex-col items-start leading-none',
        inverted && 'drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]',
        className,
      )}
      aria-label={`${site.name}, home`}
    >
      <span className="font-display text-[0.95rem] font-medium uppercase tracking-[0.12em] md:text-[1.15rem] md:tracking-[0.18em]">
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
