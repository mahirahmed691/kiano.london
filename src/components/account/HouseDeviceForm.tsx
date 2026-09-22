import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Body } from '@/components/ui/Heading'
import { shippingCountries } from '@/data/shipping'
import { thobeSizes } from '@/data/products'
import { rememberHouseContact, readStoredCheckout } from '@/lib/checkout'
import { cn } from '@/lib/cn'
import {
  asThobeSize,
  emptyHouseProfile,
  fillEmptyDetails,
  readStoredSize,
  type HouseProfile,
} from '@/lib/house-profile'

const fieldClass =
  'w-full border-0 border-b border-ivory/25 bg-transparent py-3 text-[15px] font-light text-ivory outline-none transition-colors duration-300 placeholder:text-ivory/40 focus:border-ivory'

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

function detailsFromDevice(): HouseProfile {
  const stored = readStoredCheckout()
  const filled = fillEmptyDetails({ ...emptyHouseProfile(), note: '' }, stored)
  return {
    name: filled.name,
    email: filled.email,
    telephone: filled.telephone,
    line1: filled.line1,
    line2: filled.line2,
    city: filled.city,
    region: filled.region,
    postalCode: filled.postalCode,
    country: filled.country,
    size: readStoredSize(),
  }
}

export function HouseDeviceForm() {
  const [details, setDetails] = useState<HouseProfile>(detailsFromDevice)
  const [error, setError] = useState('')
  const [kept, setKept] = useState(false)

  function setField<K extends keyof HouseProfile>(key: K, value: HouseProfile[K]) {
    setDetails((current) => ({ ...current, [key]: value }))
    setKept(false)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const email = details.email.trim().toLowerCase()
    if (email && !email.includes('@')) {
      setError('A valid email is needed, or leave it blank.')
      return
    }
    rememberHouseContact({ ...details, email })
    setDetails({ ...details, email })
    setKept(true)
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-8" autoComplete="on">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">On this device</p>
        <Body className="mt-4">
          The size you wear, and the details for the till, stay here. Sign in to keep the same
          with the house.
        </Body>
      </div>

      <Field
        id="device-size"
        label="Size"
        hint="The line will start here. You can still choose another cut."
      >
        <select
          id="device-size"
          name="size"
          value={details.size ?? ''}
          onChange={(event) => setField('size', asThobeSize(event.target.value))}
          className={cn(fieldClass, 'appearance-none')}
        >
          <option value="">Not kept yet</option>
          {thobeSizes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="device-name" label="Name">
          <input
            id="device-name"
            name="name"
            autoComplete="name"
            value={details.name}
            onChange={(event) => setField('name', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="device-email" label="Email">
          <input
            id="device-email"
            name="email"
            type="email"
            autoComplete="email"
            value={details.email}
            onChange={(event) => setField('email', event.target.value)}
            className={fieldClass}
          />
        </Field>
      </div>

      <Field id="device-telephone" label="Telephone">
        <input
          id="device-telephone"
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={details.telephone}
          onChange={(event) => setField('telephone', event.target.value)}
          className={fieldClass}
        />
      </Field>

      <Field id="device-line1" label="Address">
        <input
          id="device-line1"
          name="address-line1"
          autoComplete="address-line1"
          value={details.line1}
          onChange={(event) => setField('line1', event.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field id="device-line2" label="Flat, building (optional)">
        <input
          id="device-line2"
          name="address-line2"
          autoComplete="address-line2"
          value={details.line2}
          onChange={(event) => setField('line2', event.target.value)}
          className={fieldClass}
        />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="device-city" label="City">
          <input
            id="device-city"
            name="address-level2"
            autoComplete="address-level2"
            value={details.city}
            onChange={(event) => setField('city', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="device-postal" label="Postcode">
          <input
            id="device-postal"
            name="postal-code"
            autoComplete="postal-code"
            value={details.postalCode}
            onChange={(event) => setField('postalCode', event.target.value)}
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="device-region" label="County / region (optional)">
          <input
            id="device-region"
            name="address-level1"
            autoComplete="address-level1"
            value={details.region}
            onChange={(event) => setField('region', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field id="device-country" label="Country">
          <select
            id="device-country"
            name="country"
            autoComplete="country"
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
        <p className="text-[14px] font-light text-ivory" role="alert">
          {error}
        </p>
      ) : null}
      {kept ? (
        <p className="text-[14px] font-light text-ivory-soft">Kept on this device.</p>
      ) : null}

      <Button type="submit" variant="solid">
        Keep on this device
      </Button>
    </form>
  )
}
