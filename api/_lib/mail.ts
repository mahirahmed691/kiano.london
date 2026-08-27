import { Resend } from 'resend'
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

function houseOrigin() {
  return (process.env.SITE_URL || 'https://www.kiano.london').replace(/\/$/, '')
}

export function reservationReference(id: string) {
  return id.slice(-8).toUpperCase()
}

export function reservationLetterHtml(input: {
  name: string
  cut: string
  reference: string
  invoiceUrl: string
  accountUrl: string
}) {
  const name = input.name.trim()
  const cut = escapeHtml(input.cut)
  const reference = escapeHtml(input.reference)
  const invoiceUrl = escapeHtml(input.invoiceUrl)
  const accountUrl = escapeHtml(input.accountUrl)
  const open = name ? `${escapeHtml(name)}, payment holds the cloth.` : 'Payment holds the cloth.'
  return letterFrame(
    'The cut is reserved.',
    `<p style="margin:0;">${open} ${cut}. Reference ${reference}.</p><p style="margin:16px 0 0;">Cloth is cut from the house block in four to eight weeks.</p><p style="margin:16px 0 0;"><a href="${invoiceUrl}" style="color:#1B1714;">A record of the cut</a> · <a href="${accountUrl}" style="color:#1B1714;">Account</a></p>`,
    `Questions: ${site.email}.`,
  )
}

export function reservationLetterText(input: {
  name: string
  cut: string
  reference: string
  invoiceUrl: string
  accountUrl: string
}) {
  return [
    input.name.trim() ? `${input.name.trim()}, payment holds the cloth.` : 'Payment holds the cloth.',
    `${input.cut}.`,
    `Reference ${input.reference}.`,
    'Cloth is cut from the house block in four to eight weeks.',
    `A record of the cut: ${input.invoiceUrl}`,
    `Account: ${input.accountUrl}`,
    `Questions: ${site.email}.`,
  ].join('\n\n')
}

export function returnLetterHtml(input: { cut: string; full: boolean }) {
  const cut = escapeHtml(input.cut)
  const title = input.full ? 'The till has been returned.' : 'Part of the till has been returned.'
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
