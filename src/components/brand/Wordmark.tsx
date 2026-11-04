import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  to?: string
  className?: string
}

/**
 * The house lockup. The monogram and KIANO are the drawn artwork; LONDON and the
 * established line are set as type, so they stay legible at header size.
 */
export function Wordmark({ to = '/', className }: Props) {
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
        className="h-[2.6rem] w-auto md:h-[2.9rem]"
      />
      <span
        aria-hidden="true"
        className="mt-1.5 pl-[0.5em] font-sans text-[0.62rem] font-normal uppercase tracking-[0.5em] md:text-[0.7rem]"
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
    </Link>
  )
}
