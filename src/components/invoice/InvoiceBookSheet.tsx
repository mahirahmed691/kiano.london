import { site } from '@/data/site'
import { formatLedgerDate } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'
import { asWorkStage, isFullyReturned, workCopy } from '@/lib/work'

export type InvoiceBookRow = {
  number: string
  email: string
  customerName: string
  issuedAt: string
  netPence: number
  vatPence: number
  grossPence: number
  refundedPence?: number
  amountPence?: number
  stage?: string
}

export function InvoiceBookSheet({ invoices }: { invoices: InvoiceBookRow[] }) {
  const gross = invoices.reduce((sum, row) => sum + row.grossPence, 0)
  const vat = invoices.reduce((sum, row) => sum + row.vatPence, 0)
  const returned = invoices.reduce((sum, row) => sum + (row.refundedPence ?? 0), 0)

  return (
    <article className="invoice-book mx-auto max-w-3xl">
      <style>{`
        @media print {
          header, footer, #main-content > :not(:has(.invoice-book)), .no-print { display: none !important; }
          body, #root { background: #fff !important; color: #111 !important; }
          .invoice-book { max-width: none; }
        }
      `}</style>
      <p className="text-[11px] uppercase tracking-[0.28em] text-stone">The records</p>
      <p className="mt-6 font-display text-4xl font-light md:text-5xl">{site.fullName}</p>
      <p className="mt-4 text-[15px] font-light text-ink-soft">
        {invoices.length === 0
          ? 'No records yet.'
          : `${String(invoices.length).padStart(2, '0')} tax invoices`}
      </p>

      {invoices.length > 0 ? (
        <ul className="mt-14 divide-y divide-rule border-y border-ink">
          {invoices.map((row) => {
            const givenBack = row.refundedPence ?? 0
            const billed = row.amountPence ?? row.grossPence
            return (
              <li key={row.number} className="grid gap-4 py-6 sm:grid-cols-12 sm:items-baseline">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone sm:col-span-3">
                  {formatLedgerDate(row.issuedAt)}
                </p>
                <div className="sm:col-span-6">
                  <p className="font-display text-2xl font-light">{row.number}</p>
                  <p className="mt-2 text-[15px] font-light">{row.customerName}</p>
                  {row.customerName !== row.email ? (
                    <p className="mt-1 text-[13px] font-light text-ink-soft">{row.email}</p>
                  ) : null}
                  <p className="mt-2 text-[13px] font-light text-ink-soft">
                    {isFullyReturned(billed, givenBack)
                      ? 'Returned'
                      : workCopy[asWorkStage(row.stage)].label}
                  </p>
                </div>
                <p className="text-[15px] font-light sm:col-span-3 sm:text-right">
                  {formatGbpExact(row.grossPence)}
                  <span className="mt-1 block text-[13px] text-ink-soft">
                    VAT {formatGbpExact(row.vatPence)}
                  </span>
                  {givenBack > 0 ? (
                    <span className="mt-1 block text-[13px] text-ink-soft">
                      Returned {formatGbpExact(givenBack)}
                    </span>
                  ) : null}
                </p>
              </li>
            )
          })}
        </ul>
      ) : null}

      {invoices.length > 0 ? (
        <dl className="mt-10 space-y-3">
          <div className="flex items-baseline justify-between gap-6">
            <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">VAT</dt>
            <dd className="text-[15px] font-light">{formatGbpExact(vat)}</dd>
          </div>
          {returned > 0 ? (
            <div className="flex items-baseline justify-between gap-6">
              <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Returned</dt>
              <dd className="text-[15px] font-light">{formatGbpExact(returned)}</dd>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between gap-6 border-t border-ink pt-4">
            <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Gross</dt>
            <dd className="font-display text-3xl font-light">{formatGbpExact(gross)}</dd>
          </div>
        </dl>
      ) : null}
    </article>
  )
}
