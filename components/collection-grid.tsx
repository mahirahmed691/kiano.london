"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice, products, type Product } from "@/lib/products";

const filters: { id: "all" | Product["category"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "overcoat", label: "Overcoats" },
  { id: "tunic", label: "Tunics" },
  { id: "jubbah", label: "Jubbah" },
  { id: "trousers", label: "Trousers" },
];

const layoutClass: Record<Product["layout"], string> = {
  large: "md:col-span-8",
  portrait: "md:col-span-4",
  wide: "md:col-span-8",
};

const offsetClass: Record<NonNullable<Product["offset"]>, string> = {
  "mt-32": "md:mt-32",
  "mt-16": "md:mt-16",
  "-mt-16": "md:-mt-16",
};

const heightClass: Record<Product["layout"], string> = {
  large: "h-[70vh]",
  portrait: "h-[60vh]",
  wide: "h-[50vh]",
};

export function CollectionGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [open, setOpen] = useState(false);

  const visible = useMemo(
    () => (filter === "all" ? products : products.filter((product) => product.category === filter)),
    [filter],
  );

  return (
    <section className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
      <div className="mb-16 flex items-end justify-between border-b border-secondary/20 pb-4">
        <span className="font-label-caps uppercase tracking-widest text-secondary">
          Explore the Range
        </span>
        <div className="relative hidden md:block">
          <button
            type="button"
            className="font-label-caps inline-flex items-center uppercase tracking-widest text-secondary"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            Filters
            <span className="material-symbols-outlined ml-1 align-middle text-[16px]">tune</span>
          </button>
          {open ? (
            <div className="absolute right-0 z-10 mt-4 min-w-48 bg-surface p-4 shadow-[0_32px_80px_rgba(23,25,22,0.06)]">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`block w-full py-2 text-left font-label-caps uppercase tracking-widest ${
                    filter === item.id ? "text-primary" : "text-secondary hover:text-primary"
                  }`}
                  onClick={() => {
                    setFilter(item.id);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mb-8 flex flex-wrap gap-3 md:hidden">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-lg border px-3 py-2 font-label-caps uppercase tracking-widest ${
              filter === item.id
                ? "border-primary text-primary"
                : "border-secondary/20 text-secondary"
            }`}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-x-gutter gap-y-24 md:grid-cols-12">
        {visible.map((product) => (
          <Link
            key={product.slug}
            href={`/collection/${product.slug}`}
            className={`group cursor-pointer ${layoutClass[product.layout]} ${
              product.offset && filter === "all" ? offsetClass[product.offset] : ""
            }`}
          >
            <div
              className={`relative mb-6 w-full overflow-hidden rounded-sm bg-surface-container-low ${heightClass[product.layout]}`}
            >
              <Image
                src={product.image}
                alt={product.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 66vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="mb-1 font-sans text-body-md text-primary">{product.name}</h3>
                <p className="font-label-caps uppercase tracking-widest text-secondary">
                  {product.material}
                </p>
              </div>
              <span className="font-label-caps uppercase tracking-widest text-primary">
                {formatPrice(product.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
