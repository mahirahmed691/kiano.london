import {
  emptyCheckoutDetails,
  parseCheckoutDetails,
  shippingCountries,
  type CheckoutDetails,
  type CheckoutOrderAddress,
  type ShippingCountryCode,
} from '../data/shipping.js'

export type HouseProfile = Omit<CheckoutDetails, 'note'>

const countryCodes = new Set<string>(shippingCountries.map((country) => country.code))

function asString(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export function emptyHouseProfile(): HouseProfile {
  const { note: _note, ...profile } = emptyCheckoutDetails
  return profile
}

export function profileFromDetails(details: CheckoutDetails): HouseProfile {
  const { note: _note, ...profile } = details
  return profile
}

export function asHouseProfile(raw: unknown): HouseProfile {
  if (!raw || typeof raw !== 'object') return emptyHouseProfile()
  const record = raw as Record<string, unknown>
  const country = asString(record.country, 2).toUpperCase()
  return {
    name: asString(record.name, 80),
    email: asString(record.email, 120).toLowerCase(),
    telephone: asString(record.telephone, 40),
    line1: asString(record.line1, 80),
    line2: asString(record.line2, 80),
    city: asString(record.city, 80),
    region: asString(record.region, 80),
    postalCode: asString(record.postalCode, 16),
    country: countryCodes.has(country) ? (country as ShippingCountryCode) : 'GB',
  }
}

export function parseHouseProfile(input: unknown): { profile: HouseProfile } | { error: string } {
  const parsed = parseCheckoutDetails(
    input && typeof input === 'object' ? { ...(input as object), note: '' } : input,
  )
  if ('error' in parsed) return parsed
  return { profile: profileFromDetails(parsed.details) }
}

export function profileHasAddress(profile: HouseProfile) {
  return profile.line1.length >= 3 && profile.city.length >= 2 && profile.postalCode.length >= 3
}

export function mergeProfile(base: HouseProfile, incoming: HouseProfile): HouseProfile {
  return {
    name: incoming.name || base.name,
    email: incoming.email || base.email,
    telephone: incoming.telephone || base.telephone,
    line1: incoming.line1 || base.line1,
    line2: incoming.line2 || base.line2,
    city: incoming.city || base.city,
    region: incoming.region || base.region,
    postalCode: incoming.postalCode || base.postalCode,
    country: incoming.line1 ? incoming.country : base.country,
  }
}

export function fillEmptyDetails(
  current: CheckoutDetails,
  patch: Partial<HouseProfile>,
): CheckoutDetails {
  const hasAddress = current.line1.trim().length > 0
  return {
    ...current,
    name: current.name || patch.name || '',
    email: current.email || patch.email || '',
    telephone: current.telephone || patch.telephone || '',
    line1: current.line1 || patch.line1 || '',
    line2: current.line2 || patch.line2 || '',
    city: current.city || patch.city || '',
    region: current.region || patch.region || '',
    postalCode: current.postalCode || patch.postalCode || '',
    country: hasAddress ? current.country : patch.country || current.country,
  }
}

export function fillEmptyContact(
  current: { name: string; email: string; telephone: string },
  patch: Partial<Pick<HouseProfile, 'name' | 'email' | 'telephone'>>,
) {
  return {
    name: current.name || patch.name || '',
    email: current.email || patch.email || '',
    telephone: current.telephone || patch.telephone || '',
  }
}

export function profileFromShipping(
  shipping: CheckoutOrderAddress | Record<string, unknown> | null | undefined,
  extras: { name?: string | null; email?: string | null; telephone?: string | null } = {},
): HouseProfile {
  const record = shipping && typeof shipping === 'object' ? shipping : {}
  return asHouseProfile({
    name: extras.name || ('name' in record ? record.name : ''),
    email: extras.email ?? '',
    telephone: extras.telephone ?? '',
    line1: 'line1' in record ? record.line1 : '',
    line2: 'line2' in record ? record.line2 : '',
    city: 'city' in record ? record.city : '',
    region: 'region' in record ? record.region : '',
    postalCode: 'postalCode' in record ? record.postalCode : '',
    country: 'country' in record ? record.country : 'GB',
  })
}

export async function fetchHouseProfile(token: string | null): Promise<HouseProfile | null> {
  if (!token) return null
  try {
    const response = await fetch('/api/member', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return null
    const data = (await response.json()) as { profile?: unknown }
    const profile = asHouseProfile(data.profile)
    return profile.name || profile.email || profileHasAddress(profile) ? profile : null
  } catch {
    return null
  }
}

export async function saveHouseProfile(
  token: string,
  profile: HouseProfile,
): Promise<{ ok: true } | { error: string }> {
  try {
    const response = await fetch('/api/member', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    })
    const data = (await response.json()) as { error?: string; profile?: unknown }
    if (!response.ok) {
      return { error: data.error || 'The details could not be kept.' }
    }
    return { ok: true }
  } catch {
    return { error: 'The details could not be kept.' }
  }
}
