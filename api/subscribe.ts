import { randomBytes } from 'node:crypto'
import { withDb } from './_lib/db.js'
import { confirmLetterHtml, sendMail } from './_lib/mail.js'
import { site } from '../src/data/site.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function originFrom(request: Request) {
  const fromHeader = request.headers.get('origin')?.replace(/\/$/, '')
  if (fromHeader) return fromHeader
  const configured = process.env.SITE_URL?.replace(/\/$/, '')
  if (configured) return configured
  return new URL(request.url).origin
}

export async function POST(request: Request) {
  let body: { email?: unknown; source?: unknown }
  try {
    body = (await request.json()) as { email?: unknown; source?: unknown }
  } catch {
    return Response.json({ error: 'The address could not be read.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const source =
    body.source === 'footer' || body.source === 'account' ? body.source : 'popup'
  if (!emailPattern.test(email)) {
    return Response.json({ error: 'A valid email is needed.' }, { status: 400 })
  }

  try {
    const sql = await withDb()
    const existing = (await sql`
      SELECT confirmed FROM subscribers WHERE email = ${email}
    `) as { confirmed: boolean }[]

    if (existing[0]?.confirmed) {
      return Response.json({ ok: true, already: true })
    }

    const token = randomBytes(24).toString('hex')
    await sql`
      INSERT INTO subscribers (email, source, confirmed, token)
      VALUES (${email}, ${source}, false, ${token})
      ON CONFLICT (email) DO UPDATE SET
        source = EXCLUDED.source,
        token = EXCLUDED.token,
        confirmed = false
    `

    const origin = originFrom(request)
    const confirmUrl = `${origin}/api/subscribe-confirm?token=${token}`
    await sendMail({
      to: email,
      subject: 'Confirm the Kiano London list',
      text: `Confirm this address to join the list.\n\n${confirmUrl}\n\nIf you did not ask for this, ignore the letter. ${site.email}`,
      html: confirmLetterHtml(confirmUrl),
      idempotencyKey: `list-confirm/${email}/${token.slice(0, 12)}`,
    })

    return Response.json({ ok: true })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The list could not be joined.' }, { status: 503 })
  }
}
