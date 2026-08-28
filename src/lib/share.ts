import { getProduct, productPath } from '../data/products.js'
import { site } from '../data/site.js'

export type PageMeta = {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  robots?: string
}

const defaultImage = '/images/og.jpg'
const defaultAlt = 'Kiano London. Emirati thobes and jubbahs.'

const pages: Record<string, PageMeta> = {
  '/': {
    title: site.fullName,
    description:
      'Layl, Hadīd, Ghabār, Raml and Hajar. The jubbah in black, sand and charcoal. A London house, sizes 52 to 60.',
    path: '/',
    image: '/images/featured-overcoat.jpg',
    imageAlt: 'Hadīd: a charcoal Emirati thobe with a standing collar, worn at full length.',
  },
  '/shop': {
    title: 'Shop — Kiano London',
    description: 'The jubbah in three colours: black, sand and charcoal. Sizes 52 to 60, from the house block.',
    path: '/shop',
    image: '/images/jubbah-sand-02.jpg',
    imageAlt: 'The jubbah in sand, hem to the ankle.',
  },
  '/collection': {
    title: 'The Collection — Kiano London',
    description:
      'Layl, Hadīd, Ghabār, Raml and Hajar. Five Emirati thobes, sizes 52 to 60, from the house block.',
    path: '/collection',
    image: '/images/thobe-raml.jpg',
    imageAlt: 'The Raml thobe.',
  },
  '/story': {
    title: 'Story — Kiano London',
    description:
      'A London house of the Emirati thobe and jubbah. Layl, Hadīd, Ghabār, Raml and Hajar.',
    path: '/story',
    image: '/images/atelier-rail.jpg',
    imageAlt: 'The house line on the rail: black, sand, and bone.',
  },
  '/craftsmanship': {
    title: 'Craftsmanship — Kiano London',
    description:
      'Cloth, pattern, stitch and finish. How Layl, Hadīd and the rest of the line are built.',
    path: '/craftsmanship',
    image: '/images/worsted-wool.jpg',
    imageAlt: 'A needle on charcoal worsted: the stitch that holds a thobe.',
  },
  '/craftsmanship-details': {
    title: 'The Making — Kiano London',
    description:
      'The felled seam, the hand stitch, the concealed placket and the interior pocket: how a thobe is built.',
    path: '/craftsmanship-details',
    image: '/images/stitch-felled.jpg',
    imageAlt: 'A felled seam at close range.',
  },
  '/visit': {
    title: 'Visit — Kiano London',
    description:
      'Appointments with Kiano London. See cloth, sit for a fitting, or write first.',
    path: '/visit',
    image: '/images/cutting-room.jpg',
    imageAlt: 'Paper, shears, and cloth: the work of a thobe.',
  },
  '/cookies': {
    title: 'Cookies — Kiano London',
    description: 'What Kiano London keeps in the browser. The bag, the account, and this notice.',
    path: '/cookies',
  },
  '/privacy': {
    title: 'Privacy — Kiano London',
    description: 'How Kiano London holds a name, an email, and a reservation.',
    path: '/privacy',
  },
  '/returns': {
    title: 'If it must return — Kiano London',
    description: 'How to write if a reserved cut cannot be worn. Fourteen days from arrival.',
    path: '/returns',
  },
  '/letters/confirmed': {
    title: 'The list — Kiano London',
    description: 'Your address is on the Kiano London list.',
    path: '/letters/confirmed',
  },
  '/account': {
    title: 'Account — Kiano London',
    description: 'Reservations placed with Kiano London.',
    path: '/account',
  },
  '/reservation': {
    title: 'A reserved cut — Kiano London',
    description: 'Ask after a reserved cut with the reference and the email used at the till.',
    path: '/reservation',
    robots: 'noindex, nofollow',
  },
  '/admin': {
    title: 'The ledger — Kiano London',
    description: 'A private reading of the house.',
    path: '/admin',
    robots: 'noindex, nofollow',
  },
  '/order/invoice': {
    title: 'A record of the cut — Kiano London',
    description: 'A simple tax invoice for a Kiano London reservation.',
    path: '/order/invoice',
    robots: 'noindex, nofollow',
  },
  '/sign-in': {
    title: 'Sign in — Kiano London',
    description: 'Sign in to see reservations placed with the atelier.',
    path: '/sign-in',
  },
  '/sign-up': {
    title: 'Open an account — Kiano London',
    description: 'Open a Kiano London account to keep reservations in one place.',
    path: '/sign-up',
  },
  '/checkout': {
    title: 'Checkout — Kiano London',
    description: 'Reserve a thobe or jubbah. Made to order, four to eight weeks.',
    path: '/checkout',
  },
  '/order/confirmed': {
    title: 'Order — Kiano London',
    description: 'Your piece is reserved. Made to order, four to eight weeks.',
    path: '/order/confirmed',
  },
}

export function normalizePath(pathname: string) {
  const path = pathname.split('?')[0]?.replace(/\/$/, '') || '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function getShareMeta(pathname: string): PageMeta {
  const path = normalizePath(pathname)

  if (path.startsWith('/sign-in')) return pages['/sign-in']!
  if (path.startsWith('/sign-up')) return pages['/sign-up']!
  if (path.startsWith('/admin')) return pages['/admin']!

  const productHit = path.match(/^\/(shop|collection)\/([^/]+)$/)
  if (productHit) {
    const product = getProduct(productHit[2])
    if (product) {
      return {
        title: `${product.name} — Kiano London`,
        description: `${product.name}: ${product.colour.toLowerCase()} Emirati ${product.cut.toLowerCase()} in ${product.cloth.toLowerCase()}. Sizes 52 to 60, from the house block.`,
        path: productPath(product),
        image: product.image,
        imageAlt: product.imageAlt,
      }
    }
  }

  return pages[path] ?? pages['/']!
}

export function isShareBot(userAgent: string) {
  return /facebookexternalhit|Facebot|meta-externalagent|meta-externalfetcher|Twitterbot|WhatsApp|Slackbot|TelegramBot|LinkedInBot|Pinterest|Discordbot|redditbot|SkypeUriPreview|vkShare|Notion|Embedly|Iframely|Snapchat/i.test(
    userAgent,
  )
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function absolute(origin: string, path: string) {
  if (path.startsWith('http')) return path
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export function renderShareDocument(origin: string, pathname: string) {
  const meta = getShareMeta(pathname)
  const url = absolute(origin, meta.path)
  const image = absolute(origin, meta.image ?? defaultImage)
  const imageAlt = meta.imageAlt ?? defaultAlt
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const imageEsc = escapeHtml(image)
  const urlEsc = escapeHtml(url)
  const altEsc = escapeHtml(imageAlt)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    ${meta.robots ? `<meta name="robots" content="${escapeHtml(meta.robots)}" />` : ''}
    <link rel="canonical" href="${urlEsc}" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Kiano London" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${urlEsc}" />
    <meta property="og:image" content="${imageEsc}" />
    <meta property="og:image:alt" content="${altEsc}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageEsc}" />
    <meta http-equiv="refresh" content="0;url=${urlEsc}" />
  </head>
  <body>
    <p><a href="${urlEsc}">${title}</a></p>
  </body>
</html>`
}
