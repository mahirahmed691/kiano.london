import { AppointmentDiary } from '@/components/admin/AppointmentDiary'
import { useLedger } from '@/components/admin/ledger-state'
import { Body, Display } from '@/components/ui/Heading'

export function AdminDiaryPage() {
  const { ledger, error, keepLetter } = useLedger()

  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        Letters held.
      </Display>
      <Body className="mt-6">
        Requests are copied here when the atelier can keep them. A visit is held until the house
        names a morning. A return is held, not refunded. There is no public calendar.
      </Body>
      {error ? (
        <p className="mt-6 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      <AppointmentDiary ledger={ledger} onKeep={keepLetter} />
    </>
  )
}
