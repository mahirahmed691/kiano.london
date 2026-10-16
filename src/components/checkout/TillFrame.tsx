import { type ReactNode } from 'react'
import { HouseRoom, houseStill } from '@/components/editorial/HouseRoom'
import type { Product } from '@/data/products'

function tillStill(product?: Product | null) {
  if (!product) return houseStill
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
    <HouseRoom
      kicker={kicker}
      title={title}
      image={still.image}
      imageAlt={still.imageAlt}
      objectPosition={still.objectPosition}
      close={false}
    >
      {children}
    </HouseRoom>
  )
}
