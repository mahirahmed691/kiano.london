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
        src="/images/kiano-london.png"
        alt=""
        width={1351}
        height={266}
        className="h-7 w-auto md:h-8"
      />
    </Link>
  )
}
