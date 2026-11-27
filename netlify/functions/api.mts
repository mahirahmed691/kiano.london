/**
 * Netlify standby host: one function serves every /api/* route by calling the
 * same handlers Vercel runs from api/*.ts. Mirrors the rewrites in vercel.json.
 * See docs/BACKUP-HOSTING.md.
 */
import * as admin from '../../api/admin.ts'
import * as appointment from '../../api/appointment.ts'
import * as checkoutSession from '../../api/checkout-session.ts'
import * as clerkWebhook from '../../api/clerk-webhook.ts'
import * as createCheckoutSession from '../../api/create-checkout-session.ts'
import * as inventory from '../../api/inventory.ts'
import * as locale from '../../api/locale.ts'
import * as member from '../../api/member.ts'
import * as notices from '../../api/notices.ts'
import * as orders from '../../api/orders.ts'
import * as stripeWebhook from '../../api/stripe-webhook.ts'
import * as subscribe from '../../api/subscribe.ts'

type Handler = (request: Request) => Promise<Response> | Response
type Module = Partial<Record<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', Handler>>

const routes: Record<string, Module> = {
  admin,
  appointment,
  'checkout-session': checkoutSession,
  'clerk-webhook': clerkWebhook,
  'create-checkout-session': createCheckoutSession,
  inventory,
  locale,
  member,
  notices,
  orders,
  'stripe-webhook': stripeWebhook,
  subscribe,
}

/** Same as the rewrites in vercel.json. */
const aliases: Record<string, { to: string; params?: Record<string, string> }> = {
  'admin-summary': { to: 'admin', params: { section: 'summary' } },
  'admin-inventory': { to: 'admin', params: { section: 'inventory' } },
  'admin-competitors': { to: 'admin', params: { section: 'competitors' } },
  return: { to: 'appointment', params: { kind: 'return' } },
  wait: { to: 'appointment', params: { kind: 'wait' } },
  'subscribe-confirm': { to: 'subscribe' },
  'stills-week': { to: 'subscribe', params: { section: 'week' } },
}

export default async (request: Request): Promise<Response> => {
  const url = new URL(request.url)
  let name = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '')
  const alias = aliases[name]
  if (alias) {
    name = alias.to
    for (const [key, value] of Object.entries(alias.params ?? {})) url.searchParams.set(key, value)
  }

  const handler = routes[name]?.[request.method as keyof Module]
  if (!handler) {
    const status = routes[name] ? 405 : 404
    return Response.json({ error: status === 405 ? 'Method not allowed.' : 'Not found.' }, { status })
  }

  // x-vercel-cron is only trustworthy on Vercel; never let a visitor send it here.
  const headers = new Headers(request.headers)
  headers.delete('x-vercel-cron')
  const init: RequestInit & { duplex?: 'half' } = { method: request.method, headers }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
    init.duplex = 'half'
  }
  return handler(new Request(url, init))
}

export const config = { path: '/api/*' }
