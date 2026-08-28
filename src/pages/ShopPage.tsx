import { useMemo } from 'react'
import { LookbookStrip } from '@/components/editorial/LookbookStrip'
import { ColourFilter } from '@/components/product/ColourFilter'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Rule'
import { jubbahColours, jubbahs, productPath } from '@/data/products'
import { useColourFilter } from '@/lib/colour-param'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

const filters = ['All', ...jubbahColours] as const

export function ShopPage() {
  const [colour, setColour] = useColourFilter(jubbahColours)
  const shown = useMemo(
    () => (colour === 'All' ? jubbahs : jubbahs.filter((item) => item.colour === colour)),
    [colour],
  )

  usePageMeta(getShareMeta('/shop'))

  return (
    <>
      <section className="grid bg-ivory pt-[var(--header-offset)] lg:min-h-[100dvh] lg:grid-cols-12">
        <div className="relative order-1 min-h-[calc(62svh-var(--header-offset))] overflow-hidden bg-ivory-deep lg:order-2 lg:col-span-7 lg:min-h-[calc(100dvh-var(--header-offset))]">
          <img
            src="/images/jubbah-sand-02.jpg"
            alt="The sand jubbah at rest, the cloth to the ankle."
            className="still-in absolute inset-0 h-full w-full object-cover object-[center_22%]"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:px-12 lg:order-1 lg:col-span-5 lg:px-16 lg:py-32">
          <Reveal>
            <Eyebrow>The outer garment</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
              The Shop
            </Display>
            <p lang="ar" dir="rtl" className="mt-4 font-arabic text-2xl text-ink/55">
              الجُبَّة
            </p>
            <Body className="mt-6 max-w-md">
              The jubbah, in three colours for now: black, sand, charcoal. Five sizes, 52
              to 60. Cut from the house block.
            </Body>
          </Reveal>
        </div>
      </section>

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

          <ColourFilter
            value={colour}
            options={[...filters]}
            onChange={setColour}
          />

          {shown.length === 0 ? (
            <p className="text-[15px] font-light text-ink-soft">No jubbah in this colour.</p>
          ) : (
            <div className="grid gap-x-4 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={productPath(product)}
                  delay={index * 80}
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
              alt: 'The black jubbah from behind: a clean column, hem to the ankle.',
            },
            {
              src: '/images/jubbah-charcoal-cloth.jpg',
              alt: 'Charcoal wool-cotton for the jubbah, still in the piece.',
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
              The house also keeps the thobe. The jubbah is the outer column; the thobe
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
