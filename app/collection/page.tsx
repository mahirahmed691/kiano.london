import type { Metadata } from "next";
import { CollectionGrid } from "@/components/collection-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "The Jubbah Collection",
};

export default function CollectionPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-grow pt-32 pb-32">
        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid min-h-[60vh] grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="z-10 flex h-full flex-col justify-center space-y-6 md:col-span-5 md:pr-12">
              <h1 className="font-display-lg text-display-lg-mobile text-primary md:text-display-lg">
                The Jubbah
                <br />
                Collection
              </h1>
              <p className="max-w-md font-body-lg text-body-lg text-secondary">
                Foundational pieces for the modern modest wardrobe. A synthesis of
                traditional British heritage and contemporary minimalist form.
              </p>
            </div>
            <div className="group relative h-[60vh] overflow-hidden rounded-sm md:col-span-7">
              <img
                src="/images/hero-model.png"
                alt="A man in a structured deep olive overcoat in a brutalist setting"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/5 transition-colors duration-700 group-hover:bg-transparent" />
            </div>
          </div>
        </section>
        <CollectionGrid />
      </main>
      <SiteFooter />
    </>
  );
}
