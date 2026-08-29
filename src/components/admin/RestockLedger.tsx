import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { getProduct, products, productLineName, thobeSizes } from '@/data/products'
import { isAdminUser } from '@/lib/admin'
import { cn } from '@/lib/cn'
import type { StockMovement } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'

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
  const [note, setNote] = useState('')
  const [movements, setMovements] = useState<StockMovement[]>([])
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
        const data = (await response.json()) as {
          cuts?: Cut[]
          movements?: StockMovement[]
          error?: string
        }
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
        setMovements(data.movements ?? [])
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

  useEffect(() => {
    if (!ready) return
    const id = window.location.hash.replace(/^#/, '')
    if (!id) return
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }, [ready])

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
        body: JSON.stringify({ productId, size, quantity, note: note.trim() }),
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
      const bookResponse = await fetch('/api/admin-inventory', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const bookData = (await bookResponse.json()) as { movements?: StockMovement[] }
      if (bookResponse.ok) setMovements(bookData.movements ?? [])
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

  const held = products.flatMap((product) =>
    thobeSizes
      .filter((size) => (saved[product.id]?.[size] ?? 0) <= 0)
      .map((size) => ({ product, size })),
  )

  return (
    <div className="mt-16">
      {error ? (
        <p className="mb-8 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      {notice && !error ? (
        <p className="mb-8 text-[15px] font-light text-ink-soft" role="status">
          {notice}
        </p>
      ) : null}
      <p className="no-print mb-8">
        <Link
          to="/admin/cuts/book"
          className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
        >
          Print the line
        </Link>
      </p>
      <LedgerFold title="Cuts on the line">
      {held.length > 0 ? (
        <div className="mb-12 border-b border-rule pb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">At none</p>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {held.map(({ product, size }) => (
              <li key={`${product.id}-${size}`}>
                <a
                  href={`#cut-${product.id}`}
                  className="flex items-baseline justify-between gap-6 py-4 transition-opacity hover:opacity-70"
                >
                  <p className="text-[15px] font-light">{productLineName(product)}</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{size}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <label className="block max-w-xl">
        <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
          A line for the book
        </span>
        <input
          type="text"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="mt-2 block w-full border-0 border-b border-rule bg-transparent py-2 text-[15px] font-light text-ink outline-none transition-colors duration-300 focus:border-ink"
          placeholder="Cloth returned, or a size taken to none."
        />
      </label>
      <ul className="mt-12 divide-y divide-rule border-y border-ink">
        {products.map((product) => (
          <li
            key={product.id}
            id={`cut-${product.id}`}
            className="grid scroll-mt-36 gap-6 py-8 lg:grid-cols-12 lg:items-baseline"
          >
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
                      className={cn(
                        'mt-1 block w-16 border-0 border-b border-rule bg-transparent py-1 font-display text-2xl font-light outline-none transition-colors duration-300 focus:border-ink',
                        Number(book[product.id]?.[size] ?? '0') === 0
                          ? 'text-stone'
                          : 'text-ink',
                      )}
                      aria-label={`${productLineName(product)}, size ${size}`}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      </LedgerFold>
      <LedgerFold title="Recent movements" defaultOpen={false}>
          {movements.length > 0 ? (
          <ul className="divide-y divide-rule border-y border-rule">
            {movements.map((row) => {
              const product = getProduct(row.productId)
              const name = product ? productLineName(product) : row.productId
              return (
                <li key={row.id} className="grid gap-2 py-5 sm:grid-cols-12">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone sm:col-span-3">
                    {formatLedgerDate(row.createdAt)}
                  </p>
                  <p className="text-[15px] font-light sm:col-span-5">
                    {name} · {row.size} · {row.kind}
                    {row.note ? ` · ${row.note}` : ''}
                  </p>
                  <p className="text-[15px] font-light sm:col-span-4 sm:text-right">
                    {row.quantityDelta > 0 ? '+' : ''}
                    {row.quantityDelta} → {row.quantityAfter}
                    {row.adminEmail ? (
                      <span className="mt-1 block text-[13px] text-ink-soft">{row.adminEmail}</span>
                    ) : null}
                  </p>
                </li>
              )
            })}
          </ul>
          ) : (
            <p className="text-[15px] font-light text-ink-soft">No movements kept yet.</p>
          )}
      </LedgerFold>
    </div>
  )
}
