import { getProduct } from '../../src/data/products.ts'
import { withDb } from './db.ts'

export class StockError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StockError'
  }
}

export type StockLine = {
  productId: string
  size: number
  quantity: number
}

export async function assertStock(items: StockLine[]) {
  const sql = await withDb()

  for (const item of items) {
    const rows = (await sql`
      SELECT quantity
      FROM inventory
      WHERE product_id = ${item.productId} AND size = ${item.size}
    `) as { quantity: number }[]
    const remaining = rows[0]?.quantity ?? 0
    if (remaining >= item.quantity) continue

    const product = getProduct(item.productId)
    const name = product?.name ?? 'This piece'
    if (remaining <= 0) {
      throw new StockError(`${name} in ${item.size} is held. Write to the atelier.`)
    }
    throw new StockError(
      remaining === 1
        ? `Only one ${name} in ${item.size} remains.`
        : `Only ${remaining} of ${name} in ${item.size} remain.`,
    )
  }
}
