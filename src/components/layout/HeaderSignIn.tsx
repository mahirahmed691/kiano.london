import { useUser } from '@clerk/react'
import { NavLink } from 'react-router-dom'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { setSignInOpen } from '@/lib/signin-drawer'

type Props = {
  className?: string
}

function PersonMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn('size-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <circle cx="8" cy="5.5" r="2.75" />
      <path d="M2.5 14c.7-2.9 2.9-4.5 5.5-4.5s4.8 1.6 5.5 4.5" strokeLinecap="round" />
    </svg>
  )
}

function HeaderSignInInner({ className }: Props) {
  const { isLoaded, isSignedIn, user } = useUser()
  const base = cn(
    'inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] transition-opacity hover:opacity-70 max-sm:-m-3 max-sm:p-3',
    className,
  )

  // Hold the space while Clerk loads so the header does not jump.
  if (!isLoaded) {
    return (
      <span className={cn(base, 'invisible')} aria-hidden="true">
        <PersonMark />
        <span className="max-sm:hidden">Sign in</span>
      </span>
    )
  }

  if (isSignedIn) {
    const source =
      user.firstName?.trim() || user.primaryEmailAddress?.emailAddress?.trim() || ''
    const initial = source.charAt(0).toUpperCase()
    return (
      <NavLink to="/account" aria-label="Your account" className={base}>
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-full border border-current font-display text-[12px] normal-case tracking-normal"
        >
          {initial || <PersonMark className="size-3.5" />}
        </span>
        <span className="max-md:hidden">Account</span>
      </NavLink>
    )
  }

  return (
    <button
      type="button"
      className={base}
      aria-label="Sign in"
      aria-haspopup="dialog"
      onClick={() => setSignInOpen(true)}
    >
      <PersonMark className="sm:hidden" />
      <span className="max-sm:hidden">Sign in</span>
    </button>
  )
}

/** Sign in from any page without leaving it; once signed in, an initial that leads to the account. */
export function HeaderSignIn(props: Props) {
  if (!clerkEnabled) return null
  return <HeaderSignInInner {...props} />
}
