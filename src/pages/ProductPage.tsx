import { WovenLabel } from '@/components/brand/WovenLabel'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HouseSizePrefill } from '@/components/account/HouseSizePrefill'
import { WaitForm } from '@/components/visit/WaitForm'
import { Link, useParams } from 'react-router-dom'
import { HowItArrives } from '@/components/editorial/HowItArrives'
import { NightMotto } from '@/components/editorial/NightMotto'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ClothZoom } from '@/components/product/ClothZoom'
import { PieceHero, ProductPlate } from '@/components/product/ProductPlate'
import { HowToMeasure } from '@/components/product/HowToMeasure'
import { SizeGuide } from '@/components/product/SizeGuide'
import { Button, TextLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Rule'
import { packingNote } from '@/data/packing'
import { carriageLine } from '@/data/shipping'
import { site } from '@/data/site'
import {
  clothSwatch,
  colourVariants,
  getProduct,
  productPath,
  productLineName,
  relatedProducts,
  thobeSizes,
  type Product,
  type ThobeSize,
} from '@/data/products'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/cn'
import { clerkEnabled } from '@/lib/clerk'
import { asThobeSize, readStoredSize, writeStoredSize } from '@/lib/house-profile'
import { ShareLink } from '@/components/ui/ShareLink'
import { SITE_URL } from '@/lib/seo'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'
import { remainingCopy, useProductStock } from '@/lib/useProductStock'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id)
  const { add, open } = useCart()
  const [size, setSize] = useState<ThobeSize | ''>('')
  const [guideOpen, setGuideOpen] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const [looking, setLooking] = useState<number | null>(null)
  const stock = useProductStock(product?.id ?? '')
  const heroRef = useRef<HTMLElement>(null)
  const buyRef = useRef<HTMLDivElement>(null)
  const related = useMemo(
    () => (product ? relatedProducts(product.id).slice(0, 3) : []),
    [product],
  )
  const variants = useMemo(() => (product ? colourVariants(product) : []), [product])

  const share = getShareMeta(product ? productPath(product) : '/shop')
  usePageMeta(
    product
      ? share
      : {
          title: 'Kiano London',
          description: 'This piece is not in the collection.',
          path: '/shop',
        },
  )

  useEffect(() => {
    const fromSize = Number(new URLSearchParams(window.location.search).get('size'))
    const named = asThobeSize(fromSize)
    if (named) {
      setSize(named)
      writeStoredSize(named)
    } else {
      setSize(readStoredSize() ?? '')
    }
    setGuideOpen(false)
    setLooking(null)
    setShowBar(false)
  }, [product?.id])

  const chooseSize = useCallback((value: ThobeSize) => {
    setSize(value)
    writeStoredSize(value)
  }, [])

  useEffect(() => {
    if (!product) return
    document.documentElement.classList.add('snap-product')
    return () => document.documentElement.classList.remove('snap-product')
  }, [product?.id])

  useEffect(() => {
    const buy = buyRef.current
    const hero = heroRef.current
    if (!buy || !hero) return
    let buyVisible = false
    let heroVisible = true
    const sync = () => setShowBar(!heroVisible && !buyVisible)
    const buyObs = new IntersectionObserver(
      ([entry]) => {
        buyVisible = entry.isIntersecting
        sync()
      },
      { threshold: 0.15 },
    )
    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting
        sync()
      },
      { threshold: 0.05 },
    )
    buyObs.observe(buy)
    heroObs.observe(hero)
    return () => {
      buyObs.disconnect()
      heroObs.disconnect()
    }
  }, [product?.id])

  if (!product) {
    return <NotFoundPage />
  }

  const enquireTo = size
    ? `/visit?piece=${product.id}&size=${size}`
    : `/visit?piece=${product.id}`
  const remaining = size && stock ? stock[size] : undefined
  const held = remaining === 0

  function addToBag() {
    if (!product || !size || held) return
    add(product.id, size)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: productLineName(product),
            image: `${SITE_URL}${product.image}`,
            description: product.description,
            brand: { '@type': 'Brand', name: site.fullName },
            offers: {
              '@type': 'Offer',
              url: `${SITE_URL}${productPath(product)}`,
              priceCurrency: 'GBP',
              price: (product.pricePence / 100).toFixed(2),
              availability: 'https://schema.org/PreOrder',
            },
          }),
        }}
      />
      <PieceHero
        ref={heroRef}
        colour={product.colour}
        image={
          product.gallery[0] ?? {
            src: product.image,
            alt: product.imageAlt,
            objectPosition: product.objectPosition,
          }
        }
        onLook={() => setLooking(0)}
      />
      <section className="bg-ivory text-ink">
        <div className="grid xl:grid-cols-[minmax(16rem,1fr)_minmax(0,38rem)_minmax(16rem,1fr)] xl:items-start">
          <div className="order-3 border-t border-rule px-6 py-12 md:px-12 xl:order-1 xl:col-start-1 xl:border-t-0 xl:sticky xl:top-28 xl:max-h-[calc(100svh-7rem)] xl:overflow-y-auto xl:py-16 xl:pr-10 xl:pl-16">
            <Reveal>
              <div className="hidden xl:block">
                <PieceHeading product={product} />
              </div>
              <ul className="space-y-3 max-xl:mt-0 xl:mt-10">
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

          <div className="order-1 px-6 py-12 max-xl:pt-10 md:px-12 xl:order-3 xl:col-start-3 xl:sticky xl:top-28 xl:max-h-[calc(100svh-7rem)] xl:overflow-y-auto xl:py-16 xl:pr-16 xl:pl-10">
            <Reveal>
              <div className="mb-10 xl:hidden">
                <PieceHeading product={product} />
              </div>
              <p className="font-display text-4xl font-light">{product.price}</p>
              <p className="mt-3 text-[14px] font-light text-ink-soft">
                {product.colour} · {product.cloth}
              </p>
              <Body className="mt-6 xl:hidden">{product.description}</Body>

              <div className="mt-10" ref={buyRef}>
                {clerkEnabled ? (
                  <HouseSizePrefill chosen={size} onSize={chooseSize} />
                ) : null}
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
                          style={{ backgroundColor: variant.swatch ?? clothSwatch[variant.colour] }}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-light text-stone">{product.colour}</p>
                  </div>
                ) : null}
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Size</p>
                <div className="mt-4 grid max-w-[20rem] grid-cols-5 gap-px bg-rule">
                  {thobeSizes.map((value) => {
                    const sizeHeld = stock?.[value] === 0
                    return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={size === value}
                          onClick={() => chooseSize(value)}
                          className={cn(
                            'flex aspect-square items-center justify-center text-[12px] tracking-[0.08em] transition-colors duration-300',
                            size === value ? 'bg-ink text-ivory' : 'bg-ivory hover:bg-ivory-deep',
                            sizeHeld && size !== value && 'opacity-35',
                          )}
                        >
                        {value}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-[13px] font-light text-stone">
                  {size && remaining !== undefined ? remainingCopy(remaining) : product.leadTime}
                </p>
              </div>

              {held && size ? (
                <div className="mt-10 space-y-10">
                  <WaitForm
                    key={`${product.id}-${size}`}
                    productId={product.id}
                    size={size}
                    piece={productLineName(product)}
                  />
                </div>
              ) : (
                <Button
                  variant="solid"
                  className="mt-10 w-full justify-center"
                  disabled={!size}
                  onClick={addToBag}
                >
                  {size ? 'Add to bag' : 'Choose a size'}
                </Button>
              )}

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
                  {carriageLine} Made to order. Payment is taken first.{' '}
                  {packingNote}
                </p>
                <TextLink to={enquireTo}>Enquire to visit</TextLink>
                <ShareLink title={share.title} text={share.description} path={share.path} />
              </div>
            </Reveal>
          </div>

          {product.gallery.length > 1 ? (
            <div className="order-2 xl:order-2 xl:col-start-2">
              {product.gallery.slice(1).map((image, index) => (
                <ProductPlate
                  key={`${image.src}-${index + 1}`}
                  image={image}
                  colour={product.colour}
                  onLook={() => setLooking(index + 1)}
                />
              ))}
            </div>
          ) : (
            <div className="order-2 hidden xl:block xl:order-2 xl:col-start-2">
              <ProductPlate
                image={
                  product.gallery[0] ?? {
                    src: product.image,
                    alt: product.imageAlt,
                    objectPosition: product.objectPosition,
                  }
                }
                colour={product.colour}
                first
                onLook={() => setLooking(0)}
              />
            </div>
          )}
        </div>
      </section>

      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow>The nape</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">The woven mark.</Display>
              <WovenLabel size="lg" colour={product.colour} className="mt-10" />
              <p className="mt-8 max-w-sm text-[15px] font-light leading-relaxed text-ink-soft">
                The square mark is sewn, not printed — the interlocking KK, in the cloth
                of the piece — and set at the nape by hand after the last press. Size is
                a separate tab. Care sits at the side seam.
              </p>
            </Reveal>
            <Reveal delay={80} className="lg:col-span-7 lg:col-start-6">
              <Eyebrow>The making</Eyebrow>
              <Display className="mt-4 text-4xl md:text-5xl">
                How this {product.cut === 'Jubbah' ? 'garment' : 'thobe'} is held.
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
          <HowToMeasure />
        </Container>
      </Section>

      <HowItArrives />

      <NightMotto quiet />

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
          'shell-lift fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-ivory/95 px-5 py-3 text-ink backdrop-blur-[2px] transition-transform duration-500 xl:hidden',
          showBar && !open && looking === null ? 'translate-y-0' : 'translate-y-full',
        )}
        aria-hidden={!showBar}
      >
        <div className="flex items-center gap-4">
          <p className="font-display text-2xl font-light">{product.price}</p>
          {held ? (
            <Button
              variant="solid"
              className="flex-1 justify-center"
              href="#wait-letter"
            >
              Write if this size returns
            </Button>
          ) : (
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
          )}
        </div>
      </div>
      {looking !== null ? (
        <ClothZoom
          src={product.gallery[looking]?.src ?? product.image}
          alt={product.gallery[looking]?.alt ?? product.imageAlt}
          objectPosition={product.gallery[looking]?.objectPosition ?? product.objectPosition}
          onClose={() => setLooking(null)}
        />
      ) : null}
    </>
  )
}

function PieceHeading({ product }: { product: Product }) {
  return (
    <>
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
        {productLineName(product)}
      </Display>
    </>
  )
}
