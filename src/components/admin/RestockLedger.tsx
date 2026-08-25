import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { products, productLineName, thobeSizes } from '@/data/products'
import { isAdminUser } from '@/lib/admin'

type Cut = {
  productId: string
  size: number
  quantity: number
}

function emptyBook() {
  const book: Record<string, Record<number, string>> = {}
  for (const product of products) {
    book[product.id] = {}
    for (const size of thobeSizes) book[product.id][size] = '0'
  }
  return book
}

export function RestockLedger() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [book, setBook] = useState<Record<string, Record<number, string>>>(emptyBook)
  const [saved, setSaved] = useState<Record<string, Record<number, number>>>({})
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false

    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin-inventory', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { cuts?: Cut[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'Remaining cuts could not be read.')
          return
        }

        const next = emptyBook()
        const snapshot: Record<string, Record<number, number>> = {}
        for (const cut of data.cuts ?? []) {
          if (!next[cut.productId]) continue
          next[cut.productId][cut.size] = String(cut.quantity)
          snapshot[cut.productId] ??= {}
          snapshot[cut.productId][cut.size] = cut.quantity
        }
        setBook(next)
        setSaved(snapshot)
        setReady(true)
      } catch {
        if (!cancelled) setError('Remaining cuts could not be read.')
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  async function keepCut(productId: string, size: number) {
    const raw = book[productId]?.[size] ?? '0'
    if (raw.trim() === '') {
      setBook((current) => ({
        ...current,
        [productId]: { ...current[productId], [size]: String(saved[productId]?.[size] ?? 0) },
      }))
      return
    }
    const quantity = Number(raw)
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 999) {
      setError('A whole number of remaining cuts is needed.')
      return
    }
    if (saved[productId]?.[size] === quantity) return

    try {
      const token = await getToken()
      const response = await fetch('/api/admin-inventory', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ productId, size, quantity }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(data.error || 'The cut could not be kept.')
        return
      }
      setSaved((current) => ({
        ...current,
        [productId]: { ...current[productId], [size]: quantity },
      }))
      setError('')
      setNotice(`Kept ${quantity} in ${size}.`)
    } catch {
      setError('The cut could not be kept.')
    }
  }

  if (error && !ready) {
    return (
      <p className="mt-8 text-[15px] font-light text-ink" role="alert">
        {error}
      </p>
    )
  }

  if (!ready) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading remaining cuts.</p>
  }

  return (
    <>
      {error ? (
        <p className="mt-8 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      {notice && !error ? (
        <p className="mt-8 text-[15px] font-light text-ink-soft" role="status">
          {notice}
        </p>
      ) : null}
      <ul className="mt-12 divide-y divide-rule border-y border-ink">
        {products.map((product) => (
          <li key={product.id} className="grid gap-6 py-8 lg:grid-cols-12 lg:items-baseline">
            <div className="lg:col-span-4">
              <p className="font-display text-2xl font-light">{productLineName(product)}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-stone">
                {product.cut}
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-8 gap-y-5 lg:col-span-8">
              {thobeSizes.map((size) => (
                <li key={size}>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-stone">{size}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={999}
                      step={1}
                      value={book[product.id]?.[size] ?? '0'}
                      onChange={(event) => {
                        const value = event.target.value
                        setBook((current) => ({
                          ...current,
                          [product.id]: { ...current[product.id], [size]: value },
                        }))
                      }}
                      onBlur={() => void keepCut(product.id, size)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') (event.target as HTMLInputElement).blur()
                      }}
                      className="mt-1 block w-16 border-0 border-b border-rule bg-transparent py-1 font-display text-2xl font-light text-ink outline-none transition-colors duration-300 focus:border-ink"
                      aria-label={`${productLineName(product)}, size ${size}`}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}
