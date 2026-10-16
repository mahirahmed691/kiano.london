import { type ReactNode } from 'react'
import { Hero } from '@/components/editorial/Hero'
import { NightMotto } from '@/components/editorial/NightMotto'
import { TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { site } from '@/data/site'

export const houseStill = {
  image: '/images/cutting-room.jpg',
  imageAlt: 'Paper, shears, and cloth: the work of a thobe.',
  objectPosition: 'center 40%',
} as const

type Props = {
  kicker: string
  title: string
  image?: string
  imageAlt?: string
  objectPosition?: string
  children: ReactNode
  /** Ivory after the night plate so the footer is not flush on night. */
  close?: boolean
  containerClassName?: string
}

export function HouseRoom({
  kicker,
  title,
  image = houseStill.image,
  imageAlt = houseStill.imageAlt,
  objectPosition = houseStill.objectPosition,
  children,
  close = true,
  containerClassName,
}: Props) {
  return (
    <>
      <div className="print:hidden">
        <Hero
          image={image}
          imageAlt={imageAlt}
          objectPosition={objectPosition}
          kicker={kicker}
          title={title}
          minHeight="page"
          quiet
          priority
        />
      </div>
      <Section>
        <Container className={containerClassName}>{children}</Container>
      </Section>
      <div className="print:hidden">
        <NightMotto quiet />
      </div>
      {close ? (
        <Section className="print:hidden">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-stone">The house</p>
              <p className="mt-4 font-display text-3xl font-light">By appointment. London.</p>
              <p className="mt-4 text-[14px] font-light text-ink-soft">{site.email}</p>
              <div className="mt-8">
                <TextLink to="/visit">A visit</TextLink>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
