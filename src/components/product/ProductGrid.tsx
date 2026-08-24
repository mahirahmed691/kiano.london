import { type Product, productPath } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/lib/cn'

type Props = {
  products: Product[]
  className?: string
  numbered?: boolean
}

export function ProductGrid({ products, className, numbered = true }: Props) {
  return (
    <div className={cn('grid gap-x-3 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-4', className)}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={numbered ? String(i + 1).padStart(2, '0') : undefined}
          to={productPath(product)}
        />
      ))}
    </div>
  )
}
