export function parseAdminEmails(raw: string | undefined) {
  return (raw ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | undefined | null) {
  if (!email) return false
  const allowed = parseAdminEmails(import.meta.env.VITE_ADMIN_EMAILS)
  if (allowed.length === 0) return false
  return allowed.includes(email.trim().toLowerCase())
}
