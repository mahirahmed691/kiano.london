import { Link } from 'react-router-dom'
import { HouseMark } from '@/components/brand/HouseMark'
import { SubscribeForm } from '@/components/notices/SubscribeForm'
import { Container } from '@/components/ui/Container'
import { Rule } from '@/components/ui/Rule'
import { primaryNav } from '@/data/navigation'
import { social } from '@/data/social'
import { site } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-night text-ivory">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          <div>
            <HouseMark className="text-ivory" />
            <p className="mt-4 max-w-xs text-[14px] font-light leading-relaxed text-ivory/65">
              {site.tagline}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/45">
              {site.fullName}
            </p>
            <ul className="mt-4 space-y-2">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-[14px] font-light text-ivory/80 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/craftsmanship-details"
                  className="text-[14px] font-light text-ivory/80 transition-opacity hover:opacity-100"
                >
                  The making
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="text-[14px] font-light text-ivory/80 transition-opacity hover:opacity-100"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/45">Atelier</p>
            <address className="mt-4 not-italic text-[14px] font-light leading-relaxed text-ivory/80">
              {site.address}
              <br />
              {site.hours}
              <br />
              <a className="mt-2 inline-block" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <br />
              <a href={site.telephoneHref}>{site.telephone}</a>
            </address>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/45">The list</p>
            <p className="mt-4 text-[14px] font-light leading-relaxed text-ivory/65">
              Cloth and when a piece can be reserved. A few letters a year.
            </p>
            <div className="mt-6">
              <SubscribeForm idPrefix="letters-footer" source="footer" variant="dark" />
            </div>
          </div>
        </div>

        <Rule className="my-10 bg-ivory/15" />

        <div className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.18em] text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.fullName}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            {social.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-opacity hover:text-ivory"
              >
                {item.label}
              </a>
            ))}
            <Link to="/privacy" className="transition-opacity hover:text-ivory">
              Privacy
            </Link>
            <Link to="/cookies" className="transition-opacity hover:text-ivory">
              Cookies
            </Link>
            <span>
              Est. {site.established} · {site.city}
            </span>
          </p>
        </div>
      </Container>
    </footer>
  )
}
