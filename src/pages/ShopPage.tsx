import { useMemo, useState } from 'react'
import { LookbookStrip } from '@/components/editorial/LookbookStrip'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Rule'
import {
  jubbahColours,
  jubbahs,
  productPath,
  type ProductColour,
} from '@/data/products'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { usePageMeta } from '@/lib/usePageMeta'

const filters: Array<'All' | ProductColour> = ['All', ...jubbahColours]

export function ShopPage() {
  const [colour, setColour] = useState<'All' | ProductColour>('All')
  const shown = useMemo(
    () => (colour === 'All' ? jubbahs : jubbahs.filter((item) => item.colour === colour)),
    [colour],
  )

  usePageMeta({
    title: 'Shop — Kiano London',
    description:
      'The jubbah in three colours: black, sand and charcoal. Sizes 52 to 60, cut in London.',
    path: '/shop',
    image: '/images/jubbah-sand-02.jpg',
  })

  return (
    <>
      <header className="bg-ivory pt-32 pb-6 md:pt-40">
        <Container>
          <Reveal>
            <Eyebrow>The outer garment</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
              The Shop
            </Display>
            <p lang="ar" dir="rtl" className="mt-4 font-arabic text-2xl text-ink/55">
              الجُبَّة
            </p>
            <Body className="mt-6 max-w-xl">
              The jubbah, in three colours for now: black, sand, charcoal. Five sizes, 52
              to 60. Cut in London from the house block.
            </Body>
          </Reveal>
        </Container>
      </header>

      <div className="img-zoom relative aspect-[16/8] max-h-[560px] overflow-hidden bg-ivory-deep md:aspect-[21/8]">
        <img
          src="/images/jubbah-sand-02.jpg"
          alt="The sand jubbah at rest, the cloth to the ankle."
          className="object-[center_28%]"
          loading="eager"
          decoding="async"
        />
      </div>

      <Section>
        <Container>
          <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {String(shown.length).padStart(2, '0')} {shown.length === 1 ? 'colour' : 'colours'}
            </p>
            <p className="text-[13px] font-light text-stone">
              Sizes 52–60. Three colourways. Made to order, four to eight weeks.
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

          <div className="grid gap-x-4 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                to={productPath(product)}
              />
            ))}
          </div>
        </Container>
        <LookbookStrip
          className="mt-24 md:mt-32"
          plates={[
            {
              src: '/images/jubbah-black-02.jpg',
              alt: 'The black jubbah from behind: a clean column, hem to the ankle.',
            },
            {
              src: '/images/atelier-rail.jpg',
              alt: 'The house line on the rail: black, sand, and bone.',
              objectPosition: 'center 40%',
            },
            {
              src: '/images/jubbah-charcoal-02.jpg',
              alt: 'The charcoal jubbah walking: wool-cotton, ankle hem, concealed placket.',
            },
          ]}
        />
        <Container>
          <Rule className="mt-20 md:mt-28" />
          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-lg text-[14px] font-light leading-relaxed text-stone">
              {site.name} also cuts the thobe. The jubbah is the outer column; the thobe
              is the one beneath. Each piece leaves unscented, in a garment bag and a
              rigid box.
            </p>
            <Button to="/collection">The thobes</Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
