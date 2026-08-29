import { LedgerMembers } from '@/components/admin/LedgerMembers'
import { Body, Display } from '@/components/ui/Heading'

export function AdminMembersPage() {
  return (
    <>
      <div className="no-print">
        <Display as="h1" className="mt-8 text-5xl md:text-6xl">
          Those who keep an account.
        </Display>
        <Body className="mt-6">
          Clerk members, with paid cuts beside them. The account page is theirs; this room is
          the house count.
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
      <p className="mb-8 hidden font-display text-5xl font-light print:block">Those who keep an account.</p>
      <LedgerMembers />
    </>
  )
}
