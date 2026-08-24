import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

function checkoutApi(env: Record<string, string>): Plugin {
  return {
    name: 'checkout-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== '/api/create-checkout-session' || req.method !== 'POST') {
          next()
          return
        }

        void (async () => {
          process.env.STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY
          process.env.SITE_URL = env.SITE_URL
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
          }
          const origin = `http://${req.headers.host}`
          const request = new Request(`${origin}/api/create-checkout-session`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: Buffer.concat(chunks),
          })
          const { POST } = await import('./api/create-checkout-session.ts')
          const response = await POST(request)
          res.statusCode = response.status
          res.setHeader('content-type', 'application/json')
          res.end(await response.text())
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
