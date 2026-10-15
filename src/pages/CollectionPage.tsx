import { useMemo } from 'react'
import { Hero } from '@/components/editorial/Hero'
import { LookbookStrip } from '@/components/editorial/LookbookStrip'
import { NightMotto } from '@/components/editorial/NightMotto'
import { ColourFilter } from '@/components/product/ColourFilter'
import { ProductCard } from '@/components/product/ProductCard'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Display } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedIntent } from '@/data/creed'
import { jubbahColours, jubbahs, productLineName, productPath } from '@/data/products'
import { useColourFilter } from '@/lib/colour-param'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const filters = ['All', ...jubbahColours] as const

export function CollectionPage() {
  const [colour, setColour] = useColourFilter(jubbahColours)
  const shown = useMemo(
    () => (colour === 'All' ? jubbahs : jubbahs.filter((item) => item.colour === colour)),
    [colour],
  )

  usePageMeta(getShareMeta('/collection'))

  return (
    <>
      <Hero
        image="/images/jubbah-sand.jpg"
        imageAlt="Urban Emirati in cream, a modest column."
        objectPosition="center 8%"
        kicker="The line"
        title="The Collection."
        minHeight="screen"
        priority
      />

      <Section>
        <Container>
          <Reveal className="mb-16 max-w-xl md:mb-20">
            <Display as="h1" className="text-4xl md:text-5xl">
              {jubbahs.map((piece) => (
                <span key={piece.id} className="block">
                  {productLineName(piece)}
                </span>
              ))}
            </Display>
            <p className="mt-6 text-[15px] font-light leading-[1.85] text-ink-soft">
              Cotton viscose mix, light GSM. Five sizes, 52 to 60. {creedIntent}
            </p>
          </Reveal>
          <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {String(shown.length).padStart(2, '0')} {shown.length === 1 ? 'colour' : 'colours'}
            </p>
            <p className="text-[13px] font-light text-stone">
              Sizes 52–60. Three colourways. Made to order.
            </p>
          </div>

          <ColourFilter
            value={colour}
            options={[...filters]}
            onChange={setColour}
          />

          {shown.length === 0 ? (
            <p className="text-[15px] font-light text-ink-soft">No piece in this colour.</p>
          ) : (
            <div className="grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10">
              {shown.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={productPath(product)}
                  delay={index * 80}
                  className={
                    index === 0
                      ? 'sm:col-span-2 lg:col-span-7'
                      : index === 1
                        ? 'lg:col-span-5'
                        : 'lg:col-span-4'
                  }
                />
              ))}
            </div>
          )}
        </Container>
        <LookbookStrip
          className="mt-24 md:mt-32"
          plates={[
            {
              src: '/images/jubbah-black-02.jpg',
              alt: 'Urban Emirati in black from behind: a clean column, hem to the ankle.',
              kicker: 'Black',
              name: 'Urban Emirati',
              colour: 'Black',
            },
            {
              src: '/images/jubbah-sand-02.jpg',
              alt: 'Urban Emirati in cream at rest: the cloth draped to the ankle.',
              objectPosition: 'center 18%',
              kicker: 'Cream',
              name: 'Urban Emirati',
              colour: 'Cream',
            },
            {
              src: '/images/jubbah-charcoal-02.jpg',
              alt: 'Urban Emirati in stone grey walking: ankle hem, concealed placket.',
              objectPosition: 'center 18%',
              kicker: 'Stone Grey',
              name: 'Urban Emirati',
              colour: 'Stone Grey',
            },
          ]}
        />
      </Section>

      <NightMotto quiet />

      <Section>
        <Container>
          <div className="flex flex-wrap items-center gap-6">
            <Button to="/shop">The Shop</Button>
            <TextLink to="/visit">Visit by appointment</TextLink>
            <TextLink to="/scent">The Scent</TextLink>
          </div>
        </Container>
      </Section>
    </>
  )
}
