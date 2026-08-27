import { getProduct, productLineName, productPath, products } from '@/data/products'

export type HouseNotice = {
  id: number
  audience: 'member' | 'admin'
  kind: string
  title: string
  body: string
  href: string
  productIds: string[]
  createdAt: string
  read: boolean
}

export type NoticePlate = {
  productId: string
  src: string
  alt: string
  href: string
  objectPosition?: string
}

export function formatNoticeWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function productIdsFromCopy(copy: string) {
  const text = copy.toLowerCase()
  return products
    .filter((item) => {
      const line = productLineName(item).toLowerCase()
      return text.includes(line) || text.includes(item.id)
    })
    .map((item) => item.id)
}

export function noticePlates(notice: Pick<HouseNotice, 'productIds' | 'title' | 'body'>) {
  const ids = [
    ...new Set([
      ...(notice.productIds ?? []),
      ...productIdsFromCopy(`${notice.title} ${notice.body}`),
    ]),
  ].slice(0, 8)

  return ids.flatMap((id): NoticePlate[] => {
    const product = getProduct(id)
    if (!product) return []
    return [
      {
        productId: product.id,
        src: product.image,
        alt: product.imageAlt || product.name,
        href: productPath(product),
        objectPosition: product.objectPosition,
      },
    ]
  })
}
