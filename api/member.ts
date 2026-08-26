import { clerkUserIdFrom } from './_lib/clerk.js'
import { withDb } from './_lib/db.js'

export async function POST(request: Request) {
  const clerkUserId = await clerkUserIdFrom(request)
  if (!clerkUserId) {
    return Response.json({ error: 'Sign in to open an account.' }, { status: 401 })
  }

  let body: { email?: unknown; name?: unknown }
  try {
    body = (await request.json()) as { email?: unknown; name?: unknown }
  } catch {
    return Response.json({ error: 'The account could not be read.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!email.includes('@')) {
    return Response.json({ error: 'A valid email is needed.' }, { status: 400 })
  }

  try {
    const sql = await withDb()
    await sql`
      INSERT INTO members (clerk_user_id, email, name)
      VALUES (${clerkUserId}, ${email}, ${name || null})
      ON CONFLICT (clerk_user_id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, members.name)
    `
    await sql`
      UPDATE orders
      SET clerk_user_id = ${clerkUserId}
      WHERE clerk_user_id IS NULL AND lower(email) = lower(${email})
    `
    return Response.json({ ok: true })
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not open the account.' }, { status: 503 })
  }
}
