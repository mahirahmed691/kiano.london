import { LedgerTill } from '@/components/admin/LedgerTill'
import { Body, Display } from '@/components/ui/Heading'

export function AdminFiguresPage() {
  return (
    <>
      <div className="no-print">
        <Display as="h1" className="mt-8 text-5xl md:text-6xl">
          The till.
        </Display>
        <Body className="mt-6">
          Paid reservations, after what Stripe has returned. Not sessions, not a funnel. The weeks
          are Mondays. The line is billed sterling, including cuts later returned.
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
      <p className="mb-8 hidden font-display text-5xl font-light print:block">The till.</p>
      <LedgerTill />
    </>
  )
}
