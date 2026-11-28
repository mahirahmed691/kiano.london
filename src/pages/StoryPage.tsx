import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { NightMotto } from '@/components/editorial/NightMotto'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedIntent, creedMotto, creedSpoken, creedStandard, creedWoven } from '@/data/creed'
import { site } from '@/data/site'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function StoryPage() {
  usePageMeta(getShareMeta('/story'))

  return (
    <>
      <Hero
        image="/images/atelier-rail.jpg"
        imageAlt="The house line on the rail."
        objectPosition="18% 40%"
        kicker={creedStandard}
        title="The house."
        minHeight="screen"
        quiet
        priority
      />

      <Section>
        <Container>
          <EditorialSplit
            image="/images/cloth-giza.jpg"
            imageAlt="Cloth unrolled, before it is chalked."
            objectPosition="center 40%"
            imageOn="right"
          >
            <Eyebrow>{site.established}</Eyebrow>
            <Display as="h1" className="mt-4 text-4xl md:text-5xl">
              Founded for those who preferred to be well dressed rather than noticed.
            </Display>
            <Body className="mt-6">
              {creedWoven} {creedIntent} The first ledger lists thobes, not customers. Cloth chosen to last, and a
              belief that a modest column of cloth is a long conversation, not a season.
              {` ${creedMotto}`}
            </Body>
            <Body className="mt-4">
              The name is Kiano London. It is not a translation, and not a legend taken
              from elsewhere. London is the house. The silhouette stays the same: ankle,
              shoulder, placket concealed.
            </Body>
          </EditorialSplit>
        </Container>
      </Section>

      <Section>
        <Container>
          <EditorialSplit
            image="/images/look-lanesborough.jpg"
            imageAlt="A white thobe worn outside a stone building."
            objectPosition="center 22%"
            imageOn="left"
          >
            <Eyebrow>The lookbook</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">The white column.</Display>
            <Body className="mt-6">
              The stills are the line as it is worn: stone, a quiet column, a caption
              that ends with the name of the house. Not a second look for a feed.
            </Body>
            <Body className="mt-4">
              When it is the week, this still opens the house.
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
                  There is no window dressing. One garment, made well in set sizes, to be
                  worn every day with intent. {creedMotto}
                </Body>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <NightMotto />

      <Section>
        <Container>
          <EditorialSplit
            image="/images/cutting-room.jpg"
            imageAlt="Paper, shears, and cloth: the work of a thobe."
            objectPosition="center 40%"
            imageOn="right"
          >
            <Eyebrow>How it is made</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">Handmade in the UAE</Display>
            <Body className="mt-6">
              Each piece is cut and sewn by hand in our workshop in the UAE, in small runs, and
              sent to you from the UK. Questions about sizing or an order? Write to us. {creedIntent}
            </Body>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/contact">Contact us</Button>
              <TextLink to="/stills">The stills</TextLink>
              <TextLink to="/craftsmanship">How it is made</TextLink>
            </div>
          </EditorialSplit>
        </Container>
      </Section>
    </>
  )
}
