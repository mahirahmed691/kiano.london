import { Resend } from 'resend'
import { site } from '../../src/data/site.ts'

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
