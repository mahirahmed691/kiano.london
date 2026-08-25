import { getProduct, thobeSizes } from '../src/data/products.ts'
import { requireAdmin } from './_lib/admin.ts'
import { withDb } from './_lib/db.ts'

type Method = 'GET' | 'POST'
type Section = 'summary' | 'inventory' | 'competitors'

const allowedSizes = new Set<number>(thobeSizes)
const maxQuantity = 999
const maxName = 80
const maxUrl = 300
const maxNotes = 2000
const maxPence = 999_999

type NoteRow = {
  id: number
  name: string
  url: string
  notes: string
  price_low_pence: number | null
  price_high_pence: number | null
  created_at: string
}

function sectionOf(request: Request): Section | null {
  const url = new URL(request.url)
  const section = url.searchParams.get('section')
  if (section === 'summary' || section === 'inventory' || section === 'competitors') {
    return section
  }
  const path = url.pathname.replace(/\/$/, '')
  if (path.endsWith('/admin-inventory')) return 'inventory'
  if (path.endsWith('/admin-competitors')) return 'competitors'
  if (path.endsWith('/admin-summary') || path.endsWith('/admin')) return 'summary'
  return null
}

function asCount(rows: { n?: string | number | bigint }[]) {
  const value = rows[0]?.n
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  return 0
}

function asText(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function asPence(value: unknown) {
  if (value === '' || value === undefined || value === null) return null
  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isInteger(amount) || amount < 0 || amount > maxPence) return undefined
  return amount
}

function parseHttpUrl(raw: string) {
  if (!raw) return ''
  try {
    const url = new URL(raw)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString().slice(0, maxUrl)
  } catch {
    return null
  }
}

function asNote(row: NoteRow) {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    notes: row.notes,
    priceLowPence: row.price_low_pence,
    priceHighPence: row.price_high_pence,
    createdAt: row.created_at,
  }
}

