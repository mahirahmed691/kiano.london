import { clerkUserIdFrom } from './_lib/clerk.js'
import { withDb } from './_lib/db.js'
import { asLetterKind, asLetterStatus, storedNamedFor } from '../src/lib/letters.js'
import { asTrackingHref, asWorkStage, dispatchLine, isFullyReturned } from '../src/lib/work.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const referencePattern = /^[A-Z0-9]{8,20}$/
const missing = 'That reservation could not be read.'

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
  ready_week: string | Date | null
  stage_note: string | null
  note: string | null
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

type LetterRow = {
  id: number
  kind: string | null
  status: string | null
  named_for: string | Date | null
  reply: string | null
  product_id: string | null
  size: number | null
  reference: string | null
  created_at: string | Date
}

function asText(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function publicOrder(order: OrderRow, lines: LineRow[]) {
  return {
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
    readyWeek: storedNamedFor(order.ready_week),
    stageNote: order.stage_note ?? '',
    note: order.note ?? '',
    dispatch: dispatchLine(order.carrier ?? '', order.tracking ?? ''),
    createdAt: order.created_at,
    lines: lines.map((line) => ({
      productId: line.product_id,
      size: line.size,
      quantity: line.quantity,
      amountPence: line.amount_pence,
      description: line.description,
    })),
  }
}

function publicLetter(row: LetterRow) {
  return {
    id: row.id,
    kind: asLetterKind(row.kind),
    status: asLetterStatus(row.status),
    namedFor: storedNamedFor(row.named_for),
    reply: row.reply ?? '',
    productId: row.product_id ?? '',
    size: row.size,
    reference: row.reference ?? '',
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  }
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
             carrier, tracking, tracking_href, ready_week, stage_note, note, created_at
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
        `) as LetterRow[])
      : []

    return Response.json({
      orders: orders.map((order) => publicOrder(order, linesByOrder.get(order.id) ?? [])),
      letters: letterRows.map(publicLetter),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not read your reservations.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  let body: { email?: unknown; reference?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: missing }, { status: 400 })
  }

  const email = asText(body.email, 160).toLowerCase()
  const reference = asText(body.reference, 20).replace(/[\s-]/g, '').toUpperCase()

  if (!emailPattern.test(email) || !referencePattern.test(reference)) {
    return Response.json({ error: 'The reservation and the email are needed.' }, { status: 400 })
  }

  const tail = reference.slice(-8)

  try {
    const sql = await withDb()
    const orders = (await sql`
      SELECT id, email, status, stage, amount_pence, refunded_pence, currency,
             carrier, tracking, tracking_href, ready_week, stage_note, note, created_at
      FROM orders
      WHERE lower(email) = ${email}
        AND (
          upper(right(id, 8)) = ${tail}
          OR upper(id) = ${reference}
        )
      ORDER BY created_at DESC
      LIMIT 1
    `) as OrderRow[]

    const order = orders[0]
    if (!order) {
      return Response.json({ error: missing }, { status: 404 })
    }

    const lines = (await sql`
      SELECT order_id, product_id, size, quantity, amount_pence, description
      FROM order_lines
      WHERE order_id = ${order.id}
    `) as LineRow[]

    const letterRows = (await sql`
      SELECT id, kind, status, named_for, reply, product_id, size, reference, created_at
      FROM appointments
      WHERE lower(email) = ${email}
        AND (
          upper(coalesce(reference, '')) = ${tail}
          OR upper(coalesce(reference, '')) = ${reference}
        )
      ORDER BY created_at DESC
      LIMIT 10
    `) as LetterRow[]

    return Response.json({
      orders: [publicOrder(order, lines)],
      letters: letterRows.map(publicLetter),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not read the reservation.' }, { status: 503 })
  }
}
