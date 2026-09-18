import { Lockup } from '@/components/brand/Lockup'
import { cn } from '@/lib/cn'

type Props = {
  id: string
  name: string
  className?: string
}

const wordmarks: Record<string, string> = {
  'bait-al-kandora': '/images/competitors/bait-al-kandora.svg',
  'dar-al-ahad': '/images/competitors/dar-al-ahad.svg',
  'al-nashama': '/images/competitors/al-nashama.svg',
  qalbi: '/images/competitors/qalbi.svg',
  'al-badr': '/images/competitors/al-badr.svg',
  'al-qamees': '/images/competitors/al-qamees.svg',
  alif: '/images/competitors/alif.svg',
  shukr: '/images/competitors/shukr.svg',
}

export function CompetitorMark({ id, name, className }: Props) {
  if (id === 'kiano') {
    return <Lockup compact={false} align="start" className={cn('text-ink', className)} />
  }

  const src = wordmarks[id]
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('h-9 w-auto max-w-[16rem] object-contain object-left', className)}
      />
    )
  }

  return (
    <p
      className={cn(
        'font-display text-3xl font-light leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl',
        className,
      )}
    >
      {name}
    </p>
  )
}
