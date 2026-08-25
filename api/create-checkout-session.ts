import Stripe from 'stripe'
import { getProduct, thobeSizes } from '../src/data/products.ts'
import {
  parseCheckoutDetails,
  shippingCountryCodes,
  type CheckoutDetails,
} from '../src/data/shipping.ts'
import { clerkUserIdFrom } from './_lib/clerk.ts'
import { assertStock, StockError } from './_lib/stock.ts'

type BasketItem = {
  productId: string
  size: number
  quantity: number
}

function originFrom(request: Request) {
  const fromHeader = request.headers.get('origin')?.replace(/\/$/, '')
  if (fromHeader) return fromHeader
  const configured = process.env.SITE_URL?.replace(/\/$/, '')
  if (configured) return configured
  return new URL(request.url).origin
}

function stripeAddress(details: CheckoutDetails) {
  return {
    line1: details.line1,
    line2: details.line2 || undefined,
    city: details.city,
    state: details.region || undefined,
    postal_code: details.postalCode,
    country: details.country,
  }
}

async function upsertCustomer(stripe: Stripe, details: CheckoutDetails) {
  const existing = await stripe.customers.list({ email: details.email, limit: 1 })
  const payload: Stripe.CustomerCreateParams = {
    name: details.name,
    email: details.email,
    phone: details.telephone,
    address: stripeAddress(details),
    shipping: {
      name: details.name,
      phone: details.telephone,
      address: stripeAddress(details),
    },
    metadata: details.note ? { note: details.note } : undefined,
  }

  if (existing.data[0]) {
    return stripe.customers.update(existing.data[0].id, payload)
  }

  return stripe.customers.create(payload)
}

export async function POST(request: Request) {
  try {
    return await createSession(request)
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The payment page could not be opened.' }, { status: 500 })
  }
}

async function createSession(request: Request) {
  let body: { items?: BasketItem[]; details?: unknown }
  try {
    body = (await request.json()) as { items?: BasketItem[]; details?: unknown }
  } catch {
    return Response.json({ error: 'The bag could not be read.' }, { status: 400 })
  }

  const parsed = parseCheckoutDetails(body.details)
  if ('error' in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }
  const details = parsed.details

  const items = body.items ?? []
  if (items.length === 0) {
    return Response.json({ error: 'The bag is empty.' }, { status: 400 })
  }

  const origin = originFrom(request)
  const allowed = new Set<number>(thobeSizes)
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  const summary: string[] = []
  const stockLines: { productId: string; size: number; quantity: number }[] = []

  for (const item of items) {
    const product = getProduct(item.productId)
    const quantity = Math.min(4, Math.max(1, Number(item.quantity) || 0))
    const size = Number(item.size)
    if (!product || quantity < 1 || !allowed.has(size)) {
      return Response.json({ error: 'A line in the bag is not valid.' }, { status: 400 })
    }

    const name = `${product.name}${product.cut === 'Jubbah' ? ` · ${product.colour}` : ''} · ${size}`
    summary.push(`${name} × ${quantity}`)
    stockLines.push({ productId: product.id, size, quantity })

    const imageUrl = origin.startsWith('https') ? `${origin}${product.image}` : undefined

    lineItems.push({
      quantity,
      price_data: {
        currency: 'gbp',
        unit_amount: product.pricePence,
        product_data: {
          name,
          description: `${product.colour}. ${product.cloth}. Made to order in London.`,
          metadata: {
            product_id: product.id,
            size: String(size),
          },
          ...(imageUrl ? { images: [imageUrl] } : {}),
        },
      },
    })
  }

  try {
    await assertStock(stockLines)
  } catch (caught) {
    if (caught instanceof StockError) {
      return Response.json({ error: caught.message }, { status: 409 })
    }
    console.error(caught)
    return Response.json({ error: 'Remaining cuts could not be read.' }, { status: 503 })
  }

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret || secret === 'undefined') {
    return Response.json(
      { error: 'Payment is not configured. Add STRIPE_SECRET_KEY to the environment.' },
      { status: 503 },
    )
  }

  const clerkUserId = await clerkUserIdFrom(request)

  const stripe = new Stripe(secret)

  try {
    const customer = await upsertCustomer(stripe, details)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customer.id,
      customer_update: {
        address: 'auto',
        name: 'auto',
        shipping: 'auto',
      },
      line_items: lineItems,
      success_url: `${origin}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      locale: 'en-GB',
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: [...shippingCountryCodes],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Carriage, made to order',
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'gbp' },
            delivery_estimate: {
              minimum: { unit: 'week', value: 4 },
              maximum: { unit: 'week', value: 8 },
            },
          },
        },
      ],
      invoice_creation: { enabled: true },
      allow_promotion_codes: true,
      integration_identifier: 'kiano_bag_xhwpqelm',
      custom_text: {
        submit: {
          message: 'Payment reserves the cut. Cloth is cut in four to eight weeks.',
        },
        shipping_address: {
          message: 'Confirm where the finished piece should be sent.',
        },
      },
      client_reference_id: clerkUserId ?? undefined,
      metadata: {
        name: details.name,
        email: details.email,
        telephone: details.telephone,
        note: details.note,
        country: details.country,
        clerk_user_id: clerkUserId ?? '',
      },
      payment_intent_data: {
        description: `Kiano London. ${summary.join('; ')}`.slice(0, 1000),
        metadata: {
          note: details.note,
        },
      },
    })

    if (!session.url) {
      return Response.json({ error: 'Stripe did not return a payment page.' }, { status: 502 })
    }

    return Response.json({ url: session.url })
  } catch (caught) {
    console.error(caught)
    const connection =
      caught instanceof Error &&
      (caught.name === 'StripeConnectionError' || caught.message.includes('connection to Stripe'))
    return Response.json(
      {
        error: connection
          ? 'Payment could not be reached. Try again in a moment.'
          : 'Stripe could not open a payment page.',
      },
      { status: 502 },
    )
  }
}
