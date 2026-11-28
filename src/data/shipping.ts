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

/** Delivery is charged per order, by destination. Prices in pence. */
export type DeliveryOption = {
  id: 'uk-tracked' | 'uk-next-day' | 'europe' | 'gulf' | 'us'
  label: string
  pence: number
  days: string
}

const ukTracked: DeliveryOption = {
  id: 'uk-tracked',
  label: 'Tracked delivery',
  pence: 395,
  days: '2–3 working days once sent',
}
const ukNextDay: DeliveryOption = {
  id: 'uk-next-day',
  label: 'Next working day',
  pence: 595,
  days: 'next working day once sent',
}
const europe: DeliveryOption = { id: 'europe', label: 'Tracked delivery', pence: 1200, days: '3–5 working days once sent' }
const gulf: DeliveryOption = { id: 'gulf', label: 'Tracked delivery', pence: 1500, days: '4–8 working days once sent' }
const us: DeliveryOption = { id: 'us', label: 'Tracked delivery, duties paid', pence: 2500, days: '5–8 working days once sent' }

export function deliveryOptions(country: string | null | undefined): DeliveryOption[] {
  switch (country) {
    case 'GB':
      return [ukTracked, ukNextDay]
    case 'FR':
    case 'DE':
    case 'IT':
      return [europe]
    case 'AE':
    case 'SA':
    case 'KW':
    case 'QA':
    case 'BH':
    case 'OM':
      return [gulf]
    case 'US':
      return [us]
    default:
      return []
  }
}

/** The option the customer chose, or the first for their country. */
export function deliveryFor(country: string | null | undefined, id?: string | null): DeliveryOption | null {
  const options = deliveryOptions(country)
  return options.find((option) => option.id === id) ?? options[0] ?? null
}

export const deliveryFromPence = ukTracked.pence

export const carriageLine =
  'We deliver to Britain, the United Arab Emirates, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman, the United States, France, Germany and Italy. Delivery is tracked and charged per order: UK £3.95 (next working day £5.95), France, Germany and Italy £12, the Gulf £15, the United States £25 with duties paid. A visit is not required.'

/** Short form for the product page. */
export const deliveryLine =
  'Tracked delivery from £3.95 in the UK; £12 to Europe, £15 to the Gulf, £25 to the US. Shown before you pay.'

export const madeToOrderLine = 'Made to order: payment is taken first, and we email the week it will be ready.'

export function shippingCountryName(code: string | null | undefined) {
  if (!code) return ''
  return shippingCountries.find((country) => country.code === code)?.name ?? code
}

const dialCodes: Record<ShippingCountryCode, string> = {
  GB: '44',
  AE: '971',
  SA: '966',
  KW: '965',
  QA: '974',
  BH: '973',
  OM: '968',
  US: '1',
  FR: '33',
  DE: '49',
  IT: '39',
}

export function asE164(raw: string, country: string) {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) return trimmed
  if (trimmed.startsWith('+')) return `+${digits}`
  if (trimmed.startsWith('00')) return `+${digits.replace(/^00/, '')}`
  const cc = dialCodes[country as ShippingCountryCode]
  if (!cc) return trimmed
  if (digits.startsWith(cc)) return `+${digits}`
  if (digits.startsWith('0')) return `+${cc}${digits.slice(1)}`
  return `+${cc}${digits}`
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
