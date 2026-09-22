import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
  id?: string
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'text-[10px] font-normal uppercase tracking-[0.34em] text-stone',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function Display({ as: Tag = 'h2', children, className, id }: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        'font-display font-light leading-[1.02] tracking-[-0.028em] text-ink',
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
        'max-w-xl font-display text-xl font-light leading-[1.45] text-ink-soft md:text-2xl',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('max-w-prose text-[15px] font-light leading-[1.85] tracking-[0.01em] text-ink-soft md:text-base', className)}>
      {children}
    </p>
  )
}
