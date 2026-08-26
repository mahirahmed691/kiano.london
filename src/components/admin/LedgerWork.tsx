import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { packingSteps } from '@/data/packing'
import { isAdminUser } from '@/lib/admin'
import { orderReference } from '@/lib/checkout'
import type { LedgerOrder } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'
import { asWorkStage, workCopy, workStages, type WorkStage } from '@/lib/work'

export function LedgerWork() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [orders, setOrders] = useState<LedgerOrder[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

  async function load(token: string | null) {
    const response = await fetch('/api/admin?section=work', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    const data = (await response.json()) as { orders?: LedgerOrder[]; error?: string }
    if (!response.ok) {
      setError(data.error || 'The work could not be read.')
      return
    }
    setError('')
    setOrders(data.orders ?? [])
  }

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false
    async function read() {
      try {
        const token = await getToken()
        if (cancelled) return
        await load(token)
      } catch {
        if (!cancelled) setError('The work could not be read.')
      }
    }
    void read()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  async function setStage(orderId: string, stage: WorkStage) {
    setBusy(orderId)
    try {
      const token = await getToken()
      const response = await fetch('/api/admin?section=work', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderId, stage }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(data.error || 'The work could not be kept.')
        return
      }
      await load(token)
    } catch {
      setError('The work could not be kept.')
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="mt-16">
      {error ? (
        <p className="mb-8 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}

      <aside className="mb-14 border-t border-ink pt-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">When it is packed</p>
        <ul className="mt-6 grid gap-8 sm:grid-cols-3">
          {packingSteps.map((step) => (
            <li key={step.number}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                {step.number} · {step.title}
              </p>
              <p className="mt-3 text-[14px] font-light leading-relaxed text-ink-soft">{step.copy}</p>
            </li>
          ))}
        </ul>
      </aside>

      {orders.length === 0 && !error ? (
        <p className="text-[15px] font-light text-ink-soft">No paid reservations yet.</p>
      ) : (
        <ul className="divide-y divide-rule border-y border-ink">
          {orders.map((order) => {
            const stage = asWorkStage(order.stage ?? 'reserved')
            return (
              <li key={order.id} className="py-10">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                    {formatLedgerDate(order.createdAt)} · {orderReference(order.id)}
                  </p>
                  <p className="font-display text-2xl font-light">
                    {formatGbpExact(order.amountPence)}
                  </p>
                </div>
                <p className="mt-3 font-display text-3xl font-light">{order.email}</p>
                <ul className="mt-4 text-[15px] font-light text-ink-soft">
                  {order.lines.map((line, index) => (
                    <li key={`${line.productId}-${index}`}>
                      {line.description} · {line.size}
                      {line.quantity > 1 ? ` · ${line.quantity}` : ''}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[14px] font-light text-ink-soft">{workCopy[stage].line}</p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                  {workStages.map((next) => (
                    <button
                      key={next}
                      type="button"
                      disabled={busy === order.id}
                      onClick={() => void setStage(order.id, next)}
                      className={
                        next === stage
                          ? 'text-[11px] uppercase tracking-[0.22em]'
                          : 'text-[11px] uppercase tracking-[0.22em] opacity-45 transition-opacity hover:opacity-100'
                      }
                    >
                      {workCopy[next].label}
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
