export const thobeSizes = [52, 54, 56, 58, 60] as const

export type ThobeSize = (typeof thobeSizes)[number]

export type ProductCut = 'Thobe' | 'Jubbah'

export type ProductColour = 'Black' | 'Charcoal' | 'Grey' | 'Beige' | 'Bone' | 'Sand'

export type ProductImage = {
  src: string
  alt: string
  objectPosition?: string
}

export type Product = {
  id: string
  name: string
  arabicName: string
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
  'The Kiano monogram is woven at the nape. Size sewn in separately. Care at the side seam.'

export const products: Product[] = [
  {
    id: 'layl-thobe',
    name: 'The Layl Thobe',
    arabicName: 'ليل',
    cut: 'Thobe',
    colour: 'Black',
    cloth: 'Matte Japanese cotton, band collar',
    mill: 'Compact cotton, 80s two-ply',
    price: '£70',
    pricePence: 7000,
    image: '/images/thobe-layl.jpg',
    imageAlt: 'The Layl thobe: matte black compact cotton, band collar, hem to the ankle.',
    objectPosition: 'center 12%',
    featured: true,
    description:
      'Layl is the black column. Compact Japanese cotton, matte so it does not shine under evening light, cut from the house block with a band collar and a placket that closes out of sight.',
    details: [
      'Band collar, pad-stitched by hand so the neck holds after a day’s wear.',
      'Concealed placket; horn buttons sit inside the cloth.',
      'Felled side seams. Interior pocket bagged in the lining.',
      napeFinish,
    ],
    composition: '100% compact Japanese cotton, 80s two-ply. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/thobe-layl.jpg',
        alt: 'The Layl thobe at full length: a black column, the placket concealed.',
        objectPosition: 'center 12%',
      },
      {
        src: '/images/concealed-pocket.jpg',
        alt: 'The interior of the Layl thobe, the woven label set by hand.',
        objectPosition: 'center 62%',
      },
      {
        src: '/images/stitch-buttonhole.jpg',
        alt: 'A silk-twist buttonhole on dark cloth, the placket of the Layl thobe.',
      },
    ],
  },
  {
    id: 'hadid-thobe',
    name: 'The Hadīd Thobe',
    arabicName: 'حديد',
    cut: 'Thobe',
    colour: 'Charcoal',
    cloth: 'Super 150s wool-cotton, concealed placket',
    mill: 'Huddersfield Super 150s',
    price: '£90',
    pricePence: 9000,
    image: '/images/featured-overcoat.jpg',
    imageAlt: 'A charcoal Emirati thobe with a standing collar, worn at full length.',
    objectPosition: '72% 18%',
    featured: true,
    description:
      'Hadīd is the winter line: Huddersfield Super 150s wool-cotton, charcoal, a standing collar. The cloth has a memory. The silhouette stays architectural from morning until night.',
    details: [
      'Standing collar, pad-stitched through the stand.',
      'Super 150s wool-cotton from Huddersfield; compact, resilient, a quiet handle.',
      'Concealed placket. Side seams felled, never overlocked.',
      'Hem set to the ankle of the house block. Interior pocket unseen from the face.',
      napeFinish,
    ],
    composition: 'Wool-cotton Super 150s, Huddersfield. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/featured-overcoat.jpg',
        alt: 'The Hadīd thobe at full length: standing collar, concealed placket, charcoal column.',
        objectPosition: '72% 18%',
      },
      {
        src: '/images/worsted-wool.jpg',
        alt: 'Charcoal Super 150s and a needle, the winter cloth of Hadīd.',
      },
      {
        src: '/images/concealed-pocket.jpg',
        alt: 'The interior pocket of the Hadīd thobe, bagged so it does not pull the cloth.',
        objectPosition: 'center 62%',
      },
    ],
  },
  {
    id: 'ghabar-thobe',
    name: 'The Ghabār Thobe',
    arabicName: 'غبار',
    cut: 'Thobe',
    colour: 'Grey',
    cloth: 'Italian compact cotton, earth grey',
    mill: 'Albini compact cotton',
    price: '£60',
    pricePence: 6000,
    image: '/images/thobe-ghabar.jpg',
    imageAlt: 'The Ghabār thobe: earth grey compact cotton, band collar, hem to the ankle.',
    objectPosition: 'center 12%',
    featured: true,
    description:
      'Ghabār is earth grey: Albini compact cotton, dense without stiffness, named for dust rather than a season. It is the thobe that reads as colour only when you stand beside black.',
    details: [
      'Albini compact cotton, earth grey, a high-count two-ply.',
      'Band collar. Concealed placket. Felled seams.',
      'Cut from the same house block as Layl; the difference is only the cloth.',
      'Washed once so the drape is already itself.',
      napeFinish,
    ],
    composition: '100% Italian compact cotton, Albini. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/thobe-ghabar.jpg',
        alt: 'The Ghabār thobe at full length: earth grey, a standing column.',
        objectPosition: 'center 12%',
      },
      {
        src: '/images/cloth-dust.jpg',
        alt: 'Earth-grey compact cotton in the piece, the cloth of Ghabār.',
      },
      {
        src: '/images/worsted-wool.jpg',
        alt: 'The stitch at close range: pad-stitching that shapes the collar stand.',
      },
    ],
  },
  {
    id: 'raml-thobe',
    name: 'The Raml Thobe',
    arabicName: 'رمل',
    cut: 'Thobe',
    colour: 'Beige',
    cloth: 'Egyptian extra-long staple cotton',
    mill: 'Giza 86, washed for drape',
    price: '£65',
    pricePence: 6500,
    image: '/images/thobe-raml.jpg',
    imageAlt: 'The Raml thobe: sand extra-long staple cotton, band collar, hem to the ankle.',
    objectPosition: 'center 12%',
    description:
      'Raml is sand. Extra-long staple Giza 86, washed so the fibre drapes rather than stands. It is the daylight thobe: pale, dry, named for the ground it resembles.',
    details: [
      'Giza 86 extra-long staple cotton, washed for drape.',
      'Band collar, modest through the chest, hem to the ankle.',
      'Felled side seams. Concealed placket in the same cloth.',
      'A quiet sheen from the long fibre, never a gloss.',
      napeFinish,
    ],
    composition: '100% extra-long staple cotton, Giza 86. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/thobe-raml.jpg',
        alt: 'The Raml thobe at full length: sand extra-long staple, the cloth to the ankle.',
        objectPosition: 'center 12%',
      },
      {
        src: '/images/cloth-giza.jpg',
        alt: 'Sand extra-long staple cotton in the piece, before it is chalked and cut.',
      },
      {
        src: '/images/concealed-pocket.jpg',
        alt: 'The unseen interior: a pocket bagged in the lining, a label set by hand.',
        objectPosition: 'center 62%',
      },
    ],
  },
  {
    id: 'hajar-thobe',
    name: 'The Hajar Thobe',
    arabicName: 'حجر',
    cut: 'Thobe',
    colour: 'Bone',
    cloth: 'Washed Italian cotton-silk',
    mill: 'Como cotton-silk',
    price: '£80',
    pricePence: 8000,
    image: '/images/thobe-hajar.jpg',
    imageAlt: 'The Hajar thobe: bone cotton-silk, band collar, hem to the ankle.',
    objectPosition: 'center 12%',
    description:
      'Hajar is bone: Como cotton-silk, washed, a cooler handle than Raml and a quieter light. The placket is the same concealed work as the rest of the line. The cloth is the distinction.',
    details: [
      'Washed cotton-silk from Como. Bone, not white.',
      'Concealed placket; the fastenings disappear until the hand finds them.',
      'Pad-stitched collar stand. Felled seams. Interior pocket.',
      'Pressed as considered as the first cut. Finished from the inside.',
      napeFinish,
    ],
    composition: 'Cotton-silk, Como. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/thobe-hajar.jpg',
        alt: 'The Hajar thobe at full length: bone cotton-silk, a quieter light.',
        objectPosition: 'center 12%',
      },
      {
        src: '/images/cloth-giza.jpg',
        alt: 'Pale cloth in the piece, washed so the fibre drapes rather than stands.',
      },
      {
        src: '/images/stitch-buttonhole.jpg',
        alt: 'A silk-twist buttonhole: the fastening disappears until the hand finds it.',
      },
    ],
  },
  {
    id: 'jubbah-black',
    name: 'The Jubbah',
    arabicName: 'الجُبَّة',
    cut: 'Jubbah',
    colour: 'Black',
    swatch: '#1B1714',
    variantGroup: 'jubbah',
    cloth: 'Matte Japanese cotton, band collar',
    mill: 'Compact cotton, 80s two-ply',
    price: '£85',
    pricePence: 8500,
    image: '/images/jubbah-black.jpg',
    imageAlt: 'A black Emirati jubbah worn at full length.',
    objectPosition: 'center 12%',
    featured: true,
    description:
      'The jubbah in black: compact Japanese cotton, a modest column with more air through the chest than the thobe. Band collar, concealed placket, hem to the ankle. Cut from the house block in five sizes.',
    details: [
      'The outer garment. Worn alone, or over a thobe.',
      'Band collar, pad-stitched by hand. Concealed placket.',
      'Felled side seams. Interior pocket bagged in the lining.',
      napeFinish,
    ],
    composition: '100% compact Japanese cotton, 80s two-ply. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/jubbah-black.jpg',
        alt: 'A black Emirati jubbah worn at full length.',
        objectPosition: 'center 12%',
      },
      {
        src: '/images/jubbah-black-02.jpg',
        alt: 'The black jubbah from behind: a clean column, hem to the ankle.',
      },
      {
        src: '/images/concealed-pocket.jpg',
        alt: 'The interior of the jubbah, the woven label set by hand.',
        objectPosition: 'center 62%',
      },
    ],
  },
  {
    id: 'jubbah-sand',
    name: 'The Jubbah',
    arabicName: 'الجُبَّة',
    cut: 'Jubbah',
    colour: 'Sand',
    swatch: '#C4B49A',
    variantGroup: 'jubbah',
    cloth: 'Egyptian extra-long staple cotton',
    mill: 'Giza 86, washed for drape',
    price: '£85',
    pricePence: 8500,
    image: '/images/jubbah-sand.jpg',
    imageAlt: 'A sand Emirati jubbah worn at full length in a sunlit plaster room.',
    objectPosition: 'center 8%',
    featured: true,
    description:
      'The jubbah in sand: Giza 86 extra-long staple, washed so the fibre drapes. The daylight colour. Same block as black and charcoal, five sizes, 52 to 60.',
    details: [
      'The outer garment. Worn alone, or over a thobe.',
      'Giza 86 extra-long staple cotton, washed for drape.',
      'Band collar. Concealed placket. Felled seams.',
      'A quiet sheen from the long fibre, never a gloss.',
      napeFinish,
    ],
    composition: '100% extra-long staple cotton, Giza 86. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/jubbah-sand.jpg',
        alt: 'A sand Emirati jubbah worn at full length in a sunlit plaster room.',
        objectPosition: 'center 8%',
      },
      {
        src: '/images/jubbah-sand-02.jpg',
        alt: 'The sand jubbah at rest: the cloth draped to the ankle.',
      },
      {
        src: '/images/cloth-giza.jpg',
        alt: 'Sand extra-long staple cotton in the piece.',
      },
    ],
  },
  {
    id: 'jubbah-charcoal',
    name: 'The Jubbah',
    arabicName: 'الجُبَّة',
    cut: 'Jubbah',
    colour: 'Charcoal',
    swatch: '#5C5854',
    variantGroup: 'jubbah',
    cloth: 'Super 150s wool-cotton, concealed placket',
    mill: 'Huddersfield Super 150s',
    price: '£85',
    pricePence: 8500,
    image: '/images/jubbah-charcoal.jpg',
    imageAlt: 'A charcoal Emirati jubbah worn at full length.',
    objectPosition: 'center 10%',
    featured: true,
    description:
      'The jubbah in charcoal: Huddersfield Super 150s wool-cotton, a winter handle. The silhouette stays architectural. Same house block as black and sand, sizes 52 to 60.',
    details: [
      'The outer garment. Worn alone, or over a thobe.',
      'Super 150s wool-cotton from Huddersfield; compact, resilient.',
      'Concealed placket. Side seams felled, never overlocked.',
      'Hem set to the ankle of the house block.',
      napeFinish,
    ],
    composition: 'Wool-cotton Super 150s, Huddersfield. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/jubbah-charcoal.jpg',
        alt: 'A charcoal Emirati jubbah worn at full length.',
        objectPosition: 'center 10%',
      },
      {
        src: '/images/jubbah-charcoal-02.jpg',
        alt: 'The charcoal jubbah walking: wool-cotton, ankle hem, concealed placket.',
      },
      {
        src: '/images/jubbah-charcoal-cloth.jpg',
        alt: 'Charcoal Super 150s in the piece, before it is cut.',
      },
    ],
  },
]

export const thobes = products.filter((item) => item.cut === 'Thobe')

export const jubbahs = products.filter((item) => item.cut === 'Jubbah')

export const featuredProducts = thobes.filter((item) => item.featured)

export const featuredJubbahs = jubbahs

export const productColours: ProductColour[] = ['Black', 'Charcoal', 'Grey', 'Beige', 'Bone']

export const jubbahColours: ProductColour[] = ['Black', 'Sand', 'Charcoal']

export function getProduct(id: string | undefined) {
  if (!id) return undefined
  return products.find((item) => item.id === id)
}

export function productLineName(product: Product) {
  return product.cut === 'Jubbah' ? `${product.name} · ${product.colour}` : product.name
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
