import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { LookbookStrip } from '@/components/editorial/LookbookStrip'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { StitchArt } from '@/components/editorial/StitchArt'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow, Lead } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { featuredJubbahs, featuredProducts } from '@/data/products'
import { site } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

const lookbook = [
  {
    src: '/images/concealed-pocket.jpg',
    alt: 'The interior of the Layl thobe: the woven label set by hand.',
    caption: 'The unseen',
    objectPosition: 'center 62%',
  },
  {
    src: '/images/heritage-linen.jpg',
    alt: 'Extra-long staple cotton in the piece, the sand cloth of Raml.',
    caption: 'Cloth in the piece',
    objectPosition: '22% 50%',
  },
  {
    src: '/images/workbench.jpg',
    alt: 'The cutting bench: shears, chalk, and paper for the house block.',
    caption: 'The bench',
    objectPosition: 'center 40%',
  },
]

export function HomePage() {
  usePageMeta({
    title: 'Kiano London',
    description:
      'Layl, Hadīd, Ghabār, Raml and Hajar. The jubbah in black, sand and charcoal. Cut in London, sizes 52 to 60.',
    path: '/',
    image: '/images/featured-overcoat.jpg',
  })

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
            <Eyebrow>In the rooms</Eyebrow>
            <Display className="mt-3 text-4xl md:text-5xl">Garment, cloth, bench.</Display>
          </Reveal>
        </Container>
        <LookbookStrip
          plates={lookbook.map(({ src, alt, objectPosition }) => ({
            src,
            alt,
            objectPosition,
          }))}
        />
      </Section>

      <Section>
        <Container>
          <StitchArt />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <EditorialSplit
            image="/images/worsted-wool.jpg"
            imageAlt="A needle resting on charcoal worsted: the cloth of a winter thobe."
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
          alt="Hadīd at rest: a charcoal Emirati thobe, a column of cloth."
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
          objectPosition="center 58%"
        />
        <div className="absolute inset-0 bg-night/55" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[70svh] items-center px-6 py-24 md:px-12 lg:px-16">
          <QuoteBlock
            tone="dark"
            quote="The modest garment is not empty. It is full of work you are not meant to see."
            attribution={site.note}
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
                do not keep a shop window. The work is the invitation: Layl, Hadīd,
                the jubbah. Cut in London.
              </Body>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button to="/visit">Visit by appointment</Button>
                <TextLink to="/story">Read the story</TextLink>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ImageFrame
                src="/images/workbench.jpg"
                alt="The cutting bench: shears, chalk, and the house block."
                className="aspect-[4/5] w-full"
                objectPosition="center 40%"
                caption="Mayfair. By appointment."
              />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
