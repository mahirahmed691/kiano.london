import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { type Product } from '@/data/products'

type QuickAddContextValue = {
  product: Product | null
  open: (product: Product) => void
  close: () => void
}

const QuickAddContext = createContext<QuickAddContextValue | null>(null)

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null)
  const { pathname } = useLocation()

  const close = useCallback(() => setProduct(null), [])
  const open = useCallback((next: Product) => setProduct(next), [])

  useEffect(() => {
    setProduct(null)
  }, [pathname])

  const value = useMemo(() => ({ product, open, close }), [product, open, close])

  return <QuickAddContext.Provider value={value}>{children}</QuickAddContext.Provider>
}

export function useQuickAdd() {
  const context = useContext(QuickAddContext)
  if (!context) {
    throw new Error('useQuickAdd must be used within QuickAddProvider')
  }
  return context
}
