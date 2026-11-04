import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { markLettersJoined } from '@/lib/notices'
import { useKeptEmail } from '@/lib/kept-email'
import { cn } from '@/lib/cn'

type Variant = 'light' | 'dark' | 'panel'

type Props = {
  idPrefix: string
  source: 'popup' | 'footer' | 'account' | 'scent'
  variant?: Variant
  onJoined?: () => void
}

export function SubscribeForm({ idPrefix, source, variant = 'light', onJoined }: Props) {
  const { email, setEmail } = useKeptEmail()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [already, setAlready] = useState(false)

  const dark = variant === 'dark'
  const fieldClass = cn(
    'w-full border-0 border-b bg-transparent py-3 text-[15px] font-light outline-none transition-colors duration-300',
    dark
      ? 'border-bronze/35 text-ivory placeholder:text-ivory/35 focus:border-bronze'
      : 'border-rule text-ink placeholder:text-stone/70 focus:border-ink',
  )

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = (await response.json()) as { error?: string; already?: boolean }
      if (!response.ok) {
        throw new Error(data.error || 'The list could not be joined.')
      }
      markLettersJoined()
      setAlready(Boolean(data.already))
      setDone(true)
      onJoined?.()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The list could not be joined.')
      setBusy(false)
    }
  }

  if (done) {
    return (
      <p role="status" className={cn('text-[15px] font-light leading-relaxed', dark ? 'text-ivory/80' : 'text-ink-soft')}>
        {already
          ? 'You are already subscribed with this email address.'
          : 'Thank you for subscribing. Check your inbox and confirm your email address to start receiving updates.'}
      </p>
    )
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-6">
      <div>
        <label
          htmlFor={`${idPrefix}-email`}
          className={cn(
            'text-[11px] uppercase tracking-[0.22em]',
            dark ? 'text-bronze' : 'text-stone',
          )}
        >
          Email address
        </label>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={`${idPrefix}-consent`}
          className={fieldClass}
        />
      </div>
      <div
        id={`${idPrefix}-consent`}
        className={cn('space-y-2 text-[13px] font-light leading-relaxed', dark ? 'text-ivory/70' : 'text-stone')}
      >
        <p>Subscribe for collection releases, atelier updates, and occasional product news.</p>
        <p>
          By subscribing, you agree to receive marketing emails from Kiano London. You can
          unsubscribe at any time using the link in every email.
        </p>
        <p>
          Read our{' '}
          <Link to="/privacy" className="border-b border-current pb-px">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      {error ? (
        <p className={cn('text-[14px] font-light', dark ? 'text-ivory' : 'text-ink')} role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        variant={dark ? 'invert' : 'solid'}
        className="w-full justify-center sm:w-auto"
        disabled={busy}
      >
        {busy ? 'Subscribing' : 'Subscribe'}
      </Button>
    </form>
  )
}
