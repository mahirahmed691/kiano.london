export const thobeSizes = [52, 54, 56, 58, 60] as const

export type ThobeSize = (typeof thobeSizes)[number]

export type ProductCut = 'Thobe' | 'Jubbah'

export type ProductColour = 'Black' | 'Charcoal' | 'Grey' | 'Beige' | 'Bone' | 'Cream' | 'Stone Grey'

/** Cloth of the square mark, sampled from the piece. Thread is ivory on every colour. */
export const clothSwatch: Record<ProductColour, string> = {
  Black: '#1C1C1D',
  Charcoal: '#4A4C4C',
  Grey: '#676360',
  Beige: '#C3AC95',
  Bone: '#D2CBC3',
  Cream: '#C4B49A',
  'Stone Grey': '#8A8682',
}

export const clothThread = '#F2EBDC'

export const leadTime = 'Made to order.'

export function swatchOf(colour: ProductColour) {
  return clothSwatch[colour]
}

export type ProductImage = {
  src: string
  alt: string
  objectPosition?: string
}

export type Product = {
  id: string
  name: string
  cut: ProductCut
  colour: ProductColour
  swatch?: string
  variantGroup?: string
  cloth: string
  mill: string
  price: string
  pricePence: number
  image: string
  imageAlt: string
  objectPosition?: string
  featured?: boolean
  description: string
  details: string[]
  composition: string
  leadTime: string
  gallery: ProductImage[]
}

const napeFinish =
  'The square mark — the interlocking KK, sewn in the cloth of the piece — is set at the nape. Size sewn in separately. Care at the side seam.'

export const products: Product[] = [
  {
    id: 'jubbah-black',
    name: 'Urban Emirati',
    cut: 'Jubbah',
    colour: 'Black',
    swatch: clothSwatch.Black,
    variantGroup: 'jubbah',
    cloth: 'Cotton viscose mix, light GSM',
    mill: 'Cotton viscose mix',
    price: '£79',
    pricePence: 7900,
    image: '/images/jubbah-black.jpg',
    imageAlt: 'Urban Emirati in black, worn at full length.',
    objectPosition: 'center 12%',
    featured: true,
    description:
      'Urban Emirati in black: cotton viscose mix, light GSM. A modest column with more air through the chest than the thobe. Band collar, concealed placket, hem to the ankle. Cut from the house block in five sizes.',
    details: [
      'The outer garment. Worn alone, or over a thobe.',
      'Cotton viscose mix, light GSM.',
      'Band collar. Concealed placket. Hem to the ankle.',
      napeFinish,
    ],
    composition: 'Cotton viscose mix. Light GSM.',
    leadTime,
    gallery: [
      {
        src: '/images/jubbah-black.jpg',
        alt: 'Urban Emirati in black, worn at full length.',
        objectPosition: 'center 12%',
      },
      {
        src: '/images/jubbah-black-02.jpg',
        alt: 'Urban Emirati in black from behind: a clean column, hem to the ankle.',
      },
      {
        src: '/images/concealed-pocket.jpg',
        alt: 'The interior of the garment, the woven label set by hand.',
        objectPosition: 'center 62%',
      },
    ],
  },
  {
    id: 'jubbah-sand',
    name: 'Urban Emirati',
    cut: 'Jubbah',
    colour: 'Cream',
    swatch: clothSwatch.Cream,
    variantGroup: 'jubbah',
    cloth: 'Cotton viscose mix, light GSM',
    mill: 'Cotton viscose mix',
    price: '£79',
    pricePence: 7900,
    image: '/images/jubbah-sand.jpg',
    imageAlt: 'Urban Emirati in cream, worn at full length in a sunlit plaster room.',
    objectPosition: 'center 8%',
    featured: true,
    description:
      'Urban Emirati in cream: cotton viscose mix, light GSM. The daylight colour. Same house block as black and stone grey, five sizes, 52 to 60.',
    details: [
      'The outer garment. Worn alone, or over a thobe.',
      'Cotton viscose mix, light GSM.',
      'Band collar. Concealed placket. Hem to the ankle.',
      napeFinish,
    ],
    composition: 'Cotton viscose mix. Light GSM.',
    leadTime,
    gallery: [
      {
        src: '/images/jubbah-sand.jpg',
        alt: 'Urban Emirati in cream, worn at full length in a sunlit plaster room.',
        objectPosition: 'center 8%',
      },
      {
        src: '/images/jubbah-sand-02.jpg',
        alt: 'Urban Emirati in cream at rest: the cloth draped to the ankle.',
      },
      {
        src: '/images/cloth-giza.jpg',
        alt: 'Cotton viscose mix in the piece, light GSM.',
      },
    ],
  },
  {
    id: 'jubbah-charcoal',
    name: 'Urban Emirati',
    cut: 'Jubbah',
    colour: 'Stone Grey',
    swatch: clothSwatch['Stone Grey'],
    variantGroup: 'jubbah',
    cloth: 'Cotton viscose mix, light GSM',
    mill: 'Cotton viscose mix',
    price: '£79',
    pricePence: 7900,
    image: '/images/jubbah-charcoal.jpg',
    imageAlt: 'Urban Emirati in stone grey, worn at full length.',
    objectPosition: 'center 10%',
    featured: true,
    description:
      'Urban Emirati in stone grey: cotton viscose mix, light GSM. Same house block as black and cream, sizes 52 to 60.',
    details: [
      'The outer garment. Worn alone, or over a thobe.',
      'Cotton viscose mix, light GSM.',
      'Band collar. Concealed placket. Hem to the ankle.',
      napeFinish,
    ],
    composition: 'Cotton viscose mix. Light GSM.',
    leadTime,
    gallery: [
      {
        src: '/images/jubbah-charcoal.jpg',
        alt: 'Urban Emirati in stone grey, worn at full length.',
        objectPosition: 'center 10%',
      },
      {
        src: '/images/jubbah-charcoal-02.jpg',
        alt: 'Urban Emirati in stone grey walking: ankle hem, concealed placket.',
      },
      {
        src: '/images/jubbah-charcoal-cloth.jpg',
        alt: 'Cotton viscose mix in the piece, before it is cut.',
      },
    ],
  },
]

