import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { products, thobeSizes } from '../../src/data/products.ts'

type Sql = NeonQueryFunction<false, false>

let sql: Sql | undefined
let schemaReady: Promise<void> | undefined

export function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
}

export function getSql() {
  const url = databaseUrl()
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  if (!sql) sql = neon(url)
  return sql
}

export async function withDb() {
  const db = getSql()
  if (!schemaReady) {
    schemaReady = migrate(db).catch((caught: unknown) => {
      schemaReady = undefined
      throw caught
    })
  }
  await schemaReady
  return db
}

function seedQuantity(productId: string) {
  return productId === 'hadid-thobe' ? 2 : 4
}

async function migrate(db: Sql) {
  await db`
    CREATE TABLE IF NOT EXISTS inventory (
      product_id TEXT NOT NULL,
      size INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (product_id, size)
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS members (
      clerk_user_id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      clerk_user_id TEXT,
      email TEXT NOT NULL,
      status TEXT NOT NULL,
      amount_pence INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'gbp',
      shipping JSONB,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS order_lines (
      id SERIAL PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      size INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      amount_pence INTEGER NOT NULL,
      description TEXT NOT NULL
    )
  `
  await db`CREATE INDEX IF NOT EXISTS orders_clerk_user_id_idx ON orders (clerk_user_id)`
  await db`CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (lower(email))`
  await db`
    CREATE TABLE IF NOT EXISTS subscribers (
      email TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      confirmed BOOLEAN NOT NULL DEFAULT false,
      token TEXT UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      confirmed_at TIMESTAMPTZ
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS webhook_events (
      svix_id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT,
      product_id TEXT,
      size INTEGER,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await db`CREATE INDEX IF NOT EXISTS appointments_created_at_idx ON appointments (created_at DESC)`
  await db`
    CREATE TABLE IF NOT EXISTS competitor_notes (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      price_low_pence INTEGER,
      price_high_pence INTEGER,
      created_by TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  for (const product of products) {
    for (const size of thobeSizes) {
      await db`
        INSERT INTO inventory (product_id, size, quantity)
        VALUES (${product.id}, ${size}, ${seedQuantity(product.id)})
        ON CONFLICT (product_id, size) DO NOTHING
      `
    }
  }
}
