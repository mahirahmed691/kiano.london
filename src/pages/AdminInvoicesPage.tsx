import { LedgerInvoices } from '@/components/admin/LedgerInvoices'
import { LedgerOrders } from '@/components/admin/LedgerOrders'
import { Body, Display } from '@/components/ui/Heading'

export function AdminInvoicesPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        A record of the cut.
      </Display>
      <Body className="mt-6">
        Written when Stripe marks a session paid. Open one for the tax invoice, or print the book.
        Not a Making Tax Digital suite.
      </Body>
      <LedgerInvoices />
      <LedgerOrders />
    </>
  )
}
