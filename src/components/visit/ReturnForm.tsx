import { useUser } from '@clerk/react'
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { productLineName, products, thobeSizes } from '@/data/products'
import { site } from '@/data/site'
import { clerkContact, clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'

const fieldClass =
  'w-full border-0 border-b border-rule bg-transparent py-3 text-[15px] font-light text-ink outline-none transition-colors duration-300 placeholder:text-stone/70 focus:border-ink'

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

function ReturnMember({
  onPrefill,
}: {
  onPrefill: (patch: { name: string; email: string; telephone: string }) => void
}) {
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (!isSignedIn || !user) return
    onPrefill(clerkContact(user))
  }, [isSignedIn, onPrefill, user])

  return null
}

export function ReturnForm() {
  const [params] = useSearchParams()
  const [name, setName] = useState(() => params.get('name')?.trim() ?? '')
  const [email, setEmail] = useState(() => params.get('email')?.trim() ?? '')
  const [telephone, setTelephone] = useState(
    () => params.get('tel')?.trim() || params.get('telephone')?.trim() || '',
  )
  const [reference, setReference] = useState(
    () => (params.get('ref') ?? params.get('reference') ?? '').trim().toUpperCase(),
  )
  const [piece, setPiece] = useState(params.get('piece') ?? '')
  const [size, setSize] = useState(params.get('size') ?? '')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const [written, setWritten] = useState(false)
  const [kept, setKept] = useState(false)
  const [keeping, setKeeping] = useState(false)

  const onPrefill = useCallback(
    (patch: { name: string; email: string; telephone: string }) => {
      setName((current) => current || patch.name)
      setEmail((current) => current || patch.email)
      setTelephone((current) => current || patch.telephone)
    },
    [],
  )

  const selected = useMemo(
    () => products.find((item) => item.id === piece),
    [piece],
  )
  const selectedName = selected ? productLineName(selected) : undefined

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (keeping) return
    setKeeping(true)

    let kept = false
    let confirmationSent = false
    try {
      const response = await fetch('/api/return', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          telephone,
          productId: piece,
          size,
          note,
          reference,
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
      const subject = reference ? `Return: ${reference}` : 'Return'
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        telephone ? `Telephone: ${telephone}` : null,
        reference ? `Reservation ${reference}` : null,
        selectedName ? `Piece: ${selectedName}` : 'Piece: to be named',
        size ? `Size: ${size}` : 'Size: to be named',
        note ? `Note:\n${note}` : 'The piece cannot be worn as reserved.',
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
        <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-ink-soft">
          {kept
            ? written
              ? 'A confirmation has been sent to you. It is not a refund. We write if the return can be agreed.'
              : 'The house has the letter. It is not a refund. A confirmation will follow when it can be sent.'
            : (
              <>
                Your mail application should open with the return written in. If it does
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
      {clerkEnabled ? <ReturnMember onPrefill={onPrefill} /> : null}
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="return-name" label="Name">
          <input
            id="return-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="return-email" label="Email">
          <input
            id="return-email"
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

      <Field id="return-telephone" label="Telephone (optional)">
        <input
          id="return-telephone"
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telephone}
          onChange={(event) => setTelephone(event.target.value)}
          className={fieldClass}
        />
      </Field>

      <Field id="return-reference" label="Reservation">
        <input
          id="return-reference"
          name="reference"
          autoComplete="off"
          required
          value={reference}
          onChange={(event) => setReference(event.target.value.toUpperCase())}
          className={fieldClass}
        />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="return-piece" label="Piece">
          <select
            id="return-piece"
            name="piece"
            value={piece}
            onChange={(event) => setPiece(event.target.value)}
            className={cn(fieldClass, 'appearance-none')}
          >
            <option value="">To be named</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.cut === 'Jubbah' ? productLineName(item) : item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="return-size" label="Size">
          <select
            id="return-size"
            name="size"
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className={cn(fieldClass, 'appearance-none')}
          >
            <option value="">To be named</option>
            {thobeSizes.map((value) => (
              <option key={value} value={String(value)}>
                {value}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="return-note" label="A note">
        <textarea
          id="return-note"
          name="note"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="The piece cannot be worn as reserved."
          className={cn(fieldClass, 'resize-y')}
        />
      </Field>

      <Button type="submit" disabled={keeping}>
        Write to the atelier
      </Button>
    </form>
  )
}
