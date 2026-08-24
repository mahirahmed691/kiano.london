import { useMemo, useState } from 'react'
import { LookbookStrip } from '@/components/editorial/LookbookStrip'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Rule'
import {
  productColours,
  productPath,
  thobes,
  type ProductColour,
} from '@/data/products'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { usePageMeta } from '@/lib/usePageMeta'

const filters: Array<'All' | ProductColour> = ['All', ...productColours]

export function CollectionPage() {
  const [colour, setColour] = useState<'All' | ProductColour>('All')
  const shown = useMemo(
    () => (colour === 'All' ? thobes : thobes.filter((item) => item.colour === colour)),
    [colour],
  )

  usePageMeta({
    title: 'The Collection — Suhail',
    description:
              'Five Emirati thobes from Suhail. Black, grey and beige, sizes 52 to 60, cut in London for cooler air.',
    path: '/collection',
    image: '/images/heritage-linen.jpg',
  })

  return (
    <>
      <header className="bg-ivory pt-32 pb-6 md:pt-40">
        <Container>
          <Reveal>
            <Eyebrow>Emirati thobe</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
              The Collection
            </Display>
            <p lang="ar" dir="rtl" className="mt-4 font-arabic text-2xl text-ink/55">
              {site.arabicName}
            </p>
            <Body className="mt-6 max-w-xl">
              Five Emirati thobes: black, charcoal, grey, beige and bone. Named for a
              colour, not a season. Cut in London for the air after summer.
            </Body>
          </Reveal>
        </Container>
      </header>

      <div className="img-zoom relative aspect-[16/8] max-h-[520px] overflow-hidden bg-ivory-deep md:aspect-[21/8]">
        <img
          src="/images/heritage-linen.jpg"
          alt="Sand-beige extra-long staple cotton, the cloth of Raml."
          className="object-[22%_center]"
          loading="eager"
          decoding="async"
        />
      </div>

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
        <LookbookStrip
          className="mt-24 md:mt-32"
          plates={[
            {
              src: '/images/concealed-pocket.jpg',
              alt: 'The interior of a Suhail thobe, the Suhail label set by hand.',
              objectPosition: 'center 62%',
            },
            {
              src: '/images/heritage-linen.jpg',
              alt: 'Sand-beige extra-long staple cotton in the piece.',
              objectPosition: '22% 50%',
            },
            {
              src: '/images/workbench.jpg',
              alt: 'The cutting bench: shears, chalk, and the Suhail block.',
              objectPosition: 'center 40%',
            },
          ]}
        />
        <Container>
          <Rule className="mt-20 md:mt-28" />
          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-lg text-[14px] font-light leading-relaxed text-stone">
              Fittings are held at the London atelier. Come if you wish to see a cloth
              before it is cut.
            </p>
            <Button to="/visit">Visit by appointment</Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
