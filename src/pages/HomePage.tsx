import { LookbookStrip } from '@/components/editorial/LookbookStrip'
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
    alt: 'The Layl thobe: matte black, band collar, hem to the ankle.',
    objectPosition: 'center 12%',
  },
  {
    src: '/images/thobe-ghabar.jpg',
    alt: 'Ghabār: an earth-grey Emirati thobe, a column of cloth.',
    objectPosition: 'center 18%',
  },
  {
    src: '/images/thobe-raml.jpg',
    alt: 'The Raml thobe: sand extra-long staple, the daylight column.',
    objectPosition: 'center 12%',
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

      <Section className="bg-ivory-deep/50">
        <Container>
          <Reveal className="mb-12 md:mb-16">
            <Eyebrow>The columns</Eyebrow>
            <Display className="mt-3 text-4xl md:text-5xl">Layl, Ghabār, Raml.</Display>
          </Reveal>
        </Container>
        <LookbookStrip plates={lookbook} />
      </Section>

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
