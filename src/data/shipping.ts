export const shippingCountries = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'QA', name: 'Qatar' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'US', name: 'United States' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
] as const

export type ShippingCountryCode = (typeof shippingCountries)[number]['code']

export const shippingCountryCodes = shippingCountries.map((country) => country.code)

export function shippingCountryName(code: string | null | undefined) {
  if (!code) return ''
  return shippingCountries.find((country) => country.code === code)?.name ?? code
}

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
  productId?: string
  size?: number
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

export type CheckoutInvoiceSummary = {
  number: string
  issuedAt: string
  netPence: number
  vatPence: number
  grossPence: number
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
  invoice?: CheckoutInvoiceSummary | null
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

export function paymentStatusOf(status: string): CheckoutOrder['paymentStatus'] {
  if (status === 'paid' || status === 'no_payment_required') return status
  return 'unpaid'
}
