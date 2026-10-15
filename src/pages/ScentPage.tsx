import { Link } from 'react-router-dom'
import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Hero } from '@/components/editorial/Hero'
import { NightMotto } from '@/components/editorial/NightMotto'
import { StillCaption } from '@/components/editorial/StillCaption'
import { ScentCard } from '@/components/scent/ScentCard'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedIntent } from '@/data/creed'
import { scentComing, scentFamilies, scentPath, scents } from '@/data/scent'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function ScentPage() {
  usePageMeta(getShareMeta('/scent'))
  const oud = scentFamilies[0]
  const eau = scentFamilies[1]

  return (
    <>
      <Hero
        image="/images/scent-mayfair.jpg"
        imageAlt="Mayfair: a bottle of Kiano London, Arabian Oud, in still light."
        objectPosition="center 42%"
        kicker={scentComing}
        title="The Scent."
        minHeight="screen"
        quiet
        priority
      />

      <Section>
        <Container>
          <Reveal className="mb-16 max-w-xl md:mb-20">
            <Eyebrow>{scentComing}</Eyebrow>
            <p className="mt-6 font-display text-2xl font-light tracking-[-0.02em] text-ink/75 md:text-3xl">
              Three names: Mayfair, Bond Street, Kensington.
            </p>
            <p className="mt-6 text-[15px] font-light leading-[1.85] text-ink-soft">
              The scent is coming. It is not yet of the bag. {creedIntent}
            </p>
          </Reveal>
          <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {String(scents.length).padStart(2, '0')} names
            </p>
            <p className="text-[13px] font-light text-stone">
              Arabian Oud, and eau de parfum. The same three. Not on the till.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
            {scents.map((scent, index) => (
              <ScentCard
                key={scent.id}
                scent={scent}
                index={String(index + 1).padStart(2, '0')}
                delay={index * 80}
              />
            ))}
          </div>
        </Container>
      </Section>

      <section>
        <figure className="img-zoom relative min-h-[100svh] overflow-hidden bg-night">
          <img
            src={oud.src}
            alt={oud.alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: oud.objectPosition }}
            loading="lazy"
            decoding="async"
          />
          <StillCaption kicker={oud.name} title="The three." />
        </figure>
      </section>

      <Section>
        <Container>
          <EditorialSplit
            image={eau.src}
            imageAlt={eau.alt}
            objectPosition={eau.objectPosition}
            imageOn="right"
          >
            <Eyebrow>{eau.name}</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">The same three names.</Display>
            <Body className="mt-6">
              Two stills. Arabian Oud, and eau de parfum. The cloth still leaves
              unscented. This line is its own still, when it is of the house.
            </Body>
            <ul className="mt-8 space-y-5">
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
          </EditorialSplit>
        </Container>
      </Section>

      <NightMotto quiet />

      <Section>
        <Container>
          <Reveal className="max-w-xl">
            <Eyebrow>The list</Eyebrow>
            <Display className="mt-4 text-4xl md:text-5xl">When it is of the house.</Display>
            <Body className="mt-6">
              Write if you wish to be told. A visit is still for cloth. The scent is
              not yet reserved.
            </Body>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/visit">Visit by appointment</Button>
              <TextLink to="/shop">The Shop</TextLink>
              <TextLink to="/collection">The Collection</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
