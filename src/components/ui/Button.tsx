import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'outline' | 'ghost' | 'invert' | 'solid'

type Props = {
  children: ReactNode
  className?: string
  variant?: Variant
  to?: string
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}

const variantClass: Record<Variant, string> = {
  outline:
    'border border-current bg-transparent [@media(hover:hover)]:hover:bg-ink [@media(hover:hover)]:hover:text-ivory [@media(hover:hover)]:hover:border-ink',
  ghost: 'border-0 bg-transparent px-0 [@media(hover:hover)]:hover:opacity-70',
  invert:
    'border border-ivory bg-ivory text-ink [@media(hover:hover)]:hover:bg-transparent [@media(hover:hover)]:hover:text-ivory',
  solid:
    'border border-ink bg-ink text-ivory [@media(hover:hover)]:hover:bg-transparent [@media(hover:hover)]:hover:text-ink',
}

function classes(variant: Variant, className?: string, disabled?: boolean) {
  return cn(
    'inline-flex min-h-11 items-center gap-3 px-7 py-2.5 text-[11px] font-normal uppercase tracking-[0.22em] transition-colors duration-300 active:opacity-80',
    variantClass[variant],
    disabled && 'pointer-events-none opacity-35',
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
  disabled = false,
}: Props) {
  const classNames = classes(variant, className, disabled)

  if (to && !disabled) {
    return (
      <Link to={to} className={classNames} onClick={onClick}>
        {children}
      </Link>
    )
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classNames}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classNames} onClick={onClick} disabled={disabled}>
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
