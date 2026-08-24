import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'outline' | 'ghost' | 'invert'

type Props = {
  children: ReactNode
  className?: string
  variant?: Variant
  to?: string
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
}

const variantClass: Record<Variant, string> = {
  outline:
    'border border-current bg-transparent hover:bg-ink hover:text-ivory hover:border-ink',
  ghost: 'border-0 bg-transparent px-0 hover:opacity-70',
  invert:
    'border border-ivory/70 bg-transparent text-ivory hover:bg-ivory hover:text-ink',
}

function classes(variant: Variant, className?: string) {
  return cn(
    'inline-flex items-center gap-3 px-7 py-2.5 text-[11px] font-normal uppercase tracking-[0.22em] transition-colors duration-300',
    variantClass[variant],
    className,
  )
}

export function Button({
  children,
  className,
  variant = 'outline',
  to,
  href,
  type = 'button',
  onClick,
}: Props) {
  const classNames = classes(variant, className)

  if (to) {
    return (
      <Link to={to} className={classNames}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classNames}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classNames} onClick={onClick}>
      {children}
    </button>
  )
}

export function TextLink({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70',
        className,
      )}
    >
      <span className="border-b border-current pb-0.5">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}
