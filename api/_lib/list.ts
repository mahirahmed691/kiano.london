import { Resend } from 'resend'
import { site } from '../../src/data/site.js'
import { campaignHtml, campaignText, type CampaignDraft } from '../../src/lib/campaign-letter.js'
import type { withDb } from './db.js'
import { fromAddress, housePath } from './mail.js'

type Sql = Awaited<ReturnType<typeof withDb>>

export type ListMember = { email: string; token: string }

export function unsubscribeUrl(token: string) {
  return housePath(`/api/unsubscribe?t=${encodeURIComponent(token)}`)
}

/** Headers so mail apps show their own Unsubscribe button (and one-click works). */
export function unsubscribeHeaders(token: string) {
  return {
    'List-Unsubscribe': `<${unsubscribeUrl(token)}>, <mailto:${site.email}?subject=unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

/** Confirmed and still subscribed, each with a stable unsubscribe token. */
export async function activeList(sql: Sql): Promise<ListMember[]> {
  await sql`
    UPDATE subscribers
    SET unsub_token = md5(random()::text || email || clock_timestamp()::text)
    WHERE confirmed = true AND unsubscribed_at IS NULL AND unsub_token IS NULL
  `
  const rows = (await sql`
    SELECT email, unsub_token FROM subscribers
    WHERE confirmed = true AND unsubscribed_at IS NULL
    ORDER BY confirmed_at NULLS LAST, email
  `) as { email: string; unsub_token: string }[]
  return rows.map((row) => ({ email: row.email, token: row.unsub_token }))
}

export async function tokenFor(sql: Sql, email: string) {
  await sql`
    UPDATE subscribers
    SET unsub_token = md5(random()::text || email || clock_timestamp()::text)
    WHERE email = ${email} AND unsub_token IS NULL
  `
  const rows = (await sql`SELECT unsub_token FROM subscribers WHERE email = ${email}`) as {
    unsub_token: string | null
  }[]
  return rows[0]?.unsub_token ?? ''
}

/** Sends one letter to many, a hundred at a time. Returns how many Resend accepted. */
export async function sendCampaign(
  draft: CampaignDraft,
  members: ListMember[],
  key: string,
): Promise<{ sent: number; failed: number }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { sent: 0, failed: members.length }
  const resend = new Resend(apiKey)
  let sent = 0
  let failed = 0
  for (let start = 0; start < members.length; start += 100) {
    const chunk = members.slice(start, start + 100)
    const { data, error } = await resend.batch.send(
      chunk.map((member) => {
        const url = member.token ? unsubscribeUrl(member.token) : housePath('/privacy')
        return {
          from: fromAddress(),
          replyTo: site.email,
          to: [member.email],
          subject: draft.subject,
          html: campaignHtml(draft, url, site.email),
          text: campaignText(draft, url, site.email),
          headers: member.token ? unsubscribeHeaders(member.token) : undefined,
        }
      }),
      { idempotencyKey: `${key}/${start}` },
    )
    if (error) {
      console.error(error)
      failed += chunk.length
    } else {
      sent += data?.data?.length ?? chunk.length
    }
  }
  return { sent, failed }
}
