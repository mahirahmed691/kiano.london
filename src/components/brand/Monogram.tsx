import { cn } from '@/lib/cn'

type Props = {
  className?: string
  decorative?: boolean
}

export function Monogram({ className, decorative = false }: Props) {
  return (
    <svg
      viewBox="0 0 40 48"
      fill="none"
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      className={cn('stroke-current', className)}
    >
      {decorative ? null : <title>Kiano</title>}
      <path
        d="M11 5v38M11 24L31 5M11 24L31 43"
        strokeWidth="1.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}
