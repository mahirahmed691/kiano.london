import { getProduct, productLineName, products, thobeSizes } from '../src/data/products.js'
import { vatMethodNote, splitVat } from '../src/lib/vat.js'
import { requireAdmin } from './_lib/admin.js'
import { withDb } from './_lib/db.js'
import { recordNotice } from './_lib/notices.js'
import {
  returnAgreedLetterHtml,
  returnAgreedLetterText,
  returnRefusedLetterHtml,
  returnRefusedLetterText,
  sendMail,
  visitNamedLetterHtml,
  visitNamedLetterText,
  visitRefusedLetterHtml,
  visitRefusedLetterText,
  workBackLetterHtml,
  workBackLetterText,
  workWeekLetterHtml,
  workWeekLetterText,
} from './_lib/mail.js'
import { ensureInvoiceForOrder, invoicePublicView, loadInvoice } from './_lib/invoice.js'
import { asLetterKind, asLetterReply, asLetterStatus, asNamedDay, formatNamedDay, isLetterStatus, storedNamedFor } from '../src/lib/letters.js'
import { asCarrier, asNamedWeek, asTrackingCode, asTrackingHref, asWorkReason, asWorkStage, dispatchLine, formatNamedWeek, isFullyReturned, isWorkBackwards, isWorkStage, workCopy } from '../src/lib/work.js'

type Method = 'GET' | 'POST'
type Section =
  | 'summary'
  | 'inventory'
  | 'competitors'
  | 'prices'
  | 'accounts'
  | 'orders'
  | 'invoices'
  | 'diary'
  | 'members'
  | 'list'
  | 'work'

const sections = new Set<Section>([
  'summary',
  'inventory',
  'competitors',
  'prices',
  'accounts',
  'orders',
  'invoices',
  'diary',
  'members',
  'list',
  'work',
])

const allowedSizes = new Set<number>(thobeSizes)
const maxQuantity = 999
const maxName = 80
const maxUrl = 300
const maxNotes = 2000
const maxPence = 999_999

type NoteRow = {
  id: number
  name: string
  url: string
  notes: string
  price_low_pence: number | null
  price_high_pence: number | null
  created_at: string
}

function sectionOf(request: Request): Section | null {
  const url = new URL(request.url)
  const section = url.searchParams.get('section')
  if (section && sections.has(section as Section)) return section as Section
  const path = url.pathname.replace(/\/$/, '')
  if (path.endsWith('/admin-inventory')) return 'inventory'
  if (path.endsWith('/admin-competitors')) return 'competitors'
  if (path.endsWith('/admin-summary') || path.endsWith('/admin')) return 'summary'
  return null
}

function asIso(value: string | Date) {
  return value instanceof Date ? value.toISOString() : String(value)
}

function asCount(rows: { n?: string | number | bigint }[]) {
  const value = rows[0]?.n
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  return 0
}

function asText(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function asPence(value: unknown) {
  if (value === '' || value === undefined || value === null) return null
  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isInteger(amount) || amount < 0 || amount > maxPence) return undefined
  return amount
}

function parseHttpUrl(raw: string) {
  if (!raw) return ''
  try {
    const url = new URL(raw)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString().slice(0, maxUrl)
  } catch {
    return null
  }
}

function asNote(row: NoteRow) {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    notes: row.notes,
    priceLowPence: row.price_low_pence,
    priceHighPence: row.price_high_pence,
    createdAt: row.created_at,
  }
}

