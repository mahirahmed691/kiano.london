import { thisWeekPlate, thisWeekShopPlate } from './instagram-plates.js'
import { creedIntent, creedMotto, creedSpoken, creedWoven } from '../data/creed.js'
import { getProduct, productLineName, productPath } from '../data/products.js'
import { getScent, scentPath } from '../data/scent.js'
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
const defaultAlt = 'Kiano London. Emirati thobes and garments.'

const pages: Record<string, PageMeta> = {
  '/': {
    title: site.fullName,
    description:
      `${creedWoven} Urban Emirati in stone grey, cream and black. A London house, sizes 52 to 60.`,
    path: '/',
    image: '/images/jubbah-black.jpg',
    imageAlt: 'Urban Emirati in black, worn at full length.',
  },
  '/shop': {
    title: 'Shop — Kiano London',
    description: `Urban Emirati in stone grey, cream and black. Cotton viscose mix, light GSM. ${creedIntent} Sizes 52 to 60, from the house block.`,
    path: '/shop',
    image: '/images/jubbah-sand-02.jpg',
    imageAlt: 'Urban Emirati in cream, hem to the ankle.',
  },
  '/collection': {
    title: 'The Collection — Kiano London',
    description:
      `Urban Emirati in stone grey, cream and black. Cotton viscose mix, light GSM. ${creedMotto}`,
    path: '/collection',
    image: '/images/jubbah-sand.jpg',
    imageAlt: 'Urban Emirati in cream, a modest column.',
  },
  '/scent': {
    title: 'The Scent — Kiano London',
    description:
      'Mayfair, Bond Street and Kensington. The scent is coming. Arabian Oud, and eau de parfum. Not yet of the bag.',
    path: '/scent',
    image: '/images/scent-mayfair.jpg',
    imageAlt: 'Mayfair: a bottle of Kiano London, Arabian Oud, in still light.',
  },
  '/story': {
    title: 'Story — Kiano London',
    description:
      `A London house of the Emirati thobe and garment. ${creedSpoken} ${creedMotto}`,
    path: '/story',
    image: '/images/look-lanesborough.jpg',
    imageAlt: 'A white Emirati thobe at The Lanesborough, Hyde Park Corner.',
  },
  '/stills': {
    title: 'Stills — Kiano London',
    description:
      `One still a week. ${creedWoven} Urban Emirati, and the rooms of the house.`,
    path: '/stills',
    image: '/images/jubbah-black.jpg',
    imageAlt: 'Urban Emirati in black, worn at full length.',
  },
  '/craftsmanship': {
    title: 'Craftsmanship — Kiano London',
    description:
      `${creedSpoken} Cloth, pattern, stitch and finish. Cotton viscose mix, light GSM. How the column is built.`,
    path: '/craftsmanship',
    image: '/images/worsted-wool.jpg',
    imageAlt: 'A needle on charcoal cloth: the stitch that holds the column.',
  },
  '/craftsmanship-details': {
    title: 'The Making — Kiano London',
    description:
      'The seam, the neck, the concealed placket and the nape: how the column is built.',
    path: '/craftsmanship-details',
    image: '/images/stitch-felled.jpg',
    imageAlt: 'A felled seam at close range.',
  },
  '/visit': {
    title: 'Visit — Kiano London',
    description:
      `Appointments with Kiano London. See cloth, sit for a fitting, or write first. ${creedIntent}`,
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
  '/order/card': {
    title: 'The house card — Kiano London',
    description: 'The card that sits in the box with the piece.',
    path: '/order/card',
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
    description: 'Reserve a piece. Made to order.',
    path: '/checkout',
  },
  '/order/confirmed': {
    title: 'Order — Kiano London',
    description: 'Your piece is reserved. Made to order.',
    path: '/order/confirmed',
  },
}

export function normalizePath(pathname: string) {
  const path = pathname.split('?')[0]?.replace(/\/$/, '') || '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function getShareMeta(pathname: string): PageMeta {
  const path = normalizePath(pathname)

  if (path === '/') {
    const week = thisWeekShopPlate()
    const base = pages[path]!
    return {
      ...base,
      image: week.src,
      imageAlt: week.alt,
    }
  }

  if (path === '/stills') {
    const week = thisWeekPlate()
    const base = pages[path]!
    return {
      ...base,
      image: week.src,
      imageAlt: week.alt,
    }
  }

  if (path.startsWith('/sign-in')) return pages['/sign-in']!
  if (path.startsWith('/sign-up')) return pages['/sign-up']!
  if (path.startsWith('/admin')) return pages['/admin']!

  const productHit = path.match(/^\/(shop|collection)\/([^/]+)$/)
  if (productHit) {
    const product = getProduct(productHit[2])
    if (product) {
      return {
        title: `${productLineName(product)} — Kiano London`,
        description: `${productLineName(product)}. ${product.cloth}. Sizes 52 to 60, from the house block.`,
        path: productPath(product),
        image: product.image,
        imageAlt: product.imageAlt,
      }
    }
  }

  const scentHit = path.match(/^\/scent\/([^/]+)$/)
  if (scentHit) {
    const scent = getScent(scentHit[1])
    if (scent) {
      return {
        title: `${scent.name} — Kiano London`,
        description: `${scent.name}. ${scent.line} ${scent.wear} The scent is coming.`,
        path: scentPath(scent),
        image: scent.image,
        imageAlt: scent.imageAlt,
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