async function getSummary(): Promise<Response> {
  try {
    const sql = await withDb()

    const members = asCount(
      (await sql`SELECT COUNT(*)::int AS n FROM members`) as { n: number }[],
    )
    const orders = asCount(
      (await sql`SELECT COUNT(*)::int AS n FROM orders WHERE status = 'paid'`) as { n: number }[],
    )
    const reservedPence = asCount(
      (await sql`
        SELECT COALESCE(SUM(amount_pence), 0)::int AS n
        FROM orders
        WHERE status = 'paid'
      `) as { n: number }[],
    )
    const listConfirmed = asCount(
      (await sql`SELECT COUNT(*)::int AS n FROM subscribers WHERE confirmed = true`) as {
        n: number
      }[],
    )
    const listHeld = asCount(
      (await sql`SELECT COUNT(*)::int AS n FROM subscribers WHERE confirmed = false`) as {
        n: number
      }[],
    )
    const cutsRemaining = asCount(
      (await sql`SELECT COALESCE(SUM(quantity), 0)::int AS n FROM inventory`) as { n: number }[],
    )
    const sizesHeld = asCount(
      (await sql`SELECT COUNT(*)::int AS n FROM inventory WHERE quantity <= 0`) as { n: number }[],
    )
    const appointmentCount = asCount(
      (await sql`SELECT COUNT(*)::int AS n FROM appointments`) as { n: number }[],
    )
    const appointmentRows = (await sql`
      SELECT id, name, email, telephone, product_id, size, note, created_at
      FROM appointments
      ORDER BY created_at DESC
      LIMIT 20
    `) as {
      id: number
      name: string
      email: string
      telephone: string | null
      product_id: string | null
      size: number | null
      note: string | null
      created_at: string | Date
    }[]

    return Response.json({
      members,
      orders,
      reservedPence,
      listConfirmed,
      listHeld,
      cutsRemaining,
      sizesHeld,
      appointmentCount,
      appointments: appointmentRows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        telephone: row.telephone ?? '',
        productId: row.product_id ?? '',
        size: row.size,
        note: row.note ?? '',
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The ledger could not be read.' }, { status: 503 })
  }
}

async function getInventory(): Promise<Response> {
  try {
    const sql = await withDb()
    const rows = (await sql`
      SELECT product_id, size, quantity
      FROM inventory
      ORDER BY product_id, size
    `) as { product_id: string; size: number; quantity: number }[]

    return Response.json({
      cuts: rows.map((row) => ({
        productId: row.product_id,
        size: row.size,
        quantity: row.quantity,
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not read remaining cuts.' }, { status: 503 })
  }
}

async function postInventory(request: Request): Promise<Response> {
  let body: { productId?: unknown; size?: unknown; quantity?: unknown }
  try {
    body = (await request.json()) as { productId?: unknown; size?: unknown; quantity?: unknown }
  } catch {
    return Response.json({ error: 'The cut could not be read.' }, { status: 400 })
  }

  const productId = typeof body.productId === 'string' ? body.productId : ''
  if (!getProduct(productId)) {
    return Response.json({ error: 'This piece is not in the collection.' }, { status: 404 })
  }

  const size = Number(body.size)
  if (!allowedSizes.has(size)) {
    return Response.json({ error: 'That size is not cut.' }, { status: 400 })
  }

  const quantity = Number(body.quantity)
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > maxQuantity) {
    return Response.json({ error: 'A whole number of remaining cuts is needed.' }, { status: 400 })
  }

  try {
    const sql = await withDb()
    const updated = (await sql`
      UPDATE inventory
      SET quantity = ${quantity}
      WHERE product_id = ${productId} AND size = ${size}
      RETURNING product_id, size, quantity
    `) as { product_id: string; size: number; quantity: number }[]

    const row = updated[0]
    if (!row) {
      return Response.json({ error: 'This cut is not on the line.' }, { status: 404 })
    }

    return Response.json({
      ok: true,
      cut: { productId: row.product_id, size: row.size, quantity: row.quantity },
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not set remaining cuts.' }, { status: 503 })
  }
}

async function getCompetitors(): Promise<Response> {
  try {
    const sql = await withDb()
    const rows = (await sql`
      SELECT id, name, url, notes, price_low_pence, price_high_pence, created_at
      FROM competitor_notes
      ORDER BY created_at DESC, id DESC
    `) as NoteRow[]

    return Response.json({ notes: rows.map(asNote) })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The field could not be read.' }, { status: 503 })
  }
}

async function postCompetitors(request: Request, email: string): Promise<Response> {
  let body: {
    name?: unknown
    url?: unknown
    notes?: unknown
    priceLowPence?: unknown
    priceHighPence?: unknown
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'The house could not be read.' }, { status: 400 })
  }

  const name = asText(body.name, maxName)
  if (!name) {
    return Response.json({ error: 'A name is needed.' }, { status: 400 })
  }

  const parsedUrl = parseHttpUrl(asText(body.url, maxUrl))
  if (parsedUrl == null) {
    return Response.json({ error: 'A web address must start with http or https.' }, { status: 400 })
  }

  const notes = asText(body.notes, maxNotes)
  const priceLowPence = asPence(body.priceLowPence)
  const priceHighPence = asPence(body.priceHighPence)
  if (priceLowPence === undefined || priceHighPence === undefined) {
    return Response.json({ error: 'Price is whole pence, or left empty.' }, { status: 400 })
  }
  if (priceLowPence != null && priceHighPence != null && priceLowPence > priceHighPence) {
    return Response.json({ error: 'The low price cannot sit above the high.' }, { status: 400 })
  }

  try {
    const sql = await withDb()
    const rows = (await sql`
      INSERT INTO competitor_notes (name, url, notes, price_low_pence, price_high_pence, created_by)
      VALUES (
        ${name},
        ${parsedUrl},
        ${notes},
        ${priceLowPence},
        ${priceHighPence},
        ${email}
      )
      ON CONFLICT (name) DO UPDATE SET
        url = EXCLUDED.url,
        notes = EXCLUDED.notes,
        price_low_pence = EXCLUDED.price_low_pence,
        price_high_pence = EXCLUDED.price_high_pence
      RETURNING id, name, url, notes, price_low_pence, price_high_pence, created_at
    `) as NoteRow[]

    const row = rows[0]
    if (!row) {
      return Response.json({ error: 'The house could not be kept.' }, { status: 500 })
    }

    return Response.json({ ok: true, note: asNote(row) })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not keep that house.' }, { status: 503 })
  }
}

async function handle(request: Request, method: Method): Promise<Response> {
  const section = sectionOf(request)
  if (!section) {
    return Response.json({ error: 'This page of the ledger is not kept.' }, { status: 404 })
  }

  const gate = await requireAdmin(request)
  if (gate.ok === false) return gate.error

  if (method === 'GET') {
    if (section === 'summary') return getSummary()
    if (section === 'inventory') return getInventory()
    return getCompetitors()
  }

  if (section === 'inventory') return postInventory(request)
  if (section === 'competitors') return postCompetitors(request, gate.email)
  return Response.json({ error: 'This page of the ledger is read only.' }, { status: 405 })
}

export async function GET(request: Request): Promise<Response> {
  return handle(request, 'GET')
}

export async function POST(request: Request): Promise<Response> {
  return handle(request, 'POST')
}
