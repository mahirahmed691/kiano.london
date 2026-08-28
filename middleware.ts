import { isShareBot, renderShareDocument } from './src/lib/share.js'

export const config = {
  matcher: ['/((?!api/|images/|favicon|robots.txt|sitemap.xml|logo.svg).*)'],
}

export default function middleware(request: Request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return
  const ua = request.headers.get('user-agent') ?? ''
  if (!isShareBot(ua)) return

  const url = new URL(request.url)
  if (url.pathname.includes('.')) return
  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) return

  const origin = url.origin.replace(/\/$/, '')
  return new Response(renderShareDocument(origin, url.pathname), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, s-maxage=600, stale-while-revalidate=86400',
    },
  })
}
