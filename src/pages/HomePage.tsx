import { Link } from 'react-router-dom'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { Hero } from '@/components/editorial/Hero'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow, Lead } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/data/site'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const lookbook = [
  {
    src: '/images/thobe-layl.jpg',
    alt: 'The Layl thobe: matte black, band collar, hem to the ankle.',
    objectPosition: 'center 12%',
    kicker: '01',
    name: 'Layl',
    to: '/collection/layl-thobe',
  },
  {
    src: '/images/thobe-ghabar.jpg',
    alt: 'Ghabār: an earth-grey Emirati thobe, a column of cloth.',
    objectPosition: 'center 18%',
    kicker: '02',
    name: 'Ghabār',
    to: '/collection/ghabar-thobe',
  },
  {
    src: '/images/thobe-raml.jpg',
    alt: 'The Raml thobe: sand extra-long staple, the daylight column.',
    objectPosition: 'center 12%',
    kicker: '03',
    name: 'Raml',
    to: '/collection/raml-thobe',
  },
]

export function HomePage() {
  usePageMeta(getShareMeta('/'))

  return (
    <>
      <Hero
        image="/images/featured-overcoat.jpg"
        imageAlt="Hadīd: a charcoal Emirati thobe with a standing collar and a concealed placket, worn at full length."
        objectPosition="68% 12%"
        quiet
        priority
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Kiano London</Eyebrow>
              <Display as="h1" className="mt-4 text-4xl md:text-5xl lg:text-6xl">
                A London house.
              </Display>
              <p className="mt-5 text-[0.68rem] uppercase tracking-[0.42em] text-ink/55">
                {site.lockup}
              </p>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-6 lg:pt-10">
              <Lead>
                Emirati thobes and jubbahs. Five columns, and the outer garment
                in three colours. Cloth chosen to last.
              </Lead>
              <Body className="mt-6">
                The name is the house, not a translation. Nothing here is made for a
                campaign. A thobe should look as considered in its tenth year as it did
                in its first. That is the only standard we keep.
              </Body>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button to="/shop">The Shop</Button>
                <TextLink to="/visit">Visit by appointment</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <section>
        {lookbook.map((plate) => (
          <figure key={plate.src} className="relative min-h-[100svh] overflow-hidden bg-night">
            <img
              src={plate.src}
              alt={plate.alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: plate.objectPosition }}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(20,18,16,0.4)_0%,rgba(20,18,16,0)_100%)] px-6 pb-10 pt-16 md:px-12 lg:px-16">
              <Link to={plate.to} className="inline-block text-ivory transition-opacity hover:opacity-80">
                <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/65">{plate.kicker}</p>
                <p className="mt-2 font-display text-3xl font-light md:text-4xl">{plate.name}</p>
              </Link>
            </figcaption>
          </figure>
        ))}
        <figure className="relative min-h-[100svh] overflow-hidden bg-night">
          <img
            src="/images/stitch-pad.jpg"
            alt="Pad-stitching through the collar stand, silk on linen."
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 40%' }}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(20,18,16,0.4)_0%,rgba(20,18,16,0)_100%)] px-6 pb-10 pt-16 md:px-12 lg:px-16">
            <Link to="/craftsmanship" className="inline-block text-ivory transition-opacity hover:opacity-80">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/65">The stitch</p>
              <p className="mt-2 font-display text-3xl font-light md:text-4xl">Closer.</p>
            </Link>
          </figcaption>
        </figure>
      </section>

      <Section className="bg-night py-24 md:py-32">
        <Container>
          <QuoteBlock
            tone="dark"
            quote="The modest garment is not empty. It is full of work you are not meant to see."
            attribution={site.note}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>The house</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">By appointment</Display>
            <Body className="mt-6">
              Fittings are by appointment. We do not keep a shop window. The work is
              the invitation: Layl, Hadīd, the jubbah.
            </Body>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/visit">Visit by appointment</Button>
              <TextLink to="/story">The story</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
