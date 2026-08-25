import { useEffect, useState } from 'react'

export type ProductStock = Record<number, number>

function parseSizes(raw: unknown): ProductStock {
  if (!raw || typeof raw !== 'object') return {}
  const sizes: ProductStock = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const size = Number(key)
    const quantity = Number(value)
    if (Number.isFinite(size) && Number.isFinite(quantity)) {
      sizes[size] = quantity
    }
  }
  return sizes
}

export function remainingCopy(remaining: number) {
  if (remaining <= 0) return 'This size is held. Write to the atelier.'
  if (remaining === 1) return 'One cut remains in this size.'
  return `${remaining} cuts remain in this size.`
}

export function useProductStock(productId: string) {
  const [sizes, setSizes] = useState<ProductStock | null>(null)
  const [loadedId, setLoadedId] = useState(productId)
  if (loadedId !== productId) {
    setLoadedId(productId)
    setSizes(null)
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!productId) return
      try {
        const response = await fetch(`/api/inventory?product_id=${encodeURIComponent(productId)}`)
        const data = (await response.json()) as { sizes?: unknown }
        if (!cancelled && response.ok) setSizes(parseSizes(data.sizes))
      } catch {
        if (!cancelled) setSizes(null)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [productId])

  return sizes
}
