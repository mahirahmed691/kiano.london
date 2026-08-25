import { packingNote, packingSteps, sewnLabels } from '@/data/packing'
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
          </Reveal>
          <div className="space-y-10 lg:col-span-7 lg:col-start-6">
            {packingSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 60}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{step.number}</p>
                <h3 className="mt-2 font-display text-3xl font-light">{step.title}</h3>
                <Body className="mt-3">{step.copy}</Body>
              </Reveal>
            ))}
          </div>
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
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
