import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { packingSteps } from '@/data/packing'
import { isAdminUser } from '@/lib/admin'
import { orderReference } from '@/lib/checkout'
import type { LedgerOrder } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'
import {
  asWorkStage,
  dispatchLine,
  formatNamedWeek,
  isFullyReturned,
  isWorkBackwards,
  workCopy,
  workStages,
  type WorkStage,
} from '@/lib/work'

const fieldClass =
  'w-full border-0 border-b border-rule bg-transparent py-2 text-[15px] font-light text-ink outline-none transition-colors duration-300 placeholder:text-stone/70 focus:border-ink'

type DispatchDraft = {
  carrier: string
  tracking: string
  trackingHref: string
  readyWeek: string
  reason: string
}

export function LedgerWork() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [orders, setOrders] = useState<LedgerOrder[]>([])
  const [drafts, setDrafts] = useState<Record<string, DispatchDraft>>({})
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
    const next = data.orders ?? []
    setOrders(next)
    setDrafts(
      Object.fromEntries(
        next.map((order) => [
          order.id,
          {
            carrier: order.carrier ?? '',
            tracking: order.tracking ?? '',
            trackingHref: order.trackingHref ?? '',
            readyWeek: order.readyWeek ?? '',
            reason: '',
          },
        ]),
      ),
    )
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

  function patchDraft(orderId: string, patch: Partial<DispatchDraft>) {
    setDrafts((current) => ({
      ...current,
      [orderId]: {
        carrier: current[orderId]?.carrier ?? '',
        tracking: current[orderId]?.tracking ?? '',
        trackingHref: current[orderId]?.trackingHref ?? '',
        readyWeek: current[orderId]?.readyWeek ?? '',
        reason: current[orderId]?.reason ?? '',
        ...patch,
      },
    }))
  }

  async function setStage(orderId: string, stage: WorkStage) {
    setBusy(orderId)
    try {
      const token = await getToken()
      const draft = drafts[orderId] ?? {
        carrier: '',
        tracking: '',
        trackingHref: '',
        readyWeek: '',
        reason: '',
      }
      const response = await fetch('/api/admin?section=work', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          orderId,
          stage,
          carrier: draft.carrier,
          tracking: draft.tracking,
          trackingHref: draft.trackingHref,
          readyWeek: draft.readyWeek,
          reason: draft.reason,
        }),
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
            const returned = isFullyReturned(order.amountPence, order.refundedPence ?? 0)
            const draft = drafts[order.id] ?? {
              carrier: order.carrier ?? '',
              tracking: order.tracking ?? '',
              trackingHref: order.trackingHref ?? '',
              readyWeek: order.readyWeek ?? '',
              reason: '',
            }
            return (
              <li key={order.id} className="py-10">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                    {formatLedgerDate(order.createdAt)} · {orderReference(order.id)}
                    {returned ? ' · Returned' : ''}
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
                <p className="mt-4 text-[14px] font-light text-ink-soft">
                  {returned
                    ? 'The reservation has been returned. The size is back on the line.'
                    : stage === 'sent'
                      ? dispatchLine(order.carrier ?? '', order.tracking ?? '')
                      : workCopy[stage].line}
                </p>
                {!returned && order.readyWeek ? (
                  <p className="mt-2 text-[14px] font-light text-ink-soft">
                    The house names the week of {formatNamedWeek(order.readyWeek)}.
                  </p>
                ) : null}
                {!returned && order.stageNote ? (
                  <p className="mt-2 text-[14px] font-light text-ink">{order.stageNote}</p>
                ) : null}
                {order.note ? (
                  <p className="mt-4 text-[15px] font-light leading-relaxed text-ink">
                    {order.note}
                  </p>
                ) : null}
                <p className="mt-4">
                  <Link
                    to={`/admin/work/card?id=${encodeURIComponent(order.id)}`}
                    className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
                  >
                    The house card
                  </Link>
                </p>
                {returned ? null : (
                  <>
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                      {workStages.map((next) => {
                        const back = isWorkBackwards(stage, next)
                        return (
                        <button
                          key={next}
                          type="button"
                          disabled={busy === order.id || (back && !draft.reason.trim())}
                          onClick={() => void setStage(order.id, next)}
                          className={
                            next === stage
                              ? 'text-[11px] uppercase tracking-[0.22em]'
                              : 'text-[11px] uppercase tracking-[0.22em] opacity-45 transition-opacity hover:opacity-100 disabled:opacity-25'
                          }
                        >
                          {workCopy[next].label}
                        </button>
                        )
                      })}
                    </div>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <label>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                          The week
                        </span>
                        <input
                          className={fieldClass}
                          type="date"
                          value={draft.readyWeek}
                          onChange={(event) =>
                            patchDraft(order.id, { readyWeek: event.target.value })
                          }
                        />
                      </label>
                      <label>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                          A reason, if held back
                        </span>
                        <input
                          className={fieldClass}
                          value={draft.reason}
                          onChange={(event) =>
                            patchDraft(order.id, { reason: event.target.value })
                          }
                        />
                      </label>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        disabled={busy === order.id || !draft.readyWeek}
                        onClick={() => void setStage(order.id, stage)}
                        className="text-[11px] uppercase tracking-[0.22em] opacity-45 transition-opacity hover:opacity-100"
                      >
                        Name the week
                      </button>
                    </div>
                    <div className="mt-8 grid gap-6 sm:grid-cols-3">
                      <label>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                          How it left
                        </span>
                        <input
                          className={fieldClass}
                          value={draft.carrier}
                          onChange={(event) => patchDraft(order.id, { carrier: event.target.value })}
                          placeholder="Royal Mail"
                        />
                      </label>
                      <label>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                          The number
                        </span>
                        <input
                          className={fieldClass}
                          value={draft.tracking}
                          onChange={(event) =>
                            patchDraft(order.id, { tracking: event.target.value })
                          }
                        />
                      </label>
                      <label>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                          A link
                        </span>
                        <input
                          className={fieldClass}
                          value={draft.trackingHref}
                          onChange={(event) =>
                            patchDraft(order.id, { trackingHref: event.target.value })
                          }
                          placeholder="https://"
                          inputMode="url"
                        />
                      </label>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        disabled={busy === order.id}
                        onClick={() => void setStage(order.id, 'sent')}
                        className="text-[11px] uppercase tracking-[0.22em] opacity-45 transition-opacity hover:opacity-100"
                      >
                        Keep how it left
                      </button>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
