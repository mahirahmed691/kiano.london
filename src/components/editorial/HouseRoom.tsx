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
  /** Kept for callers; the page's own h1 carries the title, so the still stays silent. */
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
          minHeight="band"
          quiet
          priority
        />
      </div>
      <Section className="pt-14 md:pt-20 lg:pt-24">
        <Container className={containerClassName}>{children}</Container>
      </Section>
      <div className="print:hidden">
        <NightMotto quiet />
      </div>
      {close ? (
        <Section className="print:hidden">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Kiano London</p>
              <p className="mt-4 font-display text-3xl font-light">Handmade in the UAE. Made to order.</p>
              <p className="mt-4 text-[14px] font-light text-ink-soft">{site.email}</p>
              <div className="mt-8">
                <TextLink to="/contact">Contact</TextLink>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
