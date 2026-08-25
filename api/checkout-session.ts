import Stripe from 'stripe'
import {
  paymentStatusOf,
  type CheckoutOrder,
  type CheckoutOrderAddress,
} from '../src/data/shipping.ts'

function addressFrom(
  name: string | null | undefined,
  address: Stripe.Address | null | undefined,
): CheckoutOrderAddress | null {
  if (!address) return null
  return {
    name: name ?? null,
    line1: address.line1 ?? null,
    line2: address.line2 ?? null,
    city: address.city ?? null,
    region: address.state ?? null,
    postalCode: address.postal_code ?? null,
    country: address.country ?? null,
  }
}

function toCheckoutOrder(session: Stripe.Checkout.Session): CheckoutOrder {
  const shipping =
    addressFrom(
      session.collected_information?.shipping_details?.name,
      session.collected_information?.shipping_details?.address,
    ) ?? addressFrom(session.customer_details?.name, session.customer_details?.address)

  const lineItems = session.line_items?.data ?? []

  return {
    id: session.id,
    paymentStatus: paymentStatusOf(session.payment_status),
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? 'gbp',
    customerEmail: session.customer_details?.email ?? session.customer_email,
    customerName: session.customer_details?.name ?? null,
    customerPhone: session.customer_details?.phone ?? null,
    shipping,
    note: session.metadata?.note || null,
    lines: lineItems.map((line) => ({
      description: line.description ?? 'Piece',
      quantity: line.quantity ?? 1,
      amount: line.amount_total ?? 0,
    })),
  }
}

export async function GET(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret || secret === 'undefined') {
    return Response.json(
      { error: 'Payment is not configured. Add STRIPE_SECRET_KEY to the environment.' },
      { status: 503 },
    )
  }

  const sessionId = new URL(request.url).searchParams.get('session_id') ?? ''
  if (!sessionId.startsWith('cs_') || sessionId.length < 20) {
    return Response.json({ error: 'The reservation could not be found.' }, { status: 404 })
  }

  const stripe = new Stripe(secret)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })
    return Response.json(toCheckoutOrder(session))
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The reservation could not be found.' }, { status: 404 })
  }
}
