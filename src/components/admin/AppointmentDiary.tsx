import { useState } from 'react'
import { getProduct, productLineName } from '@/data/products'
import type { AppointmentRow, Ledger, LetterKeep } from '@/components/admin/ledger-state'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { asLetterStatus, formatNamedDay, letterLine } from '@/lib/letters'
import { cn } from '@/lib/cn'

const fieldClass =
  'w-full border-0 border-b border-rule bg-transparent py-2 text-[15px] font-light text-ink outline-none transition-colors duration-300 placeholder:text-stone/70 focus:border-ink'

function appointmentPiece(row: AppointmentRow) {
  const product = getProduct(row.productId)
  if (product) return productLineName(product)
  return row.kind === 'return' ? 'A cut' : 'To be discussed'
}

function formatDiaryDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function letterStatusLabel(row: AppointmentRow) {
  if (row.status === 'named' && row.namedFor) {
    return `Named · ${formatNamedDay(row.namedFor)}`
  }
  if (row.status === 'refused') return row.kind === 'return' ? 'Cannot be taken' : 'Cannot be kept'
  if (row.status === 'seen') return 'Seen'
  return 'New'
}

function DiaryLetter({
  row,
  onKeep,
}: {
  row: AppointmentRow
  onKeep: (input: LetterKeep) => void
}) {
  const [day, setDay] = useState(row.namedFor)
  const [reply, setReply] = useState(row.reply)
  const [busy, setBusy] = useState('')
  const closed = row.status === 'refused'

  async function keep(status: LetterKeep['status']) {
    if (busy) return
    setBusy(status)
    await onKeep({
      id: row.id,
      status,
      namedFor: day,
      reply,
    })
    setBusy('')
  }

  return (
    <li className="grid gap-4 py-8 lg:grid-cols-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone lg:col-span-2">
        {formatDiaryDate(row.createdAt)}
      </p>
      <div className="lg:col-span-4">
        <p className="font-display text-2xl font-light">{row.name}</p>
        <p className="mt-2 text-[15px] font-light text-ink-soft">{row.email}</p>
        {row.telephone ? (
          <p className="mt-1 text-[15px] font-light text-ink-soft">{row.telephone}</p>
        ) : null}
      </div>
      <div className="lg:col-span-6">
        <p className="text-[15px] font-light leading-relaxed text-ink-soft">
          {row.kind === 'return' ? 'A return' : 'A visit'}
          {' · '}
          {appointmentPiece(row)}
          {row.size ? ` · ${row.size}` : row.kind === 'return' ? '' : ' · to be fitted'}
          {row.reference ? ` · ${row.reference}` : ''}
        </p>
        {row.note ? (
          <p className="mt-3 text-[15px] font-light leading-relaxed text-ink">{row.note}</p>
        ) : null}
        <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-stone">
          {letterStatusLabel(row)}
        </p>
        <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-soft">
          {letterLine({
            kind: row.kind,
            status: asLetterStatus(row.status),
            namedFor: row.namedFor,
            reply: row.reply,
          })}
        </p>
        {row.status === 'named' && row.reply.trim() ? (
          <p className="mt-2 text-[15px] font-light leading-relaxed text-ink">{row.reply}</p>
        ) : null}
        {closed ? null : (
          <div className="mt-6 space-y-6">
            {row.kind === 'visit' ? (
              <div>
                <label
                  htmlFor={`named-${row.id}`}
                  className="text-[11px] uppercase tracking-[0.22em] text-stone"
                >
                  Morning
                </label>
                <input
                  id={`named-${row.id}`}
                  type="date"
                  value={day}
                  onChange={(event) => setDay(event.target.value)}
                  className={cn(fieldClass, 'mt-1')}
                />
              </div>
            ) : null}
            <div>
              <label
                htmlFor={`reply-${row.id}`}
                className="text-[11px] uppercase tracking-[0.22em] text-stone"
              >
                A note (optional)
              </label>
              <input
                id={`reply-${row.id}`}
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                className={cn(fieldClass, 'mt-1')}
              />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {row.kind === 'visit' ? (
                <button
                  type="button"
                  disabled={Boolean(busy) || !day}
                  onClick={() => void keep('named')}
                  className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 disabled:opacity-35"
                >
                  Name the morning
                </button>
              ) : null}
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void keep('refused')}
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 disabled:opacity-35"
              >
                {row.kind === 'return' ? 'Cannot be taken' : 'Cannot be kept'}
              </button>
              {row.status === 'new' ? (
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => void keep('seen')}
                  className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 disabled:opacity-35"
                >
                  Mark seen
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

export function AppointmentDiary({
  ledger,
  onKeep,
}: {
  ledger: Ledger | null
  onKeep: (input: LetterKeep) => void
}) {
  if (!ledger) {
    return <p className="mt-12 text-[15px] font-light text-ink-soft">Reading the diary.</p>
  }

  return (
    <LedgerFold title="The letters" className="mt-16">
      {ledger.appointments.length === 0 ? (
        <p className="text-[15px] font-light leading-relaxed text-ink-soft">
          No letters held yet. They still arrive by mail.
        </p>
      ) : (
        <ul className="divide-y divide-rule border-y border-ink">
          {ledger.appointments.map((row) => (
            <DiaryLetter key={row.id} row={row} onKeep={onKeep} />
          ))}
        </ul>
      )}
    </LedgerFold>
  )
}
