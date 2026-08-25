import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from '@/components/ui/Container'
import { HouseFilm } from '@/components/editorial/HouseFilm'
import { Display, Eyebrow, Lead } from '@/components/ui/Heading'

type Props = {
  image: string
  imageAlt: string
  film?: string
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
  film,
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
      {film ? (
        <HouseFilm
          src={film}
          poster={image}
          alt={imageAlt}
          objectPosition={objectPosition}
          priority={priority}
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
          fetchPriority={priority ? 'high' : undefined}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,18,16,0.55)_0%,rgba(20,18,16,0.12)_26%,rgba(20,18,16,0.1)_50%,rgba(20,18,16,0.8)_100%)]"
        aria-hidden="true"
      />
      <Container
        className={cn(
          'relative z-10 w-full pb-[max(4.5rem,calc(env(safe-area-inset-bottom)+2rem))] pt-32 md:pb-20 lg:pb-24',
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
