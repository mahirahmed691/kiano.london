import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckoutMember } from '@/components/checkout/CheckoutMember'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { packingNote } from '@/data/packing'
import { productPath } from '@/data/products'
import { shippingCountries } from '@/data/shipping'
import { useCart } from '@/lib/cart'
import {
  parseCheckoutDetails,
  readStoredCheckout,
  writeStoredCheckout,
  type CheckoutDetails,
} from '@/lib/checkout'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'
import { formatGbp } from '@/lib/money'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

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

export function CheckoutPage() {
  const { items, subtotalPence, count, setQuantity, remove } = useCart()
  const [params] = useSearchParams()
  const cancelled = params.get('cancelled') === '1'
  const [details, setDetails] = useState<CheckoutDetails>(readStoredCheckout)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const getTokenRef = useRef<() => Promise<string | null>>(async () => null)

  usePageMeta(getShareMeta('/checkout'))

  useEffect(() => {
    writeStoredCheckout(details)
  }, [details])

  const onPrefill = useCallback((patch: Pick<CheckoutDetails, 'name' | 'email'>) => {
    setDetails((current) => ({
      ...current,
      name: current.name || patch.name,
      email: current.email || patch.email,
    }))
  }, [])

  function setField<K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) {
    setDetails((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const parsed = parseCheckoutDetails(details)
    if ('error' in parsed) {
      setError(parsed.error)
      return
    }

    writeStoredCheckout(parsed.details)
    setBusy(true)

    try {
      const token = await getTokenRef.current()
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          details: parsed.details,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      })
      const text = await response.text()
      let data: { url?: string; error?: string }
      try {
        data = JSON.parse(text) as { url?: string; error?: string }
      } catch {
        throw new Error('The payment page could not be opened.')
      }
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'The payment page could not be opened.')
      }
      window.location.href = data.url
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The payment page could not be opened.')
      setBusy(false)
    }
  }

  if (items.length === 0) {
    return (
      <Section className="pt-32 md:pt-40">
        <Container>
          <Eyebrow>Checkout</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl md:text-6xl">
            Nothing is held.
          </Display>
          <Body className="mt-6">The bag is empty. Choose a piece first.</Body>
          <div className="mt-10">
            <Button to="/shop">The Shop</Button>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section className="pt-32 md:pt-40">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <Eyebrow>Checkout</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl">
              Reserve the cut.
            </Display>
            <Body className="mt-6">
              {String(count).padStart(2, '0')} {count === 1 ? 'piece' : 'pieces'}. Each piece is
              made after payment, from the house block, in four to eight weeks. Carriage is
              included. {packingNote}
            </Body>
            {clerkEnabled ? (
              <CheckoutMember
                onPrefill={onPrefill}
                onToken={(getToken) => {
                  getTokenRef.current = getToken
                }}
              />
            ) : null}

            {cancelled ? (
              <p className="mt-8 max-w-prose border-t border-rule pt-6 text-[15px] font-light leading-relaxed text-ink">
                Payment was not taken. The bag is still held. Complete the details below when you
                are ready.
              </p>
            ) : null}

            <form
              id="checkout-form"
              onSubmit={(event) => void onSubmit(event)}
              className="mt-14 space-y-14"
            >
              <fieldset>
                <legend className="text-[11px] uppercase tracking-[0.22em] text-stone">
                  01 · Contact
                </legend>
                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                  <Field id="checkout-name" label="Name">
                    <input
                      id="checkout-name"
                      name="name"
                      autoComplete="name"
                      required
                      value={details.name}
                      onChange={(event) => setField('name', event.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="checkout-email" label="Email">
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={details.email}
                      onChange={(event) => setField('email', event.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                </div>
                <div className="mt-8">
                  <Field id="checkout-telephone" label="Telephone">
                    <input
                      id="checkout-telephone"
                      name="telephone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={details.telephone}
                      onChange={(event) => setField('telephone', event.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-[11px] uppercase tracking-[0.22em] text-stone">
                  02 · Delivery
                </legend>
                <div className="mt-6 space-y-8">
                  <Field id="checkout-line1" label="Address">
                    <input
                      id="checkout-line1"
                      name="line1"
                      autoComplete="address-line1"
                      required
                      value={details.line1}
                      onChange={(event) => setField('line1', event.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="checkout-line2" label="Flat, building (optional)">
                    <input
                      id="checkout-line2"
                      name="line2"
                      autoComplete="address-line2"
                      value={details.line2}
                      onChange={(event) => setField('line2', event.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field id="checkout-city" label="City">
                      <input
                        id="checkout-city"
                        name="city"
                        autoComplete="address-level2"
                        required
                        value={details.city}
                        onChange={(event) => setField('city', event.target.value)}
                        className={fieldClass}
                      />
                    </Field>
                    <Field id="checkout-postal" label="Postcode">
                      <input
                        id="checkout-postal"
                        name="postalCode"
                        autoComplete="postal-code"
                        required
                        value={details.postalCode}
                        onChange={(event) => setField('postalCode', event.target.value)}
                        className={fieldClass}
                      />
                    </Field>
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field id="checkout-region" label="County / region (optional)">
                      <input
                        id="checkout-region"
                        name="region"
                        autoComplete="address-level1"
                        value={details.region}
                        onChange={(event) => setField('region', event.target.value)}
                        className={fieldClass}
                      />
                    </Field>
                    <Field id="checkout-country" label="Country">
                      <select
                        id="checkout-country"
                        name="country"
                        autoComplete="country"
                        required
                        value={details.country}
                        onChange={(event) =>
                          setField('country', event.target.value as CheckoutDetails['country'])
                        }
                        className={cn(fieldClass, 'appearance-none')}
                      >
                        {shippingCountries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-[11px] uppercase tracking-[0.22em] text-stone">
                  03 · A note
                </legend>
                <div className="mt-6">
                  <Field id="checkout-note" label="For the workroom (optional)">
                    <textarea
                      id="checkout-note"
                      name="note"
                      rows={4}
                      maxLength={500}
                      value={details.note}
                      onChange={(event) => setField('note', event.target.value)}
                      className={cn(fieldClass, 'resize-y')}
                    />
                  </Field>
                </div>
              </fieldset>

              {error ? (
                <p className="text-[14px] font-light text-ink lg:hidden" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="lg:hidden">
                <Button
                  type="submit"
                  variant="solid"
                  className="w-full justify-center"
                  disabled={busy}
                >
                  {busy ? 'Opening payment' : 'Continue to payment'}
                </Button>
              </div>
            </form>
          </div>

          <aside className="lg:col-span-5 lg:col-start-8 lg:pt-16">
            <div className="border-t border-ink pt-8 lg:sticky lg:top-28">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The bag</p>
              <ul className="mt-6">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-rule py-5"
                  >
                    <Link
                      to={productPath(item.product)}
                      className="img-zoom aspect-[3/4] overflow-hidden bg-ivory-deep"
                    >
                      <img
                        src={item.product.image}
                        alt=""
                        className="size-full object-cover"
                        style={
                          item.product.objectPosition
                            ? { objectPosition: item.product.objectPosition }
                            : undefined
                        }
                      />
                    </Link>
                    <div className="flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-xl font-light leading-tight">
                            {item.product.name}
                          </p>
                          <p className="mt-1 text-[12px] font-light text-stone">
                            Size {item.size} · {item.product.colour}
                          </p>
                        </div>
                        <p className="shrink-0 text-[12px] tracking-[0.06em]">
                          {formatGbp(item.product.pricePence * item.quantity)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-rule">
                          <button
                            type="button"
                            className="h-8 w-8 text-[12px]"
                            aria-label="Reduce quantity"
                            onClick={() =>
                              setQuantity(item.productId, item.size, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-[12px]">{item.quantity}</span>
                          <button
                            type="button"
                            className="h-8 w-8 text-[12px]"
                            aria-label="Increase quantity"
                            onClick={() =>
                              setQuantity(item.productId, item.size, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-[11px] uppercase tracking-[0.18em] text-stone transition-opacity hover:opacity-70"
                          onClick={() => remove(item.productId, item.size)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-baseline justify-between border-t border-ink pt-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">To pay</p>
                <p className="font-display text-4xl font-light">{formatGbp(subtotalPence)}</p>
              </div>
              <p className="mt-5 text-[14px] font-light leading-relaxed text-ink-soft">
                Card, Apple Pay and Google Pay are taken on Stripe. You will return here when the
                cut is reserved.
              </p>
              {error ? (
                <p className="mt-5 hidden text-[14px] font-light text-ink lg:block" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                form="checkout-form"
                disabled={busy}
                className="mt-8 hidden w-full items-center justify-center border border-ink bg-ink px-7 py-2.5 text-[11px] font-normal uppercase tracking-[0.22em] text-ivory transition-colors duration-300 hover:bg-transparent hover:text-ink disabled:pointer-events-none disabled:opacity-35 lg:inline-flex"
              >
                {busy ? 'Opening payment' : 'Continue to payment'}
              </button>
              <div className="mt-6">
                <TextLink to="/shop">Continue looking</TextLink>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  )
}
