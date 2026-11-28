import { randomBytes } from 'node:crypto'
import { withDb } from './_lib/db.js'
import { addToAudience, confirmLetterHtml, sendMail } from './_lib/mail.js'
import { recordNotice } from './_lib/notices.js'
import { tokenFor, unsubscribeHeaders, unsubscribeUrl } from './_lib/list.js'
import { campaignHtml, campaignText } from '../src/lib/campaign-letter.js'
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

async function unsubscribe(token: string) {
  if (token.length < 20) return false
  const sql = await withDb()
  const rows = (await sql`
    UPDATE subscribers SET unsubscribed_at = COALESCE(unsubscribed_at, now())
    WHERE unsub_token = ${token}
    RETURNING email
  `) as { email: string }[]
  return rows.length > 0
}

function isUnsubscribe(request: Request) {
  return new URL(request.url).searchParams.get('section') === 'unsubscribe'
}

export async function POST(request: Request) {
  // Mail apps' one-click Unsubscribe (RFC 8058) posts here.
  if (isUnsubscribe(request)) {
    const token = new URL(request.url).searchParams.get('t') ?? ''
    try {
      await unsubscribe(token)
    } catch (caught) {
      console.error(caught)
    }
    return new Response(null, { status: 200 })
  }

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
      SELECT confirmed, unsubscribed_at FROM subscribers WHERE email = ${email}
    `) as { confirmed: boolean; unsubscribed_at: string | null }[]

    if (existing[0]?.confirmed && !existing[0]?.unsubscribed_at) {
      return Response.json({ ok: true, already: true })
    }

    const token = randomBytes(24).toString('hex')
    await sql`
      INSERT INTO subscribers (email, source, confirmed, token)
      VALUES (${email}, ${source}, false, ${token})
      ON CONFLICT (email) DO UPDATE SET
        source = EXCLUDED.source,
        token = EXCLUDED.token,
        confirmed = false,
        unsubscribed_at = NULL
    `

    const origin = originFrom(request)
    const confirmUrl = `${origin}/api/subscribe-confirm?token=${token}`
    await sendMail({
      to: email,
      subject: 'Please confirm your email — Kiano London',
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

  if (isUnsubscribe(request)) {
    const origin = new URL(request.url).origin
    const token = new URL(request.url).searchParams.get('t') ?? ''
    try {
      const done = await unsubscribe(token)
      return Response.redirect(`${origin}/letters/unsubscribed${done ? '' : '?unknown=1'}`, 302)
    } catch (caught) {
      console.error(caught)
      return Response.redirect(`${origin}/letters/unsubscribed?unknown=1`, 302)
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
    const unsubToken = await tokenFor(sql, email)
    if (unsubToken) {
      const welcome = {
        subject: 'Welcome to the house — Kiano London',
        preheader: 'One cut, three colours, handmade in the UAE.',
        heading: 'Welcome to the house.',
        body: [
          'Thank you for joining the list. We write a few times a year: a new cloth, a week in the lookbook, and when a piece can be reserved before it is gone.',
          'Every Urban Emirati is cut and sewn by hand in the UAE, made to order in five sizes.',
        ].join('\n\n'),
        ctaLabel: 'The Shop',
        ctaHref: `${origin}/shop`,
        products: true,
      }
      const url = unsubscribeUrl(unsubToken)
      await sendMail({
        to: email,
        subject: welcome.subject,
        text: campaignText(welcome, url, site.email),
        html: campaignHtml(welcome, url, site.email),
        idempotencyKey: `list-welcome/${email}`,
        headers: unsubscribeHeaders(unsubToken),
      })
    }
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
