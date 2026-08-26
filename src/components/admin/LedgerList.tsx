import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { Button } from '@/components/ui/Button'
import { isAdminUser } from '@/lib/admin'
import type { LedgerSubscriber } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'

export function LedgerList() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [subscribers, setSubscribers] = useState<LedgerSubscriber[]>([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=list', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as {
          subscribers?: LedgerSubscriber[]
          error?: string
        }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The list could not be read.')
          return
        }
        setSubscribers(data.subscribers ?? [])
      } catch {
        if (!cancelled) setError('The list could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  const confirmed = subscribers.filter((row) => row.confirmed)
  const held = subscribers.filter((row) => !row.confirmed)

  async function copyConfirmed() {
    const lines = confirmed.map((row) => row.email).join('\n')
    if (!lines) return
    try {
      await navigator.clipboard.writeText(lines)
      setCopied('Confirmed addresses are on the clipboard.')
    } catch {
      setCopied('The addresses could not be copied.')
    }
  }

  return (
    <div className="mt-16">
      {error ? (
        <p className="mb-8 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      <LedgerFold title="Confirmed">
        <div className="no-print">
          <Button type="button" onClick={() => void copyConfirmed()} disabled={confirmed.length === 0}>
            Copy confirmed
          </Button>
          {copied ? (
            <p className="mt-4 text-[13px] font-light text-ink-soft" role="status">
              {copied}
            </p>
          ) : null}
        </div>
        {confirmed.length === 0 ? (
          <p className="mt-8 text-[15px] font-light text-ink-soft">None confirmed yet.</p>
        ) : (
          <ul className="mt-8 divide-y divide-rule border-y border-ink">
            {confirmed.map((row) => (
              <li key={row.email} className="grid gap-2 py-5 sm:grid-cols-12">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone sm:col-span-3">
                  {formatLedgerDate(row.confirmedAt || row.createdAt)}
                </p>
                <p className="text-[15px] font-light sm:col-span-9">{row.email}</p>
              </li>
            ))}
          </ul>
        )}
      </LedgerFold>
      <LedgerFold title="Held, unconfirmed" defaultOpen={false}>
        {held.length === 0 ? (
          <p className="text-[15px] font-light text-ink-soft">None waiting.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-ink">
            {held.map((row) => (
              <li key={row.email} className="grid gap-2 py-5 sm:grid-cols-12">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone sm:col-span-3">
                  {formatLedgerDate(row.createdAt)}
                </p>
                <p className="text-[15px] font-light sm:col-span-9">
                  {row.email}
                  <span className="mt-1 block text-[13px] text-ink-soft">{row.source}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </LedgerFold>
    </div>
  )
}
