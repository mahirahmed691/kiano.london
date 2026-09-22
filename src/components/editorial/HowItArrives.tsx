import { WovenLabel } from '@/components/brand/WovenLabel'
import { HangTag } from '@/components/editorial/HangTag'
import { creedIntent, creedMotto, creedWoven } from '@/data/creed'
import { packingNote, packingNoteAr, packingSteps, sewnLabels } from '@/data/packing'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Container, Section } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

export function HowItArrives() {
  return (
    <Section>
      <Container>
        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>How it arrives</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">The packing.</Display>
            <Body className="mt-8">{packingNote}</Body>
            <p lang="ar" dir="rtl" className="mt-4 w-fit max-w-md font-arabic text-lg font-light leading-relaxed text-ink-soft">
              {packingNoteAr}
            </p>
          </Reveal>
          <div className="space-y-10 lg:col-span-7 lg:col-start-6">
            {packingSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 60}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{step.number}</p>
                <h3 className="mt-2 font-display text-3xl font-light">{step.title}</h3>
                <Body className="mt-3">{step.copy}</Body>
                <p lang="ar" dir="rtl" className="mt-2 w-fit font-arabic text-lg font-light leading-relaxed text-ink-soft">
                  {step.copyAr}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-20 md:mt-28">
          <figure className="relative overflow-hidden bg-ivory-deep">
            <img
              src="/images/atelier-rail.jpg"
              alt="The house line on the rail: black, sand, and bone."
              className="aspect-[21/9] min-h-[16rem] w-full object-cover object-[18%_40%] md:min-h-[22rem]"
              loading="lazy"
              decoding="async"
            />
            <WovenLabel size="md" className="absolute bottom-5 left-5 md:bottom-8 md:left-8" />
          </figure>
        </Reveal>

        <div className="mt-24 grid items-center gap-16 md:mt-32 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <HangTag />
          </Reveal>
          <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
            <Eyebrow>The tag</Eyebrow>
            <Display className="mt-5 text-4xl md:text-5xl lg:text-6xl">The house, in the box.</Display>
            <Body className="mt-8">
              The hang tag sits with the piece. {creedWoven} {creedIntent} {creedMotto}
            </Body>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-16 border-t border-rule pt-16 md:mt-28 md:pt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>Sewn in</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">Three labels.</Display>
            <Body className="mt-8">
              The neck is the house. Size and care are separate, so the mark stays cloth,
              not a notice.
            </Body>
          </Reveal>
          <div className="space-y-10 lg:col-span-7 lg:col-start-6">
            {sewnLabels.map((item, index) => (
              <Reveal key={item.number} delay={index * 60}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                  {item.number} · {item.title}
                </p>
                <Body className="mt-3">{item.copy}</Body>
                <p lang="ar" dir="rtl" className="mt-2 w-fit font-arabic text-lg font-light leading-relaxed text-ink-soft">
                  {item.copyAr}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
