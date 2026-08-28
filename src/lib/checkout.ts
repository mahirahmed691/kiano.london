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

export {
  emptyCheckoutDetails,
  parseCheckoutDetails,
  type CheckoutDetails,
  type CheckoutOrder,
  type CheckoutOrderAddress,
}

export const CHECKOUT_STORAGE_KEY = 'kiano.checkout'

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
