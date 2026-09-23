import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from '@/components/ui/Container'
import { Display, Eyebrow, Lead } from '@/components/ui/Heading'

type Props = {
  image: string
  imageAlt: string
  objectPosition?: string
  kicker?: string
  title?: string
  subtitle?: string
  align?: 'start' | 'center'
  minHeight?: 'screen' | 'tall' | 'page'
  children?: ReactNode
  priority?: boolean
  quiet?: boolean
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
  quiet = false,
}: Props) {
  const hasCopy = Boolean(kicker || title || subtitle || children)

  return (
    <section className={cn('relative flex items-end overflow-hidden', heightClass[minHeight])}>
      <img
        src={image}
        alt={imageAlt}
        className="still-in absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      <div
        className={
          quiet
            ? 'scrim-night-top absolute inset-x-0 top-0 h-40'
            : 'scrim-night-hero absolute inset-0'
        }
        aria-hidden="true"
      />
      {!quiet && hasCopy ? (
        <Container
          className={cn(
            'relative z-10 w-full pb-[max(5rem,calc(env(safe-area-inset-bottom)+2.5rem))] pt-32 md:pb-24 lg:pb-28',
            align === 'center' && 'text-center',
          )}
        >
          {kicker ? (
            <Eyebrow className="copy-in mb-7 text-ivory/70">{kicker}</Eyebrow>
          ) : null}
          {title ? (
            <div className="copy-in" style={{ animationDelay: kicker ? '90ms' : undefined }}>
              <Display
                as="h1"
                className={cn(
                  'max-w-4xl text-[2.85rem] text-ivory sm:text-6xl md:text-7xl lg:text-[5.65rem]',
                  align === 'center' && 'mx-auto',
                )}
              >
                {title}
              </Display>
            </div>
          ) : null}
          {subtitle ? (
            <div className="copy-in" style={{ animationDelay: '180ms' }}>
              <Lead
                className={cn(
                  'mt-8 max-w-2xl text-ivory/80',
                  align === 'center' && 'mx-auto',
                )}
              >
                {subtitle}
              </Lead>
            </div>
          ) : null}
          {children ? (
            <div className="copy-in mt-12" style={{ animationDelay: '260ms' }}>
              {children}
            </div>
          ) : null}
        </Container>
      ) : null}
    </section>
  )
}
