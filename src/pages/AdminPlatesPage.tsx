import { LedgerPlates } from '@/components/admin/LedgerPlates'
import { Body, Display } from '@/components/ui/Heading'
import { plateIntervalDays } from '@/data/instagram-plates'

export function AdminPlatesPage() {
  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        The plates.
      </Display>
      <Body className="mt-6">
        One still a week, in this order. London stone, the column, a quiet line. Reels wait
        until a real walk exists. The same book is public at /stills. The house posts from
        this book; it does not invent a second look.
      </Body>
      <p className="mt-4 text-[13px] font-light text-ink-soft">
        Cadence: every {plateIntervalDays} days. Captions are already written.
      </p>
      <LedgerPlates />
    </>
  )
}
