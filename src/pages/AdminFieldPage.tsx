import { CompetitorField } from '@/components/admin/CompetitorField'
import { CompetitorNoteForm } from '@/components/admin/CompetitorNoteForm'
import { useCompetitorNotes } from '@/components/admin/ledger-state'
import { Body, Display } from '@/components/ui/Heading'

export function AdminFieldPage() {
  const { notes, keepNote } = useCompetitorNotes()

  return (
    <>
      <Display as="h1" className="mt-8 text-5xl md:text-6xl">
        Other houses of the column.
      </Display>
      <Body className="mt-6">
        The field is a reading, not a shop window. Marks sit as lockups; pounds sit beside
        them.
      </Body>
      <CompetitorField notes={notes} />
      <CompetitorNoteForm onSaved={keepNote} />
    </>
  )
}
