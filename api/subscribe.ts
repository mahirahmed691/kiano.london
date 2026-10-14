import { randomBytes } from 'node:crypto'
import { withDb } from './_lib/db.js'
import { addToAudience, confirmLetterHtml, sendMail } from './_lib/mail.js'
import { recordNotice } from './_lib/notices.js'
import { cronAuthorized, isWeekPlateRequest, sendWeekPlate } from './_lib/week-plate.js'
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
    body.source === 'footer' || body.source === 'account' || body.source === 'scent'
      ? body.source
      : 'popup'
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

export async function GET(request: Request) {
  if (isWeekPlateRequest(request)) {
    if (!cronAuthorized(request)) {
      return Response.json({ error: 'Not the house.' }, { status: 401 })
    }
    try {
      return await sendWeekPlate()
    } catch (caught) {
      console.error(caught)
      return Response.json({ error: 'The week could not be sent.' }, { status: 503 })
    }
  }

  const token = new URL(request.url).searchParams.get('token') ?? ''
  const origin = new URL(request.url).origin
  const done = `${origin}/letters/confirmed`

  if (token.length < 20) {
    return Response.redirect(`${origin}/privacy`, 302)
  }

  try {
    const sql = await withDb()
    const rows = (await sql`
      UPDATE subscribers
      SET confirmed = true, confirmed_at = now(), token = NULL
      WHERE token = ${token}
      RETURNING email
    `) as { email: string }[]

    const email = rows[0]?.email
    if (!email) {
      return Response.redirect(`${origin}/privacy`, 302)
    }

    await addToAudience(email)
    await recordNotice({
      audience: 'admin',
      kind: 'list',
      title: 'The list has a name',
      body: `${email} confirmed.`,
      href: '/admin/list',
    })
    await sendMail({
      to: site.email,
      subject: `List: ${email}`,
      text: `${email} confirmed the Kiano London list.`,
      html: `<p>${email} confirmed the Kiano London list.</p>`,
      idempotencyKey: `list-atelier/${email}`,
    })

    return Response.redirect(done, 302)
  } catch (caught) {
    console.error(caught)
    return Response.redirect(`${origin}/privacy`, 302)
  }
}
