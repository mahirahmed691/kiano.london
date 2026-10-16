import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getProduct, type Product, type ThobeSize } from '@/data/products'

export type BagLine = {
  productId: string
  size: ThobeSize
  quantity: number
}

export type BagItem = BagLine & {
  product: Product
}

type BagContextValue = {
  lines: BagLine[]
  items: BagItem[]
  count: number
  subtotalPence: number
  open: boolean
  setOpen: (open: boolean) => void
  add: (productId: string, size: ThobeSize) => void
  setQuantity: (productId: string, size: ThobeSize, quantity: number) => void
  remove: (productId: string, size: ThobeSize) => void
  clear: () => void
}

const STORAGE_KEY = 'kiano.bag'

const BagContext = createContext<BagContextValue | null>(null)

function readStored(): BagLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as BagLine[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (line) =>
        typeof line.productId === 'string' &&
        typeof line.size === 'number' &&
        typeof line.quantity === 'number' &&
        line.quantity > 0,
    )
  } catch {
    return []
  }
}

function persist(lines: BagLine[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>(readStored)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openBag = () => setOpen(true)
    const closeBag = () => setOpen(false)
    window.addEventListener('kiano-open-bag', openBag)
    window.addEventListener('kiano-close-bag', closeBag)
    return () => {
      window.removeEventListener('kiano-open-bag', openBag)
      window.removeEventListener('kiano-close-bag', closeBag)
    }
  }, [])

  const update = useCallback((next: BagLine[]) => {
    setLines(next)
    persist(next)
  }, [])

  const add = useCallback(
    (productId: string, size: ThobeSize) => {
      const current = lines.find((line) => line.productId === productId && line.size === size)
      const next = current
        ? lines.map((line) =>
            line.productId === productId && line.size === size
              ? { ...line, quantity: Math.min(4, line.quantity + 1) }
              : line,
          )
        : [...lines, { productId, size, quantity: 1 }]
      update(next)
      setOpen(true)
    },
    [lines, update],
  )

  useEffect(() => {
    const hold = (event: Event) => {
      const detail = (event as CustomEvent<{ productId?: unknown; size?: unknown }>).detail
      const productId = typeof detail?.productId === 'string' ? detail.productId : ''
      const size = Number(detail?.size)
      if (!productId || !getProduct(productId) || !size) return
      add(productId, size as ThobeSize)
    }
    window.addEventListener('kiano-add-to-bag', hold)
    return () => window.removeEventListener('kiano-add-to-bag', hold)
  }, [add])

  const setQuantity = useCallback(
    (productId: string, size: ThobeSize, quantity: number) => {
      if (quantity < 1) {
        update(lines.filter((line) => !(line.productId === productId && line.size === size)))
        return
      }
      update(
        lines.map((line) =>
          line.productId === productId && line.size === size
            ? { ...line, quantity: Math.min(4, quantity) }
            : line,
        ),
      )
    },
    [lines, update],
  )

  const remove = useCallback(
    (productId: string, size: ThobeSize) => {
      update(lines.filter((line) => !(line.productId === productId && line.size === size)))
    },
    [lines, update],
  )

  const clear = useCallback(() => update([]), [update])

  const items = useMemo(
    () =>
      lines.flatMap((line) => {
        const product = getProduct(line.productId)
        return product ? [{ ...line, product }] : []
      }),
    [lines],
  )

  const count = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items])
  const subtotalPence = useMemo(
    () => items.reduce((sum, line) => sum + line.product.pricePence * line.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      lines,
      items,
      count,
      subtotalPence,
      open,
      setOpen,
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, items, count, subtotalPence, open, add, setQuantity, remove, clear],
  )

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>
}

export function useCart() {
  const context = useContext(BagContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
