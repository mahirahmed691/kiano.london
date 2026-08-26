import { LedgerList } from '@/components/admin/LedgerList'
import { Body, Display } from '@/components/ui/Heading'

export function AdminListPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        The list.
      </Display>
      <Body className="mt-6">
        Confirmed addresses may be written to. Held rows are waiting on the confirm letter.
        Domain must be verified for letters to leave.
      </Body>
      <LedgerList />
    </>
  )
}
