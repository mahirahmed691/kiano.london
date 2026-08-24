import { Display } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

type Props = {
  quote: string
  attribution?: string
  className?: string
  tone?: 'light' | 'dark'
}

export function QuoteBlock({ quote, attribution, className, tone = 'light' }: Props) {
  return (
    <Reveal className={cn('mx-auto max-w-3xl text-center', className)}>
      <Display
        as="h2"
        className={cn(
          'text-3xl italic sm:text-4xl md:text-5xl',
          tone === 'dark' ? 'text-ivory' : 'text-ink',
        )}
      >
        {quote}
      </Display>
      {attribution ? (
        <p
          className={cn(
            'mt-8 text-[11px] uppercase tracking-[0.22em]',
            tone === 'dark' ? 'text-ivory/60' : 'text-stone',
          )}
        >
          {attribution}
        </p>
      ) : null}
    </Reveal>
  )
}
