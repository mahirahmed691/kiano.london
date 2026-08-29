import type { AppointmentRow } from '@/components/admin/ledger-state'
import { getProduct, productLineName } from '@/data/products'
import { site } from '@/data/site'
import { formatLedgerDate } from '@/lib/ledger'
import {
  asLetterKind,
  asLetterStatus,
  formatNamedDay,
  letterLine,
  type LetterKind,
} from '@/lib/letters'

const kindCopy: Record<LetterKind, string> = {
  visit: 'A visit',
  wait: 'A wait',
  return: 'A return',
}

function pieceLine(row: AppointmentRow) {
  const product = getProduct(row.productId)
  if (product) return productLineName(product)
  if (row.kind === 'return') return 'A cut'
  if (row.kind === 'wait') return 'A size'
  return 'To be discussed'
}

function statusLine(row: AppointmentRow) {
  if (row.status === 'named' && row.namedFor) return `Named · ${formatNamedDay(row.namedFor)}`
  if (row.status === 'seen') return 'Seen'
  return 'New'
}

function openLetters(rows: AppointmentRow[]) {
  return rows.filter((row) => row.status !== 'refused' && row.status !== 'agreed')
}

export function DiaryBookSheet({ appointments }: { appointments: AppointmentRow[] }) {
  const open = openLetters(appointments)
  const groups = (['visit', 'wait', 'return'] as const)
    .map((kind) => ({
      kind,
      letters: open
        .filter((row) => asLetterKind(row.kind) === kind)
        .slice()
        .sort((a, b) => {
          if (a.namedFor && b.namedFor) return a.namedFor.localeCompare(b.namedFor)
          if (a.namedFor) return -1
          if (b.namedFor) return 1
          return a.createdAt.localeCompare(b.createdAt)
        }),
    }))
    .filter((group) => group.letters.length > 0)

  return (
    <article className="diary-book mx-auto max-w-3xl">
      <style>{`
        @media print {
          header, footer, #main-content > :not(:has(.diary-book)), .no-print { display: none !important; }
          body, #root { background: #fff !important; color: #111 !important; }
          .diary-book { max-width: none; }
        }
      `}</style>
      <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Letters held</p>
      <p className="mt-6 font-display text-4xl font-light md:text-5xl">{site.fullName}</p>
      <p className="mt-4 text-[15px] font-light text-ink-soft">
        {open.length === 0
          ? 'None waiting.'
          : `${String(open.length).padStart(2, '0')} still open`}
      </p>

      {groups.map((group) => (
        <section key={group.kind} className="mt-14">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{kindCopy[group.kind]}</p>
          <ul className="mt-6 divide-y divide-rule border-y border-ink">
            {group.letters.map((row) => (
              <li key={row.id} className="grid gap-6 py-8 sm:grid-cols-12">
                <div className="sm:col-span-7">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                    {formatLedgerDate(row.createdAt)} · {statusLine(row)}
                  </p>
                  <p className="mt-3 font-display text-3xl font-light">{row.name}</p>
                  <p className="mt-2 text-[15px] font-light text-ink-soft">{row.email}</p>
                  {row.telephone ? (
                    <p className="mt-1 text-[15px] font-light text-ink-soft">{row.telephone}</p>
                  ) : null}
                  {row.note ? (
                    <p className="mt-4 text-[15px] font-light leading-relaxed text-ink">{row.note}</p>
                  ) : null}
                </div>
                <div className="sm:col-span-5">
                  <p className="text-[15px] font-light leading-relaxed text-ink">
                    {pieceLine(row)}
                    {row.size ? ` · ${row.size}` : ''}
                    {row.reference ? ` · ${row.reference}` : ''}
                  </p>
                  <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-soft">
                    {letterLine({
                      kind: asLetterKind(row.kind),
                      status: asLetterStatus(row.status),
                      namedFor: row.namedFor,
                      reply: row.reply,
                    })}
                  </p>
                  {row.reply.trim() ? (
                    <p className="mt-3 text-[15px] font-light leading-relaxed text-ink">{row.reply}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  )
}
