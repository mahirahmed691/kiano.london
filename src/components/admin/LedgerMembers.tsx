import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { isAdminUser } from '@/lib/admin'
import type { LedgerMember } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'

export function LedgerMembers() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [members, setMembers] = useState<LedgerMember[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=members', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as { members?: LedgerMember[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The members could not be read.')
          return
        }
        setMembers(data.members ?? [])
      } catch {
        if (!cancelled) setError('The members could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  return (
    <LedgerFold title="Accounts held" className="mt-16">
      {error ? (
        <p className="text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      {members.length === 0 && !error ? (
        <p className="text-[15px] font-light text-ink-soft">No members kept yet.</p>
      ) : (
        <ul className="divide-y divide-rule border-y border-ink">
          {members.map((row) => (
            <li key={row.email} className="grid gap-3 py-6 lg:grid-cols-12 lg:items-baseline">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">
                {formatLedgerDate(row.createdAt)}
              </p>
              <div className="lg:col-span-6">
                <p className="font-display text-2xl font-light">{row.name || row.email}</p>
                <p className="mt-2 text-[13px] font-light text-ink-soft">
                  <a href={`mailto:${row.email}`} className="transition-opacity hover:opacity-70">
                    {row.email}
                  </a>
                </p>
              </div>
              <div className="text-[15px] font-light lg:col-span-4 lg:text-right">
                {row.orders === 0 ? (
                  <p>No cut reserved</p>
                ) : (
                  <p>
                    <Link
                      to={`/admin/work?email=${encodeURIComponent(row.email)}`}
                      className="transition-opacity hover:opacity-70"
                    >
                      {String(row.orders).padStart(2, '0')} reserved
                    </Link>
                  </p>
                )}
                {row.lastPaidAt ? (
                  <p className="mt-1 text-[13px] text-ink-soft">
                    Last {formatLedgerDate(row.lastPaidAt)}
                  </p>
                ) : null}
                {row.lastOrderId ? (
                  <p className="mt-3">
                    <Link
                      to={`/admin/work/card?id=${encodeURIComponent(row.lastOrderId)}`}
                      className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
                    >
                      The house card
                    </Link>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </LedgerFold>
  )
}
