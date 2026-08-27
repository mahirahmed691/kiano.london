import { cn } from '@/lib/cn'

type Props = {
  className?: string
}

export function WordBell({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('stroke-current', className)}
    >
      <path
        d="M12 4.5c-2.6 0-4.5 2-4.5 5.2v4.2L5 17.5h14l-2.5-3.6v-4.2c0-3.2-1.9-5.2-4.5-5.2z"
        strokeWidth="1.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M10 18.5c0 1.1.9 2 2 2s2-.9 2-2"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  )
}
