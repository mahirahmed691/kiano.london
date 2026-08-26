import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { Button } from '@/components/ui/Button'
import { isAdminUser } from '@/lib/admin'
import type { LedgerJournalRow, LedgerPeriod } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'

type Accounts = {
  vatNote: string
  refunds: string
  month: LedgerPeriod
  allTime: LedgerPeriod
  journal: LedgerJournalRow[]
}

function emptyPeriod(): LedgerPeriod {
  return { netPence: 0, vatPence: 0, grossPence: 0, count: 0 }
}

function toCsv(rows: LedgerJournalRow[]) {
  const header = 'date,reference,description,email,net,vat,gross'
  const body = rows.map((row) =>
    [
      formatLedgerDate(row.date),
      row.reference,
      `"${row.description.replaceAll('"', '""')}"`,
      row.email,
      (row.netPence / 100).toFixed(2),
      (row.vatPence / 100).toFixed(2),
      (row.grossPence / 100).toFixed(2),
    ].join(','),
  )
  return [header, ...body].join('\n')
}

export function LedgerAccounts() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [book, setBook] = useState<Accounts | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    if (!isSignedIn || !isAdminUser(user)) return
    let cancelled = false
    async function load() {
      try {
        const token = await getToken()
        const response = await fetch('/api/admin?section=accounts', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as Accounts & { error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'The accounts could not be read.')
          return
        }
        setBook({
          vatNote: data.vatNote,
          refunds: data.refunds,
          month: data.month ?? emptyPeriod(),
          allTime: data.allTime ?? emptyPeriod(),
          journal: data.journal ?? [],
        })
      } catch {
        if (!cancelled) setError('The accounts could not be read.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  async function copyCsv() {
    if (!book) return
    const csv = toCsv(book.journal)
    try {
      await navigator.clipboard.writeText(csv)
      setCopied('The lines are on the clipboard.')
    } catch {
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'kiano-london-accounts.csv'
      link.click()
      URL.revokeObjectURL(url)
      setCopied('A file was kept.')
    }
  }

  const month = book?.month ?? emptyPeriod()
  const allTime = book?.allTime ?? emptyPeriod()

  return (
    <div className="mt-16">
      {error ? (
        <p className="mb-8 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      <LedgerFold title="This month, and all time">
        <ul className="grid gap-8 sm:grid-cols-2">
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">This month</p>
            <p className="mt-3 font-display text-3xl font-light">{formatGbpExact(month.grossPence)}</p>
            <p className="mt-2 text-[13px] font-light text-ink-soft">
              Net {formatGbpExact(month.netPence)} · VAT {formatGbpExact(month.vatPence)} ·{' '}
              {month.count} sales
            </p>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">All time</p>
            <p className="mt-3 font-display text-3xl font-light">{formatGbpExact(allTime.grossPence)}</p>
            <p className="mt-2 text-[13px] font-light text-ink-soft">
              Net {formatGbpExact(allTime.netPence)} · VAT {formatGbpExact(allTime.vatPence)} ·{' '}
              {allTime.count} sales
            </p>
          </li>
        </ul>
      </LedgerFold>
      <LedgerFold title="VAT method" defaultOpen={false}>
        {book?.vatNote ? (
          <p className="max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
            {book.vatNote}
          </p>
        ) : (
          <p className="text-[15px] font-light text-ink-soft">The method has not been read yet.</p>
        )}
        {book?.refunds ? (
          <p className="mt-4 max-w-prose text-[15px] font-light leading-relaxed text-stone">
            {book.refunds}
          </p>
        ) : null}
      </LedgerFold>
      <LedgerFold title="The journal" defaultOpen={false}>
        <div className="no-print">
          <Button type="button" onClick={() => void copyCsv()} disabled={!book?.journal.length}>
            Copy the book
          </Button>
          {copied ? (
            <p className="mt-4 text-[13px] font-light text-ink-soft" role="status">
              {copied}
            </p>
          ) : null}
        </div>
        <ul className="mt-8 divide-y divide-rule border-y border-ink">
          {(book?.journal ?? []).map((row) => (
            <li key={row.reference} className="grid gap-3 py-6 lg:grid-cols-12">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">
                {formatLedgerDate(row.date)}
              </p>
              <div className="lg:col-span-4">
                <p className="font-display text-2xl font-light">{row.reference}</p>
                <p className="mt-2 text-[13px] font-light text-ink-soft">{row.email}</p>
              </div>
              <p className="text-[13px] font-light text-ink-soft lg:col-span-3">{row.description}</p>
              <p className="text-[15px] font-light lg:col-span-3 lg:text-right">
                {formatGbpExact(row.grossPence)}
                <span className="mt-1 block text-[13px] text-ink-soft">
                  VAT {formatGbpExact(row.vatPence)}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </LedgerFold>
    </div>
  )
}
