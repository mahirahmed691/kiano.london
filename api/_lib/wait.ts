import { getProduct, productLineName, productPath } from '../../src/data/products.js'
import { withDb } from './db.js'
import { housePath, sendMail, waitReturnedLetterHtml, waitReturnedLetterText } from './mail.js'
import { recordNotice } from './notices.js'

type WaitRow = {
  id: number
  name: string
  email: string
}

export async function writeWhenSizeReturns(
  sql: Awaited<ReturnType<typeof withDb>>,
  productId: string,
  size: number,
) {
  const product = getProduct(productId)
  if (!product) return 0

  const piece = productLineName(product)
  const sizeLine = `size ${size}`
  const href = housePath(productPath(product))

  const rows = (await sql`
    UPDATE appointments
    SET
      status = 'agreed',
      reply = 'The size is on the line.'
    WHERE kind = 'wait'
      AND product_id = ${productId}
      AND size = ${size}
      AND status IN ('new', 'seen')
    RETURNING id, name, email
  `) as WaitRow[]

  for (const row of rows) {
    await sendMail({
      to: row.email,
      subject: 'This size is on the line — Kiano London',
      text: waitReturnedLetterText({ name: row.name, piece, size: sizeLine, href }),
      html: waitReturnedLetterHtml({ name: row.name, piece, size: sizeLine, href }),
      idempotencyKey: `wait-returned/${row.id}`,
    })

    const members = (await sql`
      SELECT clerk_user_id FROM members WHERE lower(email) = lower(${row.email}) LIMIT 1
    `) as { clerk_user_id: string | null }[]
    const clerkUserId = members[0]?.clerk_user_id
    if (clerkUserId) {
      await recordNotice({
        audience: 'member',
        clerkUserId,
        kind: 'wait',
        title: 'This size is on the line',
        body: `${piece}, ${sizeLine}, can be reserved again.`,
        href: productPath(product),
        productIds: [productId],
      })
    }
  }

  return rows.length
}
