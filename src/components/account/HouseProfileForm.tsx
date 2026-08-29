import { useAuth, useUser } from '@clerk/react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Body } from '@/components/ui/Heading'
import { shippingCountries } from '@/data/shipping'
import { clerkContact } from '@/lib/clerk'
import { rememberHouseContact, writeStoredCheckout, readStoredCheckout } from '@/lib/checkout'
import { cn } from '@/lib/cn'
import {
  emptyHouseProfile,
  fetchHouseProfile,
  fillEmptyDetails,
  parseHouseProfile,
  saveHouseProfile,
  type HouseProfile,
} from '@/lib/house-profile'

const fieldClass =
  'w-full border-0 border-b border-rule bg-transparent py-3 text-[15px] font-light text-ink outline-none transition-colors duration-300 placeholder:text-stone/70 focus:border-ink'

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

export function HouseProfileForm() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [details, setDetails] = useState<HouseProfile>(emptyHouseProfile)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [kept, setKept] = useState(false)

  useEffect(() => {
    if (!user) return
    const member = user
    let cancelled = false

    async function load() {
      const contact = clerkContact(member)
      const stored = readStoredCheckout()
      const token = await getToken()
      if (token) {
        await fetch('/api/member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: contact.email,
            name: contact.name,
          }),
        }).catch(() => undefined)
      }
      const profile = await fetchHouseProfile(token)
      if (cancelled) return
      let next = fillEmptyDetails({ ...emptyHouseProfile(), note: '' }, profile ?? {})
      next = fillEmptyDetails(next, stored)
      next = fillEmptyDetails(next, contact)
      setDetails({
        name: next.name,
        email: contact.email || next.email,
        telephone: next.telephone,
        line1: next.line1,
        line2: next.line2,
        city: next.city,
        region: next.region,
        postalCode: next.postalCode,
        country: next.country,
      })
      setLoaded(true)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [getToken, user])

  function setField<K extends keyof HouseProfile>(key: K, value: HouseProfile[K]) {
    setDetails((current) => ({ ...current, [key]: value }))
    setKept(false)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setKept(false)

    const contact = clerkContact(user)
    const parsed = parseHouseProfile({ ...details, email: contact.email || details.email })
    if ('error' in parsed) {
      setError(parsed.error)
      return
    }

    const token = await getToken()
    if (!token) {
      setError('Sign in to keep these details.')
      return
    }

    setBusy(true)
    const saved = await saveHouseProfile(token, parsed.profile)
    setBusy(false)
    if ('error' in saved) {
      setError(saved.error)
      return
    }

    rememberHouseContact(parsed.profile)
    writeStoredCheckout({ ...readStoredCheckout(), ...parsed.profile })
    setDetails(parsed.profile)
    setKept(true)
  }

  if (!loaded) {
    return <p className="mt-8 text-[15px] font-light text-ink-soft">Reading your details.</p>
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mt-10 space-y-8" autoComplete="on">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Your details</p>
        <Body className="mt-4">
          Kept once, then filled at the till, a visit, a wait, and a return. The house card is
          still written each time.
        </Body>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="profile-name" label="Name">
          <input
            id="profile-name"
            name="name"
            autoComplete="name"
            required
            value={details.name}
            onChange={(event) => setField('name', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="profile-email" label="Email" hint="The address on this account.">
          <input
            id="profile-email"
            name="email"
            type="email"
            autoComplete="email"
            readOnly
            value={details.email}
            className={cn(fieldClass, 'opacity-70')}
          />
        </Field>
      </div>

      <Field id="profile-telephone" label="Telephone">
        <input
          id="profile-telephone"
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={details.telephone}
          onChange={(event) => setField('telephone', event.target.value)}
          className={fieldClass}
        />
      </Field>

      <Field id="profile-line1" label="Address">
        <input
          id="profile-line1"
          name="address-line1"
          autoComplete="address-line1"
          required
          value={details.line1}
          onChange={(event) => setField('line1', event.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field id="profile-line2" label="Flat, building (optional)">
        <input
          id="profile-line2"
          name="address-line2"
          autoComplete="address-line2"
          value={details.line2}
          onChange={(event) => setField('line2', event.target.value)}
          className={fieldClass}
        />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="profile-city" label="City">
          <input
            id="profile-city"
            name="address-level2"
            autoComplete="address-level2"
            required
            value={details.city}
            onChange={(event) => setField('city', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="profile-postal" label="Postcode">
          <input
            id="profile-postal"
            name="postal-code"
            autoComplete="postal-code"
            required
            value={details.postalCode}
            onChange={(event) => setField('postalCode', event.target.value)}
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="profile-region" label="County / region (optional)">
          <input
            id="profile-region"
            name="address-level1"
            autoComplete="address-level1"
            value={details.region}
            onChange={(event) => setField('region', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="profile-country" label="Country">
          <select
            id="profile-country"
            name="country"
            autoComplete="country"
            required
            value={details.country}
            onChange={(event) =>
              setField('country', event.target.value as HouseProfile['country'])
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

      {error ? (
        <p className="text-[14px] font-light text-ink" role="alert">
          {error}
        </p>
      ) : null}
      {kept ? (
        <p className="text-[14px] font-light text-ink-soft">Kept for the next time.</p>
      ) : null}

      <Button type="submit" variant="solid" disabled={busy}>
        {busy ? 'A moment' : 'Keep these details'}
      </Button>
    </form>
  )
}
