import { LedgerWork } from '@/components/admin/LedgerWork'
import { Body, Display } from '@/components/ui/Heading'

export function AdminWorkPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        The work.
      </Display>
      <Body className="mt-6">
        A paid cut moves from reserved, to held for cloth if the mill is late, to the table, to
        the house box, then leaves. Name a week so the account is not blank. A reason is needed
        if a cut is held back. Name how it left when it goes.
      </Body>
      <LedgerWork />
    </>
  )
}
