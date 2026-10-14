import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { NightMotto } from '@/components/editorial/NightMotto'
import { HowToMeasure } from '@/components/product/HowToMeasure'
import { SizeGuide } from '@/components/product/SizeGuide'
import { TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { AppointmentForm } from '@/components/visit/AppointmentForm'
import { creedIntent } from '@/data/creed'
import { site } from '@/data/site'
import { plateCopy, thisWeekShopPlate } from '@/lib/instagram-plates'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const visitSteps = [
  {
    number: '01',
    title: 'Write',
    copy: 'Name the piece if you know it, and a size if you have one. If you do not, say so. The house names a morning. There is no calendar to pick from.',
  },
  {
    number: '02',
    title: 'Sit',
    copy: 'Cloth is shown on the table in daylight. A thobe is tried. The stills are the line as it is worn; a visit is the next still. The appointment lasts as long as it needs to.',
  },
  {
    number: '03',
    title: 'After',
    copy: 'The piece is made from the house block, four to eight weeks. A second visit for a fitting if the garment asks for one.',
  },
]

export function VisitPage() {
  const week = thisWeekShopPlate()
  const weekCopy = plateCopy(week.caption)

  usePageMeta(getShareMeta('/visit'))

  return (
    <>
      <Hero
        image="/images/cutting-room.jpg"
        imageAlt="Paper, shears, and cloth: the work of a thobe."
        objectPosition="center 40%"
        kicker="The house"
        title="By appointment."
        minHeight="screen"
        quiet
        priority
      />

      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow>A visit</Eyebrow>
              <Display as="h1" className="mt-4 text-4xl md:text-5xl">
                Three acts.
              </Display>
              <Body className="mt-6">
                There is no shop window. Come to see cloth, or to be fitted. Write
                first. {creedIntent}
              </Body>
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

      <Section>
        <Container>
          <EditorialSplit
            image={week.src}
            imageAlt={week.alt}
            objectPosition={week.objectPosition}
            imageOn="left"
          >
            <Eyebrow>This week · {week.place}</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">{week.name}</Display>
            <Body className="mt-6">
              {weekCopy.lines[0] ?? week.alt} A visit is the next still. Cloth is shown
              on the table; the book is the line as it is worn.
            </Body>
            <div className="mt-8">
              <TextLink to="/stills">The stills</TextLink>
            </div>
          </EditorialSplit>
        </Container>
      </Section>

      <NightMotto quiet />

      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>The letter</Eyebrow>
              <Display as="h2" className="mt-4 text-4xl md:text-5xl">
                Request a time.
              </Display>
              <Body className="mt-6">
                The house keeps the letter in the diary. It is held, not a booking. The house
                names a morning, or writes that it cannot be kept. If you would rather write
                directly:{' '}
                <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </Body>
              <p
                lang="ar"
                dir="rtl"
                className="mt-4 w-fit max-w-md font-arabic text-lg font-light leading-relaxed text-ink-soft"
              >
                الطلب عند الدار. هذا ليس حجزاً. نكتب عندما يمكن حفظ صباح.
              </p>
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
              <div className="mt-8">
                <TextLink to="/stills">The stills</TextLink>
              </div>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
              <AppointmentForm />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <HowToMeasure />
          <div className="mt-16 max-w-2xl">
            <SizeGuide compact />
            <p className="mt-6 max-w-md text-[13px] font-light leading-relaxed text-stone">
              Prices include VAT. Each thobe is made to order. A visit is not required.
            </p>
            <p
              lang="ar"
              dir="rtl"
              className="mt-3 w-fit max-w-md font-arabic text-[15px] font-light leading-relaxed text-stone"
            >
              الزيارة ليست واجبة.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
