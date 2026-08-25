import { shippingCountries, type ShippingCountryCode } from '../data/shipping'

export const CHECKOUT_STORAGE_KEY = 'kiano.checkout'

export type CheckoutDetails = {
  name: string
  email: string
  telephone: string
  line1: string
  line2: string
  city: string
  region: string
  postalCode: string
  country: ShippingCountryCode
  note: string
}

export type CheckoutOrderLine = {
  description: string
  quantity: number
  amount: number
}

export type CheckoutOrderAddress = {
  name: string | null
  line1: string | null
  line2: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  country: string | null
}

export type CheckoutOrder = {
  id: string
  paymentStatus: 'paid' | 'unpaid' | 'no_payment_required'
  amountTotal: number
  currency: string
  customerEmail: string | null
  customerName: string | null
  customerPhone: string | null
  shipping: CheckoutOrderAddress | null
  note: string | null
  lines: CheckoutOrderLine[]
}

export const emptyCheckoutDetails: CheckoutDetails = {
  name: '',
  email: '',
  telephone: '',
  line1: '',
  line2: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'GB',
  note: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const countryCodes = new Set<string>(shippingCountries.map((country) => country.code))

function asString(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export function parseCheckoutDetails(
  input: unknown,
): { details: CheckoutDetails } | { error: string } {
  if (!input || typeof input !== 'object') {
    return { error: 'The details could not be read.' }
  }

  const raw = input as Record<string, unknown>
  const name = asString(raw.name, 80)
  const email = asString(raw.email, 120).toLowerCase()
  const telephone = asString(raw.telephone, 40)
  const line1 = asString(raw.line1, 80)
  const line2 = asString(raw.line2, 80)
  const city = asString(raw.city, 80)
  const region = asString(raw.region, 80)
  const postalCode = asString(raw.postalCode, 16)
  const country = asString(raw.country, 2).toUpperCase()
  const note = asString(raw.note, 500)

  if (name.length < 2) return { error: 'A name is needed.' }
  if (!emailPattern.test(email)) return { error: 'A valid email is needed.' }
  if (telephone.replace(/\D/g, '').length < 8) {
    return { error: 'A telephone number is needed.' }
  }
  if (line1.length < 3) return { error: 'A delivery address is needed.' }
  if (city.length < 2) return { error: 'A city is needed.' }
  if (postalCode.length < 3) return { error: 'A postcode is needed.' }
  if (!countryCodes.has(country)) {
    return { error: 'That country cannot be delivered to yet.' }
  }

  return {
    details: {
      name,
      email,
      telephone,
      line1,
      line2,
      city,
      region,
      postalCode,
      country: country as ShippingCountryCode,
      note,
    },
  }
}

export function readStoredCheckout(): CheckoutDetails {
  if (typeof window === 'undefined') return emptyCheckoutDetails
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_STORAGE_KEY)
    if (!raw) return emptyCheckoutDetails
    const stored = JSON.parse(raw) as Partial<CheckoutDetails>
    const parsed = parseCheckoutDetails({ ...emptyCheckoutDetails, ...stored })
    if ('details' in parsed) return parsed.details
    const country = shippingCountries.some((item) => item.code === stored.country)
      ? (stored.country as ShippingCountryCode)
      : 'GB'
    return { ...emptyCheckoutDetails, ...stored, country }
  } catch {
    return emptyCheckoutDetails
  }
}

export function writeStoredCheckout(details: CheckoutDetails) {
  window.sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(details))
}

export function clearStoredCheckout() {
  window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY)
}

export function orderReference(id: string) {
  return id.slice(-8).toUpperCase()
}

export function formatOrderAddress(address: CheckoutOrderAddress) {
  return [
    address.name,
    address.line1,
    address.line2,
    [address.city, address.postalCode].filter(Boolean).join(' '),
    address.region,
    shippingCountryName(address.country),
  ].filter(Boolean)
}
