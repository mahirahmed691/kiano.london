import { WovenLabel } from '@/components/brand/WovenLabel'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  colourVariants,
  getProduct,
  productPath,
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
  const { add, open } = useCart()
  const [size, setSize] = useState<ThobeSize | ''>('')
  const [guideOpen, setGuideOpen] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const buyRef = useRef<HTMLDivElement>(null)
  const related = useMemo(
    () => (product ? relatedProducts(product.id).slice(0, 3) : []),
    [product],
  )
  const variants = useMemo(() => (product ? colourVariants(product) : []), [product])

  usePageMeta({
    title: product ? `${product.name} — Kiano London` : 'Kiano London',
    description: product
      ? `${product.name}: ${product.colour.toLowerCase()} Emirati ${product.cut.toLowerCase()} in ${product.cloth.toLowerCase()}. Cut in London, sizes 52 to 60.`
      : 'This piece is not in the collection.',
    path: product ? productPath(product) : '/shop',
    image: product?.image,
  })

  useEffect(() => {
    setSize('')
    setGuideOpen(false)
  }, [product?.id])

  useEffect(() => {
    const node = buyRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [product?.id])

  if (!product) {
    return <NotFoundPage />
  }

  const enquireTo = size
    ? `/visit?piece=${product.id}&size=${size}`
    : `/visit?piece=${product.id}`

  function addToBag() {
    if (!product || !size) return
    add(product.id, size)
  }

  return (
    <>
      <section className="pt-28 md:pt-32">
        <div className="grid xl:grid-cols-[minmax(16rem,1fr)_minmax(0,38rem)_minmax(16rem,1fr)] xl:items-start">
          <div className="order-2 px-6 py-12 md:px-12 xl:order-1 xl:sticky xl:top-28 xl:max-h-[calc(100svh-7rem)] xl:overflow-y-auto xl:py-16 xl:pr-10 xl:pl-16">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                <Link
                  to={product.cut === 'Jubbah' ? '/shop' : '/collection'}
                  className="transition-opacity hover:opacity-70"
                >
                  {product.cut === 'Jubbah' ? 'The Shop' : 'The Collection'}
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
            {product.gallery.map((image, index) => (
              <div key={`${image.src}-${index}`} className="relative bg-ivory-deep">
                <ImageFrame
                  src={image.src}
                  alt={image.alt}
                  eager={index === 0}
                  objectPosition={image.objectPosition}
                  className={
                    index === 0
                      ? 'aspect-[3/4] w-full xl:min-h-[calc(100svh-7rem)] xl:aspect-auto'
                      : 'aspect-[3/4] w-full'
                  }
                />
                {index === 0 ? (
                  <WovenLabel
                    size="md"
                    className="pointer-events-none absolute bottom-5 left-5 z-10 md:bottom-8 md:left-8"
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="order-3 px-6 py-12 md:px-12 xl:sticky xl:top-28 xl:py-16 xl:pr-16 xl:pl-10">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{product.mill}</p>
              <p className="mt-4 font-display text-4xl font-light">{product.price}</p>
              <p className="mt-3 text-[14px] font-light text-ink-soft">
                {product.colour} · {product.cloth}
              </p>
              <Body className="mt-6 xl:hidden">{product.description}</Body>

              <div className="mt-10" ref={buyRef}>
                {variants.length > 1 ? (
                  <div className="mb-8">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Colour</p>
                    <div className="mt-4 flex items-center gap-3">
                      {variants.map((variant) => (
                        <Link
                          key={variant.id}
                          to={productPath(variant)}
                          aria-label={variant.colour}
                          aria-current={variant.id === product.id ? 'true' : undefined}
                          className={cn(
                            'block h-7 w-7 border transition-opacity',
                            variant.id === product.id
                              ? 'border-ink'
                              : 'border-rule opacity-70 hover:opacity-100',
                          )}
                          style={{ backgroundColor: variant.swatch ?? '#1B1714' }}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-light text-stone">{product.colour}</p>
                  </div>
                ) : null}
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Size</p>
                <div className="mt-4 grid max-w-[20rem] grid-cols-5 gap-px bg-rule">
                  {thobeSizes.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSize(value)}
                      className={cn(
                        'flex aspect-square items-center justify-center bg-ivory text-[12px] tracking-[0.08em] transition-colors duration-300',
                        size === value ? 'bg-ink text-ivory' : 'hover:bg-ivory-deep',
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
                onClick={addToBag}
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
            <Reveal className="lg:col-span-4">
              <Eyebrow>The nape</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">The monogram.</Display>
              <WovenLabel size="lg" className="mt-10" />
              <p className="mt-8 max-w-sm text-[15px] font-light leading-relaxed text-ink-soft">
                The K is woven, not printed, and set at the nape by hand after the last
                press. The same mark is on every thobe and every jubbah.
              </p>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-7 lg:col-start-6">
              <Eyebrow>The making</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">
                How this {product.cut.toLowerCase()} is held.
              </Display>
              <p className="mt-8 max-w-md text-[15px] font-light leading-relaxed text-ink-soft">
                {product.composition}
              </p>
              <Eyebrow className="mt-14">Sizes 52–60</Eyebrow>
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
              <Eyebrow>The line</Eyebrow>
              <Display className="mt-3 text-4xl md:text-5xl">
                {product.cut === 'Jubbah' ? 'The other colours' : 'The other thobes'}
              </Display>
            </div>
            <TextLink to={product.cut === 'Jubbah' ? '/shop' : '/collection'}>
              {product.cut === 'Jubbah' ? 'All of the shop' : 'All of the collection'}
            </TextLink>
          </Reveal>
          <ProductGrid products={related} numbered={false} />
        </Container>
      </Section>

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-ivory/95 px-5 py-3 backdrop-blur-[2px] transition-transform duration-500 xl:hidden',
          showBar && !open ? 'translate-y-0' : 'translate-y-full',
        )}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        aria-hidden={!showBar}
      >
        <div className="flex items-center gap-4">
          <p className="font-display text-2xl font-light">{product.price}</p>
          <Button
            variant="solid"
            className="flex-1 justify-center"
            disabled={!size}
            onClick={() => {
              if (size) addToBag()
              else buyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
          >
            {size ? 'Add to bag' : 'Choose a size'}
          </Button>
        </div>
      </div>
    </>
  )
}
