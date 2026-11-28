import { packingNote } from './packing'

export type LegalLetter = {
  path: '/privacy' | '/cookies' | '/returns'
  kicker: string
  title: string
  lead: string
  blocks: { kicker: string; copy: string }[]
  close: string
  write?: { label: string; to: string }
}

export const privacyLetter: LegalLetter = {
  path: '/privacy',
  kicker: 'The house',
  title: 'Privacy.',
  lead: 'We hold what is needed to cut a garment, keep an account, or write when you asked us to. We do not sell a list.',
  blocks: [
    {
      kicker: 'A question',
      copy: 'The contact form sends your message to our inbox. It is kept there to reply to you.',
    },
    {
      kicker: 'Account',
      copy: 'Member sign-in is Clerk. Name and email sit there. The size you wear, delivery name, telephone, and address are kept with the house so checkout, a question, a size alert, and a return need not be written again.',
    },
    {
      kicker: 'A reservation',
      copy: 'Payment is Stripe. The reservation, the size, the delivery address, and a line written for the house card are kept so the cloth can be cut and sent. You can ask after an order with the eight-letter reference and the email you used at checkout.',
    },
    {
      kicker: 'The list',
      copy: 'If you join the list, we store the email and wait for you to confirm it. Letters are about cloth and when a piece can be reserved.',
    },
    {
      kicker: 'Updates',
      copy: 'If you keep an account, notices of an order sit against it. On the installable app, that word can also arrive as a device notice, if you allow it.',
    },
    {
      kicker: 'Cookies',
      copy: 'Your bag, checkout details, this notice and your saved size stay on the device. Nothing is sold to advertisers.',
    },
  ],
  close: 'Questions, a correction, or a request to forget an address: atelier@kiano.london.',
}

export const cookiesLetter: LegalLetter = {
  path: '/cookies',
  kicker: 'The house',
  title: 'Cookies.',
  lead: 'We keep as little as the house needs to work. Nothing is sold to advertisers. Nothing is used to follow you onto other sites.',
  blocks: [
    {
      kicker: 'The bag',
      copy: 'Pieces you hold stay on this device so the bag is still there if you return. That is not a tracking cookie.',
    },
    {
      kicker: 'Checkout',
      copy: 'Name, telephone, the delivery address, and the size you wear stay on this device after they are written, so they need not be entered again. An account keeps the same details with the house.',
    },
    {
      kicker: 'Account',
      copy: 'Sign-in is run by Clerk. Their cookies keep you signed in. The shop works without an account.',
    },
    {
      kicker: 'The line on this device',
      copy: 'After your first visit to the site, the shop and the collection can be read without a network. Checkout, your account and emails need a connection.',
    },
    {
      kicker: 'Payment',
      copy: 'Stripe takes payment on their own pages. We do not place advertising cookies for payment.',
    },
  ],
  close: 'Necessary only and Accept do the same work today: the house has no optional advertising cookies to turn on.',
}

export const returnsLetter: LegalLetter = {
  path: '/returns',
  kicker: 'After it leaves',
  title: 'If it must return.',
  lead: 'If a piece is not right, write to us before sending it back. There is no shop to return it to. The letter is held; it is not a refund.',
  blocks: [
    {
      kicker: 'Fourteen days',
      copy: 'From the day it arrives, fourteen days to write with the reservation and the size. Unworn, with the house card, the bag, and the box.',
    },
    {
      kicker: 'The packing',
      copy: packingNote,
    },
    {
      kicker: 'The refund',
      copy: 'A return, if agreed, is a refund in Stripe. When Stripe has returned the payment, the house book is written and the size is put back on the line. Do not open a dispute before you have written.',
    },
  ],
  close: 'The house keeps the letter in the diary. If the return can be taken, the house asks it back.',
  write: { label: 'Write first', to: '/returns' },
}

export const legalLetters = [privacyLetter, cookiesLetter, returnsLetter] as const

export function legalLetter(path: string) {
  return legalLetters.find((letter) => letter.path === path)
}
