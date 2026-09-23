import { Show, SignOutButton, useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeldCuts, type HeldLetter, type HeldOrder } from '@/components/account/HeldCuts'
import { HouseDeviceForm } from '@/components/account/HouseDeviceForm'
import { HouseProfileForm } from '@/components/account/HouseProfileForm'
import { SubscribeForm } from '@/components/notices/SubscribeForm'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { isAdminUser } from '@/lib/admin'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'
import { WordPlates } from '@/components/notices/WordPlates'
import { formatNoticeWhen } from '@/lib/word'
import { useHouseApp } from '@/lib/shell'
import { useWord } from '@/lib/word-state'

function AccountOrders() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [orders, setOrders] = useState<HeldOrder[] | null>(null)
  const [letters, setLetters] = useState<HeldLetter[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !user) return
    const member = user
    let cancelled = false

    async function load() {
      try {
        const token = await getToken()
        if (token) {
          await fetch('/api/member', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: member.primaryEmailAddress?.emailAddress ?? '',
              name: member.fullName ?? '',
            }),
          })
        }

        const response = await fetch('/api/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = (await response.json()) as {
          orders?: HeldOrder[]
          letters?: HeldLetter[]
          error?: string
        }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'Reservations could not be read.')
          setOrders([])
          setLetters([])
          return
        }
        setOrders(data.orders ?? [])
        setLetters(data.letters ?? [])
      } catch {
        if (!cancelled) {
          setError('Reservations could not be read.')
          setOrders([])
          setLetters([])
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, isSignedIn, user])

  if (orders === null) {
    return <p className="mt-10 text-[15px] font-light text-ink-soft">Fetching your reservations.</p>
  }

  if (error) {
    return (
      <p className="mt-10 text-[15px] font-light text-ink" role="alert">
        {error}
      </p>
    )
  }

  return <HeldCuts orders={orders} letters={letters} />
}

function AccountWord() {
  const { notices, unread, markRead } = useWord()
  if (notices.length === 0) return null

  return (
    <div className="mt-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
        Word{unread ? ` · ${String(unread).padStart(2, '0')}` : ''}
      </p>
      <ul className="mt-6 divide-y divide-rule border-t border-ink">
        {notices.slice(0, 8).map((notice) => (
          <li key={notice.id} className="py-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {formatNoticeWhen(notice.createdAt)}
              {notice.audience === 'admin' ? ' · Ledger' : ''}
            </p>
            <WordPlates
              notice={notice}
              className="mt-4"
              onOpen={() => {
                if (!notice.read) void markRead(notice.id)
              }}
            />
            <Link
              to={notice.href || '/account'}
              className="mt-4 block transition-opacity hover:opacity-70"
              onClick={() => {
                if (!notice.read) void markRead(notice.id)
              }}
            >
              <p className={cn('font-display text-2xl font-light', notice.read && 'opacity-55')}>
                {notice.title}
              </p>
              <p className="mt-2 text-[15px] font-light text-ink-soft">{notice.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AccountDeviceWord() {
  const app = useHouseApp()
  const [allowed, setAllowed] = useState(
    () => typeof window !== 'undefined' && Boolean(window.__KIANO_EXPO_PUSH),
  )

  useEffect(() => {
    const sync = () => setAllowed(Boolean(window.__KIANO_EXPO_PUSH))
    sync()
    window.addEventListener('kiano-expo-push', sync)
    return () => window.removeEventListener('kiano-expo-push', sync)
  }, [])

  if (!app) return null

  if (allowed) {
    return (
      <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-stone">
        This device takes the plate of the week, and when a cut has left.
      </p>
    )
  }

  return (
    <button
      type="button"
      className="mt-10 text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
      onClick={() => {
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'kiano-request-push' }))
      }}
    >
      Allow the plate, and when a cut has left
    </button>
  )
}

function AccountList() {
  const app = useHouseApp()
  if (!app) return null

  return (
    <div className="mt-16 border-t border-rule pt-10">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The list</p>
      <Body className="mt-4">
        Cloth and when a piece can be reserved. A few letters a year.
      </Body>
      <div className="mt-6 max-w-sm">
        <SubscribeForm idPrefix="letters-account" source="account" />
      </div>
    </div>
  )
}

function AccountLedgerLink() {
  const { user } = useUser()
  if (!isAdminUser(user)) return null
  return (
    <div className="mt-10">
      <TextLink to="/admin">The house board</TextLink>
    </div>
  )
}

function AccountGate() {
  const { isLoaded } = useAuth()

  if (!isLoaded) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the house.</p>
  }

  return (
    <>
      <Show when="signed-out">
        <Body className="mt-6">
          The shop is public. Details written here stay on this device. Sign in to keep
          reservations and the same details with the house. If you reserved without an account,
          ask after the cut with the reference and that email.
        </Body>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button to="/sign-in" variant="solid">
            Sign in
          </Button>
          <Button to="/sign-up">Open an account</Button>
        </div>
        <HouseDeviceForm />
        <div className="mt-8">
          <TextLink to="/reservation">Ask after a reserved cut</TextLink>
        </div>
      </Show>
      <Show when="signed-in">
        <Body className="mt-6">
          Payment still reserves the cloth. These are the cuts held against this email.
        </Body>
        <HouseProfileForm />
        <AccountOrders />
        <AccountWord />
        <AccountDeviceWord />
        <AccountLedgerLink />
        <div className="mt-12">
          <SignOutButton>
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </Show>
    </>
  )
}

export function AccountPage() {
  usePageMeta(getShareMeta('/account'))

  return (
    <Section fill className="pt-32 md:pt-40">
      <Container>
        <Eyebrow>Account</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          Your cuts.
        </Display>
        {clerkEnabled ? (
          <AccountGate />
        ) : (
          <Body className="mt-6">Account is not configured yet. Write to the atelier.</Body>
        )}
        <AccountList />
        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          <TextLink to="/reservation">Ask after a reserved cut</TextLink>
          <TextLink to="/returns">If it must return</TextLink>
          <TextLink to="/shop">Return to the shop</TextLink>
        </div>
      </Container>
    </Section>
  )
}
