import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from '@/components/ui/Container'
import { Display, Eyebrow, Lead } from '@/components/ui/Heading'

type Props = {
  image: string
  imageAlt: string
  objectPosition?: string
  kicker?: string
  title: string
  subtitle?: string
  align?: 'start' | 'center'
  minHeight?: 'screen' | 'tall' | 'page'
  children?: ReactNode
  priority?: boolean
}

const heightClass = {
  screen: 'min-h-[100svh]',
  tall: 'min-h-[85svh] md:min-h-[90svh]',
  page: 'min-h-[58svh] md:min-h-[68svh]',
}

export function Hero({
  image,
  imageAlt,
  objectPosition = 'center 22%',
  kicker,
  title,
  subtitle,
  align = 'start',
  minHeight = 'screen',
  children,
  priority = false,
}: Props) {
  return (
    <section className={cn('relative flex items-end overflow-hidden', heightClass[minHeight])}>
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/25 to-night/15"
        aria-hidden="true"
      />
      <Container
        className={cn(
          'relative z-10 w-full pb-16 pt-32 md:pb-20 lg:pb-24',
          align === 'center' && 'text-center',
        )}
      >
        {kicker ? (
          <Eyebrow className="mb-5 text-ivory/75">{kicker}</Eyebrow>
        ) : null}
        <Display
          as="h1"
          className={cn(
            'max-w-4xl text-[2.75rem] text-ivory sm:text-6xl md:text-7xl lg:text-[5.25rem]',
            align === 'center' && 'mx-auto',
          )}
        >
          {title}
        </Display>
        {subtitle ? (
          <Lead
            className={cn(
              'mt-6 text-ivory/80',
              align === 'center' && 'mx-auto',
            )}
          >
            {subtitle}
          </Lead>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </section>
  )
}
