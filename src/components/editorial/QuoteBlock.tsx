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
  const line = tone === 'dark' ? 'bg-bronze/40' : 'bg-ink/20'

  return (
    <Reveal className={cn('mx-auto max-w-3xl text-center', className)}>
      <div className={cn('mx-auto mb-10 h-px w-12 md:mb-12 md:w-16', line)} />
      <Display
        as="h2"
        className={cn(
          'text-4xl italic sm:text-5xl md:text-6xl',
          tone === 'dark' ? 'text-ivory' : 'text-ink',
        )}
      >
        {quote}
      </Display>
      {attribution ? (
        <p
          className={cn(
            'mt-10 text-[10px] uppercase tracking-[0.34em]',
            tone === 'dark' ? 'text-bronze' : 'text-stone',
          )}
        >
          {attribution}
        </p>
      ) : null}
      <div className={cn('mx-auto mt-10 h-px w-12 md:mt-12 md:w-16', line)} />
    </Reveal>
  )
}