async function getSummary(): Promise<Response> {
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
        SELECT COALESCE(SUM(GREATEST(0, amount_pence - refunded_pence)), 0)::int AS n
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
    const newLetters = asCount(
      (await sql`SELECT COUNT(*)::int AS n FROM appointments WHERE status = 'new'`) as {
        n: number
      }[],
    )
    const workCloth = asCount(
      (await sql`
        SELECT COUNT(*)::int AS n FROM orders
        WHERE status = 'paid' AND stage = 'cloth' AND refunded_pence < amount_pence
      `) as { n: number }[],
    )
    const workCutting = asCount(
      (await sql`
        SELECT COUNT(*)::int AS n FROM orders
        WHERE status = 'paid' AND stage = 'cutting' AND refunded_pence < amount_pence
      `) as { n: number }[],
    )
    const workPacked = asCount(
      (await sql`
        SELECT COUNT(*)::int AS n FROM orders
        WHERE status = 'paid' AND stage = 'packed' AND refunded_pence < amount_pence
      `) as { n: number }[],
    )
    const workSent = asCount(
      (await sql`
        SELECT COUNT(*)::int AS n FROM orders
        WHERE status = 'paid' AND stage = 'sent' AND refunded_pence < amount_pence
      `) as { n: number }[],
    )
    const heldCutRows = (await sql`
      SELECT product_id, size
      FROM inventory
      WHERE quantity <= 0
      ORDER BY product_id, size
    `) as { product_id: string; size: number }[]
    const appointmentRows = (await sql`
      SELECT id, name, email, telephone, product_id, size, note, status, kind, reference,
             named_for, reply, created_at
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
      status: string | null
      kind: string | null
      reference: string | null
      named_for: string | Date | null
      reply: string | null
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
      newLetters,
      workCloth,
      workCutting,
      workPacked,
      workSent,
      heldCuts: heldCutRows.map((row) => ({
        productId: row.product_id,
        size: row.size,
      })),
      appointments: appointmentRows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        telephone: row.telephone ?? '',
        productId: row.product_id ?? '',
        size: row.size,
        note: row.note ?? '',
        kind: asLetterKind(row.kind),
        reference: row.reference ?? '',
        status: asLetterStatus(row.status),
        namedFor: storedNamedFor(row.named_for),
        reply: row.reply ?? '',
        createdAt: asIso(row.created_at),
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The ledger could not be read.' }, { status: 503 })
  }
}

async function getInventory(): Promise<Response> {
  try {
    const sql = await withDb()
    const rows = (await sql`
      SELECT product_id, size, quantity
      FROM inventory
      ORDER BY product_id, size
    `) as { product_id: string; size: number; quantity: number }[]

    const movements = (await sql`
      SELECT id, product_id, size, kind, quantity_delta, quantity_after, note, admin_email, order_id, created_at
      FROM stock_movements
      ORDER BY created_at DESC, id DESC
      LIMIT 40
    `) as {
      id: number
      product_id: string
      size: number
      kind: string
      quantity_delta: number
      quantity_after: number
      note: string
      admin_email: string
      order_id: string | null
      created_at: string | Date
    }[]

    return Response.json({
      cuts: rows.map((row) => ({
        productId: row.product_id,
        size: row.size,
        quantity: row.quantity,
      })),
      movements: movements.map((row) => ({
        id: row.id,
        productId: row.product_id,
        size: row.size,
        kind: row.kind,
        quantityDelta: row.quantity_delta,
        quantityAfter: row.quantity_after,
        note: row.note,
        adminEmail: row.admin_email,
        orderId: row.order_id ?? '',
        createdAt: asIso(row.created_at),
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not read remaining cuts.' }, { status: 503 })
  }
}

async function postInventory(request: Request, email: string): Promise<Response> {
  let body: { productId?: unknown; size?: unknown; quantity?: unknown; note?: unknown }
  try {
    body = (await request.json()) as typeof body
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

  const requested = Number(body.quantity)
  if (!Number.isInteger(requested) || requested > maxQuantity) {
    return Response.json({ error: 'A whole number of remaining cuts is needed.' }, { status: 400 })
  }

  const note = asText(body.note, 400)
  if (requested < 0 && !note) {
    return Response.json(
      { error: 'A note is needed to take a cut below none.' },
      { status: 400 },
    )
  }

  const quantity = Math.max(0, requested)
  const kind = requested < 0 ? 'adjust' : undefined

  try {
    const sql = await withDb()
    const current = (await sql`
      SELECT quantity FROM inventory
      WHERE product_id = ${productId} AND size = ${size}
    `) as { quantity: number }[]
    const before = current[0]?.quantity
    if (before == null) {
      return Response.json({ error: 'This cut is not on the line.' }, { status: 404 })
    }

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

    const delta = row.quantity - before
    if (delta !== 0) {
      const movementKind = kind ?? (delta > 0 ? 'restock' : 'adjust')
      await sql`
        INSERT INTO stock_movements (
          product_id, size, kind, quantity_delta, quantity_after, note, admin_email
        )
        VALUES (
          ${productId},
          ${size},
          ${movementKind},
          ${delta},
          ${row.quantity},
          ${note},
          ${email}
        )
      `
      const piece = getProduct(productId)
      const cutName = piece ? productLineName(piece) : productId
      if (before > 0 && row.quantity <= 0) {
        await recordNotice({
          audience: 'admin',
          kind: 'cut',
          title: 'A size is held at none',
          body: `${cutName}, size ${size} is no longer on the line.`,
          href: '/admin/cuts',
          productIds: [productId],
        })
      } else if (before <= 0 && row.quantity > 0) {
        await recordNotice({
          audience: 'admin',
          kind: 'cut',
          title: 'A size is back on the line',
          body: `${cutName}, size ${size} · ${row.quantity} remaining.`,
          href: '/admin/cuts',
          productIds: [productId],
        })
      }
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

async function getCompetitors(): Promise<Response> {
  try {
    const sql = await withDb()
    const rows = (await sql`
      SELECT id, name, url, notes, price_low_pence, price_high_pence, created_at
      FROM competitor_notes
      ORDER BY created_at DESC, id DESC
    `) as NoteRow[]

    return Response.json({ notes: rows.map(asNote) })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The field could not be read.' }, { status: 503 })
  }
}

async function postCompetitors(request: Request, email: string): Promise<Response> {
  let body: {
    name?: unknown
    url?: unknown
    notes?: unknown
    priceLowPence?: unknown
    priceHighPence?: unknown
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'The house could not be read.' }, { status: 400 })
  }

  const name = asText(body.name, maxName)
  if (!name) {
    return Response.json({ error: 'A name is needed.' }, { status: 400 })
  }

  const parsedUrl = parseHttpUrl(asText(body.url, maxUrl))
  if (parsedUrl == null) {
    return Response.json({ error: 'A web address must start with http or https.' }, { status: 400 })
  }

  const notes = asText(body.notes, maxNotes)
  const priceLowPence = asPence(body.priceLowPence)
  const priceHighPence = asPence(body.priceHighPence)
  if (priceLowPence === undefined || priceHighPence === undefined) {
    return Response.json({ error: 'Price is whole pence, or left empty.' }, { status: 400 })
  }
  if (priceLowPence != null && priceHighPence != null && priceLowPence > priceHighPence) {
    return Response.json({ error: 'The low price cannot sit above the high.' }, { status: 400 })
  }

  try {
    const sql = await withDb()
    const rows = (await sql`
      INSERT INTO competitor_notes (name, url, notes, price_low_pence, price_high_pence, created_by)
      VALUES (
        ${name},
        ${parsedUrl},
        ${notes},
        ${priceLowPence},
        ${priceHighPence},
        ${email}
      )
      ON CONFLICT (name) DO UPDATE SET
        url = EXCLUDED.url,
        notes = EXCLUDED.notes,
        price_low_pence = EXCLUDED.price_low_pence,
        price_high_pence = EXCLUDED.price_high_pence
      RETURNING id, name, url, notes, price_low_pence, price_high_pence, created_at
    `) as NoteRow[]

    const row = rows[0]
    if (!row) {
      return Response.json({ error: 'The house could not be kept.' }, { status: 500 })
    }

    return Response.json({ ok: true, note: asNote(row) })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not keep that house.' }, { status: 503 })
  }
}

function getPrices(): Response {
  return Response.json({
    vatNote: vatMethodNote,
    source: 'The shop and Stripe read prices from the catalogue. This list is the same page.',
    prices: products.map((product) => {
      const split = splitVat(product.pricePence)
      return {
        productId: product.id,
        name: productLineName(product),
        cut: product.cut,
        colour: product.colour,
        pricePence: product.pricePence,
        ...split,
      }
    }),
  })
}

async function backfillInvoices() {
  const sql = await withDb()
  const missing = (await sql`
    SELECT o.id
    FROM orders o
    LEFT JOIN invoices i ON i.order_id = o.id
    WHERE o.status = 'paid' AND i.id IS NULL
    ORDER BY o.created_at
    LIMIT 80
  `) as { id: string }[]
  for (const row of missing) {
    try {
      await ensureInvoiceForOrder(sql, row.id)
    } catch (caught) {
      console.error(caught)
    }
  }
  return sql
}

async function getAccounts(): Promise<Response> {
  try {
    const sql = await backfillInvoices()
    const rows = (await sql`
      SELECT number, email, customer_name, issued_at, net_pence, vat_pence, gross_pence
      FROM invoices
      ORDER BY issued_at DESC, id DESC
      LIMIT 200
    `) as {
      number: string
      email: string
      customer_name: string | null
      issued_at: string | Date
      net_pence: number
      vat_pence: number
      gross_pence: number
    }[]

    const journal = rows.map((row) => ({
      date: asIso(row.issued_at),
      reference: row.number,
      description: `Sale · ${row.customer_name || row.email}`,
      email: row.email,
      netPence: row.net_pence,
      vatPence: row.vat_pence,
      grossPence: row.gross_pence,
    }))

    const allTime = journal.reduce(
      (sum, row) => ({
        netPence: sum.netPence + row.netPence,
        vatPence: sum.vatPence + row.vatPence,
        grossPence: sum.grossPence + row.grossPence,
        count: sum.count + 1,
      }),
      { netPence: 0, vatPence: 0, grossPence: 0, count: 0 },
    )

    const monthStart = new Date()
    monthStart.setUTCDate(1)
    monthStart.setUTCHours(0, 0, 0, 0)
    const month = journal
      .filter((row) => new Date(row.date) >= monthStart)
      .reduce(
        (sum, row) => ({
          netPence: sum.netPence + row.netPence,
          vatPence: sum.vatPence + row.vatPence,
          grossPence: sum.grossPence + row.grossPence,
          count: sum.count + 1,
        }),
        { netPence: 0, vatPence: 0, grossPence: 0, count: 0 },
      )

    const refundedPence = asCount(
      (await sql`
        SELECT COALESCE(SUM(refunded_pence), 0)::int AS n FROM orders WHERE status = 'paid'
      `) as { n: number }[],
    )

    return Response.json({
      vatNote: vatMethodNote,
      refunds:
        'A full return, once Stripe has refunded it, is written here and the size is put back on the line.',
      refundedPence,
      month,
      allTime,
      journal,
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The accounts could not be read.' }, { status: 503 })
  }
}

async function getOrders(): Promise<Response> {
  try {
    const sql = await backfillInvoices()
    const orders = (await sql`
      SELECT o.id, o.email, o.clerk_user_id, o.status, o.stage, o.amount_pence, o.refunded_pence,
             o.currency, o.carrier, o.tracking, o.tracking_href, o.ready_week, o.stage_note, o.created_at,
             i.number AS invoice_number
      FROM orders o
      LEFT JOIN invoices i ON i.order_id = o.id
      WHERE o.status = 'paid'
      ORDER BY o.created_at DESC
      LIMIT 80
    `) as {
      id: string
      email: string
      clerk_user_id: string | null
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
      created_at: string | Date
      invoice_number: string | null
    }[]

    const lines = (await sql`
      SELECT l.order_id, l.product_id, l.size, l.quantity, l.amount_pence, l.description
      FROM order_lines l
      INNER JOIN orders o ON o.id = l.order_id
      WHERE o.status = 'paid'
    `) as {
      order_id: string
      product_id: string
      size: number
      quantity: number
      amount_pence: number
      description: string
    }[]

    const linesByOrder = new Map<string, typeof lines>()
    for (const line of lines) {
      const current = linesByOrder.get(line.order_id) ?? []
      current.push(line)
      linesByOrder.set(line.order_id, current)
    }

    return Response.json({
      orders: orders.map((order) => ({
        id: order.id,
        email: order.email,
        clerkUserId: order.clerk_user_id ?? '',
        status: order.status,
        stage: asWorkStage(order.stage),
        amountPence: order.amount_pence,
        refundedPence: order.refunded_pence ?? 0,
        currency: order.currency,
        carrier: order.carrier ?? '',
        tracking: order.tracking ?? '',
        trackingHref: asTrackingHref(order.tracking_href ?? ''),
        readyWeek: storedNamedFor(order.ready_week),
        stageNote: order.stage_note ?? '',
        createdAt: asIso(order.created_at),
        invoiceNumber: order.invoice_number ?? '',
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
    return Response.json({ error: 'The reservations could not be read.' }, { status: 503 })
  }
}

async function getInvoices(request: Request): Promise<Response> {
  try {
    const sql = await backfillInvoices()
    const url = new URL(request.url)
    const raw = (url.searchParams.get('id') ?? url.searchParams.get('number') ?? '').trim()
    if (raw) {
      const numeric = Number(raw)
      const invoice =
        raw.startsWith('KL-')
          ? await loadInvoice(sql, { number: raw })
          : Number.isInteger(numeric) && numeric > 0
            ? await loadInvoice(sql, { id: numeric })
            : null
      if (!invoice) {
        return Response.json({ error: 'That record could not be found.' }, { status: 404 })
      }
      return Response.json({ invoice: invoicePublicView(invoice) })
    }

    const rows = (await sql`
      SELECT id, number, email, customer_name, issued_at, net_pence, vat_pence, gross_pence
      FROM invoices
      ORDER BY issued_at DESC, id DESC
      LIMIT 80
    `) as {
      id: number
      number: string
      email: string
      customer_name: string | null
      issued_at: string | Date
      net_pence: number
      vat_pence: number
      gross_pence: number
    }[]

    return Response.json({
      invoices: rows.map((row) => ({
        id: row.id,
        number: row.number,
        email: row.email,
        customerName: row.customer_name ?? row.email,
        issuedAt: asIso(row.issued_at),
        netPence: row.net_pence,
        vatPence: row.vat_pence,
        grossPence: row.gross_pence,
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The records could not be read.' }, { status: 503 })
  }
}

async function getMembers(): Promise<Response> {
  try {
    const sql = await withDb()
    const rows = (await sql`
      SELECT
        m.email,
        m.name,
        m.created_at,
        (
          SELECT COUNT(*)::int FROM orders o
          WHERE o.clerk_user_id = m.clerk_user_id AND o.status = 'paid'
        ) AS orders,
        (
          SELECT MAX(o.created_at) FROM orders o
          WHERE o.clerk_user_id = m.clerk_user_id AND o.status = 'paid'
        ) AS last_paid_at
      FROM members m
      ORDER BY m.created_at DESC
      LIMIT 200
    `) as {
      email: string
      name: string | null
      created_at: string | Date
      orders: number
      last_paid_at: string | Date | null
    }[]

    return Response.json({
      members: rows.map((row) => ({
        email: row.email,
        name: row.name ?? '',
        orders: Number(row.orders) || 0,
        lastPaidAt: row.last_paid_at ? asIso(row.last_paid_at) : '',
        createdAt: asIso(row.created_at),
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The members could not be read.' }, { status: 503 })
  }
}

async function getList(): Promise<Response> {
  try {
    const sql = await withDb()
    const rows = (await sql`
      SELECT email, confirmed, source, created_at, confirmed_at
      FROM subscribers
      ORDER BY confirmed DESC, created_at DESC
      LIMIT 400
    `) as {
      email: string
      confirmed: boolean
      source: string
      created_at: string | Date
      confirmed_at: string | Date | null
    }[]

    return Response.json({
      subscribers: rows.map((row) => ({
        email: row.email,
        confirmed: Boolean(row.confirmed),
        source: row.source,
        createdAt: asIso(row.created_at),
        confirmedAt: row.confirmed_at ? asIso(row.confirmed_at) : '',
      })),
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The list could not be read.' }, { status: 503 })
  }
}

async function postDiary(request: Request): Promise<Response> {
  let body: { id?: unknown; status?: unknown; namedFor?: unknown; reply?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'The letter could not be read.' }, { status: 400 })
  }

  const id = Number(body.id)
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: 'That letter is not held.' }, { status: 400 })
  }
  const requested = typeof body.status === 'string' ? body.status.trim() : ''
  if (!isLetterStatus(requested)) {
    return Response.json({ error: 'A letter is new, seen, named, or refused.' }, { status: 400 })
  }
  const status = requested
  const namedFor = asNamedDay(body.namedFor)
  const reply = asLetterReply(body.reply)

  try {
    const sql = await withDb()
    const held = (await sql`
      SELECT id, name, email, kind, status, product_id, reference
      FROM appointments
      WHERE id = ${id}
    `) as {
      id: number
      name: string
      email: string
      kind: string | null
      status: string | null
      product_id: string | null
      reference: string | null
    }[]
    const row = held[0]
    if (!row) {
      return Response.json({ error: 'That letter is not held.' }, { status: 404 })
    }

    const kind = asLetterKind(row.kind)
    const before = asLetterStatus(row.status)

    if ((status === 'new' || status === 'seen') && (before === 'named' || before === 'agreed' || before === 'refused')) {
      return Response.json({ error: 'The letter has already been answered.' }, { status: 400 })
    }
    if (status === 'named' && kind !== 'visit') {
      return Response.json({ error: 'A morning is named for a visit.' }, { status: 400 })
    }
    if (status === 'agreed' && kind !== 'return') {
      return Response.json({ error: 'A return is agreed, not a visit.' }, { status: 400 })
    }
    if (status === 'named' && !namedFor) {
      return Response.json({ error: 'A morning is needed.' }, { status: 400 })
    }

    const storedDay = status === 'named' ? namedFor : ''
    const storedReply = status === 'named' || status === 'refused' || status === 'agreed' ? reply : ''

    const updated = (await sql`
      UPDATE appointments
      SET
        status = ${status},
        named_for = ${storedDay || null},
        reply = ${storedReply}
      WHERE id = ${id}
      RETURNING id, status, named_for, reply
    `) as {
      id: number
      status: string
      named_for: string | Date | null
      reply: string | null
    }[]
    const kept = updated[0]
    if (!kept) {
      return Response.json({ error: 'That letter is not held.' }, { status: 404 })
    }

    if (status === 'named' || status === 'refused' || status === 'agreed') {
      const day = formatNamedDay(storedDay)
      if (status === 'named') {
        await sendMail({
          to: row.email,
          subject: 'A morning is named — Kiano London',
          text: visitNamedLetterText({ name: row.name, day, note: storedReply }),
          html: visitNamedLetterHtml({ name: row.name, day, note: storedReply }),
          idempotencyKey: `visit-named/${row.id}/${storedDay}`,
        })
      } else if (status === 'agreed') {
        await sendMail({
          to: row.email,
          subject: 'Send it back — Kiano London',
          text: returnAgreedLetterText({
            name: row.name,
            reference: row.reference ?? '',
            note: storedReply,
          }),
          html: returnAgreedLetterHtml({
            name: row.name,
            reference: row.reference ?? '',
            note: storedReply,
          }),
          idempotencyKey: `return-agreed/${row.id}`,
        })
      } else if (kind === 'return') {
        await sendMail({
          to: row.email,
          subject: 'The return cannot be taken — Kiano London',
          text: returnRefusedLetterText({
            name: row.name,
            reference: row.reference ?? '',
            note: storedReply,
          }),
          html: returnRefusedLetterHtml({
            name: row.name,
            reference: row.reference ?? '',
            note: storedReply,
          }),
          idempotencyKey: `return-refused/${row.id}`,
        })
      } else {
        await sendMail({
          to: row.email,
          subject: 'A morning cannot be kept — Kiano London',
          text: visitRefusedLetterText({ name: row.name, note: storedReply }),
          html: visitRefusedLetterHtml({ name: row.name, note: storedReply }),
          idempotencyKey: `visit-refused/${row.id}`,
        })
      }

      const members = (await sql`
        SELECT clerk_user_id FROM members WHERE lower(email) = lower(${row.email}) LIMIT 1
      `) as { clerk_user_id: string | null }[]
      const clerkUserId = members[0]?.clerk_user_id
      if (clerkUserId) {
        await recordNotice({
          audience: 'member',
          clerkUserId,
          kind: kind === 'return' ? 'return' : 'visit',
          title:
            status === 'named'
              ? 'A morning is named'
              : status === 'agreed'
                ? 'Send it back'
                : kind === 'return'
                  ? 'The return cannot be taken'
                  : 'A morning cannot be kept',
          body:
            status === 'named'
              ? `The house can keep the morning of ${day}.`
              : status === 'agreed'
                ? 'Send the piece back. This is not yet a refund.'
                : kind === 'return'
                  ? 'The house cannot take this return.'
                  : 'The house cannot keep a morning.',
          href: '/account',
          productIds: row.product_id ? [row.product_id] : undefined,
        })
      }
    }

    return Response.json({
      ok: true,
      id: kept.id,
      status: asLetterStatus(kept.status),
      namedFor: storedNamedFor(kept.named_for),
      reply: kept.reply ?? '',
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The diary could not be kept.' }, { status: 503 })
  }
}

async function postWork(request: Request): Promise<Response> {
  let body: {
    orderId?: unknown
    stage?: unknown
    carrier?: unknown
    tracking?: unknown
    trackingHref?: unknown
    readyWeek?: unknown
    reason?: unknown
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'The work could not be read.' }, { status: 400 })
  }

  const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : ''
  const stage = typeof body.stage === 'string' ? body.stage.trim() : ''
  if (!orderId) {
    return Response.json({ error: 'A reservation is needed.' }, { status: 400 })
  }
  if (!isWorkStage(stage)) {
    return Response.json({ error: 'That stage is not kept.' }, { status: 400 })
  }

  const carrier = stage === 'sent' ? asCarrier(typeof body.carrier === 'string' ? body.carrier : '') : ''
  const tracking = stage === 'sent' ? asTrackingCode(typeof body.tracking === 'string' ? body.tracking : '') : ''
  const trackingHref =
    stage === 'sent' ? asTrackingHref(typeof body.trackingHref === 'string' ? body.trackingHref : '') : ''
  const namedWeek = asNamedWeek(body.readyWeek)
  const reason = asWorkReason(body.reason)

  try {
    const sql = await withDb()
    const current = (await sql`
      SELECT id, stage, clerk_user_id, email, carrier, tracking, tracking_href,
             ready_week, stage_note, amount_pence, refunded_pence
      FROM orders
      WHERE id = ${orderId} AND status = 'paid'
    `) as {
      id: string
      stage: string
      clerk_user_id: string | null
      email: string
      carrier: string | null
      tracking: string | null
      tracking_href: string | null
      ready_week: string | Date | null
      stage_note: string | null
      amount_pence: number
      refunded_pence: number
    }[]
    const row = current[0]
    if (!row) {
      return Response.json({ error: 'That reservation is not held.' }, { status: 404 })
    }
    if (isFullyReturned(row.amount_pence, row.refunded_pence ?? 0)) {
      return Response.json({ error: 'That cut has been returned.' }, { status: 409 })
    }

    const before = asWorkStage(row.stage)
    const backwards = isWorkBackwards(before, stage)
    if (backwards && !reason) {
      return Response.json({ error: 'A reason is needed if the cut is held back.' }, { status: 400 })
    }

    const previousWeek = storedNamedFor(row.ready_week)
    if (body.readyWeek !== undefined && body.readyWeek !== '' && !namedWeek) {
      return Response.json({ error: 'A week is needed.' }, { status: 400 })
    }
    const storedWeek = namedWeek || previousWeek
    const weekChanged = Boolean(namedWeek) && namedWeek !== previousWeek
    const stageNote = backwards ? reason : ''
    const dispatchChanged =
      stage === 'sent' &&
      (asCarrier(row.carrier) !== carrier ||
        asTrackingCode(row.tracking) !== tracking ||
        asTrackingHref(row.tracking_href) !== trackingHref)

    if (before === stage && !dispatchChanged && !weekChanged && !backwards) {
      return Response.json({
        ok: true,
        orderId: row.id,
        stage,
        readyWeek: storedWeek,
        stageNote: row.stage_note ?? '',
      })
    }

    await sql`
      UPDATE orders
      SET
        stage = ${stage},
        carrier = ${carrier},
        tracking = ${tracking},
        tracking_href = ${trackingHref},
        ready_week = ${storedWeek || null},
        stage_note = ${backwards ? stageNote : before === stage ? (row.stage_note ?? '') : ''}
      WHERE id = ${orderId} AND status = 'paid'
    `

    const cuts = (
      (await sql`
        SELECT DISTINCT product_id FROM order_lines WHERE order_id = ${orderId}
      `) as { product_id: string }[]
    ).map((line) => line.product_id)

    if (row.clerk_user_id && (before !== stage || dispatchChanged || weekChanged)) {
      if (backwards) {
        await recordNotice({
          audience: 'member',
          clerkUserId: row.clerk_user_id,
          kind: 'work',
          title: 'The cut has been held back',
          body: reason,
          href: '/account',
          productIds: cuts,
        })
      } else if (before !== stage && stage !== 'reserved') {
        const copy = workCopy[stage]
        const bodyLine = stage === 'sent' ? dispatchLine(carrier, tracking) : copy.memberBody
        await recordNotice({
          audience: 'member',
          clerkUserId: row.clerk_user_id,
          kind: 'work',
          title: copy.memberTitle,
          body: bodyLine,
          href: '/account',
          productIds: cuts,
        })
      } else if (weekChanged) {
        const week = formatNamedWeek(namedWeek)
        await recordNotice({
          audience: 'member',
          clerkUserId: row.clerk_user_id,
          kind: 'work',
          title: 'A week is named',
          body: `The house names the week of ${week}.`,
          href: '/account',
          productIds: cuts,
        })
      }
    }

    if (backwards) {
      await sendMail({
        to: row.email,
        subject: 'The cut has been held back — Kiano London',
        text: workBackLetterText({ stage: workCopy[stage].line, reason }),
        html: workBackLetterHtml({ stage: workCopy[stage].line, reason }),
        idempotencyKey: `work-back/${row.id}/${before}/${stage}`,
      })
    } else if (weekChanged) {
      const week = formatNamedWeek(namedWeek)
      await sendMail({
        to: row.email,
        subject: 'A week is named — Kiano London',
        text: workWeekLetterText({ week }),
        html: workWeekLetterHtml({ week }),
        idempotencyKey: `work-week/${row.id}/${namedWeek}`,
      })
    }

    return Response.json({
      ok: true,
      orderId: row.id,
      stage,
      readyWeek: storedWeek,
      stageNote: backwards ? reason : before === stage ? (row.stage_note ?? '') : '',
    })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The work could not be kept.' }, { status: 503 })
  }
}

async function handle(request: Request, method: Method): Promise<Response> {
  const section = sectionOf(request)
  if (!section) {
    return Response.json({ error: 'This page of the ledger is not kept.' }, { status: 404 })
  }

  const gate = await requireAdmin(request)
  if (gate.ok === false) return gate.error

  if (method === 'GET') {
    if (section === 'summary') return getSummary()
    if (section === 'inventory') return getInventory()
    if (section === 'competitors') return getCompetitors()
    if (section === 'prices') return getPrices()
    if (section === 'accounts') return getAccounts()
    if (section === 'orders') return getOrders()
    if (section === 'invoices') return getInvoices(request)
    if (section === 'members') return getMembers()
    if (section === 'list') return getList()
    if (section === 'work') return getOrders()
    return Response.json({ error: 'This page of the ledger is written, not read.' }, { status: 405 })
  }

  if (section === 'inventory') return postInventory(request, gate.email)
  if (section === 'competitors') return postCompetitors(request, gate.email)
  if (section === 'diary') return postDiary(request)
  if (section === 'work') return postWork(request)
  return Response.json({ error: 'This page of the ledger is read only.' }, { status: 405 })
}

export async function GET(request: Request): Promise<Response> {
  return handle(request, 'GET')
}

export async function POST(request: Request): Promise<Response> {
  return handle(request, 'POST')
}
