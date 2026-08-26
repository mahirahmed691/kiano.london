import { AppointmentDiary } from '@/components/admin/AppointmentDiary'
import { useLedger } from '@/components/admin/ledger-state'
import { Body, Display } from '@/components/ui/Heading'

export function AdminDiaryPage() {
  const { ledger, markSeen } = useLedger()

  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        Letters held.
      </Display>
      <Body className="mt-6">
        Requests are copied here when the atelier can keep them. A confirmation is sent
        to the visitor when the house can write. This is not a booking calendar.
      </Body>
      <AppointmentDiary ledger={ledger} onSeen={markSeen} />
    </>
  )
}
