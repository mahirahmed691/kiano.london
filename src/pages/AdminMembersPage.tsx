import { LedgerMembers } from '@/components/admin/LedgerMembers'
import { Body, Display } from '@/components/ui/Heading'

export function AdminMembersPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        Those who keep an account.
      </Display>
      <Body className="mt-6">
        Clerk members, with paid cuts beside them. The account page is theirs; this room is
        the house count.
      </Body>
      <LedgerMembers />
    </>
  )
}
