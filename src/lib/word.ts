export type HouseNotice = {
  id: number
  audience: 'member' | 'admin'
  kind: string
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

export function formatNoticeWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
