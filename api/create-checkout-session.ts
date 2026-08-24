import Stripe from 'stripe'
import { getProduct, thobeSizes } from '../src/data/products.ts'

type BasketItem = {
  productId: string
  size: number
  quantity: number
}

function originFrom(request: Request) {
  const url = new URL(request.url)
  return process.env.SITE_URL?.replace(/\/$/, '') ?? url.origin
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return Response.json(
      { error: 'Payment is not configured. Add STRIPE_SECRET_KEY to the environment.' },
      { status: 503 },
    )
  }

  let body: { items?: BasketItem[] }
  try {
    body = (await request.json()) as { items?: BasketItem[] }
  } catch {
    return Response.json({ error: 'The bag could not be read.' }, { status: 400 })
  }

  const items = body.items ?? []
  if (items.length === 0) {
    return Response.json({ error: 'The bag is empty.' }, { status: 400 })
  }

  const allowed = new Set<number>(thobeSizes)
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  for (const item of items) {
    const product = getProduct(item.productId)
    const quantity = Math.min(4, Math.max(1, Number(item.quantity) || 0))
    const size = Number(item.size)
    if (!product || quantity < 1 || !allowed.has(size)) {
      return Response.json({ error: 'A line in the bag is not valid.' }, { status: 400 })
    }
    lineItems.push({
      quantity,
      price_data: {
        currency: 'gbp',
        unit_amount: product.pricePence,
        product_data: {
          name: `${product.name} · ${size}`,
          description: `${product.colour}. ${product.cloth}. Made to order in London.`,
        },
      },
    })
  }

  const origin = originFrom(request)
  const stripe = new Stripe(secret)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['GB', 'AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'US', 'FR', 'DE', 'IT'],
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
      allow_promotion_codes: true,
      integration_identifier: 'suhail_bag_xhwpqelm',
    })

    if (!session.url) {
      return Response.json({ error: 'Stripe did not return a payment page.' }, { status: 502 })
    }

    return Response.json({ url: session.url })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'Stripe could not open a payment page.' }, { status: 502 })
  }
}
