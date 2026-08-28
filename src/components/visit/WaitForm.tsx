import { useUser } from '@clerk/react'
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { site } from '@/data/site'
import { clerkContact, clerkEnabled } from '@/lib/clerk'

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

function WaitMember({
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

export function WaitForm({
  productId,
  size,
  piece,
}: {
  productId: string
  size: number
  piece: string
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [sent, setSent] = useState(false)
  const [written, setWritten] = useState(false)
  const [kept, setKept] = useState(false)
  const [already, setAlready] = useState(false)
  const [onTheLine, setOnTheLine] = useState(false)
  const [keeping, setKeeping] = useState(false)

  const onPrefill = useCallback(
    (patch: { name: string; email: string; telephone: string }) => {
      setName((current) => current || patch.name)
      setEmail((current) => current || patch.email)
      setTelephone((current) => current || patch.telephone)
    },
    [],
  )

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (keeping) return
    setKeeping(true)

    let kept = false
    let confirmationSent = false
    let alreadyHeld = false
    let returned = false
    try {
      const response = await fetch('/api/wait', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          telephone,
          productId,
          size,
        }),
      })
      try {
        const data = (await response.json()) as {
          kept?: boolean
          written?: boolean
          already?: boolean
          onTheLine?: boolean
        }
        kept = Boolean(data.kept)
        confirmationSent = Boolean(data.written)
        alreadyHeld = Boolean(data.already)
        returned = Boolean(data.onTheLine) || response.status === 409
      } catch {
        kept = false
      }
    } catch {
      kept = false
    }

    if (returned) {
      setOnTheLine(true)
      setSent(true)
      setKeeping(false)
      return
    }

    if (!kept) {
      const subject = `Wait: ${piece} ${size}`
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        telephone ? `Telephone: ${telephone}` : null,
        `Piece: ${piece}`,
        `Size: ${size}`,
        'Write if this size returns to the line.',
      ]
        .filter(Boolean)
        .join('\n')
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    setKept(kept)
    setWritten(confirmationSent)
    setAlready(alreadyHeld)
    setSent(true)
    setKeeping(false)
  }

  if (sent) {
    return (
      <div className="border-t border-rule pt-8">
        <p className="font-display text-3xl font-light">
          {onTheLine ? 'This size is on the line.' : kept ? 'The letter is held.' : 'The letter is ready.'}
        </p>
        <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-ink-soft">
          {onTheLine
            ? 'Refresh, then add it to the bag.'
            : already
              ? 'The house already has this letter. We write if the size returns.'
              : kept
                ? written
                  ? 'A confirmation has been sent. We write if this size returns to the line.'
                  : 'The house has the letter. A confirmation will follow when it can be sent.'
                : (
                  <>
                    Your mail application should open with the wait written in. If it does not,
                    write to{' '}
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
    <form id="wait-letter" autoComplete="on" onSubmit={onSubmit} className="space-y-8">
      {clerkEnabled ? <WaitMember onPrefill={onPrefill} /> : null}
      <p className="text-[15px] font-light leading-relaxed text-ink-soft">
        {piece}, size {size}, is held. Leave a name. We write if it returns.
      </p>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="wait-name" label="Name">
          <input
            id="wait-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="wait-email" label="Email">
          <input
            id="wait-email"
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
      <Field id="wait-telephone" label="Telephone (optional)">
        <input
          id="wait-telephone"
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telephone}
          onChange={(event) => setTelephone(event.target.value)}
          className={fieldClass}
        />
      </Field>
      <Button type="submit" disabled={keeping}>
        Write if this size returns
      </Button>
    </form>
  )
}