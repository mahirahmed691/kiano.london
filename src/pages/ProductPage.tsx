import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ImageFrame } from '@/components/editorial/ImageFrame'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SizeGuide } from '@/components/product/SizeGuide'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Rule'
import {
  getProduct,
  relatedProducts,
  thobeSizes,
  type ThobeSize,
} from '@/data/products'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/cn'
import { usePageMeta } from '@/lib/usePageMeta'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id)
  const { add } = useCart()
  const [active, setActive] = useState(0)
  const [size, setSize] = useState<ThobeSize | ''>('')
  const [guideOpen, setGuideOpen] = useState(false)
  const related = useMemo(
    () => (product ? relatedProducts(product.id).slice(0, 3) : []),
    [product],
  )

  usePageMeta({
    title: product ? `${product.name} — Cavendish House` : 'Cavendish House',
    description: product
      ? `${product.name}: ${product.colour.toLowerCase()} Emirati thobe in ${product.cloth.toLowerCase()}. Cut in London, sizes 52 to 60.`
      : 'This piece is not in the collection.',
    path: product ? `/collection/${product.id}` : '/collection',
    image: product?.image,
  })

  if (!product) {
    return <NotFoundPage />
  }

  const current = product.gallery[active] ?? product.gallery[0]
  const enquireTo = size
    ? `/visit?piece=${product.id}&size=${size}`
    : `/visit?piece=${product.id}`

  return (
    <>
      <section className="pt-24 md:pt-28">
        <div className="grid xl:grid-cols-[minmax(16rem,1fr)_minmax(0,38rem)_minmax(16rem,1fr)] xl:items-start">
          <div className="order-2 px-6 py-12 md:px-12 xl:order-1 xl:sticky xl:top-28 xl:max-h-[calc(100svh-7rem)] xl:overflow-y-auto xl:py-16 xl:pr-10 xl:pl-16">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                <Link to="/collection" className="transition-opacity hover:opacity-70">
                  The Collection
                </Link>
                <span aria-hidden="true"> · </span>
                {product.colour}
              </p>
              <Display as="h1" className="mt-6 text-4xl md:text-5xl">
                {product.name}
              </Display>
              <p lang="ar" dir="rtl" className="mt-3 font-arabic text-2xl text-ink/55">
                {product.arabicName}
              </p>
              <ul className="mt-10 space-y-3">
                {product.details.map((line) => (
                  <li
                    key={line}
                    className="max-w-sm text-[14px] font-light leading-relaxed text-ink-soft"
                  >
                    {line}
                  </li>
                ))}
              </ul>
              <Body className="mt-8 hidden xl:block">{product.description}</Body>
            </Reveal>
          </div>

          <div className="order-1 xl:order-2">
            <div className="bg-ivory-deep">
              <ImageFrame
                src={current.src}
                alt={current.alt}
                eager
                objectPosition={current.objectPosition}
                className="aspect-[3/4] w-full xl:min-h-[calc(100svh-7rem)] xl:aspect-auto"
              />
            </div>
            {product.gallery.length > 1 ? (
              <div className="grid grid-cols-3">
                {product.gallery.map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`View photograph ${index + 1} of ${product.name}`}
                    aria-pressed={index === active}
                    className={cn(
                      'img-zoom aspect-[3/4] overflow-hidden bg-ivory-deep',
                      index === active ? 'opacity-100' : 'opacity-55 hover:opacity-100',
                    )}
                  >
                    <img
                      src={image.src}
                      alt=""
                      className="size-full object-cover"
                      style={
                        image.objectPosition
                          ? { objectPosition: image.objectPosition }
                          : undefined
                      }
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="order-3 px-6 py-12 md:px-12 xl:sticky xl:top-28 xl:py-16 xl:pr-16 xl:pl-10">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{product.mill}</p>
              <p className="mt-4 font-display text-4xl font-light">{product.price}</p>
              <p className="mt-3 text-[14px] font-light text-ink-soft">
                {product.colour} · {product.cloth}
              </p>
              <Body className="mt-6 xl:hidden">{product.description}</Body>

              <div className="mt-10">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Size</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {thobeSizes.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSize(value)}
                      className={cn(
                        'h-11 min-w-11 px-3 text-[12px] tracking-[0.08em] transition-colors duration-300',
                        size === value
                          ? 'border border-ink bg-ink text-ivory'
                          : 'border border-rule hover:border-ink',
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[13px] font-light text-stone">{product.leadTime}</p>
              </div>

              <Button
                variant="solid"
                className="mt-10 w-full justify-center"
                disabled={!size}
                onClick={() => {
                  if (size) add(product.id, size)
                }}
              >
                {size ? 'Add to bag' : 'Choose a size'}
              </Button>

              <div className="mt-8 space-y-4 border-t border-rule pt-6">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-[11px] uppercase tracking-[0.22em]"
                  aria-expanded={guideOpen}
                  onClick={() => setGuideOpen((value) => !value)}
                >
                  Size guide
                  <span aria-hidden="true">{guideOpen ? '−' : '+'}</span>
                </button>
                {guideOpen ? <SizeGuide className="pb-4" compact /> : null}
                <p className="border-t border-rule pt-4 text-[13px] font-light leading-relaxed text-stone">
                  Carriage included. Made to order in London. Payment is taken before the cloth
                  is cut.
                </p>
                <TextLink to={enquireTo}>Enquire to visit</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Section className="bg-ivory-deep/40">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>The making</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">How this thobe is held.</Display>
              <p className="mt-8 max-w-md text-[15px] font-light leading-relaxed text-ink-soft">
                {product.composition}
              </p>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
              <Eyebrow>Sizes 52–60</Eyebrow>
              <Display className="mt-4 text-4xl">The house block.</Display>
              <SizeGuide className="mt-8" />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Rule className="mb-16" />
          <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>The house line</Eyebrow>
              <Display className="mt-3 text-4xl md:text-5xl">The other thobes</Display>
            </div>
            <TextLink to="/collection">All of the collection</TextLink>
          </Reveal>
          <ProductGrid products={related} numbered={false} />
        </Container>
      </Section>
    </>
  )
}
