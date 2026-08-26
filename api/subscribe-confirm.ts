import { withDb } from './_lib/db.ts'
import { addToAudience, sendMail } from './_lib/mail.ts'
import { recordNotice } from './_lib/notices.ts'
import { site } from '../src/data/site.ts'

function originFrom(request: Request) {
  return new URL(request.url).origin
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? ''
  const origin = originFrom(request)
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
      return Response.redirect(done, 302)
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
