"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

export type BagItem = {
  slug: string;
  name: string;
  material: string;
  price: number;
  image: string;
  quantity: number;
};

type BagContextValue = {
  items: BagItem[];
  count: number;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  toggleBag: () => void;
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  lastAdded: string | null;
};

const BagContext = createContext<BagContextValue | null>(null);

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const addItem = useCallback((product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === product.slug);
      if (existing) {
        return current.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        {
          slug: product.slug,
          name: product.name,
          material: product.material,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    setLastAdded(product.slug);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((current) => current.filter((item) => item.slug !== slug));
  }, []);

  const value = useMemo<BagContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      isOpen,
      openBag: () => setIsOpen(true),
      closeBag: () => setIsOpen(false),
      toggleBag: () => setIsOpen((open) => !open),
      addItem,
      removeItem,
      lastAdded,
    }),
    [items, isOpen, addItem, removeItem, lastAdded],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error("useBag must be used within BagProvider");
  }
  return context;
}
