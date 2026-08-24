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
      'Founded in Mayfair in 1894, Cavendish House remains a London atelier of coats, tailoring and knitwear.',
    path: '/story',
    image: '/images/story-hero.jpg',
  })

  return (
    <>
      <Hero
        image="/images/story-hero.jpg"
        imageAlt="A stone English house among trees, reflected in still water."
        objectPosition="center 60%"
        kicker={`Est. ${site.established}`}
        title="A house, not a brand."
        subtitle="Cavendish House was founded in Mayfair as a cutting room with rooms above it. That arrangement has not changed."
        minHeight="tall"
        priority
      />

      <Section>
        <Container>
          <EditorialSplit
            image="/images/story-portrait.jpg"
            imageAlt="A navy suit, worn without ceremony, in daylight."
            objectPosition="center 15%"
            imageOn="right"
          >
            <Eyebrow>1894</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">
              Founded for those who preferred to be well dressed rather than noticed.
            </Display>
            <Body className="mt-6">
              Eleanor Cavendish opened the house on Carlos Place with two cutters and a
              standing arrangement with a mill in Yorkshire. The first ledger lists
              coats, not customers. We still keep it that way.
            </Body>
            <Body className="mt-4">
              London has moved around us. The house has not. We remain a single
              address, a small workroom, and a belief that cloth is a long conversation.
            </Body>
          </EditorialSplit>
        </Container>
      </Section>

      <Section className="bg-ivory-deep/40 pt-0">
        <Container className="pt-20 md:pt-28">
          <div className="grid gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <ImageFrame
                src="/images/story-london.jpg"
                alt="London in soft light — the city the house has always dressed."
                className="aspect-[4/3] w-full md:aspect-[16/10]"
                objectPosition="center"
                caption="London"
              />
            </Reveal>
            <Reveal delay={100} className="md:col-span-5 md:pt-16">
              <ImageFrame
                src="/images/story-archive.jpg"
                alt="Garments in the house archive, hung with the space they deserve."
                className="aspect-[3/4] w-full"
                objectPosition="center"
                caption="The archive"
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
              <Display className="mt-4 text-4xl md:text-5xl">Carlos Place</Display>
            </Reveal>
            <div className="space-y-8 lg:col-span-7 lg:col-start-6">
              <Reveal>
                <h3 className="font-display text-2xl font-light">The shop floor</h3>
                <Body className="mt-3">
                  There is no window dressing. Cloth is shown on the table. A coat is
                  tried in natural light from the street. Appointments last as long as
                  they need to.
                </Body>
              </Reveal>
              <Reveal delay={80}>
                <h3 className="font-display text-2xl font-light">The cutting room</h3>
                <Body className="mt-3">
                  Upstairs, paper patterns hang on a rail that has been there longer
                  than anyone now working. New patterns are added. Old ones are not
                  discarded. A house remembers through its paper.
                </Body>
              </Reveal>
              <Reveal delay={140}>
                <h3 className="font-display text-2xl font-light">The work today</h3>
                <Body className="mt-3">
                  We still cut coats, suits and knitwear in small numbers. Ready-to-wear
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
            quote="A coat is a piece of architecture you take with you."
            attribution="Eleanor Cavendish"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <EditorialSplit
            image="/images/story-cutting.jpg"
            imageAlt="The house interior: rails, timber, and clothes given room to hang."
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
              <Button href={`mailto:${site.email}`}>Write to the house</Button>
              <TextLink to="/craftsmanship">How it is made</TextLink>
            </div>
          </EditorialSplit>
        </Container>
      </Section>
    </>
  )
}
