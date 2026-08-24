import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBagButton } from "@/components/add-to-bag-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice, getProduct, products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Piece" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-grow pt-32 pb-32">
        <section className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <p className="mb-8 font-label-caps uppercase tracking-widest text-secondary">
            <Link href="/collection" className="hover:text-primary">
              The Jubbah Collection
            </Link>
          </p>
          <div className="grid grid-cols-1 items-start gap-gutter md:grid-cols-12">
            <div className="aspect-[3/4] overflow-hidden bg-surface-container-low md:col-span-7">
              <img src={product.image} alt={product.alt} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-6 md:col-span-5 md:pl-12">
              <h1 className="font-display text-headline-md text-primary md:text-display-lg-mobile">
                {product.name}
              </h1>
              <p className="font-label-caps uppercase tracking-widest text-secondary">
                {product.material}
              </p>
              <p className="font-label-caps uppercase tracking-widest text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="max-w-md font-sans text-body-lg text-on-surface-variant">
                {product.description}
              </p>
              <AddToBagButton product={product} />
              <p className="text-sm text-on-surface-variant">
                Released through Inner Circle membership. Add to bag, then request an invite.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
