import { requireAdmin } from './_lib/admin.ts'
import { withDb } from './_lib/db.ts'

type NoteRow = {
  id: number
  name: string
  url: string
  notes: string
  price_low_pence: number | null
  price_high_pence: number | null
  created_at: string
}

const maxName = 80
const maxUrl = 300
const maxNotes = 2000
const maxPence = 999_999

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

export async function GET(request: Request) {
  const gate = await requireAdmin(request)
  if (!gate.ok) return gate.error

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

export async function POST(request: Request) {
  const gate = await requireAdmin(request)
  if (!gate.ok) return gate.error

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
  if (
    priceLowPence != null &&
    priceHighPence != null &&
    priceLowPence > priceHighPence
  ) {
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
        ${gate.email}
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
