import { ProductGrid } from '@/components/product/ProductGrid'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Rule'
import { products } from '@/data/products'
import { site } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export function CollectionPage() {
  usePageMeta({
    title: 'The Collection — Cavendish House',
    description:
      'Five earthy Emirati thobes from Cavendish House. Black, grey and beige, sizes 52 to 60, cut in London in premium cloth.',
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
            <p
              lang="ar"
              dir="rtl"
              className="mt-4 font-arabic text-2xl text-ink/55"
            >
              {site.arabicName}
            </p>
            <Body className="mt-6 max-w-xl">
              Five earthy Emirati thobes — black, charcoal, grey, beige and bone.
              Premium cloth, sized 52 to 60. Named for a colour, not a season.
            </Body>
          </Reveal>
        </Container>
      </header>

      <div className="px-6 md:px-12 lg:px-16">
        <div className="img-zoom aspect-[16/8] max-h-[520px] w-full bg-ivory-deep md:aspect-[21/8]">
          <img
            src="/images/heritage-linen.jpg"
            alt="Sand-beige extra-long staple cotton, the cloth of the earthy thobe."
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
              Sizes 52–60. Prices include VAT. Made to order, four to eight weeks.
            </p>
          </div>
          <ProductGrid products={products} />
          <Rule className="mt-20 md:mt-28" />
          <p className="mt-8 max-w-lg text-[14px] font-light leading-relaxed text-stone">
            Fittings are held at the London atelier. Write if you wish to see a cloth
            before it is cut.
          </p>
        </Container>
      </Section>
    </>
  )
}
