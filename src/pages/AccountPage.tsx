import { Show, SignOutButton, useAuth, useUser } from '@clerk/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DeleteAccount } from '@/components/account/DeleteAccount'
import { HeldCuts, type HeldLetter, type HeldOrder } from '@/components/account/HeldCuts'
import { HouseDeviceForm } from '@/components/account/HouseDeviceForm'
import { HouseProfileForm } from '@/components/account/HouseProfileForm'
import { SubscribeForm } from '@/components/notices/SubscribeForm'
import { HouseRoom } from '@/components/editorial/HouseRoom'
import { Button, TextLink } from '@/components/ui/Button'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { accountJustClosed, clearClosedMark } from '@/lib/account-closed'
import { isAdminUser } from '@/lib/admin'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'
import { WordPlates } from '@/components/notices/WordPlates'
import { formatNoticeWhen } from '@/lib/word'
import { useHouseApp } from '@/lib/shell'
import { useWord } from '@/lib/word-state'
import { setSignInOpen } from '@/lib/signin-drawer'

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
    return <p className="text-[15px] font-light text-ink-soft">Fetching your reservations.</p>
  }

  if (error) {
    return (
      <p className="text-[15px] font-light text-ink" role="alert">
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
    <AccountSection id="word" title={`Word${unread ? ` · ${String(unread).padStart(2, '0')}` : ''}`}>
      <ul className="divide-y divide-rule border-t border-ink">
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
    </AccountSection>
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

const sections = [
  { id: 'cuts', label: 'Your orders' },
  { id: 'details', label: 'Your details' },
  { id: 'word', label: 'Updates' },
  { id: 'settings', label: 'Account' },
] as const

function AccountSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-ink pt-8 first:border-t-0 first:pt-0 [&+&]:mt-20">
      <h2 className="text-[11px] uppercase tracking-[0.24em] text-stone">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(
      new Date(),
    ),
  )
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function SignedInAccount({ onClosed }: { onClosed: () => void }) {
  const { user } = useUser()
  const { notices } = useWord()
  const first = user?.firstName?.trim()
  const email = user?.primaryEmailAddress?.emailAddress ?? ''
  const shown = sections.filter((section) => section.id !== 'word' || notices.length > 0)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-rule pb-10">
        <div>
          <Eyebrow>The house</Eyebrow>
          <Display as="h1" className="mt-4 text-4xl md:text-6xl">
            {greeting()}
            {first ? `, ${first}` : ''}.
          </Display>
          {email ? <p className="mt-4 text-[14px] font-light text-stone">{email}</p> : null}
        </div>
        <SignOutButton>
          <button
            type="button"
            className="text-[11px] uppercase tracking-[0.22em] text-stone transition-opacity hover:opacity-70"
          >
            Sign out
          </button>
        </SignOutButton>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <nav aria-label="Account" className="lg:col-span-3">
          <ul className="flex gap-x-6 gap-y-3 overflow-x-auto max-lg:-mx-6 max-lg:px-6 max-lg:pb-2 lg:sticky lg:top-32 lg:flex-col">
            {shown.map((section) => (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-60"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 lg:col-span-9">
          <AccountSection id="cuts" title="Your orders">
            <AccountOrders />
          </AccountSection>
          <AccountSection id="details" title="Your details">
            <HouseProfileForm />
          </AccountSection>
          <AccountWord />
          <AccountSection id="settings" title="Account">
            <AccountDeviceWord />
            <AccountLedgerLink />
            <div className="mt-6 flex flex-col items-start gap-8">
              <DeleteAccount onClosed={onClosed} />
            </div>
          </AccountSection>
        </div>
      </div>
    </>
  )
}

function AccountGate() {
  const { isLoaded } = useAuth()
  const [closed, setClosed] = useState(() => accountJustClosed())

  useEffect(() => {
    if (closed) clearClosedMark()
  }, [closed])

  if (!isLoaded) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading the house.</p>
  }

  return (
    <>
      <Show when="signed-out">
        {closed ? <Body className="mt-6">This account is closed.</Body> : null}
        <Body className={closed ? 'mt-4' : 'mt-6'}>
          The shop is open to everyone. Sign in to keep your size, your address and your
          orders saved to your account, on any device.
        </Body>
        <div className="mt-10">
          <Button variant="solid" onClick={() => setSignInOpen(true)}>
            Sign in or join
          </Button>
        </div>
        <HouseDeviceForm />
        <div className="mt-8">
          <TextLink to="/reservation">Ordered without an account? Find your order</TextLink>
        </div>
      </Show>
      <Show when="signed-in">
        <SignedInAccount onClosed={() => setClosed(true)} />
      </Show>
    </>
  )
}

function SignedOutTitle() {
  if (!clerkEnabled) {
    return (
      <Display as="h1" className="text-4xl md:text-5xl">
        Your account.
      </Display>
    )
  }
  return (
    <Show when="signed-out">
      <Eyebrow>The house</Eyebrow>
      <Display as="h1" className="mt-4 text-4xl md:text-5xl">
        Your account.
      </Display>
    </Show>
  )
}

export function AccountPage() {
  usePageMeta(getShareMeta('/account'))

  return (
    <HouseRoom kicker="The house" title="Your account.">
      <SignedOutTitle />
      {clerkEnabled ? (
        <AccountGate />
      ) : (
        <Body className="mt-6">Account is not configured yet. Write to the atelier.</Body>
      )}
      <AccountList />
      <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
        <TextLink to="/reservation">Ask about an order</TextLink>
        <TextLink to="/returns">If it must return</TextLink>
        <TextLink to="/shop">Return to the shop</TextLink>
      </div>
    </HouseRoom>
  )
}
