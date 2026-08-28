import type Stripe from 'stripe'

export function liveStripeProduct(
  product: Stripe.Price['product'] | undefined,
): Stripe.Product | null {
  if (!product || typeof product === 'string') return null
  if (!('metadata' in product)) return null
  return product
}
