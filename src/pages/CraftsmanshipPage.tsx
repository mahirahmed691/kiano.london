import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { NightMotto } from '@/components/editorial/NightMotto'
import { StitchArt } from '@/components/editorial/StitchArt'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { materials, processSteps, stitchStudies } from '@/data/craftsmanship'
import { creedIntent, creedMotto, creedSpoken } from '@/data/creed'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function CraftsmanshipPage() {
  usePageMeta(getShareMeta('/craftsmanship'))

  return (
    <>
      <Hero
        image="/images/worsted-wool.jpg"
        imageAlt="A needle on charcoal cloth: the stitch that holds the column."
        objectPosition="center"
        kicker="Craftsmanship"
        title="The stitch."
        minHeight="screen"
        quiet
        priority
      />

      <Section>
        <Container>
          <StitchArt />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Process</Eyebrow>
            <Display as="h1" className="mt-4 text-4xl md:text-5xl">
              The thobe is built, not assembled.
            </Display>
            <Body className="mt-6">
              {creedSpoken} Cloth. Pattern. Stitch. Finish. Every piece is built in that
              order. We do not fuse a collar because it is faster. The methods are kept
              because they still make a better garment. {creedIntent}
            </Body>
            <div className="mt-8">
              <Button to="/craftsmanship-details">The making, in detail</Button>
            </div>
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

      <Section>
        <Container>
          <Reveal className="mb-14 max-w-xl">
            <Eyebrow>Studies</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">Stitch, seam, fastening, pocket.</Display>
            <Body className="mt-6">
              The photographs are of the work itself: not a campaign, a close look at
              how the column is held together.
            </Body>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            {stitchStudies.map((study, index) => (
              <Reveal key={study.id} delay={index * 70}>
                <figure>
                  <ImageFrame
                    src={study.image}
                    alt={study.imageAlt}
                    className="aspect-[4/5] w-full"
                  />
                  <figcaption className="mt-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                      {study.title}
                    </p>
                    <p className="mt-2 max-w-sm text-[14px] font-light leading-relaxed text-ink-soft">
                      {study.note}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <NightMotto quiet />

      <Section>
        <Container>
          <Reveal className="mb-14 max-w-xl">
            <Eyebrow>Materials</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">Cloth chosen in the piece.</Display>
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
          <Reveal className="max-w-2xl">
            <Eyebrow>Further</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">
              A closer look at the making.
            </Display>
            <Body className="mt-6">
              The seam, the neck, the concealed placket, the nape. Four details that
              decide whether a piece is still itself a decade later. {creedMotto}
            </Body>
            <div className="mt-8">
              <TextLink to="/craftsmanship-details">Read the details</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
