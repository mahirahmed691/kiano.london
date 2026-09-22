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
        subtitle="Kiano London is a house of the modest garment: a name, a single address, a long silhouette."
        minHeight="tall"
        priority
      />

      <Section>
        <Container>
          <EditorialSplit
            image="/images/cloth-giza.jpg"
            imageAlt="Extra-long staple cotton unrolled, before it is chalked."
            objectPosition="center 40%"
            imageOn="right"
          >
            <Eyebrow>{site.established}</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">
              Founded for those who preferred to be well dressed rather than noticed.
            </Display>
            <Body className="mt-6">
              The first ledger lists thobes, not customers. Cloth chosen to last, and a
              belief that a modest column of cloth is a long conversation, not a season.
            </Body>
            <Body className="mt-4">
              The name is Kiano London. It is not a translation, and not a legend taken
              from elsewhere. We remain a single address and the same silhouette: ankle,
              shoulder, placket concealed.
            </Body>
          </EditorialSplit>
        </Container>
      </Section>

      <Section className="bg-ivory-deep/40">
        <Container>
          <EditorialSplit
            image="/images/look-lanesborough.jpg"
            imageAlt="A white Emirati thobe at The Lanesborough, Hyde Park Corner."
            objectPosition="center 22%"
            imageOn="left"
          >
            <Eyebrow>Hyde Park Corner</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">The white column.</Display>
            <Body className="mt-6">
              The stills are the line as it is worn: London stone, a quiet column, a
              caption that ends with the name of the house. Not a second look for a feed.
            </Body>
            <Body className="mt-4">
              This plate sits in the book as Hyde Park Corner. When it is the week, it
              opens the house.
            </Body>
            <div className="mt-8">
              <TextLink to="/stills#lanesborough-white">The stills</TextLink>
            </div>
          </EditorialSplit>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow>A visit</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">The house</Display>
            </Reveal>
            <div className="space-y-8 lg:col-span-7 lg:col-start-6">
              <Reveal>
                <h3 className="font-display text-2xl font-light">The appointment</h3>
                <Body className="mt-3">
                  There is no window dressing. Cloth is shown on the table. A thobe is
                  tried in natural light. Appointments last as long as they need to.
                </Body>
              </Reveal>
              <Reveal delay={80}>
                <h3 className="font-display text-2xl font-light">The block</h3>
                <Body className="mt-3">
                  Paper for the Emirati thobe is kept. New patterns are added. Old ones
                  are not discarded. Kiano remembers through its paper.
                </Body>
              </Reveal>
              <Reveal delay={140}>
                <h3 className="font-display text-2xl font-light">The work today</h3>
                <Body className="mt-3">
                  The line is five thobes in small numbers: Layl, Hadīd, Ghabār, Raml
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
          <EditorialSplit
            image="/images/cutting-room.jpg"
            imageAlt="Paper, shears, and cloth: the work of a thobe."
            objectPosition="center 40%"
            imageOn="right"
          >
            <Eyebrow>Visit</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">By appointment</Display>
            <Body className="mt-6">
              Write to the atelier if you wish to see cloth, sit for a fitting, or
              simply come. We keep the diary small on purpose.
            </Body>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/visit">Visit by appointment</Button>
              <TextLink to="/stills">The stills</TextLink>
              <TextLink to="/craftsmanship">How it is made</TextLink>
            </div>
          </EditorialSplit>
        </Container>
      </Section>
    </>
  )
}
