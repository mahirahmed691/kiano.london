import { clerkUserIdFrom } from './_lib/clerk.ts'
import { withDb } from './_lib/db.ts'

type OrderRow = {
  id: string
  email: string
  status: string
  amount_pence: number
  currency: string
  created_at: string
}

type LineRow = {
  order_id: string
  product_id: string
  size: number
  quantity: number
  amount_pence: number
  description: string
}

export async function GET(request: Request) {
  const clerkUserId = await clerkUserIdFrom(request)
  if (!clerkUserId) {
    return Response.json({ error: 'Sign in to see your reservations.' }, { status: 401 })
  }

  try {
    const sql = await withDb()
    const member = (await sql`
      SELECT email FROM members WHERE clerk_user_id = ${clerkUserId}
    `) as { email: string }[]
    const email = member[0]?.email

    if (email) {
      await sql`
        UPDATE orders
        SET clerk_user_id = ${clerkUserId}
        WHERE clerk_user_id IS NULL AND lower(email) = lower(${email})
      `
    }

    const orders = (await sql`
      SELECT id, email, status, amount_pence, currency, created_at
      FROM orders
      WHERE clerk_user_id = ${clerkUserId}
      ORDER BY created_at DESC
    `) as OrderRow[]

    const lines = (await sql`
      SELECT l.order_id, l.product_id, l.size, l.quantity, l.amount_pence, l.description
      FROM order_lines l
      INNER JOIN orders o ON o.id = l.order_id
      WHERE o.clerk_user_id = ${clerkUserId}
    `) as LineRow[]

    const linesByOrder = new Map<string, LineRow[]>()
    for (const line of lines) {
      const current = linesByOrder.get(line.order_id) ?? []
      current.push(line)
      linesByOrder.set(line.order_id, current)
    }

    return Response.json({
      orders: orders.map((order) => ({
        id: order.id,
        email: order.email,
        status: order.status,
        amountPence: order.amount_pence,
        currency: order.currency,
        createdAt: order.created_at,
        lines: (linesByOrder.get(order.id) ?? []).map((line) => ({
          productId: line.product_id,
          size: line.size,
          quantity: line.quantity,
          amountPence: line.amount_pence,
          description: line.description,
        })),
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not read your reservations.' }, { status: 503 })
  }
}
