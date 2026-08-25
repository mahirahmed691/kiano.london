import { getProduct, thobeSizes } from '../src/data/products.ts'
import { withDb } from './_lib/db.ts'

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get('product_id') ?? ''
  if (!getProduct(productId)) {
    return Response.json({ error: 'This piece is not in the collection.' }, { status: 404 })
  }

  try {
    const sql = await withDb()
    const rows = (await sql`
      SELECT size, quantity
      FROM inventory
      WHERE product_id = ${productId}
    `) as { size: number; quantity: number }[]

    const sizes: Record<string, number> = {}
    for (const size of thobeSizes) sizes[String(size)] = 0
    for (const row of rows) sizes[String(row.size)] = row.quantity

    return Response.json({ productId, sizes })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not read remaining cuts.' }, { status: 503 })
  }
}
