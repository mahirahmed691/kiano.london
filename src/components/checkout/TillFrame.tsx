import { type ReactNode } from 'react'
import { Hero } from '@/components/editorial/Hero'
import { NightMotto } from '@/components/editorial/NightMotto'
import { Container, Section } from '@/components/ui/Container'
import type { Product } from '@/data/products'

const cuttingRoom = {
  image: '/images/cutting-room.jpg',
  imageAlt: 'Paper, shears, and cloth: the work of a thobe.',
  objectPosition: 'center 40%',
} as const

function tillStill(product?: Product | null) {
  if (!product) return cuttingRoom
  return {
    image: product.image,
    imageAlt: product.imageAlt,
    objectPosition: product.objectPosition ?? 'center 22%',
  }
}

type Props = {
  kicker?: string
  title: string
  product?: Product | null
  children: ReactNode
}

export function TillFrame({ kicker = 'The till', title, product, children }: Props) {
  const still = tillStill(product)

  return (
    <>
      <div className="print:hidden">
        <Hero
          image={still.image}
          imageAlt={still.imageAlt}
          objectPosition={still.objectPosition}
          kicker={kicker}
          title={title}
          minHeight="page"
          quiet
          priority
        />
      </div>
      <Section>
        <Container>{children}</Container>
      </Section>
      <div className="print:hidden">
        <NightMotto quiet />
      </div>
    </>
  )
}
