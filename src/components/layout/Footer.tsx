import { Link } from 'react-router-dom'
import { SubscribeForm } from '@/components/notices/SubscribeForm'
import { Container } from '@/components/ui/Container'
import { social } from '@/data/social'
import { site } from '@/data/site'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All pieces', to: '/shop' },
      { label: 'Collection', to: '/collection' },
      { label: 'Lookbook', to: '/stills' },
      { label: 'Scent', to: '/scent' },
    ],
  },
  {
    title: 'The House',
    links: [
      { label: 'Story', to: '/story' },
      { label: 'Craftsmanship', to: '/craftsmanship' },
      { label: 'The making', to: '/craftsmanship-details' },
      { label: 'Visit the atelier', to: '/visit' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Delivery', to: '/delivery' },
      { label: 'Returns', to: '/returns' },
      { label: 'Size guide', to: '/size-guide' },
      { label: 'Find an order', to: '/reservation' },
      { label: 'Account', to: '/account' },
    ],
  },
] as const

const legal = [
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Cookies', to: '/cookies' },
] as const

const heading = 'text-[10px] uppercase tracking-[0.32em] text-ivory/50'
const link = 'text-[14px] font-light text-ivory/80 transition-colors duration-300 hover:text-ivory'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="scheme-dark bg-night text-ivory">
      <Container className="pt-20 pb-12 md:pt-24 md:pb-14">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link to="/" aria-label={`${site.fullName}, home`} className="inline-block">
              <img
                src="/images/kiano-lockup-mark.png"
                alt=""
                width={807}
                height={351}
                className="h-10 w-auto opacity-90"
              />
            </Link>
            <p className="mt-6 max-w-xs text-[14px] font-light leading-relaxed text-ivory/60">
              New pieces, the lookbook and the occasional letter from the atelier.
            </p>
            <div className="mt-6 max-w-sm">
              <SubscribeForm idPrefix="letters-footer" source="footer" variant="inline" />
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            {columns.map((column) => (
              <div key={column.title}>
                <p className={heading}>{column.title}</p>
                <ul className="mt-5 space-y-3">
                  {column.links.map((item) => (
                    <li key={item.to}>
                      <Link to={item.to} className={link}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3">
              <p className={heading}>Contact</p>
              <p className="mt-4 text-[14px] font-light text-ivory/80">
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-ivory">
                  {site.email}
                </a>
                <span className="mx-3 text-ivory/30" aria-hidden="true">
                  ·
                </span>
                {site.city}, by appointment
              </p>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/12 pt-7 text-[11px] tracking-[0.06em] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.fullName}. Est. {site.established}.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
            {social.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-ivory">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
