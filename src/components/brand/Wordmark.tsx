import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  to?: string
  className?: string
  /** Scrolled: the monogram and KIANO only, smaller. */
  compact?: boolean
}

/**
 * The house lockup. The monogram and KIANO are the drawn artwork; LONDON and the
 * established line are set as type, so they stay legible at header size.
 */
export function Wordmark({ to = '/', className, compact = false }: Props) {
  return (
    <Link
      to={to}
      className={cn('inline-flex flex-col items-center justify-center leading-none', className)}
      aria-label={`${site.fullName}, home`}
    >
      <img
        src="/images/kiano-lockup-mark.png"
        alt=""
        width={807}
        height={351}
        className={cn(
          'w-auto transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          compact ? 'h-[2rem] md:h-[2.2rem]' : 'h-[2.6rem] md:h-[2.9rem]',
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'grid w-full justify-items-center overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          compact ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
        )}
      >
        <span className="min-h-0 w-full">
      <span
        aria-hidden="true"
        className="mt-1.5 block pl-[0.5em] text-center font-sans text-[0.62rem] font-normal uppercase tracking-[0.5em] md:text-[0.7rem]"
      >
        {site.lockup}
      </span>
      <span aria-hidden="true" className="mt-1.5 flex w-full items-center gap-1">
        <span className="h-px min-w-3 flex-1 bg-current opacity-70" />
        <span className="shrink-0 pl-[0.22em] font-sans text-[0.56rem] font-normal uppercase tracking-[0.22em] md:text-[0.62rem]">
          Est. {site.established}
        </span>
        <span className="h-px min-w-3 flex-1 bg-current opacity-70" />
      </span>
        </span>
      </span>
    </Link>
  )
}
