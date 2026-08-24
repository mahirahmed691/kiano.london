import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function CraftsmanshipSections({ showBranding = true }: { showBranding?: boolean }) {
  return (
    <>
      <SiteHeader />
      <main className="pt-[120px] pb-32 md:pt-[160px]">
        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="mb-12 md:col-span-5 md:mb-0 md:pr-12">
              <p className="mb-4 font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                Technical Mastery
              </p>
              <h1 className="mb-8 font-display-lg text-display-lg-mobile text-primary md:text-display-lg">
                The Art of the Stitch
              </h1>
              <p className="max-w-md font-body-lg text-body-lg leading-relaxed text-secondary">
                Our dedication to craftsmanship is evident in every seam, fold, and finish.
                We meld traditional bespoke techniques with contemporary material science to
                create garments of uncompromising integrity.
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="aspect-[4/5] overflow-hidden rounded bg-surface-container">
                <img
                  src="/images/fabric-detail.png"
                  alt="Charcoal wool jacket lapel and shoulder seam"
                  className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 hover:grayscale-0"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter border-t border-secondary/20 pt-16 md:grid-cols-12">
            <div className="mb-8 md:col-span-4 md:mb-0">
              <h2 className="mb-4 font-headline-sm text-headline-sm text-primary">
                Material Integrity
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                Sourcing premium wools and linens.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:col-span-8 md:grid-cols-2">
              <div>
                <div className="mb-6 aspect-square overflow-hidden rounded bg-surface-container">
                  <img
                    src="/images/heritage-linen.jpg"
                    alt="Raw woven linen"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-2 font-label-caps text-label-caps uppercase tracking-widest text-primary">
                  Heritage Linen
                </h3>
                <p className="font-body-md text-body-md text-secondary">
                  Sourced from historic mills, our linen offers unparalleled breathability
                  and a distinctive textural drape that evolves elegantly over time.
                </p>
              </div>
              <div className="mt-8 md:mt-24">
                <div className="mb-6 aspect-square overflow-hidden rounded bg-surface-container">
                  <img
                    src="/images/worsted-wool.jpg"
                    alt="Worsted wool in deep olive"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-2 font-label-caps text-label-caps uppercase tracking-widest text-primary">
                  Worsted Wools
                </h3>
                <p className="font-body-md text-body-md text-secondary">
                  Chosen for their resilience and structural memory, our worsted wools
                  provide the foundation for sharp silhouettes and enduring wear.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-32">
          <div className="relative h-[60vh] w-full bg-surface-container">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/workbench.jpg')" }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-primary/40 p-8">
              <div className="max-w-2xl rounded bg-surface/95 p-12 text-center backdrop-blur-sm">
                <h2 className="mb-6 font-headline-md text-headline-md text-primary">
                  Bespoke Construction
                </h2>
                <p className="mb-8 font-body-md text-body-md text-secondary">
                  We eschew fused linings in favor of traditional floating canvas. This
                  meticulous process ensures the garment molds to the wearer&apos;s form,
                  providing structural integrity without sacrificing natural movement. Every
                  lapel is rolled by hand; every buttonhole is hand-sewn with silk thread.
                </p>
                {showBranding ? (
                  <a
                    href="#signature"
                    className="inline-block rounded-sm bg-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary"
                  >
                    Explore Techniques
                  </a>
                ) : (
                  <Link
                    href="/craftsmanship/details"
                    className="inline-block rounded-sm bg-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary"
                  >
                    Explore Techniques
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mb-12 border-t border-secondary/20 pt-16">
            <h2 className="mb-4 font-headline-sm text-headline-sm text-primary">
              Functional Utility
            </h2>
            <p className="font-body-md text-body-md text-secondary">
              Concealed pockets and integrated fastenings.
            </p>
          </div>
          <div className="grid auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded bg-surface-container p-8 md:col-span-2">
              <div className="relative z-10 flex h-full flex-col justify-end">
                <h3 className="mb-2 font-headline-sm text-headline-sm text-primary">
                  Concealed Architecture
                </h3>
                <p className="max-w-sm font-body-md text-body-md text-secondary">
                  Internal pocket structures designed to carry modern essentials without
                  disturbing the exterior silhouette.
                </p>
              </div>
              <div className="absolute top-0 right-0 h-full w-1/2">
                <img
                  src="/images/concealed-pocket.jpg"
                  alt="Concealed internal pocket"
                  className="h-full w-full object-cover object-left opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
            </div>
            <div className="flex flex-col justify-between rounded bg-surface-container p-8">
              <span className="material-symbols-outlined text-4xl text-primary">
                architecture
              </span>
              <div>
                <h3 className="mb-2 font-label-caps text-label-caps uppercase tracking-widest text-primary">
                  Hardware
                </h3>
                <p className="font-body-md text-body-md text-secondary">
                  Custom-milled closures crafted from solid brass and finished with a matte
                  patina.
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded bg-surface-container">
              <img
                src="/images/fastenings.jpg"
                alt="Integrated fastening"
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/80 to-transparent p-8">
                <h3 className="font-label-caps text-label-caps uppercase tracking-widest text-on-primary">
                  Integrated Fastenings
                </h3>
              </div>
            </div>
            <div className="flex items-center justify-center rounded bg-surface-variant p-8 md:col-span-2">
              <div className="max-w-lg text-center">
                <span className="material-symbols-outlined mb-4 text-3xl text-secondary">
                  straighten
                </span>
                <p className="font-body-md text-body-md text-primary italic">
                  &ldquo;True luxury resides in the details that remain unseen, felt only by
                  the wearer in the quiet confidence of perfect fit and enduring
                  function.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {showBranding ? (
          <section
            id="signature"
            className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop"
          >
            <div className="grid grid-cols-1 gap-gutter border-t border-secondary/20 pt-16 md:grid-cols-12">
              <div className="mb-12 md:col-span-5 md:mb-0">
                <p className="mb-4 font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                  The Signature
                </p>
                <h2 className="mb-8 font-display-lg text-display-lg-mobile text-primary md:text-display-lg">
                  Physical Branding
                </h2>
                <p className="mb-6 max-w-md font-body-lg text-body-lg leading-relaxed text-secondary">
                  Our branding is an exercise in restraint. The tactile quality of our
                  embossed woven labels reflects a &lsquo;Quiet Luxury&rsquo; approach—where
                  quality is felt by the wearer, not broadcast to the world.
                </p>
                <p className="max-w-md font-body-md text-body-md leading-relaxed text-secondary">
                  Each piece is finished with our signature embossed labels and
                  precision-woven sizing tags, ensuring that even the most functional
                  elements adhere to our standards of material integrity.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:col-span-7 md:grid-cols-2">
                <div className="aspect-[4/5] overflow-hidden rounded bg-surface-container">
                  <img
                    src="/images/label-concrete.png"
                    alt="Embossed Concrete Studio woven label"
                    className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 hover:grayscale-0"
                  />
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded bg-surface-container md:mt-12">
                  <img
                    src="/images/label-xl.png"
                    alt="XL sizing tags in hand"
                    className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 hover:grayscale-0"
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
