import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-container-max px-margin-mobile pt-32 pb-32 md:px-margin-desktop">
        <h1 className="mb-6 font-display text-headline-md text-primary">Page not found</h1>
        <p className="mb-8 font-sans text-body-md text-on-surface-variant">
          This path is not part of the house.
        </p>
        <Link href="/" className="border-b border-primary pb-1 font-label-caps uppercase tracking-widest text-primary">
          Return home
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
