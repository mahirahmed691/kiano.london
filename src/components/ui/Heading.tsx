import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'text-[11px] font-normal uppercase tracking-[0.28em] text-stone',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function Display({ as: Tag = 'h2', children, className }: Props) {
  return (
    <Tag
      className={cn(
        'font-display font-light leading-[1.05] tracking-[-0.02em] text-ink',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'max-w-xl font-display text-xl font-light leading-relaxed text-ink-soft md:text-2xl',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('max-w-prose text-[15px] font-light leading-relaxed text-ink-soft md:text-base', className)}>
      {children}
    </p>
  )
}
