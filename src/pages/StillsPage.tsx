import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { PlatePair } from '@/components/editorial/PlatePair'
import { NightMotto } from '@/components/editorial/NightMotto'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedSpoken, creedWoven } from '@/data/creed'
import { instagramPlates, plateIntervalDays } from '@/data/instagram-plates'
import { site } from '@/data/site'
import {
  plateCopy,
  plateKindLabel,
  plateNumber,
  thisWeekPlate,
} from '@/lib/instagram-plates'
import { cn } from '@/lib/cn'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function StillsPage() {
  const week = thisWeekPlate()
  const weekCopy = plateCopy(week.caption)

  usePageMeta(getShareMeta('/stills'))

  return (
    <>
      <Hero
        image={week.src}
        imageAlt={week.alt}
        objectPosition={week.objectPosition}
        quiet
        priority
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>This week · {week.place}</Eyebrow>
              <Display as="h1" className="mt-4 text-4xl md:text-5xl lg:text-6xl">
                The stills.
              </Display>
              <p className="mt-5 text-[0.68rem] uppercase tracking-[0.42em] text-ink/55">
                {site.lockup}
              </p>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-6 lg:pt-10">
              <Body>
                One still a week, in this order. London stone, the column, a quiet line.
                {` ${creedWoven}`} The house does not invent a second look for a feed.
              </Body>
              <Body className="mt-6">
                {weekCopy.lines.join(' ')} Cadence: every {plateIntervalDays} days.
              </Body>
              {week.to ? (
                <div className="mt-8">
                  <TextLink to={week.to}>{week.name}</TextLink>
                </div>
              ) : null}
            </Reveal>
          </div>

          <Reveal delay={160} className="mt-16 border-t border-rule pt-10 md:mt-20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The book</p>
            <ol className="mt-6 grid gap-x-12 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {instagramPlates.map((plate) => {
                const current = plate.id === week.id
                return (
                  <li key={plate.id}>
                    <a
                      href={`#${plate.id}`}
                      className={cn(
                        'flex items-baseline gap-4 text-ink transition-opacity hover:opacity-70',
                        current && 'text-ink',
                      )}
                    >
                      <span className="w-6 shrink-0 text-[11px] uppercase tracking-[0.22em] text-stone">
                        {plateNumber(plate)}
                      </span>
                      <span className="font-display text-xl font-light tracking-[-0.02em] md:text-2xl">
                        {plate.name}
                      </span>
                      {current ? (
                        <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                          This week
                        </span>
                      ) : null}
                    </a>
                  </li>
                )
              })}
            </ol>
          </Reveal>
        </Container>
      </Section>

      <NightMotto />

      <Section className="py-0 md:py-0 lg:py-0">
        <Container>
          <ol>
            {instagramPlates.map((plate, index) => {
              const copy = plateCopy(plate.caption)
              const current = plate.id === week.id
              const imageLeft = index % 2 === 1

              return (
                <li
                  key={plate.id}
                  id={plate.id}
                  className="scroll-mt-[6rem] border-t border-rule py-16 md:scroll-mt-[7rem] md:py-24"
                >
                  <article className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
                    <Reveal
                      className={cn(
                        'lg:col-span-7',
                        imageLeft ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-6 lg:row-start-1',
                      )}
                    >
                      <PlatePair plate={plate} eager={index < 2} />
                    </Reveal>
                    <Reveal
                      delay={120}
                      className={cn(
                        'lg:col-span-4',
                        imageLeft ? 'lg:col-start-9 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1',
                      )}
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                        {plateNumber(plate)}
                        {' · '}
                        {plateKindLabel(plate.kind)}
                        {current ? ' · This week' : ''}
                      </p>
                      <Display className="mt-4 text-3xl md:text-4xl">{plate.name}</Display>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-stone">
                        {plate.place}
                      </p>
                      {copy.lines.map((line) => (
                        <Body key={line} className="mt-4 max-w-sm">
                          {line}
                        </Body>
                      ))}
                      {copy.mark ? (
                        <p className="mt-5 text-[0.68rem] uppercase tracking-[0.42em] text-ink/55">
                          {copy.mark}
                        </p>
                      ) : null}
                      {plate.to ? (
                        <div className="mt-8">
                          <TextLink to={plate.to}>The piece</TextLink>
                        </div>
                      ) : null}
                      {plate.children?.[0] ? (
                        <ImageFrame
                          src={plate.children[0].src}
                          alt={plate.children[0].alt}
                          objectPosition={plate.children[0].objectPosition}
                          className="mt-10 aspect-[3/4] w-full max-w-sm"
                        />
                      ) : null}
                    </Reveal>
                  </article>
                </li>
              )
            })}
          </ol>
        </Container>
      </Section>

      <Section className="border-t border-rule">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>The house</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">By appointment</Display>
            <Body className="mt-6">
              The stills are the line as it is worn. Cloth is shown on the table. A visit
              is the next still. {creedSpoken}
            </Body>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/visit">Visit by appointment</Button>
              <TextLink to="/collection">The Collection</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
