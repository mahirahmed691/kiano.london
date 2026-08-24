export const thobeSizes = [52, 54, 56, 58, 60] as const

export type Product = {
  id: string
  name: string
  cut: 'Thobe'
  colour: 'Black' | 'Charcoal' | 'Grey' | 'Beige' | 'Bone'
  cloth: string
  mill: string
  price: string
  image: string
  imageAlt: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: 'layl-thobe',
    name: 'The Layl Thobe',
    cut: 'Thobe',
    colour: 'Black',
    cloth: 'Matte Japanese cotton, band collar',
    mill: 'Compact cotton, 80s two-ply',
    price: '£980',
    image: '/images/concealed-pocket.jpg',
    imageAlt: 'The interior of a black Emirati thobe, the house label set by hand.',
    featured: true,
  },
  {
    id: 'hadid-thobe',
    name: 'The Hadīd Thobe',
    cut: 'Thobe',
    colour: 'Charcoal',
    cloth: 'Super 150s wool-cotton, concealed placket',
    mill: 'Huddersfield Super 150s',
    price: '£1,280',
    image: '/images/featured-overcoat.jpg',
    imageAlt: 'A charcoal Emirati thobe with a standing collar, worn at full length.',
    featured: true,
  },
  {
    id: 'ghabar-thobe',
    name: 'The Ghabār Thobe',
    cut: 'Thobe',
    colour: 'Grey',
    cloth: 'Italian compact cotton, earth grey',
    mill: 'Albini compact cotton',
    price: '£890',
    image: '/images/fabric-detail.png',
    imageAlt: 'Earth-grey compact cotton, the cloth of the Ghabār thobe.',
    featured: true,
  },
  {
    id: 'raml-thobe',
    name: 'The Raml Thobe',
    cut: 'Thobe',
    colour: 'Beige',
    cloth: 'Egyptian extra-long staple cotton',
    mill: 'Giza 86, washed for drape',
    price: '£920',
    image: '/images/heritage-linen.jpg',
    imageAlt: 'Sand-beige extra-long staple cotton, the cloth of the Raml thobe.',
  },
  {
    id: 'hajar-thobe',
    name: 'The Hajar Thobe',
    cut: 'Thobe',
    colour: 'Bone',
    cloth: 'Washed Italian cotton-silk',
    mill: 'Como cotton-silk',
    price: '£1,080',
    image: '/images/fastenings.jpg',
    imageAlt: 'Bone cotton-silk at the placket of the Hajar thobe, fastenings concealed.',
  },
]

export const featuredProducts = products.filter((item) => item.featured)
