export const thobeSizes = [52, 54, 56, 58, 60] as const

export type ThobeSize = (typeof thobeSizes)[number]

export type ProductColour = 'Black' | 'Charcoal' | 'Grey' | 'Beige' | 'Bone'

export type ProductImage = {
  src: string
  alt: string
  objectPosition?: string
}

export type Product = {
  id: string
  name: string
  arabicName: string
  cut: 'Thobe'
  colour: ProductColour
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

export const products: Product[] = [
  {
    id: 'layl-thobe',
    name: 'The Layl Thobe',
    arabicName: 'ليل',
    cut: 'Thobe',
    colour: 'Black',
    cloth: 'Matte Japanese cotton, band collar',
    mill: 'Compact cotton, 80s two-ply',
    price: '£980',
    pricePence: 98000,
    image: '/images/concealed-pocket.jpg',
    imageAlt: 'The interior of a black Emirati thobe, the house label set by hand.',
    objectPosition: 'center 62%',
    featured: true,
    description:
      'Layl is the black column. Compact Japanese cotton, matte so it does not shine under evening light, cut from the house block with a band collar and a placket that closes out of sight.',
    details: [
      'Band collar, pad-stitched by hand so the neck holds after a day’s wear.',
      'Concealed placket; horn buttons sit inside the cloth.',
      'Felled side seams. Interior pocket bagged in the lining.',
      'The house label is woven and set at the nape by hand.',
    ],
    composition: '100% compact Japanese cotton, 80s two-ply. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/concealed-pocket.jpg',
        alt: 'The interior of the Layl thobe, the house label set by hand.',
        objectPosition: 'center 62%',
      },
      {
        src: '/images/fastenings.jpg',
        alt: 'A concealed placket, the fastenings of a Cavendish thobe.',
        objectPosition: 'center 45%',
      },
      {
        src: '/images/worsted-wool.jpg',
        alt: 'Close work: a needle and dark cloth, the stitch that holds the collar.',
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
    price: '£1,280',
    pricePence: 128000,
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
        alt: 'Charcoal Super 150s and a needle, the winter cloth of the house.',
      },
      {
        src: '/images/concealed-pocket.jpg',
        alt: 'The interior pocket of a Cavendish thobe, bagged so it does not pull the cloth.',
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
    price: '£890',
    pricePence: 89000,
    image: '/images/fabric-detail.png',
    imageAlt: 'Earth-grey compact cotton, the cloth of the Ghabār thobe.',
    objectPosition: '18% 42%',
    featured: true,
    description:
      'Ghabār is earth grey: Albini compact cotton, dense without stiffness, named for dust rather than a season. It is the thobe that reads as colour only when you stand beside black.',
    details: [
      'Albini compact cotton, earth grey, a high-count two-ply.',
      'Band collar. Concealed placket. Felled seams.',
      'Cut from the same house block as Layl; the difference is only the cloth.',
      'Washed once before it leaves the workroom so the drape is already itself.',
    ],
    composition: '100% Italian compact cotton, Albini. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/fabric-detail.png',
        alt: 'Earth-grey compact cotton, the face of the Ghabār thobe.',
        objectPosition: '18% 42%',
      },
      {
        src: '/images/fastenings.jpg',
        alt: 'Integrated fastenings set into the placket, never sitting on it.',
        objectPosition: 'center 45%',
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
    price: '£920',
    pricePence: 92000,
    image: '/images/heritage-linen.jpg',
    imageAlt: 'Sand-beige extra-long staple cotton, the cloth of the Raml thobe.',
    objectPosition: '22% 50%',
    description:
      'Raml is sand. Extra-long staple Giza 86, washed so the fibre drapes rather than stands. It is the daylight thobe: pale, dry, named for the ground it resembles.',
    details: [
      'Giza 86 extra-long staple cotton, washed for drape.',
      'Band collar, modest through the chest, hem to the ankle.',
      'Felled side seams. Concealed placket in the same cloth.',
      'A quiet sheen from the long fibre, never a gloss.',
    ],
    composition: '100% extra-long staple cotton, Giza 86. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/heritage-linen.jpg',
        alt: 'Sand-beige extra-long staple cotton in the piece, the cloth of Raml.',
        objectPosition: '22% 50%',
      },
      {
        src: '/images/workbench.jpg',
        alt: 'The cutting bench: shears, chalk, and paper for the house block.',
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
    price: '£1,080',
    pricePence: 108000,
    image: '/images/fastenings.jpg',
    imageAlt: 'Bone cotton-silk at the placket of the Hajar thobe, fastenings concealed.',
    objectPosition: 'center 45%',
    description:
      'Hajar is bone: Como cotton-silk, washed, a cooler handle than Raml and a quieter light. The placket is the same concealed work as the rest of the house. The cloth is the distinction.',
    details: [
      'Washed cotton-silk from Como. Bone, not white.',
      'Concealed placket; the fastenings disappear until the hand finds them.',
      'Pad-stitched collar stand. Felled seams. Interior pocket.',
      'Pressed as considered as the first cut. Finished from the inside.',
    ],
    composition: 'Cotton-silk, Como. Silk-twist buttonholes. Buffalo horn.',
    leadTime: 'Made to order, four to eight weeks.',
    gallery: [
      {
        src: '/images/fastenings.jpg',
        alt: 'Bone cotton-silk at the placket of the Hajar thobe.',
        objectPosition: 'center 45%',
      },
      {
        src: '/images/heritage-linen.jpg',
        alt: 'Pale cloth in the piece, before it is chalked for the house block.',
        objectPosition: '22% 50%',
      },
      {
        src: '/images/concealed-pocket.jpg',
        alt: 'The interior of a Cavendish thobe: pocket, lining, the house label.',
        objectPosition: 'center 62%',
      },
    ],
  },
]

export const featuredProducts = products.filter((item) => item.featured)

export const productColours: ProductColour[] = ['Black', 'Charcoal', 'Grey', 'Beige', 'Bone']

export function getProduct(id: string | undefined) {
  if (!id) return undefined
  return products.find((item) => item.id === id)
}

export function relatedProducts(id: string) {
  return products.filter((item) => item.id !== id)
}
