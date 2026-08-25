import { loadEnv } from 'vite'
import { withDb } from '../api/_lib/db.ts'

const env = loadEnv('development', process.cwd(), '')
for (const key of ['DATABASE_URL', 'POSTGRES_URL'] as const) {
  if (env[key] && !process.env[key]) process.env[key] = env[key]
}

await withDb()
console.log('Inventory, members and orders are ready.')
