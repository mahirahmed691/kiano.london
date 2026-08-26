import { getProduct, productLineName } from '@/data/products'
import type { AppointmentRow, Ledger } from '@/components/admin/ledger-state'
import { LedgerFold } from '@/components/admin/LedgerFold'

function appointmentPiece(row: AppointmentRow) {
  const product = getProduct(row.productId)
  if (product) return productLineName(product)
  return 'To be discussed'
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

export function AppointmentDiary({
  ledger,
  onSeen,
}: {
  ledger: Ledger | null
  onSeen: (id: number) => void
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
            <li key={row.id} className="grid gap-4 py-8 lg:grid-cols-12">
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
                  {appointmentPiece(row)}
                  {row.size ? ` · ${row.size}` : ' · to be fitted'}
                </p>
                {row.note ? (
                  <p className="mt-3 text-[15px] font-light leading-relaxed text-ink">{row.note}</p>
                ) : null}
                <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-stone">
                  {row.status === 'seen' ? 'Seen' : 'New'}
                  {row.status === 'new' ? (
                    <button
                      type="button"
                      onClick={() => onSeen(row.id)}
                      className="ml-6 tracking-[0.22em] transition-opacity hover:opacity-70"
                    >
                      Mark seen
                    </button>
                  ) : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </LedgerFold>
  )
}
