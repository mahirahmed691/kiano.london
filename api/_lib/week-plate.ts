import { plateCopy, plateHref, plateWeekIndex, stillsHash, thisWeekPlate } from '../../src/lib/instagram-plates.js'
import { withDb } from './db.js'
import { housePath, sendMail, weekPlateLetterHtml, weekPlateLetterText } from './mail.js'
import { pushPlateToDevices } from './notices.js'

export function cronAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  const header = request.headers.get('authorization')
  if (secret && header === `Bearer ${secret}`) return true
  if (request.headers.get('x-vercel-cron') === '1') return true
  return false
}

export function isWeekPlateRequest(request: Request) {
  const url = new URL(request.url)
  return (
    url.pathname.endsWith('/stills-week') ||
    url.searchParams.get('section') === 'week' ||
    cronAuthorized(request)
  )
}

export async function sendWeekPlate() {
  const week = thisWeekPlate()
  const weekKey = `${plateWeekIndex()}-${week.id}`
  const copy = plateCopy(week.caption)
  const line = copy.lines[0] ?? week.alt
  const href = housePath(stillsHash(week))
  const image = plateHref(week.src)

  const sql = await withDb()
  const claimed = (await sql`
    INSERT INTO plate_letters (week_key, plate_id)
    VALUES (${weekKey}, ${week.id})
    ON CONFLICT (week_key) DO NOTHING
    RETURNING week_key
  `) as { week_key: string }[]

  if (claimed.length === 0) {
    return Response.json({ ok: true, already: true, plate: week.id })
  }

  const names = (await sql`
    SELECT email FROM subscribers WHERE confirmed = true
  `) as { email: string }[]

  let emailed = 0
  for (const row of names) {
    const mail = await sendMail({
      to: row.email,
      subject: `${week.name} — Kiano London`,
      text: weekPlateLetterText({
        name: week.name,
        place: week.place,
        line,
        href,
      }),
      html: weekPlateLetterHtml({
        name: week.name,
        place: week.place,
        line,
        image,
        href,
      }),
      idempotencyKey: `plate-week/${weekKey}/${row.email}`,
    })
    if (mail.sent) emailed += 1
  }

  const pushed = await pushPlateToDevices(
    week.name,
    `This week · ${week.place}. ${line}`,
    stillsHash(week),
  )

  await sql`
    UPDATE plate_letters
    SET emailed = ${emailed}, pushed = ${pushed.sent}
    WHERE week_key = ${weekKey}
  `

  return Response.json({
    ok: true,
    plate: week.id,
    emailed,
    pushed: pushed.sent,
  })
}
