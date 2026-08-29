import { LedgerList } from '@/components/admin/LedgerList'
import { Body, Display } from '@/components/ui/Heading'

export function AdminListPage() {
  return (
    <>
      <div className="no-print">
        <Display as="h1" className="mt-8 text-5xl md:text-6xl">
          The list.
        </Display>
        <Body className="mt-6">
          Confirmed addresses may be written to. Held rows are waiting on the confirm letter.
          Domain must be verified for letters to leave.
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
      <p className="mb-8 hidden font-display text-5xl font-light print:block">The list.</p>
      <LedgerList />
    </>
  )
}
