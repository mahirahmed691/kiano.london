import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { products, thobeSizes } from '@/data/products'
import { site } from '@/data/site'
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

export function AppointmentForm() {
  const [params] = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [piece, setPiece] = useState(params.get('piece') ?? '')
  const [size, setSize] = useState(params.get('size') ?? '')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const selectedName = useMemo(
    () => products.find((item) => item.id === piece)?.name,
    [piece],
  )

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const subject = selectedName
      ? `Appointment: ${selectedName}`
      : 'Appointment at Suhail'
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
    setSent(true)
  }

  if (sent) {
    return (
      <div className="border-t border-rule pt-8">
        <p className="font-display text-3xl font-light">The letter is ready.</p>
        <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-ink-soft">
          Your mail application should open with the appointment written in. If it does
          not, write to us at{' '}
          <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
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
          name="telephone"
          type="tel"
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
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="visit-size" label="Size">
          <select
            id="visit-size"
            name="size"
            value={size}
            onChange={(event) => setSize(event.target.value)}
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

      <Button type="submit">Request an appointment</Button>
    </form>
  )
}
