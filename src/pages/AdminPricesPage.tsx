import { LedgerPrices } from '@/components/admin/LedgerPrices'
import { Body, Display } from '@/components/ui/Heading'

export function AdminPricesPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        The line in sterling.
      </Display>
      <Body className="mt-6">
        VAT-inclusive. The shop and Stripe read the catalogue. This page does not overwrite
        them.
      </Body>
      <LedgerPrices />
    </>
  )
}
