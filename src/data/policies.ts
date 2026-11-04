import { shippingCountries } from './shipping.js'

/** The terms the house keeps. The trust bar, product pages, returns and delivery all read from here. */

export const returnWindowDays = 14

export const deliveryCountries = shippingCountries.map((country) => country.name)

export const trustPoints = [
  { title: 'Free delivery', detail: 'On every order, to every country we send to.' },
  { title: '14-day returns', detail: 'Free return postage within the UK.' },
  { title: 'Secure checkout', detail: 'Card payments are handled by Stripe.' },
  { title: 'Made to order', detail: 'Each piece is cut for you, in small runs.' },
  { title: 'Atelier visits', detail: 'In London, by appointment.' },
] as const

export const returnsSummary =
  'Free delivery. Returns within 14 days of delivery: unworn, unwashed, with tags attached. Return postage is free within the UK. We do not offer exchanges.'

export const returnsPolicy = [
  {
    title: 'Return window',
    body: `Tell us within ${returnWindowDays} days of delivery that you would like to return a piece, then send it back within ${returnWindowDays} days of telling us.`,
  },
  {
    title: 'Condition',
    body: 'Pieces must be unworn, unwashed, and with the tags attached, in the original garment bag and box with the house card.',
  },
  {
    title: 'How to return',
    body: 'Write to us with your order reference using the form below, or by email. We reply with how to send the piece back.',
  },
  {
    title: 'Return postage',
    body: 'Return postage within the UK is paid by Kiano London. From outside the UK, the return postage is yours to arrange and pay; please use a tracked service.',
  },
  {
    title: 'Exchanges',
    body: 'We do not offer exchanges. To change the size or colour, return the piece for a refund and place a new order.',
  },
  {
    title: 'Refunds',
    body: `Refunds are made to the card you paid with, within ${returnWindowDays} days of the piece reaching us. Delivery was free, so there is no delivery charge to refund.`,
  },
] as const

export const deliveryPolicy = [
  {
    title: 'Cost',
    body: 'Delivery is free on every order.',
  },
  {
    title: 'Where we deliver',
    body: `${deliveryCountries.slice(0, -1).join(', ')} and ${deliveryCountries[deliveryCountries.length - 1]}.`,
  },
  {
    title: 'Made to order',
    body: 'Each piece is cut after you order it. We email you the week it will be ready, and again with tracking when it is sent.',
  },
] as const
