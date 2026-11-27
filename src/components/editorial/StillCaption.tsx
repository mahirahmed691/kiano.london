import { type ElementType, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Props = {
  kicker: string
  title: string
  to?: string
  /** What the link does, when the kicker and title alone do not say it. */
  label?: string
  children?: ReactNode
  className?: string
  as?: ElementType
}

export function StillCaption({
  kicker,
  title,
  to,
  label,
  children,
  className,
  as: Tag = 'figcaption',
}: Props) {
  const copy = (
    <>
      <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/85">{kicker}</p>
      <p className="mt-2 font-display text-3xl font-light md:text-4xl">{title}</p>
      {children}
    </>
  )

  return (
    <Tag
      className={cn(
        'scrim-night-caption absolute inset-x-0 bottom-0 px-6 pb-10 pt-16 md:px-12 lg:px-16',
        className,
      )}
    >
      {to ? (
        <Link
          to={to}
          aria-label={label}
          className="inline-block text-ivory transition-opacity duration-500 [text-shadow:0_1px_14px_rgba(27,23,20,0.35)] hover:opacity-80"
        >
          {copy}
        </Link>
      ) : (
        <div className="text-ivory [text-shadow:0_1px_14px_rgba(27,23,20,0.35)]">{copy}</div>
      )}
    </Tag>
  )
}
