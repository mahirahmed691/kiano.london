import { clerkUserIdFrom } from './_lib/clerk.js'
import { withDb } from './_lib/db.js'
import { asLetterKind, asLetterStatus, storedNamedFor } from '../src/lib/letters.js'
import { asTrackingHref, asWorkStage, dispatchLine, isFullyReturned } from '../src/lib/work.js'

type OrderRow = {
  id: string
  email: string
  status: string
  stage: string | null
  amount_pence: number
  refunded_pence: number
  currency: string
  carrier: string | null
  tracking: string | null
  tracking_href: string | null
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
      SELECT id, email, status, stage, amount_pence, refunded_pence, currency,
             carrier, tracking, tracking_href, created_at
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

    const letterRows = email
      ? ((await sql`
          SELECT id, kind, status, named_for, reply, product_id, size, reference, created_at
          FROM appointments
          WHERE lower(email) = lower(${email})
          ORDER BY created_at DESC
          LIMIT 20
        `) as {
          id: number
          kind: string | null
          status: string | null
          named_for: string | Date | null
          reply: string | null
          product_id: string | null
          size: number | null
          reference: string | null
          created_at: string | Date
        }[])
      : []

    return Response.json({
      orders: orders.map((order) => ({
        id: order.id,
        email: order.email,
        status: order.status,
        stage: asWorkStage(order.stage),
        amountPence: order.amount_pence,
        refundedPence: order.refunded_pence ?? 0,
        returned: isFullyReturned(order.amount_pence, order.refunded_pence ?? 0),
        currency: order.currency,
        carrier: order.carrier ?? '',
        tracking: order.tracking ?? '',
        trackingHref: asTrackingHref(order.tracking_href ?? ''),
        dispatch: dispatchLine(order.carrier ?? '', order.tracking ?? ''),
        createdAt: order.created_at,
        lines: (linesByOrder.get(order.id) ?? []).map((line) => ({
          productId: line.product_id,
          size: line.size,
          quantity: line.quantity,
          amountPence: line.amount_pence,
          description: line.description,
        })),
      })),
      letters: letterRows.map((row) => ({
        id: row.id,
        kind: asLetterKind(row.kind),
        status: asLetterStatus(row.status),
        namedFor: storedNamedFor(row.named_for),
        reply: row.reply ?? '',
        productId: row.product_id ?? '',
        size: row.size,
        reference: row.reference ?? '',
        createdAt:
          row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not read your reservations.' }, { status: 503 })
  }
}
