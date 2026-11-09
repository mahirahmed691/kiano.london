import { useAuth } from '@clerk/react'
import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Body } from '@/components/ui/Heading'
import { markAccountClosed } from '@/lib/account-closed'
import { clearStoredCheckout } from '@/lib/checkout'
import { writeStoredSize } from '@/lib/house-profile'

type Props = {
  onClosed: () => void
}

export function DeleteAccount({ onClosed }: Props) {
  const { getToken, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector('button')?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, busy])

  async function closeAccount() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const token = await getToken()
      if (!token) {
        setError('Sign in again, then close the account.')
        return
      }
      const response = await fetch('/api/member', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        setError(data.error || 'The account could not be closed. Write to the atelier.')
        return
      }
      clearStoredCheckout()
      writeStoredSize(null)
      markAccountClosed()
      try {
        await signOut({ redirectUrl: '/account' })
      } catch {
        window.location.assign('/account')
        return
      }
      onClosed()
    } catch {
      setError('The account could not be closed. Write to the atelier.')
    } finally {
      setBusy(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
        onClick={() => {
          setError('')
          setOpen(true)
        }}
      >
        Delete this account
      </button>
    )
  }

  return (
    <div ref={panelRef} aria-labelledby={titleId}>
      <p id={titleId} className="text-[11px] uppercase tracking-[0.22em] text-stone">
        Delete this account
      </p>
      <Body className="mt-4 max-w-md">
        The size, the notices, and the details kept here go with it. A paid reservation stays with
        the house, so the cloth can still be cut. The list, if you joined it, stays until you write
        to the atelier.
      </Body>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button variant="solid" onClick={() => void closeAccount()} disabled={busy}>
          {busy ? 'Closing.' : 'Delete this account'}
        </Button>
        <button
          type="button"
          className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 disabled:opacity-35"
          onClick={() => setOpen(false)}
          disabled={busy}
        >
          Keep it
        </button>
      </div>
      {error ? (
        <p className="mt-6 text-[15px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
