import { site } from '@/data/site'
import { formatOrderAddress, orderReference, type CheckoutOrderAddress } from '@/lib/checkout'
import type { LedgerInvoice } from '@/lib/ledger'
import { formatLedgerDate } from '@/lib/ledger'
import { formatGbpExact } from '@/lib/money'
import { isFullyReturned, isPartReturned } from '@/lib/work'
import { vatMethodNote } from '@/lib/vat'

type Props = {
  invoice: LedgerInvoice
  reference?: string
}

export function InvoiceSheet({ invoice, reference }: Props) {
  const shipping = invoice.shipping as CheckoutOrderAddress | null
  const lines = shipping ? formatOrderAddress(shipping) : []
  const returned = invoice.refundedPence ?? 0
  const remaining = Math.max(0, invoice.grossPence - returned)

  return (
    <article className="invoice-sheet mx-auto max-w-3xl">
      <style>{`
        @media print {
          header, footer, #main-content > :not(:has(.invoice-sheet)), .no-print { display: none !important; }
          body, #root { background: #fff !important; color: #111 !important; }
          .invoice-sheet { max-width: none; }
        }
      `}</style>
      <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-ink pb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Tax invoice</p>
          <h1 className="mt-3 font-display text-4xl font-light md:text-5xl">{site.fullName}</h1>
          <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-soft">
            {site.city}
            <span className="mt-1 block">{site.email}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-light">{invoice.number}</p>
          <p className="mt-2 text-[13px] font-light text-ink-soft">{formatLedgerDate(invoice.issuedAt)}</p>
          {reference ? (
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-stone">
              Session · {reference}
            </p>
          ) : (
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-stone">
              {orderReference(invoice.orderId)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">To</p>
          <p className="mt-3 font-display text-2xl font-light">{invoice.customerName}</p>
          <p className="mt-2 text-[15px] font-light text-ink-soft">{invoice.email}</p>
        </div>
        {lines.length > 0 ? (
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Delivery</p>
            <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-soft">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        ) : null}
      </div>

      <ul className="mt-12 divide-y divide-rule border-y border-ink">
        {invoice.lines.map((line, index) => (
          <li key={`${line.description}-${index}`} className="grid gap-2 py-5 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <p className="text-[15px] font-light">{line.description}</p>
              {line.size > 0 || line.quantity > 1 ? (
                <p className="mt-1 text-[13px] font-light text-ink-soft">
                  {[
                    line.size > 0 ? `Size ${line.size}` : null,
                    line.quantity > 1 ? String(line.quantity) : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              ) : null}
            </div>
            <p className="text-[15px] font-light sm:col-span-5 sm:text-right">
              {formatGbpExact(line.grossPence)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-8 space-y-3">
        <div className="flex items-baseline justify-between gap-6">
          <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Net</dt>
          <dd className="text-[15px] font-light">{formatGbpExact(invoice.netPence)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-6">
          <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">VAT 20%</dt>
          <dd className="text-[15px] font-light">{formatGbpExact(invoice.vatPence)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-6 border-t border-ink pt-4">
          <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Gross</dt>
          <dd className="font-display text-3xl font-light">{formatGbpExact(invoice.grossPence)}</dd>
        </div>
        {returned > 0 ? (
          <>
            <div className="flex items-baseline justify-between gap-6">
              <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">Returned</dt>
              <dd className="text-[15px] font-light">{formatGbpExact(returned)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6">
              <dt className="text-[11px] uppercase tracking-[0.22em] text-stone">
                {isFullyReturned(invoice.grossPence, returned)
                  ? 'Closed'
                  : isPartReturned(invoice.grossPence, returned)
                    ? 'Still held'
                    : 'Held'}
              </dt>
              <dd className="font-display text-2xl font-light">{formatGbpExact(remaining)}</dd>
            </div>
          </>
        ) : null}
      </dl>

      <p className="mt-12 max-w-prose text-[13px] font-light leading-relaxed text-stone">
        {vatMethodNote}
      </p>
    </article>
  )
}
