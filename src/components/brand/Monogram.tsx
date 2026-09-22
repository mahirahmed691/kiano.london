import { cn } from '@/lib/cn'

type Props = {
  className?: string
  decorative?: boolean
}

export function Monogram({ className, decorative = false }: Props) {
  return (
    <svg
      viewBox="0 0 64 76"
      fill="none"
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      className={cn('stroke-current', className)}
    >
      {decorative ? null : <title>Kiano</title>}
      <g
        strokeWidth="1.7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M32 8 V68" />
        <path d="M23 8 H41" />
        <path d="M23 68 H41" />
        <path d="M32 28 L12 14" />
        <path d="M32 28 L52 14" />
        <path d="M8 14 H16" />
        <path d="M48 14 H56" />
        <path d="M32 48 L12 62" />
        <path d="M32 48 L52 62" />
        <path d="M8 62 H16" />
        <path d="M48 62 H56" />
      </g>
    </svg>
  )
}
