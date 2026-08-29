import { AppointmentDiary } from '@/components/admin/AppointmentDiary'
import { useDiary } from '@/components/admin/ledger-state'
import { Body, Display } from '@/components/ui/Heading'

export function AdminDiaryPage() {
  const { appointments, error, keepLetter } = useDiary()

  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        Letters held.
      </Display>
      <Body className="mt-6">
        Requests are copied here when the atelier can keep them. A visit is held until the house
        names a morning. A return is held until the house asks it back. There is no public
        calendar. It is not a refund. Print the open letters for the morning.
      </Body>
      {error ? (
        <p className="mt-6 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      <AppointmentDiary appointments={appointments} onKeep={keepLetter} />
    </>
  )
}
