import { getProduct, thobeSizes } from '../src/data/products.ts'
import { requireAdmin } from './_lib/admin.ts'
import { withDb } from './_lib/db.ts'

const allowedSizes = new Set<number>(thobeSizes)
const maxQuantity = 999

export async function GET(request: Request) {
  const gate = await requireAdmin(request)
  if (!gate.ok) return gate.error

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

export async function POST(request: Request) {
  const gate = await requireAdmin(request)
  if (!gate.ok) return gate.error

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
