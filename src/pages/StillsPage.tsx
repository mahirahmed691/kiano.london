import { Link } from 'react-router-dom'
import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { instagramPlates, plateIntervalDays } from '@/data/instagram-plates'
import { site } from '@/data/site'
import { plateCopy, thisWeekPlate } from '@/lib/instagram-plates'
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
              <Eyebrow>This week</Eyebrow>
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
                The house does not invent a second look for a feed.
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
        </Container>
      </Section>

      <section>
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
                  className="border-t border-rule py-16 md:py-24"
                >
                  <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <Reveal
                      className={cn(
                        'lg:col-span-7',
                        imageLeft ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-6 lg:row-start-1',
                      )}
                    >
                      {plate.to ? (
                        <Link to={plate.to} className="block">
                          <ImageFrame
                            src={plate.src}
                            alt={plate.alt}
                            objectPosition={plate.objectPosition}
                            className="aspect-[3/4] w-full"
                            eager={index < 2}
                          />
                        </Link>
                      ) : (
                        <ImageFrame
                          src={plate.src}
                          alt={plate.alt}
                          objectPosition={plate.objectPosition}
                          className="aspect-[3/4] w-full"
                          eager={index < 2}
                        />
                      )}
                    </Reveal>
                    <Reveal
                      delay={120}
                      className={cn(
                        'lg:col-span-4',
                        imageLeft ? 'lg:col-start-9 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1',
                      )}
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                        {String(index + 1).padStart(2, '0')}
                        {current ? ' · This week' : ''}
                      </p>
                      <Display className="mt-4 text-3xl md:text-4xl">{plate.name}</Display>
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
                    </Reveal>
                  </article>
                </li>
              )
            })}
          </ol>
        </Container>
      </section>

      <Section className="border-t border-rule">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>The house</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">By appointment</Display>
            <Body className="mt-6">
              The stills are the line as it is worn. Cloth is shown on the table. A visit
              is the next still.
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
