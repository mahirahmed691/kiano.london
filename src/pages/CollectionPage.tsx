import { useMemo } from 'react'
import { Hero } from '@/components/editorial/Hero'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { LookbookStrip } from '@/components/editorial/LookbookStrip'
import { NightMotto } from '@/components/editorial/NightMotto'
import { ColourFilter } from '@/components/product/ColourFilter'
import { ProductCard } from '@/components/product/ProductCard'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { creedMotto } from '@/data/creed'
import { productColours, productPath, thobes } from '@/data/products'
import { useColourFilter } from '@/lib/colour-param'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const filters = ['All', ...productColours] as const

export function CollectionPage() {
  const [colour, setColour] = useColourFilter(productColours)
  const shown = useMemo(
    () => (colour === 'All' ? thobes : thobes.filter((item) => item.colour === colour)),
    [colour],
  )

  usePageMeta(getShareMeta('/collection'))

  return (
    <>
      <Hero
        image="/images/thobe-layl.jpg"
        imageAlt="The Layl thobe: matte black, band collar, hem to the ankle."
        objectPosition="center 12%"
        kicker="Emirati thobe"
        title="The Collection."
        minHeight="screen"
        priority
      />

      <Section>
        <Container>
          <Reveal className="mb-16 max-w-xl md:mb-20">
            <Display as="h1" className="text-4xl md:text-5xl">
              The Collection.
            </Display>
            <p className="mt-6 text-[15px] font-light leading-[1.85] text-ink-soft">
              Black, charcoal, grey, beige and bone. {creedMotto}
            </p>
          </Reveal>
          <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {String(shown.length).padStart(2, '0')} {shown.length === 1 ? 'piece' : 'pieces'}
            </p>
            <p className="text-[13px] font-light text-stone">
              Sizes 52–60. Prices include VAT. Made to order, four to eight weeks.
            </p>
          </div>

          <ColourFilter
            value={colour}
            options={[...filters]}
            onChange={setColour}
          />

          {shown.length === 0 ? (
            <p className="text-[15px] font-light text-ink-soft">No thobe in this colour.</p>
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
              src: '/images/featured-overcoat.jpg',
              alt: 'A charcoal Emirati thobe at full length: standing collar, charcoal column.',
              objectPosition: '72% 18%',
              kicker: 'Charcoal',
              name: 'Charcoal',
              colour: 'Charcoal',
            },
            {
              src: '/images/thobe-ghabar.jpg',
              alt: 'An earth-grey Emirati thobe, compact cotton, hem to the ankle.',
              objectPosition: 'center 12%',
              kicker: 'Grey',
              name: 'Grey',
              colour: 'Grey',
            },
            {
              src: '/images/thobe-raml.jpg',
              alt: 'A sand extra-long staple Emirati thobe, the cloth to the ankle.',
              objectPosition: 'center 12%',
              kicker: 'Beige',
              name: 'Beige',
              colour: 'Beige',
            },
          ]}
        />
      </Section>

      <NightMotto quiet />

      <Section>
        <Container>
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Bone</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">The bone column.</Display>
              <Body className="mt-6">
                The last of the five: a pale extra-long staple, cut from the same block
                as the rest of the line. Fittings are by appointment. Come if you wish
                to see a cloth before it is reserved.
              </Body>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button to="/visit">Visit by appointment</Button>
                <TextLink to="/shop">The Shop</TextLink>
                <TextLink to="/scent">The Scent</TextLink>
              </div>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
              <ImageFrame
                src="/images/thobe-hajar.jpg"
                alt="A bone extra-long staple Emirati thobe at rest: a pale column."
                className="aspect-[4/5] w-full"
                objectPosition="center 12%"
                caption="Bone."
                colour="Bone"
              />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
