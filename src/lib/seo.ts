import { type PageMeta } from '@/lib/share'

export type { PageMeta }

export const SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') ?? 'https://www.kiano.london'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function applyPageMeta({ title, description, path, image, imageAlt, robots }: PageMeta) {
  const url = `${SITE_URL}${path}`
  const ogImage = image?.startsWith('http') ? image : `${SITE_URL}${image ?? '/images/og.jpg'}`
  const alt = imageAlt ?? 'Kiano London. Emirati thobes and garments.'

  document.title = title
  upsertMeta('name', 'description', description)
  if (robots) {
    upsertMeta('name', 'robots', robots)
  } else {
    document.head.querySelector('meta[name="robots"]')?.remove()
  }
  upsertMeta('property', 'og:locale', 'en_GB')
  upsertMeta('property', 'og:site_name', 'Kiano London')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', ogImage)
  upsertMeta('property', 'og:image:alt', alt)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', ogImage)

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
}
