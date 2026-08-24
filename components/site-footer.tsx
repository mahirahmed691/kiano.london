import Link from "next/link";
import { footerLinks } from "@/lib/site";

type SiteFooterProps = {
  variant?: "home" | "default";
};

export function SiteFooter({ variant = "default" }: SiteFooterProps) {
  if (variant === "home") {
    return (
      <footer className="mx-auto w-full max-w-container-max border-t border-outline-variant/20 bg-surface-container px-margin-mobile py-20 md:grid md:grid-cols-12 md:gap-gutter md:px-margin-desktop">
        <div className="mb-12 flex flex-col justify-between md:col-span-6 md:mb-0">
          <Link href="/" className="mb-6 block font-display text-headline-md text-primary">
            Cavendish House
          </Link>
          <p className="font-sans text-body-md text-on-surface-variant">
            © 2024 Cavendish House. All rights reserved.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-6">
          <div className="flex flex-col space-y-4">
            <Link href="/contact" className="font-sans text-body-md text-on-surface-variant transition-colors hover:text-primary">
              Contact
            </Link>
            <Link href="/membership" className="font-sans text-body-md text-on-surface-variant transition-colors hover:text-primary">
              Membership
            </Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/terms" className="font-sans text-body-md text-on-surface-variant transition-colors hover:text-primary">
              Terms
            </Link>
            <Link href="/privacy" className="font-sans text-body-md text-on-surface-variant transition-colors hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full border-t border-secondary/10 bg-surface-container">
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-8 px-margin-mobile py-16 md:flex-row md:px-margin-desktop">
        <Link href="/" className="font-display text-headline-sm text-primary transition-opacity hover:opacity-70">
          Cavendish House
        </Link>
        <div className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label-caps uppercase tracking-widest text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="font-label-caps uppercase tracking-widest text-secondary">
          © 2024 Cavendish House. British Heritage, Islamic Tradition.
        </p>
      </div>
    </footer>
  );
}
