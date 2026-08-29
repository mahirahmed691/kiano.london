import { RestockLedger } from '@/components/admin/RestockLedger'
import { Body, Display } from '@/components/ui/Heading'

export function AdminCutsPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        Remaining on the line.
      </Display>
      <Body className="mt-6">
        Set a size when cloth returns. Leave the field and it is kept. The shop reads
        these numbers; this page is the only place they are written. Print remaining cuts for the
        table.
      </Body>
      <RestockLedger />
    </>
  )
}
