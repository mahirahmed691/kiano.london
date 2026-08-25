export const HOUSE_ADMIN_EMAILS = [
  'atelier@kiano.london',
  'mahirahmed691@gmail.com',
] as const

export function parseAdminEmails(raw: string | undefined) {
  return (raw ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function resolveAdminEmails(raw: string | undefined) {
  const fromEnv = parseAdminEmails(raw)
  return fromEnv.length > 0 ? fromEnv : [...HOUSE_ADMIN_EMAILS]
}
