import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

function originOf(req: IncomingMessage) {
  return `http://${req.headers.host}`
}

async function writeJson(res: ServerResponse, response: Response) {
  res.statusCode = response.status
  res.setHeader('content-type', 'application/json')
  res.end(await response.text())
}

function checkoutApi(env: Record<string, string>): Plugin {
  return {
    name: 'checkout-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0]
        const createSession = pathname === '/api/create-checkout-session' && req.method === 'POST'
        const readSession = pathname === '/api/checkout-session' && req.method === 'GET'

        if (!createSession && !readSession) {
          next()
          return
        }

        void (async () => {
          if (env.STRIPE_SECRET_KEY) process.env.STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY
          if (env.SITE_URL) process.env.SITE_URL = env.SITE_URL
          try {
            if (createSession) {
              const chunks: Buffer[] = []
              for await (const chunk of req) {
                chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
              }
              const request = new Request(`${originOf(req)}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                  origin: req.headers.origin ?? originOf(req),
                },
                body: Buffer.concat(chunks),
              })
              const { POST } = await import('./api/create-checkout-session.ts')
              await writeJson(res, await POST(request))
              return
            }

            const request = new Request(`${originOf(req)}${req.url}`, {
              method: 'GET',
            })
            const { GET } = await import('./api/checkout-session.ts')
            await writeJson(res, await GET(request))
          } catch (caught) {
            console.error(caught)
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: 'The atelier could not reach payment.' }))
          }
        })()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), checkoutApi(env)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },
  }
})
