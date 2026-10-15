import { Resend } from 'resend'
import { careLine } from '../../src/data/packing.js'
import { site } from '../../src/data/site.js'

function fromAddress() {
  return process.env.RESEND_FROM || 'Kiano London <atelier@kiano.london>'
}

export async function sendMail(input: {
  to: string
  subject: string
  text: string
  html: string
  idempotencyKey: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) return { sent: false as const }

  const resend = new Resend(key)
  const { error } = await resend.emails.send(
    {
      from: fromAddress(),
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    },
    { idempotencyKey: input.idempotencyKey },
  )

  if (error) {
    console.error(error)
    return { sent: false as const }
  }
  return { sent: true as const }
}

export async function addToAudience(email: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  const resend = new Resend(key)
  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
  })
  if (error && !/already exists/i.test(error.message ?? '')) {
    console.error(error)
  }
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function letterFrame(title: string, body: string, footer: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#F2EBDC;color:#1B1714;font-family:Georgia,serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBDC;padding:48px 24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#6F675C;">Kiano London</td>
            </tr>
            <tr>
              <td style="padding-top:24px;font-size:32px;font-weight:300;line-height:1.15;">${title}</td>
            </tr>
            <tr>
              <td style="padding-top:20px;font-size:16px;font-weight:300;line-height:1.7;color:#3F3933;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding-top:32px;font-size:13px;color:#6F675C;line-height:1.6;">
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function visitLetterHtml(input: { name: string; piece: string; size: string }) {
  const name = escapeHtml(input.name)
  const piece = escapeHtml(input.piece)
  const size = escapeHtml(input.size)
  const named = `<p style="margin:16px 0 0;">You named ${piece}, ${size}.</p>`
  return letterFrame(
    'The letter is held.',
    `<p style="margin:0;">${name}, the request is with the house. This is not a booking. We write when a morning can be kept.</p>${named}`,
    `Questions: ${site.email}.`,
  )
}

export function visitLetterText(input: { name: string; piece: string; size: string }) {
  return [
    `${input.name}, the request is with the house.`,
    'This is not a booking. We write when a morning can be kept.',
    `You named ${input.piece}, ${input.size}.`,
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

export function visitNamedLetterHtml(input: {
  name: string
  day: string
  note?: string
}) {
  const name = escapeHtml(input.name)
  const day = escapeHtml(input.day)
  const note = input.note?.trim()
    ? `<p style="margin:16px 0 0;">${escapeHtml(input.note.trim())}</p>`
    : ''
  return letterFrame(
    'A morning is named.',
    `<p style="margin:0;">${name}, the house can keep the morning of ${day}. This is not a public calendar. Write if that morning cannot be kept.</p>${note}`,
    `Questions: ${site.email}.`,
  )
}

export function visitNamedLetterText(input: { name: string; day: string; note?: string }) {
  return [
    `${input.name}, the house can keep the morning of ${input.day}.`,
    'This is not a public calendar. Write if that morning cannot be kept.',
    input.note?.trim() || null,
    `Questions: ${site.email}.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function visitRefusedLetterHtml(input: { name: string; note?: string }) {
  const name = escapeHtml(input.name)
  const note = input.note?.trim()
    ? `<p style="margin:16px 0 0;">${escapeHtml(input.note.trim())}</p>`
    : ''
  return letterFrame(
    'A morning cannot be kept.',
    `<p style="margin:0;">${name}, the house cannot keep a morning for this letter.</p>${note}`,
    `Questions: ${site.email}.`,
  )
}

export function visitRefusedLetterText(input: { name: string; note?: string }) {
  return [
    `${input.name}, the house cannot keep a morning for this letter.`,
    input.note?.trim() || null,
    `Questions: ${site.email}.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function returnRefusedLetterHtml(input: { name: string; reference: string; note?: string }) {
  const name = escapeHtml(input.name)
  const reference = escapeHtml(input.reference)
  const note = input.note?.trim()
    ? `<p style="margin:16px 0 0;">${escapeHtml(input.note.trim())}</p>`
    : ''
  return letterFrame(
    'The return cannot be taken.',
    `<p style="margin:0;">${name}, the house cannot take this return. Reservation ${reference}. It is not a refund.</p>${note}`,
    `Questions: ${site.email}.`,
  )
}

export function returnRefusedLetterText(input: {
  name: string
  reference: string
  note?: string
}) {
  return [
    `${input.name}, the house cannot take this return.`,
    `Reservation ${input.reference}. It is not a refund.`,
    input.note?.trim() || null,
    `Questions: ${site.email}.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function returnAgreedLetterHtml(input: {
  name: string
  reference: string
  note?: string
}) {
  const name = escapeHtml(input.name)
  const reference = escapeHtml(input.reference)
  const note = input.note?.trim()
    ? `<p style="margin:16px 0 0;">${escapeHtml(input.note.trim())}</p>`
    : ''
  return letterFrame(
    'Send it back.',
    `<p style="margin:0;">${name}, send the piece back. Unworn, with the house card, the bag, and the box. Reservation ${reference}. This is not yet a refund.</p>${note}`,
    `Questions: ${site.email}.`,
  )
}

export function returnAgreedLetterText(input: {
  name: string
  reference: string
  note?: string
}) {
  return [
    `${input.name}, send the piece back.`,
    'Unworn, with the house card, the bag, and the box.',
    `Reservation ${input.reference}. This is not yet a refund.`,
    input.note?.trim() || null,
    `Questions: ${site.email}.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function workWeekLetterHtml(input: { week: string }) {
  const week = escapeHtml(input.week)
  return letterFrame(
    'A week is named.',
    `<p style="margin:0;">The house names the week of ${week} for this cut. Four to eight weeks is the usual wait; this is the week the house can keep.</p>`,
    `Questions: ${site.email}.`,
  )
}

export function workWeekLetterText(input: { week: string }) {
  return [
    `The house names the week of ${input.week} for this cut.`,
    'Four to eight weeks is the usual wait; this is the week the house can keep.',
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

export function workBackLetterHtml(input: { stage: string; reason: string }) {
  const stage = escapeHtml(input.stage)
  const reason = escapeHtml(input.reason)
  return letterFrame(
    'The cut has been held back.',
    `<p style="margin:0;">The piece is now ${stage}.</p><p style="margin:16px 0 0;">${reason}</p>`,
    `Questions: ${site.email}.`,
  )
}

export function workBackLetterText(input: { stage: string; reason: string }) {
  return [
    `The piece is now ${input.stage}.`,
    input.reason,
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

function cutsMarkup(cuts: string) {
  const lines = cuts
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length === 0) return ''
  return `<p style="margin:16px 0 0;">${lines.map((line) => escapeHtml(line)).join('<br/>')}</p>`
}

export function packedLetterHtml(input: { cuts: string; note?: string; cardUrl?: string }) {
  const line = input.note?.trim()
  const written = line
    ? `<p style="margin:16px 0 0;">A line you wrote is on the card.</p><p style="margin:16px 0 0;">${escapeHtml(line)}</p>`
    : ''
  const card = input.cardUrl
    ? `<p style="margin:16px 0 0;"><a href="${escapeHtml(input.cardUrl)}" style="color:#1B1714;">The house card</a></p>`
    : ''
  return letterFrame(
    'It is in the house box.',
    `<p style="margin:0;">Garment bag, unscented tissue, a rigid box. No scent. A house card sits with the piece name and the size.</p>${cutsMarkup(input.cuts)}${written}<p style="margin:16px 0 0;">${escapeHtml(careLine)}</p>${card}`,
    `Questions: ${site.email}.`,
  )
}

export function packedLetterText(input: { cuts: string; note?: string; cardUrl?: string }) {
  const line = input.note?.trim()
  return [
    'Garment bag, unscented tissue, a rigid box. No scent. A house card sits with the piece name and the size.',
    input.cuts.trim() || null,
    line ? `A line you wrote is on the card.\n\n${line}` : null,
    careLine,
    input.cardUrl ? `The house card: ${input.cardUrl}` : null,
    `Questions: ${site.email}.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function sentLetterHtml(input: { how: string; cuts: string; cardUrl?: string }) {
  const card = input.cardUrl
    ? `<p style="margin:16px 0 0;"><a href="${escapeHtml(input.cardUrl)}" style="color:#1B1714;">The house card</a></p>`
    : ''
  return letterFrame(
    'It has left the house.',
    `<p style="margin:0;">${escapeHtml(input.how)}</p>${cutsMarkup(input.cuts)}<p style="margin:16px 0 0;">Hang it. ${escapeHtml(careLine)}</p>${card}`,
    `Questions: ${site.email}.`,
  )
}

export function sentLetterText(input: { how: string; cuts: string; cardUrl?: string }) {
  return [
    input.how,
    input.cuts.trim() || null,
    `Hang it. ${careLine}`,
    input.cardUrl ? `The house card: ${input.cardUrl}` : null,
    `Questions: ${site.email}.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function houseOrigin() {
  return (process.env.SITE_URL || 'https://www.kiano.london').replace(/\/$/, '')
}

export function reservationReference(id: string) {
  return id.slice(-8).toUpperCase()
}

export function reservationLetterHtml(input: {
  name: string
  lines: string[]
  reference: string
  invoiceUrl: string
  cardUrl: string
  accountUrl: string
}) {
  const name = input.name.trim()
  const cuts = (input.lines.length ? input.lines : ['A cut']).map((line) => escapeHtml(line))
  const reference = escapeHtml(input.reference)
  const invoiceUrl = escapeHtml(input.invoiceUrl)
  const cardUrl = escapeHtml(input.cardUrl)
  const accountUrl = escapeHtml(input.accountUrl)
  const open = name ? `${escapeHtml(name)}, payment holds the cloth.` : 'Payment holds the cloth.'
  const list = cuts
    .map((line) => `<li style="margin:0 0 8px;">${line}.</li>`)
    .join('')
  return letterFrame(
    'The cut is reserved.',
    `<p style="margin:0;">${open}</p><ul style="margin:16px 0 0;padding:0;list-style:none;">${list}</ul><p style="margin:16px 0 0;">Reference ${reference}.</p><p style="margin:16px 0 0;">Cloth is cut from the house block in four to eight weeks.</p><p style="margin:16px 0 0;"><a href="${invoiceUrl}" style="color:#1B1714;">A record of the cut</a> · <a href="${cardUrl}" style="color:#1B1714;">The house card</a> · <a href="${accountUrl}" style="color:#1B1714;">Account</a></p>`,
    `Questions: ${site.email}.`,
  )
}

export function reservationLetterText(input: {
  name: string
  lines: string[]
  reference: string
  invoiceUrl: string
  cardUrl: string
  accountUrl: string
}) {
  const cuts = input.lines.length ? input.lines : ['A cut']
  return [
    input.name.trim() ? `${input.name.trim()}, payment holds the cloth.` : 'Payment holds the cloth.',
    cuts.map((line) => `${line}.`).join('\n'),
    `Reference ${input.reference}.`,
    'Cloth is cut from the house block in four to eight weeks.',
    `A record of the cut: ${input.invoiceUrl}`,
    `The house card: ${input.cardUrl}`,
    `Account: ${input.accountUrl}`,
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

export function returnLetterHtml(input: { cut: string; full: boolean }) {
  const cut = escapeHtml(input.cut)
  const title = input.full
    ? 'The reservation has been returned.'
    : 'Part of the reservation has been returned.'
  const line = input.full
    ? `${cut} is no longer held against the account.`
    : `A part of the reservation for ${cut} has been returned.`
  return letterFrame(title, `<p style="margin:0;">${line}</p>`, `Questions: ${site.email}.`)
}

export function returnLetterText(input: { cut: string; full: boolean }) {
  return [
    input.full
      ? `${input.cut} is no longer held against the account.`
      : `A part of the reservation for ${input.cut} has been returned.`,
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

export function returnAskLetterHtml(input: {
  name: string
  piece: string
  size: string
  reference: string
}) {
  const name = escapeHtml(input.name)
  const piece = escapeHtml(input.piece)
  const size = escapeHtml(input.size)
  const reference = escapeHtml(input.reference)
  return letterFrame(
    'The letter is held.',
    `<p style="margin:0;">${name}, the request is with the house. This is not a refund. We write if the return can be agreed.</p><p style="margin:16px 0 0;">You named ${piece}, ${size}. Reservation ${reference}.</p>`,
    `Questions: ${site.email}.`,
  )
}

export function returnAskLetterText(input: {
  name: string
  piece: string
  size: string
  reference: string
}) {
  return [
    `${input.name}, the request is with the house.`,
    'This is not a refund. We write if the return can be agreed.',
    `You named ${input.piece}, ${input.size}. Reservation ${input.reference}.`,
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

export function waitAskLetterHtml(input: { name: string; piece: string; size: string }) {
  const name = escapeHtml(input.name)
  const piece = escapeHtml(input.piece)
  const size = escapeHtml(input.size)
  return letterFrame(
    'The letter is held.',
    `<p style="margin:0;">${name}, the house has the letter. If ${piece}, ${size}, returns to the line, we write.</p>`,
    `Questions: ${site.email}.`,
  )
}

export function waitAskLetterText(input: { name: string; piece: string; size: string }) {
  return [
    `${input.name}, the house has the letter.`,
    `If ${input.piece}, ${input.size}, returns to the line, we write.`,
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

export function waitReturnedLetterHtml(input: { name: string; piece: string; size: string; href: string }) {
  const name = escapeHtml(input.name)
  const piece = escapeHtml(input.piece)
  const size = escapeHtml(input.size)
  const href = escapeHtml(input.href)
  return letterFrame(
    'This size is on the line.',
    `<p style="margin:0;">${name}, ${piece}, ${size}, can be reserved again.</p><p style="margin:16px 0 0;"><a href="${href}" style="color:#1B1714;">Open the piece</a></p>`,
    `Questions: ${site.email}.`,
  )
}

export function waitReturnedLetterText(input: { name: string; piece: string; size: string; href: string }) {
  return [
    `${input.name}, ${input.piece}, ${input.size}, can be reserved again.`,
    input.href,
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

export function waitRefusedLetterHtml(input: { name: string; piece: string; size: string; note?: string }) {
  const name = escapeHtml(input.name)
  const piece = escapeHtml(input.piece)
  const size = escapeHtml(input.size)
  const note = input.note?.trim() ? `<p style="margin:16px 0 0;">${escapeHtml(input.note.trim())}</p>` : ''
  return letterFrame(
    'The house cannot write.',
    `<p style="margin:0;">${name}, the house cannot write if ${piece}, ${size}, returns to the line.</p>${note}`,
    `Questions: ${site.email}.`,
  )
}

export function waitRefusedLetterText(input: { name: string; piece: string; size: string; note?: string }) {
  return [
    `${input.name}, the house cannot write if ${input.piece}, ${input.size}, returns to the line.`,
    input.note?.trim() || '',
    `Questions: ${site.email}.`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function weekPlateLetterHtml(input: {
  name: string
  place: string
  line: string
  image: string
  href: string
}) {
  const name = escapeHtml(input.name)
  const place = escapeHtml(input.place)
  const line = escapeHtml(input.line)
  const image = escapeHtml(input.image)
  const href = escapeHtml(input.href)
  return letterFrame(
    name,
    `<p style="margin:0;">This week · ${place}.</p><p style="margin:16px 0 0;">${line}</p><p style="margin:16px 0 0;"><img src="${image}" alt="" width="480" style="display:block;width:100%;height:auto;"/></p><p style="margin:16px 0 0;"><a href="${href}" style="color:#1B1714;">The stills</a></p>`,
    `A still a week. Questions: ${site.email}.`,
  )
}

export function weekPlateLetterText(input: {
  name: string
  place: string
  line: string
  href: string
}) {
  return [
    `This week · ${input.place}.`,
    input.name,
    input.line,
    input.href,
    `A still a week. Questions: ${site.email}.`,
  ].join('\n\n')
}

export function housePath(path: string) {
  return `${houseOrigin()}${path.startsWith('/') ? path : `/${path}`}`
}

export function confirmLetterHtml(url: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#F2EBDC;color:#1B1714;font-family:Georgia,serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBDC;padding:48px 24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#6F675C;">Kiano London</td>
            </tr>
            <tr>
              <td style="padding-top:24px;font-size:32px;font-weight:300;line-height:1.15;">Confirm the list.</td>
            </tr>
            <tr>
              <td style="padding-top:20px;font-size:16px;font-weight:300;line-height:1.7;color:#3F3933;">
                A few letters a year: cloth, a name, and when a piece can be reserved. Confirm this address to join.
              </td>
            </tr>
            <tr>
              <td style="padding-top:32px;">
                <a href="${url}" style="display:inline-block;border:1px solid #1B1714;color:#F2EBDC;background:#1B1714;padding:14px 28px;text-decoration:none;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Confirm</a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:32px;font-size:13px;color:#6F675C;line-height:1.6;">
                If you did not ask for this, ignore the letter. Questions: ${site.email}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
