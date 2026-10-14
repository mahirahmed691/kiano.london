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
import { Rule } from '@/components/ui/Rule'
import { creedIntent } from '@/data/creed'
import { jubbahColours, jubbahs, productLineName, productPath } from '@/data/products'
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
        imageAlt="Urban Emirati in cream at rest, the cloth to the ankle."
        objectPosition="center 22%"
        kicker="The outer garment"
        title="The Shop."
        minHeight="screen"
        priority
      />

      <Section>
        <Container>
          <Reveal className="mb-16 max-w-xl md:mb-20">
            <p lang="ar" dir="rtl" className="w-fit font-arabic text-2xl font-light text-ink-soft">
              الجُبَّة
            </p>
            <Display as="h1" className="mt-5 text-4xl md:text-5xl">
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
              Sizes 52–60. Three colourways. Made to order, four to eight weeks.
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
            <div className="grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
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
      </Section>

      <NightMotto quiet />

      <Section>
        <LookbookStrip
          plates={[
            {
              src: '/images/jubbah-black-02.jpg',
              alt: 'Urban Emirati in black from behind: a clean column, hem to the ankle.',
              kicker: 'Black',
              name: 'Urban Emirati',
            },
            {
              src: '/images/jubbah-charcoal-cloth.jpg',
              alt: 'Cotton viscose mix for the garment, still in the piece.',
              objectPosition: 'center 40%',
              kicker: 'The cloth',
              name: 'Light GSM',
            },
            {
              src: '/images/jubbah-charcoal-02.jpg',
              alt: 'Urban Emirati in stone grey walking: ankle hem, concealed placket.',
              kicker: 'Stone Grey',
              name: 'Urban Emirati',
            },
          ]}
        />
        <Container>
          <Rule className="mt-20 md:mt-28" />
          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-lg text-[14px] font-light leading-relaxed text-stone">
              The house also keeps the thobe. This garment is the outer column; the thobe
              is the one beneath. Each piece leaves unscented, in a garment bag and a
              rigid box. The scent is coming, as its own line.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Button to="/collection">The thobes</Button>
              <TextLink to="/scent">The Scent</TextLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
