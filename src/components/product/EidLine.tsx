import { eidNotice, formatOrderBy, type EidRegion } from '@/lib/eid'
import { useLocale } from '@/lib/local-price'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
  /** A known delivery country (checkout); otherwise guessed from the visitor's currency. */
  region?: EidRegion
}

export function EidLine({ className, region }: Props) {
  const locale = useLocale()
  const where: EidRegion = region ?? (locale ? 'abroad' : 'uk')
  const notice = eidNotice(where)
  if (!notice) return null

  if (notice.kind === 'after') {
    return (
      <p className={cn('text-[13px] font-light leading-relaxed text-stone', className)}>
        Orders placed now are made after {notice.eid}.
      </p>
    )
  }

  const soon = notice.daysLeft <= 7
  return (
    <p className={cn('text-[13px] font-light leading-relaxed text-ink', className)}>
      <span className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-ink-soft">{notice.eid}</span>
      Order by {formatOrderBy(notice.orderBy)} for delivery before {notice.eid}
      {where === 'uk' ? ' in the UK' : ''}.
      {soon ? (
        <span className="text-stone">
          {' '}
          {notice.daysLeft === 0 ? 'Today is the last day.' : `${notice.daysLeft} days left.`}
        </span>
      ) : null}
    </p>
  )
}
