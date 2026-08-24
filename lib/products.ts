export type Product = {
  slug: string;
  name: string;
  material: string;
  price: number;
  image: string;
  alt: string;
  description: string;
  layout: "large" | "portrait" | "wide";
  offset?: "mt-32" | "mt-16" | "-mt-16";
  category: "overcoat" | "tunic" | "jubbah" | "trousers";
};

export const products: Product[] = [
  {
    slug: "brutalist-overcoat",
    name: "The Brutalist Overcoat",
    material: "Charcoal Wool",
    price: 850,
    image: "/images/featured-overcoat.jpg",
    alt: "A tailored deep charcoal overcoat with clean, straight lines and a concealed placket.",
    description:
      "A structured overcoat in charcoal wool, cut with a concealed placket and architectural shoulder.",
    layout: "large",
    category: "overcoat",
  },
  {
    slug: "structured-tunic",
    name: "Structured Tunic",
    material: "Off-White Cotton",
    price: 320,
    image: "/images/collection-tunic.jpg",
    alt: "Full-length shot of a structured off-white tunic",
    description:
      "A gallery-cut tunic in off-white cotton, designed to hold a clean, modest line.",
    layout: "portrait",
    offset: "mt-32",
    category: "tunic",
  },
  {
    slug: "linen-drape-jubbah",
    name: "Linen Drape Jubbah",
    material: "Deep Olive",
    price: 410,
    image: "/images/linen-jubbah.jpg",
    alt: "Deep olive linen draped over a wooden chair",
    description:
      "A linen jubbah in deep olive, cut for drape and breathability.",
    layout: "portrait",
    category: "jubbah",
  },
  {
    slug: "obsidian-core-jubbah",
    name: "Obsidian Core Jubbah",
    material: "Matte Black Crepe",
    price: 450,
    image: "/images/obsidian.jpg",
    alt: "A matte black jubbah worn beside a tall window",
    description:
      "A matte black crepe jubbah with an uninterrupted, architectural silhouette.",
    layout: "portrait",
    offset: "mt-16",
    category: "jubbah",
  },
  {
    slug: "foundation-trousers",
    name: "The Foundation Trousers",
    material: "Stone Twill",
    price: 280,
    image: "/images/garments-rail.png",
    alt: "Brass clothing rail holding stone, off-white, and charcoal garments",
    description:
      "Stone twill trousers cut as a foundational piece for the modest wardrobe.",
    layout: "wide",
    offset: "-mt-16",
    category: "trousers",
  },
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
