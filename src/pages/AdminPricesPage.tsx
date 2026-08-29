import { LedgerPrices } from '@/components/admin/LedgerPrices'
import { Body, Display } from '@/components/ui/Heading'

export function AdminPricesPage() {
  return (
    <>
      <div className="no-print">
        <Display as="h1" className="mt-8 text-5xl md:text-6xl">
          The line in sterling.
        </Display>
        <Body className="mt-6">
          VAT-inclusive. The shop and Stripe read the catalogue. This page does not overwrite
          them.
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
      <p className="mb-8 hidden font-display text-5xl font-light print:block">The line in sterling.</p>
      <LedgerPrices />
    </>
  )
}
