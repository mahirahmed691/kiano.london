/**
 * The house letter for the list: used by the server to send and by Admin to preview,
 * so what you see while writing is what arrives.
 */
import { jubbahs, productLineName, productPath } from '../data/products.js'

export type CampaignDraft = {
  subject: string
  /** The grey line inboxes show beside the subject. */
  preheader?: string
  heading: string
  body: string
  ctaLabel: string
  ctaHref: string
  image?: string
  /** Show the three colours, each with its price, under the letter. */
  products?: boolean
}

export const houseOrigin = 'https://www.kiano.london'

const ink = '#1B1714'
const ivory = '#F2EBDC'
const soft = '#3F3933'
const stone = '#6F675C'
const rule = '#D4CBB8'
const sans = "Helvetica,Arial,sans-serif"
const serif = "'Cormorant Garamond',Georgia,'Times New Roman',serif"

function escape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function absolute(path: string, origin: string) {
  return /^https?:\/\//.test(path) ? path : `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}

function paragraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block, index) =>
        `<p style="margin:${index === 0 ? '0' : '18px 0 0'};">${escape(block).replaceAll('\n', '<br/>')}</p>`,
    )
    .join('')
}

function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${ink}" style="background:${ink};">
    <a href="${escape(href)}" style="display:inline-block;padding:17px 34px;font-family:${sans};font-size:11px;letter-spacing:0.26em;text-transform:uppercase;color:${ivory};text-decoration:none;">${escape(label)}</a>
  </td></tr></table>`
}

function productRow(origin: string) {
  const cells = jubbahs
    .map((piece) => {
      const href = absolute(productPath(piece), origin)
      return `<td class="col" width="33.33%" valign="top" style="padding:0 6px;">
        <a href="${escape(href)}" style="text-decoration:none;color:${ink};">
          <img src="${escape(absolute(piece.image, origin))}" alt="${escape(productLineName(piece))}" width="148" style="display:block;width:100%;height:auto;border:0;"/>
          <p style="margin:12px 0 0;font-family:${serif};font-size:17px;line-height:1.25;color:${ink};">${escape(piece.colour)}</p>
          <p style="margin:4px 0 0;font-family:${sans};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${stone};">${escape(piece.price)}</p>
        </a>
      </td>`
    })
    .join('')
  return `<tr><td style="padding-top:44px;">
    <p style="margin:0 0 18px;font-family:${sans};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:${stone};text-align:center;">One cut · Three colours</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 -6px;"><tr>${cells}</tr></table>
  </td></tr>`
}

export function campaignHtml(
  draft: CampaignDraft,
  unsubscribeUrl: string,
  siteEmail: string,
  origin: string = houseOrigin,
) {
  const image = draft.image?.trim()
  const preheader = (draft.preheader ?? '').trim()
  const cta =
    draft.ctaLabel.trim() && draft.ctaHref.trim()
      ? `<tr><td style="padding-top:34px;">${button(draft.ctaLabel.trim(), draft.ctaHref.trim())}</td></tr>`
      : ''
  const link = (label: string, path: string) =>
    `<a href="${escape(absolute(path, origin))}" style="color:${stone};text-decoration:none;">${label}</a>`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="color-scheme" content="light only"/>
    <meta name="supported-color-schemes" content="light only"/>
    <title>${escape(draft.subject)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap" rel="stylesheet"/>
    <style>
      @media (max-width: 520px) {
        .wrap { padding: 32px 18px !important; }
        .title { font-size: 30px !important; }
        .col { display: block !important; width: 100% !important; padding: 0 0 22px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${ivory};color:${ink};">
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escape(preheader)}${'&#8204;&nbsp;'.repeat(60)}</div>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${ivory}" style="background:${ivory};">
      <tr>
        <td class="wrap" align="center" style="padding:48px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
            <tr>
              <td align="center" style="padding-bottom:8px;">
                <a href="${escape(origin)}" style="text-decoration:none;">
                  <img src="${escape(absolute('/images/email-mark.png', origin))}" alt="Kiano London" width="132" style="display:block;width:132px;height:auto;border:0;margin:0 auto;"/>
                </a>
                <p style="margin:10px 0 0;font-family:${sans};font-size:9px;letter-spacing:0.42em;text-transform:uppercase;color:${stone};">London · Est. MMXXIV</p>
              </td>
            </tr>
            ${image ? `<tr><td style="padding-top:36px;"><img src="${escape(image)}" alt="" width="480" style="display:block;width:100%;height:auto;border:0;"/></td></tr>` : `<tr><td style="padding-top:28px;border-bottom:1px solid ${rule};font-size:0;line-height:0;">&nbsp;</td></tr>`}
            <tr>
              <td class="title" style="padding-top:36px;font-family:${serif};font-size:36px;font-weight:300;line-height:1.1;letter-spacing:-0.01em;color:${ink};">${escape(draft.heading || draft.subject)}</td>
            </tr>
            <tr>
              <td style="padding-top:20px;font-family:Georgia,serif;font-size:16px;font-weight:300;line-height:1.75;color:${soft};">${paragraphs(draft.body)}</td>
            </tr>
            ${cta}
            ${draft.products ? productRow(origin) : ''}
            <tr>
              <td style="padding-top:40px;font-family:${serif};font-size:18px;font-style:italic;color:${ink};">Kiano London</td>
            </tr>
            <tr>
              <td style="padding-top:44px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${rule};">
                  <tr>
                    <td align="center" style="padding-top:22px;font-family:${sans};font-size:10px;letter-spacing:0.24em;text-transform:uppercase;line-height:2;">
                      ${link('Shop', '/shop')} &nbsp;·&nbsp; ${link('Lookbook', '/stills')} &nbsp;·&nbsp; ${link('Size guide', '/size-guide')} &nbsp;·&nbsp; ${link('Contact', '/contact')}
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top:18px;font-family:${sans};font-size:11px;line-height:1.7;color:${stone};">
                      You are receiving this because you joined the Kiano London list.<br/>
                      <a href="${escape(unsubscribeUrl)}" style="color:${stone};text-decoration:underline;">Unsubscribe</a> · Questions: <a href="mailto:${escape(siteEmail)}" style="color:${stone};">${escape(siteEmail)}</a><br/>
                      Kiano London, a trading name of Prolific Digital Tech Ltd, Birkenhead, CH41 1DN.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function campaignText(
  draft: CampaignDraft,
  unsubscribeUrl: string,
  siteEmail: string,
  origin: string = houseOrigin,
) {
  return [
    draft.heading || draft.subject,
    draft.body.trim(),
    draft.ctaLabel.trim() && draft.ctaHref.trim() ? `${draft.ctaLabel.trim()}: ${draft.ctaHref.trim()}` : null,
    draft.products
      ? jubbahs.map((piece) => `${productLineName(piece)}, ${piece.price}: ${absolute(productPath(piece), origin)}`).join('\n')
      : null,
    'Kiano London',
    `You are receiving this because you joined the Kiano London list.\nUnsubscribe: ${unsubscribeUrl}\nQuestions: ${siteEmail}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}
