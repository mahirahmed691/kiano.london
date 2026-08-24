"use client";

import Image from "next/image";
import Link from "next/link";
import { useBag } from "@/components/bag-provider";
import { formatPrice } from "@/lib/products";

export function ShoppingBag() {
  const { items, isOpen, closeBag, removeItem } = useBag();

  if (!isOpen) {
    return null;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        className="absolute inset-0 bg-primary/20"
        aria-label="Close shopping bag"
        onClick={closeBag}
      />
      <aside className="animate-bag-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-[0_32px_80px_rgba(23,25,22,0.08)]">
        <div className="flex items-center justify-between border-b border-secondary/10 px-8 py-6">
          <h2 className="font-label-caps uppercase tracking-widest text-primary">Shopping Bag</h2>
          <button
            type="button"
            aria-label="Close shopping bag"
            className="text-primary transition-opacity hover:opacity-70"
            onClick={closeBag}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <p className="font-sans text-body-md text-on-surface-variant">
              Your bag is empty. Explore the Jubbah Collection to begin.
            </p>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-4 border-b border-secondary/10 pb-6">
                  <Link href={`/collection/${item.slug}`} onClick={closeBag} className="relative block h-24 w-20 shrink-0 overflow-hidden bg-surface-container-low">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-body-md text-primary">{item.name}</p>
                    <p className="font-label-caps mt-1 text-secondary">{item.material}</p>
                    <p className="font-label-caps mt-2 text-primary">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="self-start font-label-caps text-secondary uppercase tracking-widest transition-colors hover:text-primary"
                    onClick={() => removeItem(item.slug)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-secondary/10 px-8 py-6">
          {items.length > 0 ? (
            <p className="mb-4 flex justify-between font-label-caps uppercase tracking-widest text-primary">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </p>
          ) : null}
          <Link
            href="/membership"
            onClick={closeBag}
            className="flex w-full items-center justify-center bg-primary px-8 py-4 font-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-primary/90"
          >
            Request Invite
          </Link>
          <p className="mt-3 text-center font-sans text-sm text-on-surface-variant">
            Pieces are released through Inner Circle membership.
          </p>
        </div>
      </aside>
    </div>
  );
}
