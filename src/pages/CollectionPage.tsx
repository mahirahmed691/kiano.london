import { useMemo, useState } from 'react'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import {
  productColours,
  productPath,
  thobes,
  type ProductColour,
} from '@/data/products'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const filters: Array<'All' | ProductColour> = ['All', ...productColours]

export function CollectionPage() {
  const [colour, setColour] = useState<'All' | ProductColour>('All')
  const shown = useMemo(
    () => (colour === 'All' ? thobes : thobes.filter((item) => item.colour === colour)),
    [colour],
  )

  usePageMeta(getShareMeta('/collection'))

  return (
    <>
      <header className="bg-night pt-32 pb-20 md:pt-40 md:pb-28">
        <Container>
          <Reveal>
            <Eyebrow className="text-ivory/70">Emirati thobe</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl text-ivory md:text-6xl lg:text-7xl">
              The Collection
            </Display>
            <p className="mt-4 text-[0.68rem] uppercase tracking-[0.42em] text-ivory/45">
              {site.lockup}
            </p>
            <Body className="mt-6 max-w-xl text-ivory/75">
              Five Emirati thobes: Layl, Hadīd, Ghabār, Raml and Hajar. Black, charcoal,
              grey, beige and bone. Cut from the house block.
            </Body>
          </Reveal>
        </Container>
      </header>

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

          <div className="mb-12 flex flex-wrap gap-x-8 gap-y-3 md:mb-16">
            {filters.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setColour(value)}
                className={cn(
                  'relative text-[11px] uppercase tracking-[0.22em] transition-opacity',
                  colour === value ? 'opacity-100' : 'opacity-45 hover:opacity-100',
                  colour === value &&
                    'after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-current',
                )}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="grid gap-x-4 gap-y-16 sm:grid-cols-2 lg:grid-cols-12">
            {shown.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                to={productPath(product)}
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
              <div className="mt-8">
                <Button to="/visit">Visit by appointment</Button>
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
