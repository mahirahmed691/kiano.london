import { verifyWebhook } from '@clerk/backend/webhooks'
import { withDb } from './_lib/db.ts'
import { recordNotice } from './_lib/notices.ts'

function memberName(first?: string | null, last?: string | null) {
  return `${first ?? ''} ${last ?? ''}`.trim()
}

function primaryEmail(
  emails: { id: string; email_address: string }[] | undefined,
  primaryId?: string | null,
) {
  if (!emails?.length) return ''
  const match = emails.find((entry) => entry.id === primaryId) ?? emails[0]
  return match?.email_address?.trim().toLowerCase() ?? ''
}

export async function POST(request: Request) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return Response.json({ error: 'The account hook is not configured.' }, { status: 503 })
  }

  let evt
  try {
    evt = await verifyWebhook(request)
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The account hook could not be verified.' }, { status: 400 })
  }

  const svixId = request.headers.get('svix-id')?.trim() ?? ''

  try {
    const sql = await withDb()

    if (svixId) {
      const seen = (await sql`
        SELECT svix_id FROM webhook_events WHERE svix_id = ${svixId}
      `) as { svix_id: string }[]
      if (seen.length > 0) return Response.json({ received: true })
    }

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const clerkUserId = evt.data.id
      const email = primaryEmail(evt.data.email_addresses, evt.data.primary_email_address_id)
      const name = memberName(evt.data.first_name, evt.data.last_name)
      if (clerkUserId && email) {
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
        if (evt.type === 'user.created') {
          await recordNotice({
            audience: 'admin',
            kind: 'member',
            title: 'A member has an account',
            body: name ? `${name} · ${email}` : email,
            href: '/admin/members',
          })
        }
      }
    }

    if (evt.type === 'user.deleted') {
      const clerkUserId = evt.data.id
      if (clerkUserId) {
        await sql`
          UPDATE orders
          SET clerk_user_id = NULL
          WHERE clerk_user_id = ${clerkUserId}
        `
        await sql`
          DELETE FROM members WHERE clerk_user_id = ${clerkUserId}
        `
        await sql`
          DELETE FROM push_tokens WHERE clerk_user_id = ${clerkUserId}
        `
        await sql`
          DELETE FROM notice_reads WHERE clerk_user_id = ${clerkUserId}
        `
        await sql`
          DELETE FROM notices WHERE audience = 'member' AND clerk_user_id = ${clerkUserId}
        `
      }
    }

    if (svixId) {
      await sql`
        INSERT INTO webhook_events (svix_id, event_type)
        VALUES (${svixId}, ${evt.type})
        ON CONFLICT (svix_id) DO NOTHING
      `
    }
  } catch (caught) {
    console.error(caught)
    return Response.json({ error: 'The atelier could not keep the account.' }, { status: 500 })
  }

  return Response.json({ received: true })
}
