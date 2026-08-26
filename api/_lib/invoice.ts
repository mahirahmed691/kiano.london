import type { NeonQueryFunction } from '@neondatabase/serverless'
import { site } from '../../src/data/site.ts'
import type { LedgerInvoice } from '../../src/lib/ledger.ts'
import { splitVat } from '../../src/lib/vat.ts'

type Sql = NeonQueryFunction<false, false>

type OrderRow = {
  id: string
  email: string
  status: string
  amount_pence: number
  currency: string
  shipping: LedgerInvoice['shipping'] | string | null
  created_at: string | Date
}

type LineRow = {
  product_id: string
  size: number
  quantity: number
  amount_pence: number
  description: string
}

type InvoiceRow = {
  id: number
  number: string
  order_id: string
  email: string
  customer_name: string | null
  issued_at: string | Date
  net_pence: number
  vat_pence: number
  gross_pence: number
  currency: string
  shipping: LedgerInvoice['shipping'] | string | null
}

function asIso(value: string | Date) {
  return value instanceof Date ? value.toISOString() : String(value)
}

function asShipping(value: InvoiceRow['shipping']): LedgerInvoice['shipping'] {
  if (!value) return null
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as LedgerInvoice['shipping']
    } catch {
      return null
    }
  }
  return value
}

function customerNameFrom(shipping: LedgerInvoice['shipping'], email: string) {
  return shipping?.name?.trim() || email
}

async function nextInvoiceNumber(sql: Sql, year: number) {
  await sql`
    INSERT INTO invoice_counters (year, last_n)
    VALUES (${year}, 0)
    ON CONFLICT (year) DO NOTHING
  `
  const rows = (await sql`
    UPDATE invoice_counters
    SET last_n = last_n + 1
    WHERE year = ${year}
    RETURNING last_n
  `) as { last_n: number }[]
  const n = rows[0]?.last_n ?? 1
  return `KL-${year}-${String(n).padStart(4, '0')}`
}

export async function loadInvoice(
  sql: Sql,
  lookup: { orderId?: string; number?: string; id?: number },
): Promise<LedgerInvoice | null> {
  const rows = lookup.orderId
    ? ((await sql`
        SELECT id, number, order_id, email, customer_name, issued_at,
               net_pence, vat_pence, gross_pence, currency, shipping
        FROM invoices
        WHERE order_id = ${lookup.orderId}
      `) as InvoiceRow[])
    : lookup.number
      ? ((await sql`
          SELECT id, number, order_id, email, customer_name, issued_at,
                 net_pence, vat_pence, gross_pence, currency, shipping
          FROM invoices
          WHERE number = ${lookup.number}
        `) as InvoiceRow[])
      : lookup.id != null
        ? ((await sql`
            SELECT id, number, order_id, email, customer_name, issued_at,
                   net_pence, vat_pence, gross_pence, currency, shipping
            FROM invoices
            WHERE id = ${lookup.id}
          `) as InvoiceRow[])
        : []

  const row = rows[0]
  if (!row) return null

  const lines = (await sql`
    SELECT product_id, size, quantity, description, net_pence, vat_pence, gross_pence
    FROM invoice_lines
    WHERE invoice_id = ${row.id}
    ORDER BY id
  `) as {
    product_id: string
    size: number
    quantity: number
    description: string
    net_pence: number
    vat_pence: number
    gross_pence: number
  }[]

  return {
    id: row.id,
    number: row.number,
    orderId: row.order_id,
    email: row.email,
    customerName: row.customer_name ?? row.email,
    issuedAt: asIso(row.issued_at),
    netPence: row.net_pence,
    vatPence: row.vat_pence,
    grossPence: row.gross_pence,
    currency: row.currency,
    shipping: asShipping(row.shipping),
    lines: lines.map((line) => ({
      productId: line.product_id,
      size: line.size,
      quantity: line.quantity,
      description: line.description,
      netPence: line.net_pence,
      vatPence: line.vat_pence,
      grossPence: line.gross_pence,
    })),
  }
}

export async function ensureInvoiceForOrder(sql: Sql, orderId: string): Promise<LedgerInvoice | null> {
  const existing = await loadInvoice(sql, { orderId })
  if (existing) return existing

  const orders = (await sql`
    SELECT id, email, status, amount_pence, currency, shipping, created_at
    FROM orders
    WHERE id = ${orderId} AND status = 'paid'
  `) as OrderRow[]
  const order = orders[0]
  if (!order) return null

  const orderLines = (await sql`
    SELECT product_id, size, quantity, amount_pence, description
    FROM order_lines
    WHERE order_id = ${orderId}
    ORDER BY id
  `) as LineRow[]

  const shipping = asShipping(order.shipping)
  const split = splitVat(order.amount_pence)
  const year = new Date(asIso(order.created_at)).getUTCFullYear() || new Date().getUTCFullYear()
  const number = await nextInvoiceNumber(sql, year)
  const name = customerNameFrom(shipping, order.email)

  const inserted = (await sql`
    INSERT INTO invoices (
      number, order_id, email, customer_name, issued_at,
      net_pence, vat_pence, gross_pence, currency, shipping
    )
    VALUES (
      ${number},
      ${order.id},
      ${order.email},
      ${name},
      ${asIso(order.created_at)},
      ${split.netPence},
      ${split.vatPence},
      ${split.grossPence},
      ${order.currency},
      ${shipping ? JSON.stringify(shipping) : null}::jsonb
    )
    ON CONFLICT (order_id) DO NOTHING
    RETURNING id
  `) as { id: number }[]

  if (inserted.length === 0) {
    return loadInvoice(sql, { orderId })
  }

  const invoiceId = inserted[0]!.id
  for (const line of orderLines) {
    const lineSplit = splitVat(line.amount_pence)
    await sql`
      INSERT INTO invoice_lines (
        invoice_id, product_id, size, quantity, description, net_pence, vat_pence, gross_pence
      )
      VALUES (
        ${invoiceId},
        ${line.product_id},
        ${line.size},
        ${line.quantity},
        ${line.description},
        ${lineSplit.netPence},
        ${lineSplit.vatPence},
        ${lineSplit.grossPence}
      )
    `
  }

  return loadInvoice(sql, { orderId })
}

export function invoicePublicView(invoice: LedgerInvoice) {
  return {
    ...invoice,
    house: {
      name: site.fullName,
      address: site.address,
      email: site.email,
      telephone: site.telephone,
    },
  }
}
