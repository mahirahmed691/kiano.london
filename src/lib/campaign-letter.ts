/**
 * The house letter for the list: used by the server to send and by Admin to preview,
 * so what you see while writing is what arrives.
 */
export type CampaignDraft = {
  subject: string
  heading: string
  body: string
  ctaLabel: string
  ctaHref: string
  image?: string
}

function escape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function paragraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block, index) =>
        `<p style="margin:${index === 0 ? '0' : '16px 0 0'};">${escape(block).replaceAll('\n', '<br/>')}</p>`,
    )
    .join('')
}

export function campaignHtml(draft: CampaignDraft, unsubscribeUrl: string, siteEmail: string) {
  const image = draft.image?.trim()
  const cta =
    draft.ctaLabel.trim() && draft.ctaHref.trim()
      ? `<tr><td style="padding-top:32px;"><a href="${escape(draft.ctaHref.trim())}" style="display:inline-block;background:#1B1714;color:#F2EBDC;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;padding:16px 28px;">${escape(draft.ctaLabel.trim())}</a></td></tr>`
      : ''
  return `<!doctype html>
<html lang="en">
  <head><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${escape(draft.subject)}</title></head>
  <body style="margin:0;background:#F2EBDC;color:#1B1714;font-family:Georgia,serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBDC;padding:48px 24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
            <tr>
              <td style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#1B1714;text-align:center;">Kiano London</td>
            </tr>
            ${image ? `<tr><td style="padding-top:32px;"><img src="${escape(image)}" alt="" width="480" style="display:block;width:100%;height:auto;border:0;"/></td></tr>` : ''}
            <tr>
              <td style="padding-top:32px;font-size:32px;font-weight:300;line-height:1.15;">${escape(draft.heading || draft.subject)}</td>
            </tr>
            <tr>
              <td style="padding-top:20px;font-size:16px;font-weight:300;line-height:1.7;color:#3F3933;">${paragraphs(draft.body)}</td>
            </tr>
            ${cta}
            <tr>
              <td style="padding-top:48px;border-top:1px solid #D4CBB8;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#6F675C;line-height:1.7;">
                You are receiving this because you joined the Kiano London list.<br/>
                <a href="${escape(unsubscribeUrl)}" style="color:#6F675C;">Unsubscribe</a> · Questions: ${escape(siteEmail)}<br/>
                Kiano London, a trading name of Prolific Digital Tech Ltd, Birkenhead, CH41 1DN.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function campaignText(draft: CampaignDraft, unsubscribeUrl: string, siteEmail: string) {
  return [
    draft.heading || draft.subject,
    draft.body.trim(),
    draft.ctaLabel.trim() && draft.ctaHref.trim() ? `${draft.ctaLabel.trim()}: ${draft.ctaHref.trim()}` : null,
    `You are receiving this because you joined the Kiano London list.\nUnsubscribe: ${unsubscribeUrl}\nQuestions: ${siteEmail}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}
