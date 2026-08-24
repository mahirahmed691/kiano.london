import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export function StoryPage() {
  usePageMeta({
    title: 'Our Story — Cavendish House',
    description:
      'A London atelier of the Emirati thobe, founded in 2026 as a cutting room for the modest wardrobe.',
    path: '/story',
    image: '/images/featured-overcoat.jpg',
  })

  return (
    <>
      <Hero
        image="/images/featured-overcoat.jpg"
        imageAlt="A charcoal Emirati thobe, the house silhouette, worn at full length."
        objectPosition="center 62%"
        kicker={`Est. ${site.established}`}
        title="A house, not a brand."
        subtitle="Cavendish House opened as a cutting room for the modest garment — a small workroom, and a long silhouette."
        minHeight="tall"
        priority
      />

      <Section>
        <Container>
          <EditorialSplit
            image="/images/workbench.jpg"
            imageAlt="The cutting bench at Cavendish House: shears, chalk, and the house block."
            objectPosition="center 40%"
            imageOn="right"
          >
            <Eyebrow>{site.established}</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">
              Founded for those who preferred to be well dressed rather than noticed.
            </Display>
            <Body className="mt-6">
              The first ledger lists thobes, not customers. Two cutters, a standing
              arrangement with a mill, and a belief that a modest column of cloth is a
              long conversation — not a season.
            </Body>
            <Body className="mt-4">
              London is where the work is done. The house is not a country myth, and
              not a window display. We remain a single address, a small workroom, and
              the same silhouette: ankle, shoulder, placket concealed.
            </Body>
          </EditorialSplit>
        </Container>
      </Section>

      <Section className="bg-ivory-deep/40 pt-0">
        <Container className="pt-20 md:pt-28">
          <div className="grid gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <ImageFrame
                src="/images/heritage-linen.jpg"
                alt="Extra-long staple cotton in the piece, before it is chalked and cut."
                className="aspect-[4/3] w-full md:aspect-[16/10]"
                objectPosition="center"
                caption="Cloth"
              />
            </Reveal>
            <Reveal delay={100} className="md:col-span-5 md:pt-16">
              <ImageFrame
                src="/images/workbench.jpg"
                alt="The cutting bench: paper patterns, shears, and cloth in the work."
                className="aspect-[3/4] w-full"
                objectPosition="center 40%"
                caption="The workroom"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow>The rooms</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">The atelier</Display>
            </Reveal>
            <div className="space-y-8 lg:col-span-7 lg:col-start-6">
              <Reveal>
                <h3 className="font-display text-2xl font-light">The shop floor</h3>
                <Body className="mt-3">
                  There is no window dressing. Cloth is shown on the table. A thobe is
                  tried in natural light from the street. Appointments last as long as
                  they need to.
                </Body>
              </Reveal>
              <Reveal delay={80}>
                <h3 className="font-display text-2xl font-light">The cutting room</h3>
                <Body className="mt-3">
                  Upstairs, paper patterns for the Emirati thobe hang on a rail. New
                  patterns are added. Old ones are not discarded. A house remembers
                  through its paper.
                </Body>
              </Reveal>
              <Reveal delay={140}>
                <h3 className="font-display text-2xl font-light">The work today</h3>
                <Body className="mt-3">
                  We still cut five earthy thobes in small numbers. Ready-to-wear
                  follows the same patterns as commission work. The difference is only
                  time.
                </Body>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-night py-24 md:py-32">
        <Container>
          <QuoteBlock
            tone="dark"
            quote="A thobe is a piece of architecture you take with you."
            attribution="House note"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <EditorialSplit
            image="/images/concealed-pocket.jpg"
            imageAlt="The interior pocket of a Cavendish thobe, the house label set by hand."
            objectPosition="center"
            imageOn="left"
          >
            <Eyebrow>Visit</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">By appointment</Display>
            <Body className="mt-6">
              Write to the atelier if you wish to see cloth, sit for a fitting, or
              simply walk through the rooms. We keep the diary small on purpose.
            </Body>
            <div className="mt-8 flex flex-wrap gap-6">
              <Button to="/visit">Visit by appointment</Button>
              <TextLink to="/craftsmanship">How it is made</TextLink>
            </div>
          </EditorialSplit>
        </Container>
      </Section>
    </>
  )
}
