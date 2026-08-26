import { LedgerWork } from '@/components/admin/LedgerWork'
import { Body, Display } from '@/components/ui/Heading'

export function AdminWorkPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        The work.
      </Display>
      <Body className="mt-6">
        A paid cut moves from reserved, to the table, to the house box, then leaves. The member
        is told when the stage changes. Refunds stay in Stripe.
      </Body>
      <LedgerWork />
    </>
  )
}
