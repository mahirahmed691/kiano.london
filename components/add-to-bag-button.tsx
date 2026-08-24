"use client";

import { useBag } from "@/components/bag-provider";
import type { Product } from "@/lib/products";

export function AddToBagButton({ product }: { product: Product }) {
  const { addItem, items } = useBag();
  const inBag = items.some((item) => item.slug === product.slug);

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="bg-primary px-8 py-4 font-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary"
    >
      {inBag ? "Added to Bag" : "Add to Bag"}
    </button>
  );
}
