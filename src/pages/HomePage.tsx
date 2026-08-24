import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { StitchArt } from '@/components/editorial/StitchArt'
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
    title: 'Cavendish House — الجُبَّة',
    description:
      'Cavendish House cuts the Emirati thobe in London: black, grey and beige, sizes 52 to 60, in premium cloth.',
    path: '/',
    image: '/images/featured-overcoat.jpg',
  })

  return (
    <>
      <Hero
        image="/images/featured-overcoat.jpg"
        imageAlt="A charcoal Emirati thobe with a standing collar and a concealed placket, worn at full length."
        objectPosition="center 12%"
        kicker={`Established ${site.established} · ${site.city}`}
        title="A column of cloth."
        subtitle="Earthy Emirati thobes, cut slowly in London. Black, grey, beige. Sizes 52 to 60."
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
                Modest luxury,
                <br />
                held by the stitch.
              </Display>
              <p
                lang="ar"
                dir="rtl"
                className="mt-5 font-arabic text-2xl font-normal text-ink/55 md:text-3xl"
              >
                {site.arabicName}
              </p>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-6 lg:pt-10">
              <Lead>
                Cavendish House is a London atelier of the Emirati thobe. Black,
                charcoal, grey, beige and bone. Japanese cotton, Super 150s, extra-long
                staple — cloth chosen to last.
              </Lead>
              <Body className="mt-6">
                Nothing here is made for a campaign. A thobe should look as considered in
                its tenth year as it did in its first. That is the only standard we keep.
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
              <Eyebrow>The house line</Eyebrow>
              <Display className="mt-3 text-4xl md:text-5xl">Five thobes</Display>
            </div>
            <TextLink to="/collection">All of the collection</TextLink>
          </Reveal>
          <ProductGrid
            products={featuredProducts}
            numbered={false}
            linkTo="/collection"
            className="lg:grid-cols-3"
          />
        </Container>
      </Section>

      <Section className="bg-ivory-deep/50">
        <Container>
          <StitchArt />
        </Container>
      </Section>

      <Section>
        <Container>
          <EditorialSplit
            image="/images/worsted-wool.jpg"
            imageAlt="A needle resting on charcoal worsted — the cloth of a winter thobe."
            objectPosition="center"
            imageOn="left"
          >
            <Eyebrow>The stitch</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">
              Structure you cannot see, and would miss if it were gone.
            </Display>
            <Body className="mt-6">
              Side seams are felled, not overlocked. The collar is pad-stitched by hand
              so the neck holds its line. Fastenings sit inside the placket. It is slower
              work. It is why the garment lasts.
            </Body>
            <div className="mt-8">
              <TextLink to="/craftsmanship">Craftsmanship</TextLink>
            </div>
          </EditorialSplit>
        </Container>
      </Section>

      <section className="relative min-h-[70svh] overflow-hidden">
        <ImageFrame
          src="/images/featured-overcoat.jpg"
          alt="A charcoal Emirati thobe at rest — the house silhouette, a column of cloth."
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
          objectPosition="center 58%"
        />
        <div className="absolute inset-0 bg-night/55" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[70svh] items-center px-6 py-24 md:px-12 lg:px-16">
          <QuoteBlock
            tone="dark"
            quote="The modest garment is not empty. It is full of work you are not meant to see."
            attribution="House note"
          />
        </div>
      </section>

      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow>The atelier</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">Cut in London</Display>
              <Body className="mt-6">
                The cutting room is a single address. Fittings are by appointment. We
                do not keep a shop window. The work is the invitation — an Emirati
                thobe, cloth chosen to outlive the season.
              </Body>
              <div className="mt-8">
                <Button to="/story">Read our story</Button>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ImageFrame
                src="/images/heritage-linen.jpg"
                alt="A roll of extra-long staple cotton, the beige cloth of the house."
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
