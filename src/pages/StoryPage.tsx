import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/data/site'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function StoryPage() {
  usePageMeta(getShareMeta('/story'))

  return (
    <>
      <Hero
        image="/images/atelier-rail.jpg"
        imageAlt="The house line on the rail: black, sand, and bone."
        objectPosition="18% 40%"
        kicker={site.fullName}
        title="The house."
        subtitle="Kiano London is a cutting room for the modest garment: a name, a single address, a long silhouette."
        minHeight="tall"
        priority
      />

      <Section>
        <Container>
          <EditorialSplit
            image="/images/cloth-giza.jpg"
            imageAlt="Extra-long staple cotton unrolled on the cutting table."
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
              long conversation, not a season.
            </Body>
            <Body className="mt-4">
              The name is Kiano London. It is not a translation, and not a legend taken
              from elsewhere. London is where the work is cut. We remain a single
              address, a small workroom, and the same silhouette: ankle, shoulder,
              placket concealed.
            </Body>
          </EditorialSplit>
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
                  patterns are added. Old ones are not discarded. Kiano remembers
                  through its paper.
                </Body>
              </Reveal>
              <Reveal delay={140}>
                <h3 className="font-display text-2xl font-light">The work today</h3>
                <Body className="mt-3">
                  We still cut five thobes in small numbers: Layl, Hadīd, Ghabār, Raml
                  and Hajar. Ready-to-wear follows the same patterns as commission work.
                  The difference is only time.
                </Body>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-ivory-deep/50 py-24 md:py-32">
        <Container>
          <QuoteBlock
            quote="A thobe is a piece of architecture you take with you."
            attribution={site.note}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="max-w-2xl">
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
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
