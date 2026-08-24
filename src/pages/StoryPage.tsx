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
      'Founded in Mayfair in 1894, Cavendish House remains a London atelier of the jubbah and the thobe.',
    path: '/story',
    image: '/images/story-vision.jpg',
  })

  return (
    <>
      <Hero
        image="/images/story-vision.jpg"
        imageAlt="A quiet London terrace in morning light — the city the house has always dressed."
        objectPosition="center 40%"
        kicker={`Est. ${site.established}`}
        title="A house, not a brand."
        subtitle="Cavendish House was founded in Mayfair as a cutting room for the modest garment. That arrangement has not changed."
        minHeight="tall"
        priority
      />

      <Section>
        <Container>
          <EditorialSplit
            image="/images/linen-jubbah.jpg"
            imageAlt="An olive linen thobe, the house’s enduring silhouette."
            objectPosition="center"
            imageOn="right"
          >
            <Eyebrow>1894</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">
              Founded for those who preferred to be well dressed rather than noticed.
            </Display>
            <Body className="mt-6">
              Eleanor Cavendish opened the house on Carlos Place with two cutters and a
              standing arrangement with a mill in Yorkshire. The first ledger lists
              jubbahs, not customers. We still keep it that way.
            </Body>
            <Body className="mt-4">
              London has moved around us. The house has not. We remain a single
              address, a small workroom, and a belief that a modest garment is a long
              conversation with cloth.
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
                src="/images/workbench.jpg"
                alt="The cutting table, where paper patterns for the jubbah still hang."
                className="aspect-[3/4] w-full"
                objectPosition="center"
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
              <Display className="mt-4 text-4xl md:text-5xl">Carlos Place</Display>
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
                  Upstairs, paper patterns for the jubbah hang on a rail that has been
                  there longer than anyone now working. New patterns are added. Old ones
                  are not discarded. A house remembers through its paper.
                </Body>
              </Reveal>
              <Reveal delay={140}>
                <h3 className="font-display text-2xl font-light">The work today</h3>
                <Body className="mt-3">
                  We still cut jubbahs and thobes in small numbers. Ready-to-wear
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
            quote="A jubbah is a piece of architecture you take with you."
            attribution="Eleanor Cavendish"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <EditorialSplit
            image="/images/label-concrete.png"
            imageAlt="The woven Cavendish House label, set by hand at the nape."
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
