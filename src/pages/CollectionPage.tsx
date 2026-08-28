import { useMemo } from 'react'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { ColourFilter } from '@/components/product/ColourFilter'
import { ProductCard } from '@/components/product/ProductCard'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { productColours, productPath, thobes } from '@/data/products'
import { site } from '@/data/site'
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
      <section className="grid bg-ivory pt-[var(--header-offset)] lg:min-h-[100dvh] lg:grid-cols-12">
        <div className="relative order-1 min-h-[calc(62svh-var(--header-offset))] overflow-hidden bg-ivory-deep lg:order-2 lg:col-span-7 lg:min-h-[calc(100dvh-var(--header-offset))]">
          <img
            src="/images/thobe-layl.jpg"
            alt="The Layl thobe: matte black, band collar, hem to the ankle."
            className="still-in absolute inset-0 h-full w-full object-cover object-[center_12%]"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:px-12 lg:order-1 lg:col-span-5 lg:px-16 lg:py-32">
          <Reveal>
            <Eyebrow>Emirati thobe</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
              The Collection
            </Display>
            <p className="mt-4 text-[0.68rem] uppercase tracking-[0.42em] text-ink/55">
              {site.lockup}
            </p>
            <Body className="mt-6 max-w-md">
              Five Emirati thobes: Layl, Hadīd, Ghabār, Raml and Hajar. Black, charcoal,
              grey, beige and bone. Cut from the house block.
            </Body>
          </Reveal>
        </div>
      </section>

      <Section>
        <Container>
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
            <div className="grid gap-x-4 gap-y-16 sm:grid-cols-2 lg:grid-cols-12">
              {shown.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={productPath(product)}
                  index={String(index + 1).padStart(2, '0')}
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
      </Section>

      <section className="bg-ivory-deep/50">
        <Container className="py-20 md:py-28">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Hajar</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">The bone column.</Display>
              <Body className="mt-6">
                The last of the five: a pale extra-long staple, cut from the same block
                as Layl. Fittings are by appointment. Come if you wish to see a cloth
                before it is reserved.
              </Body>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button to="/visit">Visit by appointment</Button>
                <TextLink to="/shop">The Shop</TextLink>
              </div>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
              <ImageFrame
                src="/images/thobe-hajar.jpg"
                alt="The Hajar thobe at rest: bone extra-long staple, a pale column."
                className="aspect-[4/5] w-full"
                objectPosition="center 12%"
                caption="Hajar."
              />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
