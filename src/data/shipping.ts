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
