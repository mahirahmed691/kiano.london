import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedIntent, creedJoin, creedMotto, creedSpoken, creedStandard, creedWoven } from '@/data/creed'
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
        kicker={creedStandard}
        title="The house."
        subtitle={`${creedWoven} ${creedIntent}`}
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
              {` ${creedMotto}`}
            </Body>
            <Body className="mt-4">
              The name is Kiano London. It is not a translation, and not a legend taken
              from elsewhere. We remain a single address and the same silhouette: ankle,
              shoulder, placket concealed.
            </Body>
          </EditorialSplit>
        </Container>
      </Section>

      <Section>
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
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow>{creedStandard}</Eyebrow>
              <Display className="mt-6 text-4xl md:text-5xl lg:text-6xl">{creedSpoken}</Display>
            </Reveal>
            <div className="divide-y divide-rule lg:col-span-7 lg:col-start-6">
              <Reveal className="pb-10">
                <h3 className="font-display text-3xl font-light md:text-4xl">Discipline</h3>
                <Body className="mt-5">
                  Paper for the Emirati thobe is kept. One block, one silhouette. New
                  patterns are added; old ones are not discarded. The shears follow the grain.
                </Body>
              </Reveal>
              <Reveal delay={80} className="py-10">
                <h3 className="font-display text-3xl font-light md:text-4xl">Craftsmanship</h3>
                <Body className="mt-5">
                  Ready-to-wear follows the same methods as commission work: felled
                  seams, pad-stitched collars, a finish from the inside. The difference is only time.
                </Body>
              </Reveal>
              <Reveal delay={140} className="pt-10">
                <h3 className="font-display text-3xl font-light md:text-4xl">Purpose</h3>
                <Body className="mt-5">
                  There is no window dressing. Cloth is shown on the table. A thobe is
                  tried in natural light, then worn with intent. {creedMotto}
                </Body>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section paper={false} className="bg-night py-28 md:py-40">
        <Container>
          <QuoteBlock
            tone="dark"
            quote={creedMotto}
            attribution={creedJoin}
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
              simply come. We keep the diary small on purpose. {creedIntent}
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
