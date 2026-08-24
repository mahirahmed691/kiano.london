import { type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  as?: ElementType
  children: ReactNode
  className?: string
  id?: string
}

export function Container({ as: Tag = 'div', children, className, id }: Props) {
  return (
    <Tag
      id={id}
      className={cn('mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-24', className)}
    >
      {children}
    </Tag>
  )
}

export function Section({ as: Tag = 'section', children, className, id }: Props) {
  return (
    <Tag id={id} className={cn('py-20 md:py-28 lg:py-36', className)}>
      {children}
    </Tag>
  )
}
