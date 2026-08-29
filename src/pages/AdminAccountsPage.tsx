import { LedgerAccounts } from '@/components/admin/LedgerAccounts'
import { Body, Display } from '@/components/ui/Heading'

export function AdminAccountsPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        The book in sterling.
      </Display>
      <Body className="mt-6">
        Paid reservations only. A simple journal for the accountant, not a Sage clone. A full
        return is written when Stripe refunds it. Months and the line sit on Figures.
      </Body>
      <LedgerAccounts />
    </>
  )
}
