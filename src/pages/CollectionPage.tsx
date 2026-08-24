import { ProductGrid } from '@/components/product/ProductGrid'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Rule'
import { products } from '@/data/products'
import { usePageMeta } from '@/lib/usePageMeta'

export function CollectionPage() {
  usePageMeta({
    title: 'The Collection — Cavendish House',
    description:
      'Coats, tailoring and knitwear from Cavendish House. Cloth from British mills, cut in Mayfair.',
    path: '/collection',
    image: '/images/collection-hero.jpg',
  })

  return (
    <>
      <header className="bg-ivory pt-32 pb-6 md:pt-40">
        <Container>
          <Reveal>
            <Eyebrow>Autumn winter</Eyebrow>
            <Display as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
              The Collection
            </Display>
            <Body className="mt-6 max-w-xl">
              Eight pieces, made in small numbers. Each is named for a room or a street
              around the house — not a season, which we do not believe in.
            </Body>
          </Reveal>
        </Container>
      </header>

      <div className="px-6 md:px-12 lg:px-16">
        <div className="img-zoom aspect-[16/8] max-h-[520px] w-full bg-ivory-deep md:aspect-[21/8]">
          <img
            src="/images/collection-hero.jpg"
            alt="A quiet rail of jackets, knitwear and a felt hat against an ivory wall."
            className="h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <Section>
        <Container>
          <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {String(products.length).padStart(2, '0')} pieces
            </p>
            <p className="text-[13px] font-light text-stone">
              Prices include VAT. Made to order, four to eight weeks.
            </p>
          </div>
          <ProductGrid products={products} />
          <Rule className="mt-20 md:mt-28" />
          <p className="mt-8 max-w-lg text-[14px] font-light leading-relaxed text-stone">
            Fittings are held at 8 Carlos Place. Write to the atelier if you wish to
            see a cloth before it is cut.
          </p>
        </Container>
      </Section>
    </>
  )
}
