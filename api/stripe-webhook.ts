import Stripe from 'stripe'
import { fulfillPaidSession } from './_lib/fulfill.ts'
import { applyChargeRefund } from './_lib/refund.ts'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || secret === 'undefined' || !webhookSecret) {
    return Response.json({ error: 'The payment hook is not configured.' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return Response.json({ error: 'The payment hook could not be verified.' }, { status: 400 })
  }

  const body = await request.text()
  const stripe = new Stripe(secret)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The payment hook could not be verified.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session
    try {
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price.product'],
      })
      await fulfillPaidSession(full)
    } catch (caught) {
      console.error(caught)
      return Response.json({ error: 'The reservation could not be recorded.' }, { status: 500 })
    }
  }

  if (event.type === 'charge.refunded') {
    try {
      await applyChargeRefund(stripe, event.data.object as Stripe.Charge, event.id)
    } catch (caught) {
      console.error(caught)
      return Response.json({ error: 'The return could not be written.' }, { status: 500 })
    }
  }

  return Response.json({ received: true })
}
