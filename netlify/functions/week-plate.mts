/**
 * Netlify standby host: replaces the Vercel cron in vercel.json
 * ("0 8 * * 1" → GET /api/subscribe). Authorised with CRON_SECRET.
 */
import { GET } from '../../api/subscribe.ts'

export default async (): Promise<Response> => {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) {
    console.error('week-plate: CRON_SECRET is not set; skipping.')
    return new Response('CRON_SECRET missing', { status: 500 })
  }
  const site = (process.env.SITE_URL || 'https://www.kiano.london').replace(/\/$/, '')
  const response = await GET(
    new Request(`${site}/api/subscribe`, { headers: { authorization: `Bearer ${secret}` } }),
  )
  console.log('week-plate:', response.status)
  return response
}

export const config = { schedule: '0 8 * * 1' }
