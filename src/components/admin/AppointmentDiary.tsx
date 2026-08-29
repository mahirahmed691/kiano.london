import { useState } from 'react'
import { LedgerFilter } from '@/components/admin/LedgerFilter'
import { getProduct, productLineName } from '@/data/products'
import type { AppointmentRow, LetterKeep } from '@/components/admin/ledger-state'
import { LedgerFold } from '@/components/admin/LedgerFold'
import { asLetterKind, asLetterStatus, formatNamedDay, letterLine, type LetterKind } from '@/lib/letters'
import { cn } from '@/lib/cn'

const fieldClass =
  'w-full border-0 border-b border-rule bg-transparent py-2 text-[15px] font-light text-ink outline-none transition-colors duration-300 placeholder:text-stone/70 focus:border-ink'

function appointmentPiece(row: AppointmentRow) {
  const product = getProduct(row.productId)
  if (product) return productLineName(product)
  return row.kind === 'return' ? 'A cut' : row.kind === 'wait' ? 'A size' : 'To be discussed'
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
  if (row.status === 'agreed') return row.kind === 'wait' ? 'On the line' : 'Send it back'
  if (row.status === 'refused') {
    if (row.kind === 'return') return 'Cannot be taken'
    if (row.kind === 'wait') return 'Cannot write'
    return 'Cannot be kept'
  }
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
  const closed = row.status === 'refused' || row.status === 'agreed'

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
        <p className="mt-2 text-[15px] font-light text-ink-soft">
          <a href={`mailto:${row.email}`} className="transition-opacity hover:opacity-70">
            {row.email}
          </a>
        </p>
        {row.telephone ? (
          <p className="mt-1 text-[15px] font-light text-ink-soft">
            <a href={`tel:${row.telephone}`} className="transition-opacity hover:opacity-70">
              {row.telephone}
            </a>
          </p>
        ) : null}
      </div>
      <div className="lg:col-span-6">
        <p className="text-[15px] font-light leading-relaxed text-ink-soft">
          {row.kind === 'return' ? 'A return' : row.kind === 'wait' ? 'A wait' : 'A visit'}
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
        {row.status === 'agreed' && row.reply.trim() ? (
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
              ) : (
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => void keep('agreed')}
                  className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 disabled:opacity-35"
                >
                  {row.kind === 'wait' ? 'It is on the line' : 'Send it back'}
                </button>
              )}
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void keep('refused')}
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 disabled:opacity-35"
              >
                {row.kind === 'return'
                  ? 'Cannot be taken'
                  : row.kind === 'wait'
                    ? 'Cannot write'
                    : 'Cannot be kept'}
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
  appointments,
  onKeep,
}: {
  appointments: AppointmentRow[] | null
  onKeep: (input: LetterKeep) => void
}) {
  const [statusView, setStatusView] = useState<'new' | 'open' | 'closed' | 'all'>('open')
  const [kindView, setKindView] = useState<'all' | LetterKind>('all')

  if (!appointments) {
    return <p className="mt-12 text-[15px] font-light text-ink-soft">Reading the diary.</p>
  }

  const closedOf = (row: AppointmentRow) => row.status === 'refused' || row.status === 'agreed'
  const byStatus = appointments.filter((row) => {
    if (statusView === 'all') return true
    if (statusView === 'new') return row.status === 'new'
    if (statusView === 'closed') return closedOf(row)
    return !closedOf(row)
  })
  const visible = byStatus.filter((row) => kindView === 'all' || asLetterKind(row.kind) === kindView)

  return (
    <LedgerFold title="The letters" className="mt-16">
      <div className="space-y-8">
        <LedgerFilter
          label="Held"
          value={statusView}
          onChange={setStatusView}
          options={[
            {
              id: 'new',
              label: 'New',
              count: appointments.filter((row) => row.status === 'new').length,
            },
            {
              id: 'open',
              label: 'Open',
              count: appointments.filter((row) => !closedOf(row)).length,
            },
            {
              id: 'closed',
              label: 'Closed',
              count: appointments.filter((row) => closedOf(row)).length,
            },
            { id: 'all', label: 'All', count: appointments.length },
          ]}
        />
        <LedgerFilter
          label="Kind"
          value={kindView}
          onChange={setKindView}
          options={[
            { id: 'all', label: 'All' },
            { id: 'visit', label: 'Visit' },
            { id: 'wait', label: 'Wait' },
            { id: 'return', label: 'Return' },
          ]}
        />
      </div>
      {appointments.length === 0 ? (
        <p className="mt-10 text-[15px] font-light leading-relaxed text-ink-soft">
          No letters held yet. They still arrive by mail.
        </p>
      ) : visible.length === 0 ? (
        <p className="mt-10 text-[15px] font-light text-ink-soft">Nothing in this column.</p>
      ) : (
        <ul className="mt-10 divide-y divide-rule border-y border-ink">
          {visible.map((row) => (
            <DiaryLetter key={row.id} row={row} onKeep={onKeep} />
          ))}
        </ul>
      )}
    </LedgerFold>
  )
}
