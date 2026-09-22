import { useCallback, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HouseContactPrefill } from '@/components/account/HouseContactPrefill'
import { Button } from '@/components/ui/Button'
import { productLineName, products, thobeSizes } from '@/data/products'
import { site } from '@/data/site'
import { readStoredCheckout, rememberHouseContact } from '@/lib/checkout'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { asThobeSize, readStoredSize, writeStoredSize, type HouseProfile } from '@/lib/house-profile'

const fieldClass =
  'w-full border-0 border-b border-ivory/25 bg-transparent py-3 text-[15px] font-light text-ivory outline-none transition-colors duration-300 placeholder:text-ivory/40 focus:border-ivory'

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.22em] text-stone">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  )
}

export function AppointmentForm() {
  const [params] = useSearchParams()
  const stored = readStoredCheckout()
  const keptSize = readStoredSize()
  const [name, setName] = useState(() => params.get('name')?.trim() || stored.name)
  const [email, setEmail] = useState(() => params.get('email')?.trim() || stored.email)
  const [telephone, setTelephone] = useState(
    () =>
      params.get('tel')?.trim() ||
      params.get('telephone')?.trim() ||
      stored.telephone,
  )
  const [piece, setPiece] = useState(params.get('piece') ?? '')
  const [size, setSize] = useState(params.get('size') ?? (keptSize ? String(keptSize) : ''))
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const [written, setWritten] = useState(false)
  const [kept, setKept] = useState(false)
  const [keeping, setKeeping] = useState(false)

  const onPrefill = useCallback((patch: Partial<HouseProfile>) => {
    setName((current) => current || patch.name || '')
    setEmail((current) => current || patch.email || '')
    setTelephone((current) => current || patch.telephone || '')
    if (patch.size) setSize((current) => current || String(patch.size))
  }, [])

  const selected = useMemo(
    () => products.find((item) => item.id === piece),
    [piece],
  )
  const selectedName = selected ? productLineName(selected) : undefined

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (keeping) return
    setKeeping(true)
    const named = asThobeSize(size)
    rememberHouseContact(named ? { name, email, telephone, size: named } : { name, email, telephone })

    let kept = false
    let confirmationSent = false
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          telephone,
          productId: piece,
          size,
          note,
        }),
      })
      try {
        const data = (await response.json()) as { kept?: boolean; written?: boolean }
        kept = Boolean(data.kept)
        confirmationSent = Boolean(data.written)
      } catch {
        kept = false
        confirmationSent = false
      }
    } catch {
      kept = false
    }

    if (!kept) {
      const subject = selectedName
        ? `Appointment: ${selectedName}`
        : 'Appointment at Kiano London'
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        telephone ? `Telephone: ${telephone}` : null,
        selectedName ? `Piece: ${selectedName}` : 'Piece: to be discussed',
        size ? `Size: ${size}` : 'Size: to be fitted',
        note ? `Note:\n${note}` : null,
      ]
        .filter(Boolean)
        .join('\n')

      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    setKept(kept)
    setWritten(confirmationSent)
    setSent(true)
    setKeeping(false)
  }

  if (sent) {
    return (
      <div className="border-t border-rule pt-8">
        <p className="font-display text-3xl font-light">
          {kept ? 'The letter is held.' : 'The letter is ready.'}
        </p>
        <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-ivory/70">
          {kept
            ? written
              ? 'A confirmation has been sent to you. It is not a booking. We write when a morning can be kept.'
              : 'The house has the letter. A confirmation will follow when it can be sent. It is not a booking.'
            : (
              <>
                Your mail application should open with the appointment written in. If it does
                not, write to us at{' '}
                <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </>
            )}
        </p>
      </div>
    )
  }

  return (
    <form autoComplete="on" onSubmit={onSubmit} className="space-y-8">
      {clerkEnabled ? <HouseContactPrefill onPrefill={onPrefill} /> : null}
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="visit-name" label="Name">
          <input
            id="visit-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="visit-email" label="Email">
          <input
            id="visit-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </Field>
      </div>

      <Field id="visit-telephone" label="Telephone (optional)">
        <input
          id="visit-telephone"
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telephone}
          onChange={(event) => setTelephone(event.target.value)}
          className={fieldClass}
        />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="visit-piece" label="Piece">
          <select
            id="visit-piece"
            name="piece"
            value={piece}
            onChange={(event) => setPiece(event.target.value)}
            className={cn(fieldClass, 'appearance-none')}
          >
            <option value="">To be discussed</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.cut === 'Jubbah' ? productLineName(item) : item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="visit-size" label="Size">
          <select
            id="visit-size"
            name="size"
            value={size}
            onChange={(event) => {
              const next = event.target.value
              setSize(next)
              const named = asThobeSize(next)
              if (named) writeStoredSize(named)
            }}
            className={cn(fieldClass, 'appearance-none')}
          >
            <option value="">To be fitted</option>
            {thobeSizes.map((value) => (
              <option key={value} value={String(value)}>
                {value}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="visit-note" label="A note">
        <textarea
          id="visit-note"
          name="note"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={cn(fieldClass, 'resize-y')}
        />
      </Field>

      <Button type="submit" disabled={keeping}>
        Request an appointment
      </Button>
    </form>
  )
}
