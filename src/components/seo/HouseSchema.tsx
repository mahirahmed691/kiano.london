import { social } from '@/data/social'
import { site } from '@/data/site'

export function HouseSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.fullName,
    url: 'https://www.kiano.london',
    email: site.email,
    telephone: site.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8 Carlos Place',
      addressLocality: 'London',
      postalCode: 'W1K 3AS',
      addressCountry: 'GB',
    },
    ...(social.length ? { sameAs: social.map((item) => item.href) } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
