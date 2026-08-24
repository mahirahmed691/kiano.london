import { ImageFrame } from '@/components/editorial/ImageFrame'
import { SizeGuide } from '@/components/product/SizeGuide'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { AppointmentForm } from '@/components/visit/AppointmentForm'
import { site } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

const visitSteps = [
  {
    number: '01',
    title: 'Write',
    copy: 'Name the piece if you know it, and a size if you have one. If you do not, say so. The diary is kept small on purpose.',
  },
  {
    number: '02',
    title: 'Sit',
    copy: 'Cloth is shown on the table in daylight from the street. A thobe is tried. The appointment lasts as long as it needs to.',
  },
  {
    number: '03',
    title: 'Cut',
    copy: 'We cut from the house block, four to eight weeks. A second visit for a fitting if the garment asks for one.',
  },
]

export function VisitPage() {
  usePageMeta({
    title: 'Visit — Suhail',
    description:
      'Appointments at the Suhail atelier in Mayfair. See cloth, sit for a fitting, or walk the rooms.',
    path: '/visit',
    image: '/images/workbench.jpg',
  })

  return (
    <>
      <header className="bg-ivory pt-32 pb-10 md:pt-40 md:pb-14">
        <Container>
          <Reveal>
            <Eyebrow>The atelier</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
              By appointment.
            </Display>
            <p lang="ar" dir="rtl" className="mt-4 font-arabic text-2xl text-ink/55">
              {site.arabicName}
            </p>
            <Body className="mt-6 max-w-xl">
              There is no shop window. Come to see cloth, to be fitted, or to walk the
              rooms. Write first. We keep the diary small.
            </Body>
          </Reveal>
        </Container>
      </header>

      <div className="img-zoom relative aspect-[16/8] max-h-[520px] overflow-hidden bg-ivory-deep md:aspect-[21/8]">
        <img
          src="/images/workbench.jpg"
          alt="The cutting bench at Suhail: shears, chalk, and cloth in progress."
          className="object-[center_40%]"
          loading="eager"
          decoding="async"
        />
      </div>

      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow>A visit</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">Three acts.</Display>
            </Reveal>
            <div className="space-y-10 lg:col-span-7 lg:col-start-6">
              {visitSteps.map((step, index) => (
                <Reveal key={step.number} delay={index * 60}>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{step.number}</p>
                  <h2 className="mt-2 font-display text-3xl font-light">{step.title}</h2>
                  <Body className="mt-3">{step.copy}</Body>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-ivory-deep/40">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>The letter</Eyebrow>
              <Display as="h2" className="mt-4 text-4xl md:text-5xl">
                Request a time.
              </Display>
              <Body className="mt-6">
                The form opens a letter to the house. If you would rather write directly:{' '}
                <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </Body>
              <address className="mt-10 not-italic">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Address</p>
                <p className="mt-3 max-w-xs text-[15px] font-light leading-relaxed text-ink-soft">
                  {site.address}
                  <br />
                  {site.hours}
                  <br />
                  <a href={site.telephoneHref}>{site.telephone}</a>
                </p>
              </address>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
              <AppointmentForm />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid items-start gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Sizes 52–60</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">The house block.</Display>
              <Body className="mt-6">
                If you already know your size, name it in the letter. If you do not, we
                will measure you here. Between sizes, we cut from the larger and take in.
              </Body>
              <SizeGuide className="mt-10" compact />
              <p className="mt-6 max-w-md text-[13px] font-light leading-relaxed text-stone">
                Prices include VAT. Each thobe is cut to order.
              </p>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
              <ImageFrame
                src="/images/heritage-linen.jpg"
                alt="Extra-long staple cotton in the piece, shown on the table before it is cut."
                className="aspect-[4/5] w-full"
                caption="Cloth is shown on the table, in daylight."
              />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
