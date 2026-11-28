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
    body: 'Prices are in pounds sterling. The seller is not registered for VAT, so no VAT is charged. Payment is taken by Stripe, by card, Apple Pay or Google Pay, when the order is placed.',
  },
  {
    title: 'Delivery',
    body: `We deliver to ${deliveryCountries.slice(0, -1).join(', ')} and ${deliveryCountries[deliveryCountries.length - 1]}. Delivery is tracked and charged per order, and the charge is shown before you pay: UK £3.95, or £5.95 for the next working day; France, Germany and Italy £12; the UAE, Saudi Arabia, Kuwait, Qatar, Bahrain and Oman £15; the United States £25, with US duties paid by us. If you cancel within 14 days we refund the standard delivery charge with the piece. Outside the UK and the US, the destination country may charge import duties or taxes on arrival.`,
  },
  {
    title: 'Dispatch',
    body: 'Pieces are held in stock in sizes 52 to 60 and sent from the UK within 3 to 5 working days of payment. We email you with tracking when your order is sent. A piece is yours, and at your risk, once it is delivered.',
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
