import { Link } from 'react-router-dom'
import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { HouseCreed } from '@/components/editorial/HouseCreed'
import { Hero } from '@/components/editorial/Hero'
import { NightMotto } from '@/components/editorial/NightMotto'
import { StillCaption } from '@/components/editorial/StillCaption'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow, Lead } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedJoin, creedSpoken, creedStandard } from '@/data/creed'
import { type InstagramPlate } from '@/data/instagram-plates'
import { jubbahs, productLineName, productPath } from '@/data/products'
import { scentPath, scents } from '@/data/scent'
import { site } from '@/data/site'
import { plateCopy, recentShopPlates, stillsHash, thisWeekShopPlate } from '@/lib/instagram-plates'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'
import { TrustBar } from '@/components/editorial/TrustBar'

export function HomePage() {
  const week = thisWeekShopPlate()
  const previous = recentShopPlates(4)
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
        kicker="Lookbook · this week"
        title={week.name}
        captionTo={stillsHash(week)}
        captionLabel={`View ${week.name} in the lookbook`}
      />

      <TrustBar />

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
                In the lookbook this week
              </p>
              <Lead className="mt-5">{weekCopy.lines[0] ?? week.name}</Lead>
              <Body className="mt-8">
                Kiano London is a London-based atelier creating considered menswear for
                modern life. Each piece is designed with discipline, craftsmanship, and
                purpose — from the Urban Emirati to refined everyday essentials.
              </Body>
              <Body className="mt-4">
                Urban Emirati in stone grey, cream and black. The scent is coming.
              </Body>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <Button to="/shop">Shop the Urban Emirati</Button>
                <TextLink to="/collection">View the collection</TextLink>
                <TextLink to="/stills">Explore the lookbook</TextLink>
                <TextLink to="/scent">Discover the scent</TextLink>
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

      <NightMotto attribution={`${creedJoin} · ${site.note}`} />

      <Section className="border-y border-rule">
        <Container>
          <Reveal>
            <Eyebrow>The line</Eyebrow>
            <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-20 lg:grid-cols-3">
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
                <ul className="mt-5 space-y-3">
                  {jubbahs.map((piece) => (
                    <li key={`collection-${piece.id}`}>
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
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The Scent</p>
                <ul className="mt-5 space-y-5">
                  {scents.map((scent) => (
                    <li key={scent.id}>
                      <Link
                        to={scentPath(scent)}
                        className="font-display text-2xl font-light tracking-[-0.02em] transition-opacity hover:opacity-70 md:text-3xl"
                      >
                        {scent.name}
                      </Link>
                      <p className="mt-1.5 text-[13px] font-light text-stone">{scent.line}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-stone">Coming</p>
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
            alt="Stitching through the collar stand."
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 40%' }}
            loading="lazy"
            decoding="async"
          />
          <StillCaption to="/craftsmanship" kicker="Craft & process" title="Closer." label="Read about the making process" />
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
              the invitation: Urban Emirati. A visit is the next still.
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
      <StillCaption
        to={href}
        kicker={lastWeek ? 'Lookbook · last week' : `Lookbook · ${plate.place}`}
        title={plate.name}
        label={`View ${plate.name} in the lookbook`}
      >
        {copy.lines[0] ? (
          <p className="mt-2 max-w-md font-light text-ivory/75">{copy.lines[0]}</p>
        ) : null}
      </StillCaption>
    </figure>
  )
}
