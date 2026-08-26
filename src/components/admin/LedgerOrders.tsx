import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { TextLink } from '@/components/ui/Button'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
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
    <div id="ledger-orders" className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
      <Reveal>
        <Eyebrow>Reservations</Eyebrow>
        <Display as="h2" className="mt-4 text-4xl md:text-5xl">
          Paid cuts.
        </Display>
        <Body className="mt-6">
          Each paid session is a reservation. A Clerk id is kept when the till carried one.
        </Body>
      </Reveal>
      {error ? (
        <p className="mt-8 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      {orders.length === 0 && !error ? (
        <p className="mt-12 text-[15px] font-light text-ink-soft">No paid reservations yet.</p>
      ) : (
        <ul className="mt-12 divide-y divide-rule border-y border-ink">
          {orders.map((order) => (
            <li key={order.id} className="grid gap-4 py-8 lg:grid-cols-12">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">
                {formatLedgerDate(order.createdAt)}
              </p>
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">{order.email}</p>
                <p className="mt-2 text-[13px] font-light text-ink-soft">
                  {orderReference(order.id)} · {order.status}
                  {order.clerkUserId ? ' · member' : ''}
                </p>
                {order.invoiceNumber ? (
                  <p className="mt-3">
                    <TextLink to={`/admin/invoices/${order.invoiceNumber}`}>
                      {order.invoiceNumber}
                    </TextLink>
                  </p>
                ) : null}
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
    </div>
  )
}
