export type Product = {
  id: string
  name: string
  cut: 'Jubbah' | 'Thobe'
  cloth: string
  mill: string
  price: string
  image: string
  imageAlt: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: 'cavendish-jubbah',
    name: 'The Cavendish Jubbah',
    cut: 'Jubbah',
    cloth: 'Charcoal worsted, concealed placket',
    mill: 'Huddersfield Super 120s',
    price: '£1,280',
    image: '/images/featured-overcoat.jpg',
    imageAlt:
      'A charcoal wool jubbah with a clean architectural line and a concealed placket.',
    featured: true,
  },
  {
    id: 'linen-drape-thobe',
    name: 'The Linen Drape Thobe',
    cut: 'Thobe',
    cloth: 'Deep olive Irish linen',
    mill: 'Baird McNutt, County Down',
    price: '£640',
    image: '/images/linen-jubbah.jpg',
    imageAlt: 'A deep olive linen thobe draped over a wooden chair in quiet light.',
    featured: true,
  },
  {
    id: 'obsidian-jubbah',
    name: 'The Obsidian Jubbah',
    cut: 'Jubbah',
    cloth: 'Matte black crepe',
    mill: 'Como silk-wool crepe',
    price: '£890',
    image: '/images/obsidian.jpg',
    imageAlt: 'A matte black jubbah standing beside a tall window, the silhouette unbroken.',
    featured: true,
  },
  {
    id: 'structured-thobe',
    name: 'The Structured Thobe',
    cut: 'Thobe',
    cloth: 'Off-white compact cotton',
    mill: 'Thomas Mason, Lancashire',
    price: '£520',
    image: '/images/collection-tunic.jpg',
    imageAlt: 'A full-length structured off-white thobe, cut to hold a modest line.',
  },
  {
    id: 'heritage-linen-jubbah',
    name: 'The Heritage Linen Jubbah',
    cut: 'Jubbah',
    cloth: 'Natural flax, enzyme-washed',
    mill: 'Libeco, Meulebeke',
    price: '£680',
    image: '/images/heritage-linen.jpg',
    imageAlt: 'Raw heritage linen, the cloth of the house jubbah before it is cut.',
  },
  {
    id: 'worsted-winter-thobe',
    name: 'The Worsted Winter Thobe',
    cut: 'Thobe',
    cloth: 'Deep olive worsted wool',
    mill: 'Abraham Moon, Yorkshire',
    price: '£960',
    image: '/images/worsted-wool.jpg',
    imageAlt: 'Deep olive worsted wool, the winter cloth of the house thobe.',
  },
  {
    id: 'placket-jubbah',
    name: 'The Placket Jubbah',
    cut: 'Jubbah',
    cloth: 'Stone cotton, integrated fastenings',
    mill: 'Thomas Mason',
    price: '£740',
    image: '/images/fastenings.jpg',
    imageAlt: 'Integrated fastenings set into the placket of a stone cotton jubbah.',
  },
  {
    id: 'ivory-evening-thobe',
    name: 'The Ivory Evening Thobe',
    cut: 'Thobe',
    cloth: 'Ivory cotton-silk, mandarin collar',
    mill: 'Como mill',
    price: '£820',
    image: '/images/structured-tunic-home.jpg',
    imageAlt: 'An ivory evening thobe with a standing collar, photographed in studio light.',
  },
]

export const featuredProducts = products.filter((item) => item.featured)
