import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { TextLink } from '@/components/ui/Button'
import { isAdminUser } from '@/lib/admin'
import { orderReference } from '@/lib/checkout'
import type { LedgerOrder } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'

export function LedgerOrders() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [orders, setOrders] = useState<LedgerOrder[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { orders?: LedgerOrder[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The reservations could not be read.')
          return
        }
        setOrders(data.orders ?? [])
      } catch {
        if (!cancelled) setError('The reservations could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  return (
    <LedgerFold title="Paid cuts" defaultOpen={false}>
      {error ? (
        <p className="text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      {orders.length === 0 && !error ? (
        <p className="text-[15px] font-light text-ink-soft">No paid reservations yet.</p>
      ) : (
        <ul className="divide-y divide-rule border-y border-ink">
          {orders.map((order) => (
            <li key={order.id} className="grid gap-4 py-8 lg:grid-cols-12">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">
                {formatLedgerDate(order.createdAt)}
              </p>
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">
                  {order.customerName || order.email}
                </p>
                {order.customerName && order.customerName !== order.email ? (
                  <p className="mt-2 text-[13px] font-light text-ink-soft">{order.email}</p>
                ) : null}
                <p className="mt-2 text-[13px] font-light text-ink-soft">
                  {orderReference(order.id)}
                  {order.clerkUserId ? ' · member' : ''}
                </p>
                {order.invoiceNumber ? (
                  <p className="mt-3">
                    <TextLink to={`/admin/invoices/${order.invoiceNumber}`}>
                      {order.invoiceNumber}
                    </TextLink>
                  </p>
                ) : null}
                <p className="mt-3">
                  <TextLink to={`/admin/work?email=${encodeURIComponent(order.email)}`}>
                    The work
                  </TextLink>
                </p>
              </div>
              <ul className="text-[15px] font-light leading-relaxed text-ink-soft lg:col-span-4">
                {order.lines.map((line, index) => (
                  <li key={`${line.productId}-${index}`}>
                    {line.description} · {line.size}
                    {line.quantity > 1 ? ` · ${line.quantity}` : ''}
                  </li>
                ))}
              </ul>
              <p className="font-display text-2xl font-light lg:col-span-2 lg:text-right">
                {formatGbpExact(order.amountPence)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </LedgerFold>
  )
}
