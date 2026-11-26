import { site } from './site'
import { deliveryCountries, returnWindowDays } from './policies'

/** Terms of sale. Plain English; reads from the same policies as delivery and returns. */

const trader = site.trader
const traderLine = [
  trader.legalName ? `${site.fullName} is a trading name of ${trader.legalName}` : site.fullName,
  trader.companyNumber ? `company number ${trader.companyNumber}` : '',
  trader.address ? `registered at ${trader.address}` : '',
  trader.vatNumber ? `VAT number ${trader.vatNumber}` : '',
]
  .filter(Boolean)
  .join(', ')

export const termsLead =
  'The terms on which a piece is sold. They sit alongside delivery, returns, and privacy. Your rights in law are not reduced by anything here.'

export const termsBlocks = [
  {
    title: 'Who sells',
    body: `${traderLine}. Write to ${site.email}.`,
  },
  {
    title: 'The order',
    body: 'An order is accepted, and the contract made, when payment is taken and the confirmation email is sent. If a piece cannot be made, we tell you and refund in full.',
  },
  {
    title: 'Price and payment',
    body: 'Prices are in pounds sterling and include UK VAT at 20%. Payment is taken by Stripe, by card, Apple Pay or Google Pay, when the order is placed.',
  },
  {
    title: 'Delivery',
    body: `Delivery is free, to ${deliveryCountries.slice(0, -1).join(', ')} and ${deliveryCountries[deliveryCountries.length - 1]}. Outside the UK, the destination country may charge import duties or taxes on arrival.`,
  },
  {
    title: 'Made to order',
    body: 'Each piece is cut after you order it, in the standard sizes. We email the week it will be ready, and again with tracking when it is sent. A piece is yours, and at your risk, once it is delivered.',
  },
  {
    title: 'Changing your mind',
    body: `You may cancel within ${returnWindowDays} days of delivery and return the piece unworn, under the returns policy. Refunds go to the card you paid with, within ${returnWindowDays} days of the piece reaching us.`,
  },
  {
    title: 'If something is wrong',
    body: 'If a piece is faulty, not as described, or not fit for purpose, you have rights under the Consumer Rights Act 2015, including repair, replacement, or a refund. Write to us first.',
  },
  {
    title: 'Law',
    body: 'These terms are governed by the law of England and Wales. If you live elsewhere in the UK, you may also bring a claim in your own courts.',
  },
] as const
