import type Stripe from 'stripe'
import { getProduct, productLineName } from '../../src/data/products.js'
import { isFullyReturned } from '../../src/lib/work.js'
import { withDb } from './db.js'
import { recordNotice } from './notices.js'

type OrderRow = {
  id: string
  clerk_user_id: string | null
  email: string
  amount_pence: number
  refunded_pence: number
}

type LineRow = {
  product_id: string
  size: number
  quantity: number
  description: string
}

export async function applyChargeRefund(stripe: Stripe, charge: Stripe.Charge, eventId: string) {
  const refunded = Math.max(0, charge.amount_refunded ?? 0)
  if (refunded <= 0) return

  const paymentIntent =
    typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id
  if (!paymentIntent) return

  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent,
    limit: 1,
  })
  const sessionId = sessions.data[0]?.id
  const sql = await withDb()

  if (eventId) {
    const claimed = (await sql`
      INSERT INTO webhook_events (svix_id, event_type)
      VALUES (${eventId}, ${'charge.refunded'})
      ON CONFLICT (svix_id) DO NOTHING
      RETURNING svix_id
    `) as { svix_id: string }[]
    if (claimed.length === 0) return
  }

  if (!sessionId) return

  const current = (await sql`
    SELECT id, clerk_user_id, email, amount_pence, refunded_pence
    FROM orders
    WHERE id = ${sessionId} AND status = 'paid'
  `) as OrderRow[]
  const order = current[0]
  if (!order) return
  if (refunded <= order.refunded_pence) return

  const updated = (await sql`
    UPDATE orders
    SET refunded_pence = ${refunded}
    WHERE id = ${order.id} AND status = 'paid' AND refunded_pence < ${refunded}
    RETURNING id, clerk_user_id, email, amount_pence, refunded_pence
  `) as OrderRow[]
  const next = updated[0]
  if (!next) return

  const becameReturned =
    !isFullyReturned(order.amount_pence, order.refunded_pence) &&
    isFullyReturned(next.amount_pence, next.refunded_pence)

  if (becameReturned) {
    const lines = (await sql`
      SELECT product_id, size, quantity, description
      FROM order_lines
      WHERE order_id = ${order.id}
    `) as LineRow[]

    for (const line of lines) {
      const remaining = (await sql`
        UPDATE inventory
        SET quantity = quantity + ${line.quantity}
        WHERE product_id = ${line.product_id} AND size = ${line.size}
        RETURNING quantity
      `) as { quantity: number }[]
      const after = remaining[0]?.quantity
      if (after === undefined) continue

      await sql`
        INSERT INTO stock_movements (
          product_id, size, kind, quantity_delta, quantity_after, note, admin_email, order_id
        )
        VALUES (
          ${line.product_id},
          ${line.size},
          'restock',
          ${line.quantity},
          ${after},
          'return',
          '',
          ${order.id}
        )
      `

      const before = after - line.quantity
      if (before <= 0 && after > 0) {
        const piece = getProduct(line.product_id)
        const name = piece ? productLineName(piece) : line.description
        await recordNotice({
          audience: 'admin',
          kind: 'cut',
          title: 'A size is back on the line',
          body: `${name}, size ${line.size} · ${after} remaining.`,
          href: '/admin/cuts',
        })
      }
    }
  }

  const first = (
    (await sql`
      SELECT description FROM order_lines WHERE order_id = ${order.id} ORDER BY id LIMIT 1
    `) as { description: string }[]
  )[0]
  const cutName = first?.description || 'a cut'
  const full = isFullyReturned(next.amount_pence, next.refunded_pence)

  if (next.clerk_user_id) {
    await recordNotice({
      audience: 'member',
      clerkUserId: next.clerk_user_id,
      kind: 'return',
      title: full ? 'The till has been returned' : 'Part of the till has been returned',
      body: full
        ? `${cutName} is no longer held against the account.`
        : `${cutName} · a part of the reservation has been returned.`,
      href: '/account',
    })
  }

  await recordNotice({
    audience: 'admin',
    kind: 'return',
    title: full ? 'A cut has been returned' : 'A part of a cut has been returned',
    body: `${cutName} · ${next.email}`,
    href: '/admin/accounts',
  })
}
