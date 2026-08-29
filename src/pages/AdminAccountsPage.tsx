import { LedgerAccounts } from '@/components/admin/LedgerAccounts'
import { Body, Display } from '@/components/ui/Heading'

export function AdminAccountsPage() {
  return (
    <>
      <div className="no-print">
        <Display as="h1" className="mt-8 text-5xl md:text-6xl">
          The book in sterling.
        </Display>
        <Body className="mt-6">
          Paid reservations only. A simple journal for the accountant, not a Sage clone. A full
          return is written when Stripe refunds it. Months and the line sit on Figures.
        </Body>
        <p className="mt-8">
          <button
            type="button"
            onClick={() => window.print()}
            className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
          >
            Print
          </button>
        </p>
      </div>
      <p className="mb-8 hidden font-display text-5xl font-light print:block">The book in sterling.</p>
      <LedgerAccounts />
    </>
  )
}
