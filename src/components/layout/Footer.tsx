import { Link } from 'react-router-dom'
import { HouseMark } from '@/components/brand/HouseMark'
import { SubscribeForm } from '@/components/notices/SubscribeForm'
import { Container } from '@/components/ui/Container'
import { Rule } from '@/components/ui/Rule'
import { creedJoin, creedMotto } from '@/data/creed'
import { primaryNav } from '@/data/navigation'
import { social } from '@/data/social'
import { site } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="scheme-dark bg-night text-ivory">
      <Container className="pt-28 pb-24 md:pt-40 md:pb-32">
        <div className="flex flex-col items-center text-center">
          <HouseMark compact={false} className="text-bronze" />
          <p className="mt-6 max-w-xs text-[14px] font-light leading-[1.85] text-ivory/65">
            {site.tagline}
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.32em] text-bronze">
            {creedJoin}
          </p>
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-bronze">
              {site.fullName}
            </p>
            <ul className="mt-4 space-y-2">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-[14px] font-light text-ivory/80 transition-colors duration-500 hover:text-bronze"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/stills"
                  className="text-[14px] font-light text-ivory/80 transition-colors duration-500 hover:text-bronze"
                >
                  Stills
                </Link>
              </li>
              <li>
                <Link
                  to="/craftsmanship-details"
                  className="text-[14px] font-light text-ivory/80 transition-colors duration-500 hover:text-bronze"
                >
                  The making
                </Link>
              </li>
              <li>
                <Link
                  to="/reservation"
                  className="text-[14px] font-light text-ivory/80 transition-colors duration-500 hover:text-bronze"
                >
                  A reserved cut
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="text-[14px] font-light text-ivory/80 transition-colors duration-500 hover:text-bronze"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-bronze">Visit</p>
            <address className="mt-5 not-italic text-[14px] font-light leading-[1.85] text-ivory/80">
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
            <p className="text-[10px] uppercase tracking-[0.32em] text-bronze">The list</p>
            <p className="mt-4 text-[14px] font-light leading-relaxed text-ivory/65">
              Cloth, and when a piece can be reserved. The scent, when it is of the house.
              A few letters a year.
            </p>
            <div className="mt-6">
              <SubscribeForm idPrefix="letters-footer" source="footer" variant="dark" />
            </div>
          </div>
        </div>

        <Rule className="my-14 bg-bronze/30" />

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
                className="transition-colors duration-500 hover:text-bronze"
              >
                {item.label}
              </a>
            ))}
            <Link to="/privacy" className="transition-colors duration-500 hover:text-bronze">
              Privacy
            </Link>
            <Link to="/returns" className="transition-colors duration-500 hover:text-bronze">
              Returns
            </Link>
            <Link to="/cookies" className="transition-colors duration-500 hover:text-bronze">
              Cookies
            </Link>
            <span>
              {creedMotto} · Est. {site.established} · {site.city}
            </span>
          </p>
        </div>
      </Container>
    </footer>
  )
}
