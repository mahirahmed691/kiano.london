import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { materials, processSteps } from '@/data/craftsmanship'
import { usePageMeta } from '@/lib/usePageMeta'

export function CraftsmanshipPage() {
  usePageMeta({
    title: 'Craftsmanship — Cavendish House',
    description:
      'Cloth, pattern, canvas and finish. How a Cavendish House coat is cut and made in Mayfair.',
    path: '/craftsmanship',
    image: '/images/craft-hero.jpg',
  })

  return (
    <>
      <Hero
        image="/images/craft-hero.jpg"
        imageAlt="Cloth hanging in a measured row, the colour and hand of the piece."
        objectPosition="center"
        kicker="The work"
        title="Four acts, and no shortcuts."
        subtitle="Cloth. Pattern. Canvas. Finish. Everything we make passes through the same rooms, in the same order."
        minHeight="tall"
        priority
      >
        <Button to="/craftsmanship-details" variant="invert">
          The making, in detail
        </Button>
      </Hero>

      <Section>
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Process</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">
              The coat is built, not assembled.
            </Display>
            <Body className="mt-6">
              We do not fuse a chest because it is faster. We do not send buttonholes
              out. The methods are older than the house; we keep them because they still
              make a better garment.
            </Body>
          </Reveal>

          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-2 lg:gap-x-10 lg:gap-y-20">
            {processSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 60}>
                <article>
                  <ImageFrame
                    src={step.image}
                    alt={step.imageAlt}
                    className="aspect-[5/4] w-full"
                  />
                  <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-stone">
                    {step.number}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-light">{step.title}</h3>
                  <Body className="mt-3">{step.summary}</Body>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-ivory-deep/50">
        <Container>
          <Reveal className="mb-14 max-w-xl">
            <Eyebrow>Materials</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">British cloth, chosen in the piece.</Display>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((material, index) => (
              <Reveal key={material.name} delay={index * 70}>
                <article className="border-t border-rule pt-6">
                  <h3 className="font-display text-2xl font-light">{material.name}</h3>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-stone">
                    {material.origin}
                  </p>
                  <Body className="mt-4">{material.copy}</Body>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <ImageFrame
                src="/images/details-canvas.jpg"
                alt="Close work in the cutting room."
                className="aspect-[4/5] w-full"
              />
            </Reveal>
            <Reveal delay={100}>
              <Eyebrow>Further</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">
                A closer look at the making.
              </Display>
              <Body className="mt-6">
                The floating canvas, the buttonhole, the shoulder, the lining. Four
                details that decide whether a coat is still itself a decade later.
              </Body>
              <div className="mt-8">
                <TextLink to="/craftsmanship-details">Read the details</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
