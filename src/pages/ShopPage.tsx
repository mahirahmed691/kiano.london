import { useMemo } from 'react'
import { Hero } from '@/components/editorial/Hero'
import { LookbookStrip } from '@/components/editorial/LookbookStrip'
import { ColourFilter } from '@/components/product/ColourFilter'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Rule } from '@/components/ui/Rule'
import { creedIntent } from '@/data/creed'
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
      <Hero
        image="/images/jubbah-sand-02.jpg"
        imageAlt="The sand jubbah at rest, the cloth to the ankle."
        objectPosition="center 22%"
        kicker="The outer garment"
        title="The Shop."
        subtitle={`The jubbah, in three colours for now: black, sand, charcoal. Five sizes, 52 to 60. ${creedIntent}`}
        minHeight="tall"
        priority
      >
        <p lang="ar" dir="rtl" className="w-fit font-arabic text-2xl text-ivory/70">
          الجُبَّة
        </p>
      </Hero>

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
              kicker: 'Black',
              name: 'The jubbah',
            },
            {
              src: '/images/jubbah-charcoal-cloth.jpg',
              alt: 'Charcoal wool-cotton for the jubbah, still in the piece.',
              objectPosition: 'center 40%',
              kicker: 'The cloth',
              name: 'Charcoal',
            },
            {
              src: '/images/jubbah-charcoal-02.jpg',
              alt: 'The charcoal jubbah walking: wool-cotton, ankle hem, concealed placket.',
              kicker: 'Charcoal',
              name: 'The jubbah',
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
