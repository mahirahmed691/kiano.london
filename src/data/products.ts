export type Product = {
  id: string
  name: string
  cloth: string
  mill: string
  price: string
  image: string
  imageAlt: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: 'mayfair-coat',
    name: 'The Mayfair Coat',
    cloth: 'Camel wool, unlined',
    mill: 'Abraham Moon, Yorkshire',
    price: '£2,450',
    image: '/images/product-mayfair.jpg',
    imageAlt:
      'Camel wool wrap coat with a self-belt, worn over a black turtleneck against pale stone.',
    featured: true,
  },
  {
    id: 'chesterfield',
    name: 'The Chesterfield',
    cloth: 'Navy windowpane wool',
    mill: 'Huddersfield Super 120s',
    price: '£3,200',
    image: '/images/product-chesterfield.jpg',
    imageAlt:
      'Navy windowpane three-piece suit with a white pocket square and striped tie.',
    featured: true,
  },
  {
    id: 'hawick-crew',
    name: 'Hawick Cashmere',
    cloth: 'Two-ply Scottish cashmere',
    mill: 'Hawick, Borders',
    price: '£685',
    image: '/images/product-cashmere.jpg',
    imageAlt: 'Cream cashmere knit hanging in even light.',
    featured: true,
  },
  {
    id: 'townhouse-blazer',
    name: 'The Townhouse Blazer',
    cloth: 'Navy hopsack',
    mill: 'Huddersfield',
    price: '£1,850',
    image: '/images/product-blazer.jpg',
    imageAlt: 'Navy tailored jacket photographed in studio light.',
  },
  {
    id: 'field-jacket',
    name: 'The Field Jacket',
    cloth: 'Indigo denim, cord collar',
    mill: 'Selvedge cotton',
    price: '£1,250',
    image: '/images/product-field.jpg',
    imageAlt:
      'Dark indigo field jacket with a tan corduroy collar hanging on a wooden hanger.',
  },
  {
    id: 'merino-polo',
    name: 'Merino Polo',
    cloth: 'Extrafine merino',
    mill: 'Scottish Borders',
    price: '£295',
    image: '/images/product-polo.jpg',
    imageAlt: 'Soft merino knit in a muted earth tone.',
  },
  {
    id: 'navy-suit',
    name: 'The Navy Suit',
    cloth: 'Midweight worsted',
    mill: 'Huddersfield Super 110s',
    price: '£2,800',
    image: '/images/product-trouser.jpg',
    imageAlt: 'Full navy suit, cut close through the shoulder.',
  },
  {
    id: 'leather-jacket',
    name: 'The Leather Jacket',
    cloth: 'Vegetable-tanned hide',
    mill: 'British tannery',
    price: '£1,950',
    image: '/images/product-wrap.jpg',
    imageAlt: 'Brown leather jacket worn over a chambray shirt and navy tie.',
  },
]

export const featuredProducts = products.filter((item) => item.featured)
