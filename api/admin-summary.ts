import { requireAdmin } from './_lib/admin.ts'
import { withDb } from './_lib/db.ts'

function asCount(rows: { n?: string | number | bigint }[]) {
  const value = rows[0]?.n
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  return 0
}

export async function GET(request: Request): Promise<Response> {
  const gate = await requireAdmin(request)
  if (!gate.ok) return gate.error

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
