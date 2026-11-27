import { SignIn, useUser } from '@clerk/react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { setSignInOpen, useSignInOpen } from '@/lib/signin-drawer'

const ink = '#1B1714'
const rule = '#D4CBB8'
const stone = '#6F675C'
const label = {
  textTransform: 'uppercase',
  letterSpacing: '0.24em',
  fontSize: '10px',
  fontWeight: '400',
} as const

/** Clerk, stripped to the form: the drawer draws its own heading and frame. */
const drawerAppearance = {
  layout: {
    socialButtonsVariant: 'blockButton',
    logoPlacement: 'none',
  },
  elements: {
    rootBox: { width: '100%' },
    cardBox: {
      width: '100%',
      maxWidth: 'none',
      boxShadow: 'none',
      border: 'none',
      borderRadius: '0',
      backgroundColor: 'transparent',
    },
    card: {
      padding: '0',
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0',
      backgroundColor: 'transparent',
      gap: '1.75rem',
    },
    header: { display: 'none' },
    socialButtonsBlockButton: {
      ...label,
      height: '3.25rem',
      border: `1px solid ${ink}`,
      borderRadius: '0',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      color: ink,
    },
    socialButtonsBlockButtonText: { ...label },
    dividerLine: { backgroundColor: rule },
    dividerText: { ...label, color: stone },
    formFieldLabel: { ...label, color: stone },
    formFieldInput: {
      height: '3rem',
      padding: '0',
      border: 'none',
      borderBottom: `1px solid ${ink}`,
      borderRadius: '0',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      fontSize: '16px',
      fontWeight: '300',
    },
    formButtonPrimary: {
      ...label,
      height: '3.25rem',
      borderRadius: '0',
      boxShadow: 'none',
      backgroundColor: ink,
      color: '#F2EBDC',
      WebkitTextFillColor: '#F2EBDC',
    },
    footer: {
      background: 'transparent',
      border: 'none',
      padding: '0',
      marginTop: '0.5rem',
    },
    footerActionText: { fontWeight: '300', color: stone },
    footerActionLink: {
      color: ink,
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
      fontWeight: '400',
    },
  },
} as const

function SignInDrawerInner() {
  const open = useSignInOpen()
  const { isSignedIn } = useUser()
  const { pathname, search } = useLocation()
  const back = `${pathname}${search}`

  useEffect(() => {
    if (isSignedIn) setSignInOpen(false)
  }, [isSignedIn])

  useEffect(() => {
    setSignInOpen(false)
  }, [pathname])

  // Clerk steps the form through the hash (#/factor-one…); drop it once the panel shuts.
  useEffect(() => {
    if (open || !window.location.hash.startsWith('#/')) return
    window.history.replaceState(window.history.state, '', `${pathname}${search}`)
  }, [open, pathname, search])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSignInOpen(false)
    }
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={cn('fixed inset-0 z-[60]', open ? 'visible' : 'invisible')}>
      <button
        type="button"
        aria-label="Close sign in"
        className={cn(
          'absolute inset-0 bg-night/40 backdrop-blur-[2px] transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => setSignInOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        aria-hidden={!open}
        className={cn(
          'shell-sheet absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col border-l border-rule bg-ivory text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-rule px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.22em]">The house</p>
          <button
            type="button"
            className="text-[11px] uppercase tracking-[0.22em] opacity-60 transition-opacity hover:opacity-100"
            onClick={() => setSignInOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pt-14 pb-10 sm:px-10">
          <h2 className="font-display text-5xl font-light leading-[1.05] tracking-[-0.02em]">
            Sign in.
          </h2>
          <p className="mt-5 max-w-xs text-[14px] font-light leading-relaxed text-ink-soft">
            Your size, your address and your reserved cuts, kept against your name.
          </p>
          <div className="mt-12">
            {open ? (
              <SignIn
                routing="hash"
                withSignUp
                fallbackRedirectUrl={back}
                signUpFallbackRedirectUrl={back}
                appearance={drawerAppearance}
              />
            ) : null}
          </div>
        </div>

        <div className="border-t border-rule px-8 py-5 sm:px-10">
          <p className="text-[12px] font-light leading-relaxed text-stone">
            The shop stays open without an account.{' '}
            <Link
              to="/privacy"
              className="underline underline-offset-4"
              onClick={() => setSignInOpen(false)}
            >
              What we keep
            </Link>
            .
          </p>
        </div>
      </aside>
    </div>
  )
}

export function SignInDrawer() {
  if (!clerkEnabled) return null
  return <SignInDrawerInner />
}
