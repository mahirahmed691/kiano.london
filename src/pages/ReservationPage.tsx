import { Show } from '@clerk/react'
import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HeldCuts, type HeldLetter, type HeldOrder } from '@/components/account/HeldCuts'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { clerkEnabled } from '@/lib/clerk'
import { reservationPath } from '@/lib/checkout'
import { useKeptEmail } from '@/lib/kept-email'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const fieldClass =
  'w-full border-0 border-b border-ivory/25 bg-transparent py-3 text-[15px] font-light text-ivory outline-none transition-colors duration-300 placeholder:text-ivory/40 focus:border-ivory'

function keepAccountHref(email: string) {
  const query = new URLSearchParams({ redirect_url: '/account' })
  if (email) query.set('email', email)
  return `/sign-up?${query.toString()}`
}

async function askForCut(email: string, reference: string) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, reference }),
  })
  const data = (await response.json()) as {
    orders?: HeldOrder[]
    letters?: HeldLetter[]
    error?: string
  }
  if (!response.ok) {
    throw new Error(data.error || 'That reservation could not be read.')
  }
  return {
    orders: data.orders ?? [],
    letters: data.letters ?? [],
  }
}

export function ReservationPage() {
  const [params] = useSearchParams()
  const { email, setEmail } = useKeptEmail(params.get('email') ?? '')
  const [reference, setReference] = useState(
    () => (params.get('ref') ?? params.get('reference') ?? '').trim().toUpperCase(),
  )
  const [orders, setOrders] = useState<HeldOrder[] | null>(null)
  const [letters, setLetters] = useState<HeldLetter[]>([])
  const [error, setError] = useState('')
  const [asking, setAsking] = useState(false)

  usePageMeta(getShareMeta('/reservation'))

  useEffect(() => {
    const fromEmail = params.get('email')?.trim() ?? ''
    const fromRef = (params.get('ref') ?? params.get('reference') ?? '').trim().toUpperCase()
    if (!fromEmail || !fromRef) return

    let cancelled = false
    void askForCut(fromEmail, fromRef)
      .then((found) => {
        if (cancelled) return
        setOrders(found.orders)
        setLetters(found.letters)
        setError('')
      })
      .catch((caught: unknown) => {
        if (cancelled) return
        setOrders(null)
        setLetters([])
        setError(caught instanceof Error ? caught.message : 'That reservation could not be read.')
      })

    return () => {
      cancelled = true
    }
  }, [params])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (asking) return
    setAsking(true)
    setError('')
    try {
      const found = await askForCut(email, reference)
      setOrders(found.orders)
      setLetters(found.letters)
      window.history.replaceState(null, '', reservationPath({ reference, email }))
    } catch (caught) {
      setOrders(null)
      setLetters([])
      setError(caught instanceof Error ? caught.message : 'That reservation could not be read.')
    } finally {
      setAsking(false)
    }
  }

  return (
    <Section className="pt-32 md:pt-40">
      <Container className="max-w-2xl">
        <Eyebrow>A reserved cut</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          Ask after it.
        </Display>
        <Body className="mt-6">
          The eight-letter reference on the confirmation, and the email used at the till. An
          account is not needed.
        </Body>

        <form autoComplete="on" onSubmit={onSubmit} className="mt-12 space-y-8">
          <div>
            <label htmlFor="reservation-email" className="text-[11px] uppercase tracking-[0.22em] text-stone">
              Email
            </label>
            <div className="mt-1">
              <input
                id="reservation-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={fieldClass}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="reservation-reference"
              className="text-[11px] uppercase tracking-[0.22em] text-stone"
            >
              Reservation
            </label>
            <div className="mt-1">
              <input
                id="reservation-reference"
                name="reference"
                autoComplete="off"
                required
                minLength={8}
                maxLength={20}
                value={reference}
                onChange={(event) => setReference(event.target.value.toUpperCase())}
                className={fieldClass}
              />
            </div>
          </div>
          <Button type="submit" disabled={asking}>
            {asking ? 'Reading the house.' : 'Ask after the cut'}
          </Button>
        </form>

        {error ? (
          <p className="mt-10 text-[15px] font-light text-ivory" role="alert">
            {error}
          </p>
        ) : null}

        {orders ? (
          <>
            <HeldCuts orders={orders} letters={letters} empty="That reservation could not be read." />
            {clerkEnabled && orders[0] ? (
              <div className="mt-12 flex flex-wrap gap-6">
                <Show when="signed-out">
                  <Button to={keepAccountHref(email)}>Keep it on the account</Button>
                </Show>
                <Show when="signed-in">
                  <Button to="/account">Account</Button>
                </Show>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          <TextLink to="/account">Account</TextLink>
          <TextLink to="/returns">If it must return</TextLink>
        </div>
      </Container>
    </Section>
  )
}
