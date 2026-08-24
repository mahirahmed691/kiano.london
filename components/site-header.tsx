"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useBag } from "@/components/bag-provider";
import { navLinks } from "@/lib/site";

type SiteHeaderProps = {
  variant?: "overlay" | "solid";
};

export function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  const pathname = usePathname();
  const { count, openBag } = useBag();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (variant !== "overlay") {
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const overlayTransparent = variant === "overlay" && !scrolled;
  const onHero = overlayTransparent;
  const navClass = overlayTransparent
    ? "bg-transparent py-8"
    : variant === "overlay"
      ? "border-b border-outline-variant/10 bg-background/90 py-4 backdrop-blur-md"
      : "border-b border-secondary/10 bg-surface/90 backdrop-blur-md";
  const markClass = onHero
    ? "text-white"
    : "text-primary";
  const idleLinkClass = onHero
    ? "text-white/80 transition-colors duration-300 hover:text-white"
    : "text-on-surface-variant transition-colors duration-300 hover:text-primary";
  const activeLinkClass = onHero
    ? "border-b border-white pb-1 text-white"
    : "border-b border-primary pb-1 text-primary";

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${navClass}`}
      >
        <div className="mx-auto flex h-auto max-w-container-max items-center justify-between px-margin-mobile md:h-20 md:px-margin-desktop">
          {variant === "solid" ? (
            <>
              <div className="hidden items-center gap-8 font-sans text-body-md tracking-tight md:flex">
                {navLinks.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={
                        active
                          ? "border-b border-primary pb-1 text-primary"
                          : "text-secondary transition-colors duration-300 hover:text-primary"
                      }
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/"
                className="flex-1 text-center font-display text-headline-sm uppercase tracking-widest text-primary transition-opacity hover:opacity-70 md:flex-none"
              >
                Cavendish House
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`font-display text-headline-sm tracking-tighter ${markClass}`}
              >
                Cavendish House
              </Link>
              <div className="hidden space-x-8 font-label-caps uppercase tracking-widest md:flex">
                {navLinks.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={active ? activeLinkClass : idleLinkClass}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
          <div className={`flex items-center space-x-6 ${onHero ? "text-white" : "text-primary"}`}>
            {variant === "solid" ? (
              <Link href="/membership" aria-label="Membership" className="hidden transition-opacity hover:opacity-70 md:inline-flex">
                <span className="material-symbols-outlined">person</span>
              </Link>
            ) : null}
            <button
              type="button"
              aria-label="Shopping Bag"
              className="relative cursor-pointer transition-opacity hover:opacity-70"
              onClick={openBag}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {count > 0 ? (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-on-primary">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label="Menu"
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </nav>
      {menuOpen ? (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button className="absolute inset-0 bg-primary/30" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-surface px-8 py-10">
            <div className="mb-12 flex items-center justify-between">
              <span className="font-display text-headline-sm uppercase tracking-widest text-primary">CH</span>
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-8 font-label-caps uppercase tracking-widest">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-primary" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href="/membership" className="text-primary" onClick={() => setMenuOpen(false)}>
                Membership
              </Link>
              <Link href="/contact" className="text-primary" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
