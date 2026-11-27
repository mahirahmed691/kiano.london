import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { HouseCreed } from '@/components/editorial/HouseCreed'
import { Hero } from '@/components/editorial/Hero'
import { NightMotto } from '@/components/editorial/NightMotto'
import { StillCaption } from '@/components/editorial/StillCaption'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow, Lead } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedSpoken, creedStandard } from '@/data/creed'
import { type InstagramPlate } from '@/data/instagram-plates'
import { jubbahs, productPath } from '@/data/products'
import { site } from '@/data/site'
import { plateCopy, recentShopPlates, stillsHash, thisWeekShopPlate } from '@/lib/instagram-plates'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'
import { TrustBar } from '@/components/editorial/TrustBar'
import { ProductCard } from '@/components/product/ProductCard'

export function HomePage() {
  const week = thisWeekShopPlate()
  const previous = recentShopPlates(4)
  const weekPiece = jubbahs.find((piece) => week.id === piece.id || week.id.startsWith(`${piece.id}-`))

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
        captionTo={weekPiece ? productPath(weekPiece) : stillsHash(week)}
        captionLabel={weekPiece ? `Shop ${week.name}, ${weekPiece.price}` : `View ${week.name} in the lookbook`}
        captionCta={weekPiece ? `Shop · ${weekPiece.price}` : undefined}
      />

      <TrustBar />

      <Section className="py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
            <div>
              <Eyebrow>The shop</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">One cut. Three colours.</Display>
            </div>
            <TextLink to="/shop">View the shop</TextLink>
          </Reveal>
          <div className="max-sm:-mx-6 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-5 max-sm:overflow-x-auto max-sm:px-6 max-sm:pb-2 max-sm:[scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-12">
            {jubbahs.map((product, index) => (
              <ProductCard
                className="max-sm:w-[78%] max-sm:shrink-0 max-sm:snap-start"
                key={product.id}
                product={product}
                to={productPath(product)}
                delay={index * 80}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-rule py-20 md:py-28 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5">
              <Eyebrow>{creedStandard}</Eyebrow>
              <Display as="h1" className="mt-6 text-5xl md:text-6xl lg:text-7xl">
                Worn with purpose.
              </Display>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-6 lg:col-start-7 lg:pt-14">
              <Lead>
                A London atelier making one garment, properly. Cut from a single house
                block, finished by hand, made to order.
              </Lead>
              <Body className="mt-8">
                More air through the chest than the thobe, a band collar, a concealed
                placket, a hem to the ankle. Worn alone, or over a thobe. The scent of the
                house is coming.
              </Body>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <Button to="/shop">Shop the Urban Emirati</Button>
                <TextLink to="/stills">Explore the lookbook</TextLink>
                <TextLink to="/scent">Discover the scent</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="py-20 md:py-28 lg:py-32">
        <Container>
          <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <Eyebrow>The house</Eyebrow>
            <Display className="mt-5 text-4xl md:text-5xl lg:text-6xl">{creedSpoken}</Display>
          </Reveal>
          <HouseCreed />
        </Container>
      </Section>

      <NightMotto attribution={site.note} compact />

      <section>
        {previous.map((plate, index) => (
          <BookLook key={plate.id} plate={plate} lastWeek={index === 0} />
        ))}
        <figure className="img-zoom relative min-h-[70svh] overflow-hidden bg-night">
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

      <Section className="py-20 md:py-28 lg:py-32">
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
              Fittings are by appointment in London. We keep no shop window: come and
              feel the cloth, try the sizes, and leave with the right one.
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
