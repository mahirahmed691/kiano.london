import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type Props = {
  to?: string
  className?: string
}

export function Wordmark({ to = '/', className }: Props) {
  return (
    <Link
      to={to}
      className={cn('inline-flex items-center justify-center', className)}
      aria-label={`${site.fullName}, home`}
    >
      <img
        src="/images/kiano-lockup.png"
        alt=""
        width={815}
        height={496}
        className="h-[3.25rem] w-auto md:h-[3.85rem]"
      />
    </Link>
  )
}
