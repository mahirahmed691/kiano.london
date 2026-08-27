import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

const envKeys = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CLERK_WEBHOOK_SIGNING_SECRET',
  'SITE_URL',
  'DATABASE_URL',
  'POSTGRES_URL',
  'CLERK_SECRET_KEY',
  'ADMIN_EMAILS',
  'VITE_ADMIN_EMAILS',
  'RESEND_API_KEY',
  'RESEND_FROM',
] as const

type Method = 'GET' | 'POST' | 'PATCH'

type Route = {
  method: Method
  path: string
  load: () => Promise<(request: Request) => Promise<Response>>
}

const routes: Route[] = [
  {
    method: 'POST',
    path: '/api/create-checkout-session',
    load: async () => (await import('./api/create-checkout-session.ts')).POST,
  },
  {
    method: 'GET',
    path: '/api/checkout-session',
    load: async () => (await import('./api/checkout-session.ts')).GET,
  },
  {
    method: 'GET',
    path: '/api/inventory',
    load: async () => (await import('./api/inventory.ts')).GET,
  },
  {
    method: 'GET',
    path: '/api/orders',
    load: async () => (await import('./api/orders.ts')).GET,
  },
  {
    method: 'GET',
    path: '/api/admin',
    load: async () => (await import('./api/admin.ts')).GET,
  },
  {
    method: 'POST',
    path: '/api/admin',
    load: async () => (await import('./api/admin.ts')).POST,
  },
  {
    method: 'GET',
    path: '/api/admin-summary',
    load: async () => (await import('./api/admin.ts')).GET,
  },
  {
    method: 'GET',
    path: '/api/admin-inventory',
    load: async () => (await import('./api/admin.ts')).GET,
  },
  {
    method: 'POST',
    path: '/api/admin-inventory',
    load: async () => (await import('./api/admin.ts')).POST,
  },
  {
    method: 'GET',
    path: '/api/admin-competitors',
    load: async () => (await import('./api/admin.ts')).GET,
  },
  {
    method: 'POST',
    path: '/api/admin-competitors',
    load: async () => (await import('./api/admin.ts')).POST,
  },
  {
    method: 'POST',
    path: '/api/appointment',
    load: async () => (await import('./api/appointment.ts')).POST,
  },
  {
    method: 'POST',
    path: '/api/clerk-webhook',
    load: async () => (await import('./api/clerk-webhook.ts')).POST,
  },
  {
    method: 'POST',
    path: '/api/member',
    load: async () => (await import('./api/member.ts')).POST,
  },
  {
    method: 'POST',
    path: '/api/stripe-webhook',
    load: async () => (await import('./api/stripe-webhook.ts')).POST,
  },
  {
    method: 'POST',
    path: '/api/subscribe',
    load: async () => (await import('./api/subscribe.ts')).POST,
  },
  {
    method: 'GET',
    path: '/api/subscribe-confirm',
    load: async () => (await import('./api/subscribe-confirm.ts')).GET,
  },
  {
    method: 'GET',
    path: '/api/notices',
    load: async () => (await import('./api/notices.ts')).GET,
  },
  {
    method: 'PATCH',
    path: '/api/notices',
    load: async () => (await import('./api/notices.ts')).PATCH,
  },
  {
    method: 'POST',
    path: '/api/notices',
    load: async () => (await import('./api/notices.ts')).POST,
  },
]

function originOf(req: IncomingMessage) {
  return `http://${req.headers.host}`
}

async function writeJson(res: ServerResponse, response: Response) {
  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  if (response.status >= 300 && response.status < 400) {
    res.end()
    return
  }
  if (!res.getHeader('content-type')) {
    res.setHeader('content-type', 'application/json')
  }
  res.end(Buffer.from(await response.arrayBuffer()))
}

function headerValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.join(', ')
  return value ?? ''
}

function atelierApi(env: Record<string, string>): Plugin {
  return {
    name: 'atelier-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        const route = routes.find(
          (entry) => entry.path === pathname && entry.method === req.method,
        )
        if (!route) {
          next()
          return
        }

        void (async () => {
          for (const key of envKeys) {
            if (env[key]) process.env[key] = env[key]
          }
          try {
            const chunks: Buffer[] = []
            const hasBody = route.method === 'POST' || route.method === 'PATCH'
            if (hasBody) {
              for await (const chunk of req) {
                chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
              }
            }
            const headers: Record<string, string> = {}
            for (const [key, value] of Object.entries(req.headers)) {
              if (key === 'host' || key === 'content-length' || key === 'connection') continue
              const next = headerValue(value)
              if (next) headers[key] = next
            }
            if (!headers['content-type']) headers['content-type'] = 'application/json'
            if (!headers.origin) headers.origin = originOf(req)

            const request = new Request(`${originOf(req)}${req.url}`, {
              method: route.method,
              headers,
              body: hasBody ? Buffer.concat(chunks) : undefined,
            })
            const handler = await route.load()
            await writeJson(res, await handler(request))
          } catch (caught) {
            console.error(caught)
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: 'The atelier could not complete that request.' }))
          }
        })()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const clerkPublishable =
    env.VITE_CLERK_PUBLISHABLE_KEY || env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''

  return {
    plugins: [
      react(),
      tailwindcss(),
      atelierApi(env),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
        manifest: false,
        workbox: {
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2}'],
        },
      }),
    ],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: {
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkPublishable),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },
  }
})
