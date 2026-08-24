import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Rule'
import { detailSections } from '@/data/craftsmanship'
import { usePageMeta } from '@/lib/usePageMeta'

export function CraftsmanshipDetailsPage() {
  usePageMeta({
    title: 'The Making — Cavendish House',
    description:
      'The floating canvas, the buttonhole, the shoulder and the lining: how a Cavendish House coat is built.',
    path: '/craftsmanship-details',
    image: '/images/details-hero.jpg',
  })

  return (
    <>
      <Hero
        image="/images/details-hero.jpg"
        imageAlt="Shirting and cloth laid out before they are cut."
        objectPosition="center"
        kicker="Craftsmanship · Details"
        title="What the cloth conceals."
        subtitle="A coat is judged from ten paces. It is made in millimetres."
        minHeight="page"
        priority
      />

      <Section>
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>An editorial of four</Eyebrow>
            <Display as="h2" className="mt-4 text-4xl md:text-5xl">
              Structure, the hand, the line, the unseen.
            </Display>
            <Body className="mx-auto mt-6">
              These are not selling points. They are the reasons a Cavendish garment
              can be recut, relined and worn again. We write them down so they are not
              treated as folklore.
            </Body>
          </Reveal>
        </Container>
      </Section>

      {detailSections.map((section, index) => (
        <Section key={section.id} className={index % 2 === 1 ? 'bg-ivory-deep/40' : undefined}>
          <Container>
            <EditorialSplit
              image={section.image}
              imageAlt={section.imageAlt}
              imageOn={section.imagePosition}
            >
              <Eyebrow>{section.kicker}</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">{section.title}</Display>
              {section.copy.map((paragraph) => (
                <Body key={paragraph.slice(0, 24)} className="mt-5">
                  {paragraph}
                </Body>
              ))}
            </EditorialSplit>
          </Container>
        </Section>
      ))}

      <Section>
        <Container>
          <Rule className="mb-16" />
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <Reveal>
              <Eyebrow>Continue</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">From the workroom to the rail.</Display>
              <Body className="mt-6">
                See the pieces these methods produce, or return to the four acts of
                the making.
              </Body>
            </Reveal>
            <Reveal delay={80} className="flex flex-wrap gap-4 md:justify-end">
              <Button to="/collection">The Collection</Button>
              <TextLink to="/craftsmanship">Craftsmanship</TextLink>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
