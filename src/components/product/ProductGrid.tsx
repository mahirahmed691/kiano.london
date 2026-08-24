import { type Product } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/lib/cn'

type Props = {
  products: Product[]
  className?: string
  numbered?: boolean
  linkTo?: string
}

export function ProductGrid({ products, className, numbered = true, linkTo }: Props) {
  return (
    <div className={cn('grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8', className)}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={numbered ? String(i + 1).padStart(2, '0') : undefined}
          to={linkTo}
        />
      ))}
    </div>
  )
}
