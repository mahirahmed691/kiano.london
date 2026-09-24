import { Link, useParams } from 'react-router-dom'
import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { NightMotto } from '@/components/editorial/NightMotto'
import { ScentCard } from '@/components/scent/ScentCard'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { scentArabic, scentComing, getScent, relatedScents } from '@/data/scent'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function ScentPiecePage() {
  const { id } = useParams()
  const scent = getScent(id)
  const related = scent ? relatedScents(scent.id) : []
  const rest = scent?.gallery.slice(1) ?? []

  usePageMeta(
    scent
      ? getShareMeta(`/scent/${scent.id}`)
      : {
          title: 'Kiano London',
          description: 'This scent is not of the house.',
          path: '/scent',
        },
  )

  if (!scent) return <NotFoundPage />

  return (
    <>
      <Hero
        image={scent.image}
        imageAlt={scent.imageAlt}
        objectPosition={scent.objectPosition}
        minHeight="screen"
        priority
        quiet
      />

      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>{scentComing}</Eyebrow>
              <Display as="h1" className="mt-4 text-4xl md:text-5xl">
                {scent.name}.
              </Display>
              <p
                lang="ar"
                dir="rtl"
                className="mt-4 w-fit font-arabic text-2xl font-light text-ink-soft"
              >
                {scentArabic}
              </p>
              <Body className="mt-6">{scent.line}</Body>
              <Body className="mt-6">
                Arabian Oud, and eau de parfum. The name is of the house. The bottle is
                not yet of the bag.
              </Body>
              <div className="mt-10">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The notes</p>
                <ul className="mt-5 space-y-3">
                  {scent.notes.map((note) => (
                    <li
                      key={note}
                      className="max-w-sm text-[14px] font-light leading-relaxed text-ink-soft"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Button to="/scent">The Scent</Button>
                <TextLink to="/visit">Visit by appointment</TextLink>
              </div>
            </Reveal>
            {rest[0] ? (
              <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
                <ImageFrame
                  src={rest[0].src}
                  alt={rest[0].alt}
                  className="aspect-[3/4] w-full"
                  objectPosition={rest[0].objectPosition}
                  caption={rest[0].kicker ? `${rest[0].kicker}.` : undefined}
                />
              </Reveal>
            ) : null}
          </div>
          {rest.length > 1 ? (
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:mt-24">
              {rest.slice(1).map((still) => (
                <ImageFrame
                  key={`${still.src}-${still.objectPosition ?? ''}`}
                  src={still.src}
                  alt={still.alt}
                  className="aspect-[3/4] w-full"
                  objectPosition={still.objectPosition}
                />
              ))}
            </div>
          ) : null}
        </Container>
      </Section>

      <NightMotto quiet />

      <Section>
        <Container>
          <Reveal className="mb-12 md:mb-16">
            <Eyebrow>The three</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">Also coming.</Display>
          </Reveal>
          <div className="grid gap-x-8 gap-y-20 sm:grid-cols-2">
            {related.map((piece, index) => (
              <ScentCard key={piece.id} scent={piece} delay={index * 80} />
            ))}
          </div>
          <div className="mt-16">
            <Link
              to="/scent"
              className="text-[10px] uppercase tracking-[0.28em] text-stone transition-opacity hover:opacity-70"
            >
              The Scent
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
