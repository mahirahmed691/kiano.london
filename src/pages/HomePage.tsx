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
    title: 'Cavendish House — Premium Jubbah & Thobe, London',
    description:
      'Cavendish House is a Mayfair atelier of the jubbah and the thobe. Irish linen, Yorkshire worsted, hand-felled seams, cut in London since 1894.',
    path: '/',
    image: '/images/og.jpg',
  })

  return (
    <>
      <Hero
        image="/images/hero-model.png"
        imageAlt="A man in a long modest jubbah, photographed in quiet studio light."
        objectPosition="center 18%"
        kicker={`Established ${site.established} · ${site.neighbourhood}`}
        title="The lasting jubbah."
        subtitle="A London house of the thobe: cut slowly, from cloth chosen to outlive the season."
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
            </Reveal>
            <Reveal delay={100} className="lg:col-span-6 lg:pt-10">
              <Lead>
                Cavendish House cuts the jubbah and the thobe in Mayfair. Irish linen for
                summer. Yorkshire worsted for winter. A concealed placket. A felled seam.
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
              <Display className="mt-3 text-4xl md:text-5xl">Selected pieces</Display>
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
            image="/images/craft-closeup.jpg"
            imageAlt="Hand stitching through the collar stand of a jubbah."
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
          src="/images/linen-drape-home.jpg"
          alt="Olive linen falling in a long modest line."
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
          objectPosition="center"
        />
        <div className="absolute inset-0 bg-night/55" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[70svh] items-center px-6 py-24 md:px-12 lg:px-16">
          <QuoteBlock
            tone="dark"
            quote="The modest garment is not empty. It is full of work you are not meant to see."
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
                src="/images/garments-rail.png"
                alt="Jubbahs and thobes spaced on a brass rail in the Mayfair atelier."
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
