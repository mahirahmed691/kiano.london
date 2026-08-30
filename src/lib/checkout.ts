import {
  emptyCheckoutDetails,
  parseCheckoutDetails,
  shippingCountries,
  shippingCountryName,
  type CheckoutDetails,
  type CheckoutOrder,
  type CheckoutOrderAddress,
  type ShippingCountryCode,
} from '@/data/shipping'
import {
  asHouseProfile,
  notifyHouseDetails,
  writeStoredSize,
  type HouseProfile,
} from '@/lib/house-profile'

export {
  emptyCheckoutDetails,
  parseCheckoutDetails,
  type CheckoutDetails,
  type CheckoutOrder,
  type CheckoutOrderAddress,
}

export const CHECKOUT_STORAGE_KEY = 'kiano.checkout'

function readRawCheckout(): string | null {
  try {
    const local = window.localStorage.getItem(CHECKOUT_STORAGE_KEY)
    if (local) return local
  } catch {
    /* private mode */
  }
  try {
    const session = window.sessionStorage.getItem(CHECKOUT_STORAGE_KEY)
    if (!session) return null
    try {
      window.localStorage.setItem(CHECKOUT_STORAGE_KEY, session)
    } catch {
      /* private mode */
    }
    try {
      window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY)
    } catch {
      /* private mode */
    }
    return session
  } catch {
    return null
  }
}

export function readStoredCheckout(): CheckoutDetails {
  if (typeof window === 'undefined') return emptyCheckoutDetails
  try {
    const raw = readRawCheckout()
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
  const payload = JSON.stringify(details)
  try {
    window.localStorage.setItem(CHECKOUT_STORAGE_KEY, payload)
    notifyHouseDetails()
  } catch {
    try {
      window.sessionStorage.setItem(CHECKOUT_STORAGE_KEY, payload)
      notifyHouseDetails()
    } catch {
      /* private mode */
    }
  }
}

export function clearStoredCheckout() {
  try {
    window.localStorage.removeItem(CHECKOUT_STORAGE_KEY)
  } catch {
    /* private mode */
  }
  try {
    window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY)
  } catch {
    /* private mode */
  }
}

export function clearCheckoutNote() {
  const current = readStoredCheckout()
  writeStoredCheckout({ ...current, note: '' })
}

export function rememberHouseContact(patch: Partial<HouseProfile>) {
  const current = readStoredCheckout()
  const profile = asHouseProfile({ ...current, ...patch })
  const { size, ...contact } = profile
  if ('size' in patch) writeStoredSize(size)
  writeStoredCheckout({
    ...current,
    ...contact,
    note: current.note,
  })
}

export function orderReference(id: string) {
  return id.slice(-8).toUpperCase()
}

export function returnPath(input: {
  reference: string
  productId?: string
  size?: number
}) {
  const query = new URLSearchParams()
  if (input.reference) query.set('ref', input.reference)
  if (input.productId) query.set('piece', input.productId)
  if (input.size && input.size > 0) query.set('size', String(input.size))
  const qs = query.toString()
  return qs ? `/returns?${qs}` : '/returns'
}

export function returnLetterHref(reference: string) {
  return returnPath({ reference })
}

export function reservationPath(input: { reference?: string; email?: string }) {
  const query = new URLSearchParams()
  if (input.reference) query.set('ref', input.reference)
  if (input.email) query.set('email', input.email)
  const qs = query.toString()
  return qs ? `/reservation?${qs}` : '/reservation'
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
