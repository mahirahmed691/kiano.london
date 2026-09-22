import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { products, thobeSizes } from '../../src/data/products.js'

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
  await db`ALTER TABLE members ADD COLUMN IF NOT EXISTS profile JSONB`
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
  await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stage TEXT NOT NULL DEFAULT 'reserved'`
  await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS refunded_pence INTEGER NOT NULL DEFAULT 0`
  await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier TEXT NOT NULL DEFAULT ''`
  await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking TEXT NOT NULL DEFAULT ''`
  await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_href TEXT NOT NULL DEFAULT ''`
  await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS ready_week DATE`
  await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stage_note TEXT NOT NULL DEFAULT ''`
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
  await db`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'`
  await db`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'visit'`
  await db`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reference TEXT NOT NULL DEFAULT ''`
  await db`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS named_for DATE`
  await db`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reply TEXT NOT NULL DEFAULT ''`
  await db`
    CREATE TABLE IF NOT EXISTS stock_movements (
      id SERIAL PRIMARY KEY,
      product_id TEXT NOT NULL,
      size INTEGER NOT NULL,
      kind TEXT NOT NULL,
      quantity_delta INTEGER NOT NULL,
      quantity_after INTEGER NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      admin_email TEXT NOT NULL DEFAULT '',
      order_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await db`CREATE INDEX IF NOT EXISTS stock_movements_created_at_idx ON stock_movements (created_at DESC)`
  await db`
    CREATE TABLE IF NOT EXISTS invoice_counters (
      year INTEGER PRIMARY KEY,
      last_n INTEGER NOT NULL DEFAULT 0
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      number TEXT NOT NULL UNIQUE,
      order_id TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      customer_name TEXT,
      issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      net_pence INTEGER NOT NULL,
      vat_pence INTEGER NOT NULL,
      gross_pence INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'gbp',
      shipping JSONB
    )
  `
  await db`CREATE INDEX IF NOT EXISTS invoices_issued_at_idx ON invoices (issued_at DESC)`
  await db`
    CREATE TABLE IF NOT EXISTS invoice_lines (
      id SERIAL PRIMARY KEY,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      size INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      description TEXT NOT NULL,
      net_pence INTEGER NOT NULL,
      vat_pence INTEGER NOT NULL,
      gross_pence INTEGER NOT NULL
    )
  `
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
  await db`
    CREATE TABLE IF NOT EXISTS notices (
      id SERIAL PRIMARY KEY,
      audience TEXT NOT NULL,
      clerk_user_id TEXT,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      href TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await db`CREATE INDEX IF NOT EXISTS notices_member_idx ON notices (clerk_user_id, created_at DESC)`
  await db`CREATE INDEX IF NOT EXISTS notices_audience_idx ON notices (audience, created_at DESC)`
  await db`ALTER TABLE notices ADD COLUMN IF NOT EXISTS product_ids TEXT NOT NULL DEFAULT ''`
  await db`
    CREATE TABLE IF NOT EXISTS notice_reads (
      notice_id INTEGER NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
      clerk_user_id TEXT NOT NULL,
      read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (notice_id, clerk_user_id)
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS push_tokens (
      clerk_user_id TEXT NOT NULL,
      token TEXT NOT NULL,
      platform TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (clerk_user_id, token)
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS instagram_out (
      plate_id TEXT PRIMARY KEY,
      posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      ig_media_id TEXT NOT NULL DEFAULT '',
      permalink TEXT NOT NULL DEFAULT '',
      posted_by TEXT NOT NULL DEFAULT ''
    )
  `
  await db`
    CREATE TABLE IF NOT EXISTS plate_letters (
      week_key TEXT PRIMARY KEY,
      plate_id TEXT NOT NULL,
      emailed INTEGER NOT NULL DEFAULT 0,
      pushed INTEGER NOT NULL DEFAULT 0,
      sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
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
