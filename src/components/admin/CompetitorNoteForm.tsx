import { useAuth, useUser } from '@clerk/react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { isAdminUser } from '@/lib/admin'
import type { CompetitorLedgerNote } from '@/data/competitors'

const fieldClass =
  'w-full border-0 border-b border-rule bg-transparent py-3 text-[15px] font-light text-ink outline-none transition-colors duration-300 placeholder:text-stone/70 focus:border-ink'

function poundsToPence(raw: string) {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const pounds = Number(trimmed)
  if (!Number.isInteger(pounds) || pounds < 0 || pounds > 9999) return undefined
  return pounds * 100
}

export function CompetitorNoteForm({
  onSaved,
}: {
  onSaved: (note: CompetitorLedgerNote) => void
}) {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [low, setLow] = useState('')
  const [high, setHigh] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [keeping, setKeeping] = useState(false)

  if (!isSignedIn || !isAdminUser(user)) return null

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (keeping) return

    const priceLowPence = poundsToPence(low)
    const priceHighPence = poundsToPence(high)
    if (priceLowPence === undefined || priceHighPence === undefined) {
      setError('Price is whole pounds, or left empty.')
      return
    }

    setKeeping(true)
    setError('')
    setNotice('')

    try {
      const token = await getToken()
      const response = await fetch('/api/admin-competitors', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          url,
          notes,
          priceLowPence,
          priceHighPence,
        }),
      })
      const data = (await response.json()) as { note?: CompetitorLedgerNote; error?: string }
      if (!response.ok || !data.note) {
        setError(data.error || 'The house could not be kept.')
        return
      }
      onSaved(data.note)
      setName('')
      setUrl('')
      setNotes('')
      setLow('')
      setHigh('')
      setNotice(`Kept ${data.note.name}.`)
    } catch {
      setError('The house could not be kept.')
    } finally {
      setKeeping(false)
    }
  }

  return (
    <div className="mt-24 border-t border-rule pt-16 md:mt-32 md:pt-20">
      <Eyebrow>Scope</Eyebrow>
      <Display as="h3" className="mt-4 text-3xl md:text-4xl">
        Add a house.
      </Display>
      <Body className="mt-6">
        The known field is kept in the house files. Use this when a new name should sit on
        the map, or when a published band should replace a conversion. Same name writes over
        the last note.
      </Body>
      <form className="mt-12 max-w-xl space-y-8" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.22em] text-stone">Name</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.22em] text-stone">URL</span>
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className={fieldClass}
            placeholder="https://"
            autoComplete="off"
          />
        </label>
        <div className="grid gap-8 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-stone">Low, £</span>
            <input
              inputMode="numeric"
              value={low}
              onChange={(event) => setLow(event.target.value)}
              className={`${fieldClass} font-display text-2xl`}
              placeholder="—"
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-stone">High, £</span>
            <input
              inputMode="numeric"
              value={high}
              onChange={(event) => setHigh(event.target.value)}
              className={`${fieldClass} font-display text-2xl`}
              placeholder="—"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.22em] text-stone">Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className={`${fieldClass} min-h-24 resize-y`}
            maxLength={2000}
          />
        </label>
        {error ? (
          <p className="text-[15px] font-light text-ink" role="alert">
            {error}
          </p>
        ) : null}
        {notice && !error ? (
          <p className="text-[15px] font-light text-ink-soft" role="status">
            {notice}
          </p>
        ) : null}
        <Button type="submit" variant="outline" disabled={keeping}>
          {keeping ? 'Keeping' : 'Keep this house'}
        </Button>
      </form>
    </div>
  )
}
