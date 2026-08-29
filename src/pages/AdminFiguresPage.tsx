import { LedgerTill } from '@/components/admin/LedgerTill'
import { Body, Display } from '@/components/ui/Heading'

export function AdminFiguresPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        The till.
      </Display>
      <Body className="mt-6">
        Paid reservations, after what Stripe has returned. Not sessions, not a funnel. The weeks
        are Mondays. The line is billed sterling, including cuts later returned.
      </Body>
      <LedgerTill />
    </>
  )
}
