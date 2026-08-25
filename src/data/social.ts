export type SocialLink = {
  label: string
  href: string
}

/** Live profile URLs. Empty hrefs are omitted from the site. */
export const social: SocialLink[] = [
  { label: 'Instagram', href: '' },
  { label: 'TikTok', href: '' },
  { label: 'Pinterest', href: '' },
].filter((item) => item.href.startsWith('http'))