export const productColours: ProductColour[] = ['Black', 'Charcoal', 'Grey', 'Beige', 'Bone']

export const jubbahColours: ProductColour[] = ['Stone Grey', 'Cream', 'Black']

export const thobes = products.filter((item) => item.cut === 'Thobe')

export const jubbahs = jubbahColours.flatMap((colour) =>
  products.filter((item) => item.cut === 'Jubbah' && item.colour === colour),
)

export const featuredProducts = products.filter((item) => item.featured)

/** Still-plate ids that are not SKUs. Cloth of the square mark only. */
const stillColour: Record<string, ProductColour> = {
  layl: 'Black',
  raml: 'Beige',
  ghabar: 'Grey',
  hadid: 'Charcoal',
  hajar: 'Bone',
}

export function getProduct(id: string | undefined) {
  if (!id) return undefined
  return products.find((item) => item.id === id)
}

/** Cloth of a piece or still plate: `jubbah-sand` or `layl` → Cream / Black. */
export function colourOfPiece(id: string | undefined): ProductColour | undefined {
  if (!id) return undefined
  return getProduct(id)?.colour ?? stillColour[id]
}

export function productLineName(product: Product) {
  return product.cut === 'Jubbah' ? `${product.name} in ${product.colour}` : product.name
}

export function reservedCutName(
  productId: string | undefined,
  size: number | undefined,
  fallback = 'A cut',
) {
  const piece = getProduct(productId)
  const name = piece ? productLineName(piece) : fallback
  return size ? `${name}, size ${size}` : name
}

export function productPath(product: Product) {
  return product.cut === 'Jubbah' ? `/shop/${product.id}` : `/collection/${product.id}`
}

export function colourVariants(product: Product) {
  if (!product.variantGroup) return []
  return products.filter((item) => item.variantGroup === product.variantGroup)
}

export function relatedProducts(id: string) {
  const product = getProduct(id)
  if (!product) return []
  return products.filter((item) => item.cut === product.cut && item.id !== id)
}
