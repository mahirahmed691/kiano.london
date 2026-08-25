import { HouseFilm } from '@/components/editorial/HouseFilm'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { Hero } from '@/components/editorial/Hero'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow, Lead } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { featuredJubbahs, featuredProducts } from '@/data/products'
import { site } from '@/data/site'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const lookbook = [
  {
    src: '/images/thobe-layl.jpg',
    film: '/films/layl.mp4',
    alt: 'The Layl thobe: matte black, band collar, hem to the ankle.',
    objectPosition: 'center 12%',
    name: 'Layl',
  },
  {
    src: '/images/thobe-ghabar.jpg',
    film: '/films/ghabar.mp4',
    alt: 'Ghabār: an earth-grey Emirati thobe, a column of cloth.',
    objectPosition: 'center 18%',
    name: 'Ghabār',
  },
  {
    src: '/images/thobe-raml.jpg',
    film: '/films/raml.mp4',
    alt: 'The Raml thobe: sand extra-long staple, the daylight column.',
    objectPosition: 'center 12%',
    name: 'Raml',
  },
]

export function HomePage() {
  usePageMeta(getShareMeta('/'))

  return (
    <>
      <Hero
        image="/images/featured-overcoat.jpg"
        film="/films/hadid.mp4"
        imageAlt="Hadīd: a charcoal Emirati thobe with a standing collar and a concealed placket, worn at full length."
        objectPosition="68% 12%"
        kicker={`Established ${site.established} · ${site.city}`}
        title="Cut in London."
        subtitle="Emirati thobes and jubbahs, cut in London."
        priority
      >
        <div className="flex flex-wrap items-center gap-6">
          <Button to="/shop" variant="invert">
            The Shop
          </Button>
          <TextLink to="/visit" className="text-ivory">
            Visit the atelier
          </TextLink>
        </div>
      </Hero>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Kiano London</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl lg:text-6xl">
                A name, a room,
                <br />
                a long silhouette.
              </Display>
              <p className="mt-5 text-[0.68rem] uppercase tracking-[0.42em] text-ink/55">
                {site.lockup}
              </p>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-6 lg:pt-10">
              <Lead>
                Kiano London is a cutting room for the modest garment. We cut five thobes,
                and the jubbah in three colours. Cloth chosen to last.
              </Lead>
              <Body className="mt-6">
                The name is the house, not a translation. Nothing here is made for a
                campaign. A thobe should look as considered in its tenth year as it did
                in its first. That is the only standard we keep.
              </Body>
              <div className="mt-8">
                <TextLink to="/story">The story</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>The shop</Eyebrow>
              <Display className="mt-3 text-4xl md:text-5xl">The jubbah</Display>
            </div>
            <TextLink to="/shop">All colours</TextLink>
          </Reveal>
          <ProductGrid products={featuredJubbahs} numbered={false} className="lg:grid-cols-3" />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>The line</Eyebrow>
              <Display className="mt-3 text-4xl md:text-5xl">Five thobes</Display>
            </div>
            <TextLink to="/collection">All of the collection</TextLink>
          </Reveal>
          <ProductGrid products={featuredProducts} numbered={false} className="lg:grid-cols-3" />
        </Container>
      </Section>

      <section>
        {lookbook.map((plate) => (
          <figure key={plate.src} className="relative min-h-[100svh] overflow-hidden bg-night">
            <HouseFilm
              src={plate.film}
              poster={plate.src}
              alt={plate.alt}
              objectPosition={plate.objectPosition}
              className="absolute inset-0 h-full w-full"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(20,18,16,0.72)_0%,rgba(20,18,16,0)_100%)] px-6 pb-10 pt-24 md:px-12 lg:px-16">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/65">The columns</p>
              <p className="mt-2 font-display text-4xl font-light text-ivory md:text-5xl">
                {plate.name}
              </p>
            </figcaption>
          </figure>
        ))}
        <figure className="relative min-h-[100svh] overflow-hidden bg-night">
          <HouseFilm
            src="/films/cloth.mp4"
            poster="/images/stitch-pad.jpg"
            alt="Pad-stitching through the collar stand, silk on linen."
            objectPosition="center 40%"
            className="absolute inset-0 h-full w-full"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(20,18,16,0.72)_0%,rgba(20,18,16,0)_100%)] px-6 pb-10 pt-24 md:px-12 lg:px-16">
            <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/65">The stitch</p>
            <p className="mt-2 font-display text-4xl font-light text-ivory md:text-5xl">
              Closer.
            </p>
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
            <Eyebrow>The atelier</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">Cut in London</Display>
            <Body className="mt-6">
              The cutting room is a single address. Fittings are by appointment. We
              do not keep a shop window. The work is the invitation: Layl, Hadīd,
              the jubbah. Cut in London.
            </Body>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/visit">Visit by appointment</Button>
              <TextLink to="/craftsmanship">How it is made</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
