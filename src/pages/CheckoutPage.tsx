import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckoutMember } from '@/components/checkout/CheckoutMember'
import { TillFrame } from '@/components/checkout/TillFrame'
import { Button, TextLink } from '@/components/ui/Button'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { packingNote } from '@/data/packing'
import { productLineName, productPath } from '@/data/products'
import { shippingCountries } from '@/data/shipping'
import { useCart } from '@/lib/cart'
import {
  parseCheckoutDetails,
  readStoredCheckout,
  writeStoredCheckout,
  type CheckoutDetails,
} from '@/lib/checkout'
import { clerkEnabled } from '@/lib/clerk'
import { asThobeSize, fillEmptyDetails, profileFromDetails, readStoredSize, type HouseProfile } from '@/lib/house-profile'
import { cn } from '@/lib/cn'
import { formatGbp } from '@/lib/money'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const fieldClass =
  'w-full border-0 border-b border-rule bg-transparent py-3 text-[15px] font-light text-ink outline-none transition-colors duration-300 placeholder:text-stone/70 focus:border-ink'

function asPaymentError(message?: string) {
  if (message && !/till/i.test(message)) return message
  return 'Payment could not be opened. Write to the atelier.'
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.22em] text-stone">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {hint ? <p className="mt-2 text-[13px] font-light text-stone">{hint}</p> : null}
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

  const onPrefill = useCallback((patch: Partial<HouseProfile>) => {
    setDetails((current) => fillEmptyDetails(current, patch))
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
    if (!navigator.onLine) {
      setError('The till needs a connection.')
      return
    }
    setBusy(true)

    try {
      const token = await getTokenRef.current()
      if (token) {
        await fetch('/api/member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: parsed.details.email,
            name: parsed.details.name,
            profile: profileFromDetails(
              parsed.details,
              readStoredSize() ?? asThobeSize(items[0]?.size),
            ),
          }),
        }).catch(() => undefined)
      }
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
        throw new Error(asPaymentError(data.error))
      }
      window.location.href = data.url
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : asPaymentError())
      setBusy(false)
    }
  }

  if (items.length === 0) {
    return (
      <TillFrame title="Nothing is held.">
        <Eyebrow>The till</Eyebrow>
        <Display as="h1" className="mt-4 text-4xl md:text-5xl">
          Nothing is held.
        </Display>
        <Body className="mt-6">The bag is empty. Choose a piece first.</Body>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button to="/shop">The Shop</Button>
          <TextLink to="/shop/till-proof">The proof, one pound</TextLink>
        </div>
      </TillFrame>
    )
  }

  return (
    <TillFrame title="Reserve the cut." product={items[0]?.product}>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <Eyebrow>Kiano London</Eyebrow>
            <Display as="h1" className="mt-4 text-4xl md:text-5xl">
              Reserve the cut.
            </Display>
            <Body className="mt-6">
              {String(count).padStart(2, '0')} {count === 1 ? 'piece' : 'pieces'}. Each piece is
              made after payment, from the house block. Carriage is included. {packingNote}
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
              autoComplete="on"
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
                      autoComplete="shipping name"
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
                      name="tel"
                      type="tel"
                      inputMode="tel"
                      autoComplete="shipping tel"
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
                      name="address-line1"
                      autoComplete="shipping address-line1"
                      required
                      value={details.line1}
                      onChange={(event) => setField('line1', event.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="checkout-line2" label="Flat, building (optional)">
                    <input
                      id="checkout-line2"
                      name="address-line2"
                      autoComplete="shipping address-line2"
                      value={details.line2}
                      onChange={(event) => setField('line2', event.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field id="checkout-city" label="City">
                      <input
                        id="checkout-city"
                        name="address-level2"
                        autoComplete="shipping address-level2"
                        required
                        value={details.city}
                        onChange={(event) => setField('city', event.target.value)}
                        className={fieldClass}
                      />
                    </Field>
                    <Field id="checkout-postal" label="Postcode">
                      <input
                        id="checkout-postal"
                        name="postal-code"
                        autoComplete="shipping postal-code"
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
                        name="address-level1"
                        autoComplete="shipping address-level1"
                        value={details.region}
                        onChange={(event) => setField('region', event.target.value)}
                        className={fieldClass}
                      />
                    </Field>
                    <Field id="checkout-country" label="Country">
                      <select
                        id="checkout-country"
                        name="country"
                        autoComplete="shipping country"
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
                  03 · A card
                </legend>
                <div className="mt-6">
                  <Field
                    id="checkout-note"
                    label="A line for the house card (optional)"
                    hint="It sits in the box with the piece name and the size."
                  >
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
                  {busy ? 'A moment' : 'Reserve the cut'}
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
                            {productLineName(item.product)}
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
                Pay with card, Apple Pay, or Google Pay. A confirmation follows when the cut is
                reserved.
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
                className="mt-8 inline-flex w-full appearance-none items-center justify-center border border-ink bg-ink px-7 py-2.5 text-[11px] font-normal uppercase tracking-[0.22em] text-ivory [-webkit-text-fill-color:#F2EBDC] transition-colors duration-300 hover:bg-transparent hover:text-ink hover:[-webkit-text-fill-color:#1B1714] disabled:pointer-events-none disabled:opacity-35"
              >
                {busy ? 'A moment' : 'Reserve the cut'}
              </button>
              <div className="mt-6">
                <TextLink to="/shop">Continue looking</TextLink>
              </div>
            </div>
          </aside>
        </div>
    </TillFrame>
  )
}
