import type Stripe from 'stripe'
import { thobeSizes } from '../../src/data/products.ts'
import { withDb } from './db.ts'
import { ensureInvoiceForOrder } from './invoice.ts'

const allowedSizes = new Set<number>(thobeSizes)

type FulfillLine = {
  productId: string
  size: number
  quantity: number
  amount: number
  description: string
}

function asRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') return {}
  const record: Record<string, string> = {}
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'string') record[key] = entry
  }
  return record
}

function productMetadata(line: Stripe.LineItem) {
  const product = line.price?.product
  if (!product || typeof product === 'string' || product.deleted) return {}
  return asRecord(product.metadata)
}

function linesFromSession(session: Stripe.Checkout.Session): FulfillLine[] {
  return (session.line_items?.data ?? []).flatMap((line) => {
    const metadata = productMetadata(line)
    const size = Number(metadata.size)
    const productId = metadata.product_id
    if (!productId || !allowedSizes.has(size)) return []
    return [
      {
        productId,
        size,
        quantity: Math.max(1, line.quantity ?? 1),
        amount: line.amount_total ?? 0,
        description: line.description ?? productId,
      },
    ]
  })
}

function shippingJson(session: Stripe.Checkout.Session) {
  const collected = session.collected_information?.shipping_details
  const address = collected?.address ?? session.customer_details?.address
  if (!address) return null
  return {
    name: collected?.name ?? session.customer_details?.name ?? null,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    region: address.state,
    postalCode: address.postal_code,
    country: address.country,
  }
}

export async function fulfillPaidSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    return
  }

  const email = (
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.email ??
    ''
  ).trim()
  if (!email) return

  const clerkUserId =
    session.metadata?.clerk_user_id?.trim() || session.client_reference_id?.trim() || null
  const name = session.customer_details?.name ?? session.metadata?.name ?? null
  const shipping = shippingJson(session)
  const sql = await withDb()

  const claimed = (await sql`
    INSERT INTO orders (
      id, clerk_user_id, email, status, amount_pence, currency, shipping, note
    )
    VALUES (
      ${session.id},
      ${clerkUserId},
      ${email},
      'paid',
      ${session.amount_total ?? 0},
      ${session.currency ?? 'gbp'},
      ${shipping ? JSON.stringify(shipping) : null}::jsonb,
      ${session.metadata?.note || null}
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  `) as { id: string }[]

  if (claimed.length === 0) {
    try {
      await ensureInvoiceForOrder(sql, session.id)
    } catch (caught) {
      console.error(caught)
    }
    return
  }

  for (const line of linesFromSession(session)) {
    await sql`
      INSERT INTO order_lines (
        order_id, product_id, size, quantity, amount_pence, description
      )
      VALUES (
        ${session.id},
        ${line.productId},
        ${line.size},
        ${line.quantity},
        ${line.amount},
        ${line.description}
      )
    `
    const remaining = (await sql`
      UPDATE inventory
      SET quantity = GREATEST(0, quantity - ${line.quantity})
      WHERE product_id = ${line.productId} AND size = ${line.size}
      RETURNING quantity
    `) as { quantity: number }[]
    await sql`
      INSERT INTO stock_movements (
        product_id, size, kind, quantity_delta, quantity_after, note, admin_email, order_id
      )
      VALUES (
        ${line.productId},
        ${line.size},
        'sale',
        ${-line.quantity},
        ${remaining[0]?.quantity ?? 0},
        '',
        '',
        ${session.id}
      )
    `
  }

  try {
    await ensureInvoiceForOrder(sql, session.id)
  } catch (caught) {
    console.error(caught)
  }

  if (clerkUserId) {
    await sql`
      INSERT INTO members (clerk_user_id, email, name)
      VALUES (${clerkUserId}, ${email}, ${name})
      ON CONFLICT (clerk_user_id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, members.name)
    `
    await sql`
      UPDATE orders
      SET clerk_user_id = ${clerkUserId}
      WHERE clerk_user_id IS NULL AND lower(email) = lower(${email})
    `
  }
}
