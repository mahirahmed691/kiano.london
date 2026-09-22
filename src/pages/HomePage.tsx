import { Link } from 'react-router-dom'
import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { HouseCreed } from '@/components/editorial/HouseCreed'
import { Hero } from '@/components/editorial/Hero'
import { NightMotto } from '@/components/editorial/NightMotto'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow, Lead } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedIntent, creedJoin, creedSpoken, creedStandard, creedWoven } from '@/data/creed'
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
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5">
              <Eyebrow>{creedStandard}</Eyebrow>
              <Display as="h1" className="mt-6 text-5xl md:text-6xl lg:text-7xl">
                Worn with purpose.
              </Display>
              <p className="mt-8 text-[0.62rem] uppercase tracking-[0.4em] text-ink/50">
                {creedJoin}
              </p>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-6 lg:col-start-7 lg:pt-14">
              <p className="text-[10px] uppercase tracking-[0.32em] text-stone">
                This week · {week.place}
              </p>
              <Lead className="mt-5">{weekCopy.lines[0] ?? week.name}</Lead>
              <Body className="mt-8">
                {creedWoven} {creedIntent} Five columns, and the outer garment in
                three colours. The house does not invent a second look for a feed.
              </Body>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <Button to="/stills">The stills</Button>
                <TextLink to="/shop">The Shop</TextLink>
                <TextLink to="/collection">The Collection</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="mx-auto mb-16 max-w-2xl text-center md:mb-24">
            <Eyebrow>The house</Eyebrow>
            <Display className="mt-5 text-4xl md:text-5xl lg:text-6xl">{creedSpoken}</Display>
          </Reveal>
          <HouseCreed />
        </Container>
      </Section>

      <Section className="border-y border-rule">
        <Container>
          <Reveal>
            <Eyebrow>The line</Eyebrow>
            <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-20">
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

      <NightMotto attribution={`${creedJoin} · ${site.note}`} />

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

      <Section>
        <Container>
          <EditorialSplit
            image="/images/cutting-room.jpg"
            imageAlt="Paper, shears, and cloth: the work of a thobe."
            objectPosition="center 40%"
            imageOn="right"
          >
            <Eyebrow>The house</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">By appointment</Display>
            <Body className="mt-6">
              Fittings are by appointment. We do not keep a shop window. The work is
              the invitation: Layl, Hadīd, the jubbah. A visit is the next still.
            </Body>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/visit">Visit by appointment</Button>
              <TextLink to="/stills">The stills</TextLink>
              <TextLink to="/story">The story</TextLink>
            </div>
          </EditorialSplit>
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
