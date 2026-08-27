import { Show, SignOutButton, useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SubscribeForm } from '@/components/notices/SubscribeForm'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { getProduct, productPath } from '@/data/products'
import { isAdminUser } from '@/lib/admin'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { orderReference, returnLetterHref } from '@/lib/checkout'
import { formatGbp } from '@/lib/money'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'
import { WordPlates } from '@/components/notices/WordPlates'
import { formatNoticeWhen } from '@/lib/word'
import { useHouseApp } from '@/lib/shell'
import { useWord } from '@/lib/word-state'
import { asWorkStage, dispatchLine, isFullyReturned, isPartReturned, workCopy, workStages } from '@/lib/work'

type AccountOrder = {
  id: string
  createdAt: string
  amountPence: number
  currency: string
  status: string
  stage?: string
  refundedPence?: number
  returned?: boolean
  carrier?: string
  tracking?: string
  trackingHref?: string
  dispatch?: string
  lines: {
    productId: string
    size: number
    quantity: number
    amountPence: number
    description: string
  }[]
}

function formatOrderDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function AccountOrders() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [orders, setOrders] = useState<AccountOrder[] | null>(null)
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
        const data = (await response.json()) as { orders?: AccountOrder[]; error?: string }
        if (cancelled) return
        if (!response.ok) {
          setError(data.error || 'Reservations could not be read.')
          setOrders([])
          return
        }
        setOrders(data.orders ?? [])
      } catch {
        if (!cancelled) {
          setError('Reservations could not be read.')
          setOrders([])
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

  if (orders.length === 0) {
    return (
      <div className="mt-10">
        <Body>No cuts are reserved against this account yet.</Body>
        <div className="mt-8">
          <Button to="/shop">The Shop</Button>
        </div>
      </div>
    )
  }

  return (
    <ul className="mt-12 divide-y divide-rule border-t border-ink">
      {orders.map((order) => (
        <li key={order.id} className="py-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {formatOrderDate(order.createdAt)} · {orderReference(order.id)}
            </p>
            <p className="font-display text-2xl font-light">{formatGbp(order.amountPence)}</p>
          </div>
          <ul className="mt-4 space-y-2">
            {order.lines.map((line, index) => {
                const product = getProduct(line.productId)
                return (
                  <li key={`${order.id}-${line.productId}-${line.size}-${index}`}>
                    <Link
                      to={product ? productPath(product) : '/shop'}
                      className="text-[15px] font-light text-ink transition-opacity hover:opacity-70"
                    >
                      {line.description}
                      {line.quantity > 1 ? ` × ${line.quantity}` : ''}
                    </Link>
                  </li>
                )
              })}
          </ul>
          <ol className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {workStages.map((step) => {
              const current = asWorkStage(order.stage)
              const reached = workStages.indexOf(step) <= workStages.indexOf(current)
              return (
                <li
                  key={step}
                  className={cn(
                    'text-[11px] uppercase tracking-[0.22em]',
                    reached ? 'text-ink' : 'text-stone',
                  )}
                >
                  {workCopy[step].label}
                </li>
              )
            })}
          </ol>
          <p className="mt-3 text-[14px] font-light text-ink-soft">
            {isFullyReturned(order.amountPence, order.refundedPence ?? 0)
              ? 'The reservation has been returned.'
              : isPartReturned(order.amountPence, order.refundedPence ?? 0)
                ? `The reservation has been returned in part · ${formatGbp(order.refundedPence ?? 0)}.`
                : asWorkStage(order.stage) === 'sent'
                  ? dispatchLine(order.carrier ?? '', order.tracking ?? '')
                  : workCopy[asWorkStage(order.stage)].line}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <Link
              to={`/order/invoice?session_id=${encodeURIComponent(order.id)}`}
              className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
            >
              A record of the cut
            </Link>
            {order.lines[0]?.productId ? (
              <Link
                to={
                  order.lines[0].size
                    ? `/visit?piece=${encodeURIComponent(order.lines[0].productId)}&size=${order.lines[0].size}`
                    : `/visit?piece=${encodeURIComponent(order.lines[0].productId)}`
                }
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
              >
                Enquire to visit
              </Link>
            ) : null}
            <a
              href={returnLetterHref(orderReference(order.id))}
              className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
            >
              Write if it must return
            </a>
            {order.trackingHref && asWorkStage(order.stage) === 'sent' ? (
              <a
                href={order.trackingHref}
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
              >
                Follow it
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
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
        This device takes word.
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
      Allow word on this device
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

export function AccountPage() {
  usePageMeta(getShareMeta('/account'))

  return (
    <Section className="pt-32 md:pt-40">
      <Container>
        <Eyebrow>Account</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          Your cuts.
        </Display>
        {clerkEnabled ? (
          <>
            <Show when="signed-out">
              <Body className="mt-6">
                The shop is public. Sign in to keep reservations in one place, against the email
                you use at checkout.
              </Body>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button to="/sign-in" variant="solid">
                  Sign in
                </Button>
                <Button to="/sign-up">Open an account</Button>
              </div>
            </Show>
            <Show when="signed-in">
              <Body className="mt-6">
                Payment still reserves the cloth. These are the cuts held against this email.
              </Body>
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
        ) : (
          <Body className="mt-6">Account is not configured yet. Write to the atelier.</Body>
        )}
        <AccountList />
        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          <TextLink to="/returns">If it must return</TextLink>
          <TextLink to="/shop">Return to the shop</TextLink>
        </div>
      </Container>
    </Section>
  )
}
