import { Link } from 'react-router-dom'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { Hero } from '@/components/editorial/Hero'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow, Lead } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { type InstagramPlate } from '@/data/instagram-plates'
import { jubbahs, productLineName, productPath, thobes } from '@/data/products'
import { site } from '@/data/site'
import { plateCopy, recentPlates, stillsHash, thisWeekPlate } from '@/lib/instagram-plates'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function HomePage() {
  const week = thisWeekPlate()
  const previous = recentPlates(4)
  const weekCopy = plateCopy(week.caption)

  usePageMeta(getShareMeta('/'))

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
              <Eyebrow>Kiano London</Eyebrow>
              <Display as="h1" className="mt-4 text-4xl md:text-5xl lg:text-6xl">
                A London house.
              </Display>
              <p className="mt-5 text-[0.68rem] uppercase tracking-[0.42em] text-ink/55">
                {site.lockup}
              </p>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-6 lg:pt-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                This week · {week.place}
              </p>
              <Lead className="mt-4">{weekCopy.lines[0] ?? week.name}</Lead>
              <Body className="mt-6">
                Emirati thobes and jubbahs. Five columns, and the outer garment
                in three colours. Cloth chosen to last. The house does not invent
                a second look for a feed.
              </Body>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button to="/stills">The stills</Button>
                <TextLink to="/shop">The Shop</TextLink>
                <TextLink to="/collection">The Collection</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-rule">
        <Container>
          <Reveal>
            <Eyebrow>The line</Eyebrow>
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The Shop</p>
                <ul className="mt-5 space-y-3">
                  {jubbahs.map((piece) => (
                    <li key={piece.id}>
                      <Link
                        to={productPath(piece)}
                        className="font-display text-2xl font-light tracking-[-0.02em] transition-opacity hover:opacity-70 md:text-3xl"
                      >
                        {productLineName(piece)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The Collection</p>
                <ol className="mt-5 space-y-3">
                  {thobes.map((piece, index) => (
                    <li key={piece.id} className="flex items-baseline gap-4">
                      <span className="w-6 shrink-0 text-[11px] uppercase tracking-[0.22em] text-stone">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <Link
                        to={productPath(piece)}
                        className="font-display text-2xl font-light tracking-[-0.02em] transition-opacity hover:opacity-70 md:text-3xl"
                      >
                        {piece.name}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <section>
        {previous.map((plate, index) => (
          <BookLook key={plate.id} plate={plate} lastWeek={index === 0} />
        ))}
        <figure className="img-zoom relative min-h-[100svh] overflow-hidden bg-night">
          <img
            src="/images/stitch-pad.jpg"
            alt="Pad-stitching through the collar stand, silk on linen."
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 40%' }}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(20,18,16,0.4)_0%,rgba(20,18,16,0)_100%)] px-6 pb-10 pt-16 md:px-12 lg:px-16">
            <Link to="/craftsmanship" className="inline-block text-ivory transition-opacity hover:opacity-80">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/65">The stitch</p>
              <p className="mt-2 font-display text-3xl font-light md:text-4xl">Closer.</p>
            </Link>
          </figcaption>
        </figure>
      </section>

      <Section className="bg-night py-24 md:py-32">
        <Container>
          <QuoteBlock
            tone="dark"
            quote="The modest garment is not empty. It is full of work you are not meant to see."
            attribution={site.note}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>The house</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">By appointment</Display>
            <Body className="mt-6">
              Fittings are by appointment. We do not keep a shop window. The work is
              the invitation: Layl, Hadīd, the jubbah.
            </Body>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/visit">Visit by appointment</Button>
              <TextLink to="/stills">The stills</TextLink>
              <TextLink to="/story">The story</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}

function BookLook({ plate, lastWeek }: { plate: InstagramPlate; lastWeek: boolean }) {
  const copy = plateCopy(plate.caption)
  const href = plate.to ?? stillsHash(plate)

  return (
    <figure className="img-zoom relative min-h-[100svh] overflow-hidden bg-night">
      <img
        src={plate.src}
        alt={plate.alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: plate.objectPosition }}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(20,18,16,0.4)_0%,rgba(20,18,16,0)_100%)] px-6 pb-10 pt-16 md:px-12 lg:px-16">
        <Link to={href} className="inline-block text-ivory transition-opacity hover:opacity-80">
          <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/65">
            {lastWeek ? 'Last week' : plate.place}
          </p>
          <p className="mt-2 font-display text-3xl font-light md:text-4xl">{plate.name}</p>
          {copy.lines[0] ? (
            <p className="mt-2 max-w-md font-light text-ivory/75">{copy.lines[0]}</p>
          ) : null}
        </Link>
      </figcaption>
    </figure>
  )
}
