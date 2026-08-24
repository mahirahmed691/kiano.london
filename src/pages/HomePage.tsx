import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow, Lead } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { featuredProducts } from '@/data/products'
import { site } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export function HomePage() {
  usePageMeta({
    title: 'Cavendish House — Coats, Tailoring & Knitwear, London',
    description:
      'Cavendish House is a Mayfair atelier of coats, tailoring and knitwear, cut by hand in London since 1894.',
    path: '/',
    image: '/images/og.jpg',
  })

  return (
    <>
      <Hero
        image="/images/hero-home.jpg"
        imageAlt="Camel wool wrap coat, tied at the waist, photographed against pale stone."
        objectPosition="center 18%"
        kicker={`Established ${site.established} · ${site.neighbourhood}`}
        title="The lasting coat."
        subtitle="Made slowly in London, from cloth chosen to outlive the season."
        priority
      >
        <Button to="/collection" variant="invert">
          The Collection
        </Button>
      </Hero>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>The house</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl lg:text-6xl">
                Quiet luxury,
                <br />
                cut by hand.
              </Display>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-6 lg:pt-10">
              <Lead>
                Cavendish House is a London atelier of coats, tailoring and knitwear.
                We work with a small cutting room in Mayfair and a handful of British mills.
              </Lead>
              <Body className="mt-6">
                Nothing here is made for a campaign. A coat should look as considered in its
                tenth winter as it did in its first. That is the only standard we keep.
              </Body>
              <div className="mt-8">
                <TextLink to="/story">Our story</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Autumn winter</Eyebrow>
              <Display className="mt-3 text-4xl md:text-5xl">Selected pieces</Display>
            </div>
            <TextLink to="/collection">All of the collection</TextLink>
          </Reveal>
          <ProductGrid products={featuredProducts} numbered={false} className="lg:grid-cols-3" />
        </Container>
      </Section>

      <Section className="bg-ivory-deep/50">
        <Container>
          <EditorialSplit
            image="/images/home-atelier.jpg"
            imageAlt="The Mayfair atelier: garments spaced on black rails beneath a timber ceiling."
            objectPosition="center"
            imageOn="left"
          >
            <Eyebrow>The cut</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">
              Structure you cannot see, and would miss if it were gone.
            </Display>
            <Body className="mt-6">
              Every coat is canvassed, not fused. The chest is pad-stitched by hand so the
              cloth holds its line without stiffness. It is slower work. It is why the
              garment lasts.
            </Body>
            <div className="mt-8">
              <TextLink to="/craftsmanship">Craftsmanship</TextLink>
            </div>
          </EditorialSplit>
        </Container>
      </Section>

      <section className="relative min-h-[70svh] overflow-hidden">
        <ImageFrame
          src="/images/home-craft.jpg"
          alt="A rail of coats and knitwear in cream, navy and terracotta."
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
          objectPosition="center"
        />
        <div className="absolute inset-0 bg-night/55" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[70svh] items-center px-6 py-24 md:px-12 lg:px-16">
          <QuoteBlock
            tone="dark"
            quote="Nothing should look new except the person wearing it."
            attribution="House note, 1926"
          />
        </div>
      </section>

      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow>Mayfair</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">The townhouse</Display>
              <Body className="mt-6">
                Cavendish House still occupies a single address on Carlos Place. The
                cutting room is on the first floor; fittings are by appointment. We do
                not keep a shop window. The work is the invitation.
              </Body>
              <div className="mt-8">
                <Button to="/story">Read our story</Button>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ImageFrame
                src="/images/story-hero.jpg"
                alt="An English country house reflected in still water, the house’s namesake calm."
                className="aspect-[4/3] w-full"
                objectPosition="center"
              />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
