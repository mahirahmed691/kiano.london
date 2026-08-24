import Link from "next/link";
import { InviteForm } from "@/components/invite-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader variant="overlay" />
      <main className="flex-grow">
        <section className="relative flex h-screen min-h-[600px] w-full items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-model.png')" }}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 mx-auto mt-20 flex max-w-4xl flex-col items-center px-4 text-center">
            <h1 className="mb-6 font-display-lg text-display-lg-mobile font-light uppercase tracking-wider text-white md:text-display-lg">
              Cavendish House
            </h1>
            <p className="max-w-xl font-body-md text-body-md font-light text-white/90 md:text-body-lg">
              Modern Modesty, Rooted in London.
            </p>
          </div>
          <a
            href="#story"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white"
            aria-label="Scroll to story"
          >
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </a>
        </section>

        <section
          id="story"
          className="mx-auto max-w-container-max px-margin-mobile py-32 md:px-margin-desktop"
        >
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-32">
            <div className="order-2 space-y-8 md:order-1">
              <h2 className="font-headline-md text-headline-md text-primary">
                A Synthesis of Heritage and Subtlety
              </h2>
              <div className="h-px w-12 bg-secondary-fixed-dim" />
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                We believe true luxury speaks quietly. Cavendish House was born from a
                desire to reconcile traditional British tailoring with the fluid, modern
                modest silhouettes of the Islamic tradition. Our designs are architectural,
                defined by precise cuts and a rigorous rejection of the superfluous.
              </p>
              <p className="text-on-surface-variant">
                Every garment is an exercise in restraint, designed not to dominate the
                wearer, but to elevate their natural posture. We source the finest materials
                to ensure our pieces endure, transcending transient seasons.
              </p>
              <div className="pt-4">
                <Link
                  href="/story"
                  className="inline-flex items-center border-b border-primary pb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-opacity hover:opacity-70"
                >
                  Read the Full Story
                  <span className="material-symbols-outlined ml-2 text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/images/garments-rail.png"
                alt="A curated clothing rack displaying minimalist garments in olive, stone, and off-white"
                className="h-auto w-full object-cover grayscale-[20%] transition-all duration-700 hover:grayscale-0"
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-margin-mobile py-32 md:px-margin-desktop">
          <div className="mx-auto max-w-container-max">
            <div className="mb-16 flex items-end justify-between">
              <div>
                <h2 className="mb-2 font-headline-md text-headline-md text-primary">
                  The Jubbah Collection
                </h2>
                <p className="text-on-surface-variant">
                  Foundational pieces for the modern wardrobe.
                </p>
              </div>
              <Link
                href="/collection"
                className="hidden border-b border-transparent pb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary hover:border-primary md:inline-flex"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
              <Link
                href="/collection/brutalist-overcoat"
                className="group relative overflow-hidden bg-surface md:col-span-8"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src="/images/featured-overcoat.jpg"
                    alt="A tailored deep charcoal modern jubbah"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:absolute md:bottom-0 md:left-0 md:w-full md:bg-gradient-to-t md:from-black/60 md:to-transparent md:text-white">
                  <h3 className="mb-1 font-body-lg text-body-lg text-primary md:text-white">
                    The Brutalist Overcoat
                  </h3>
                  <p className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant md:text-white/80">
                    Charcoal Wool
                  </p>
                </div>
              </Link>
              <div className="flex flex-col gap-gutter md:col-span-4">
                <Link href="/collection/structured-tunic" className="group h-full bg-surface">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src="/images/structured-tunic-home.jpg"
                      alt="Close-up of a charcoal tailored jacket shoulder and lapel"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-body-md text-body-md text-primary">
                      Structured Tunic
                    </h3>
                    <p className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
                      Charcoal
                    </p>
                  </div>
                </Link>
                <Link href="/collection/linen-drape-jubbah" className="group h-full bg-surface">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src="/images/linen-drape-home.jpg"
                      alt="A flowing off-white linen garment in a sparse modern room"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-body-md text-body-md text-primary">Linen Drape</h3>
                    <p className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
                      Off-White
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-margin-mobile py-32 md:px-margin-desktop">
          <div className="flex flex-col items-center gap-16 md:flex-row">
            <div className="w-full md:w-1/2">
              <img
                src="/images/craft-closeup.jpg"
                alt="Macro close-up of wool fabric and a finished buttonhole"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div className="w-full space-y-8 md:w-1/2 md:pl-16">
              <h2 className="font-headline-md text-headline-md text-primary">
                Rigorous Execution
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                The architecture of a garment is only as strong as its foundation. We
                employ traditional tailoring techniques—hand-finished seams, canvassed
                constructions, and bespoke detailing—and apply them to modern modest
                silhouettes that honor heritage through a contemporary lens.
              </p>
              <ul className="mt-8 space-y-6">
                <li className="flex items-start">
                  <div className="mt-2 mr-4 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <div>
                    <h4 className="mb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary">
                      Material Integrity
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Sourcing heavy-weight worsted wools and crisp Irish linens that hold
                      structure while offering breathability.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-2 mr-4 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <div>
                    <h4 className="mb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary">
                      Concealed Utility
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Hidden plackets, integrated pockets, and subtle fastenings maintain
                      the uninterrupted lines of the silhouette.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="inner-circle"
          className="border-t border-outline-variant/20 bg-surface-container px-margin-mobile py-32 md:px-margin-desktop"
        >
          <div className="mx-auto max-w-2xl space-y-8 text-center">
            <h2 className="font-headline-md text-headline-md text-primary">The Inner Circle</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Join the Cavendish House membership to receive early access to seasonal
              collections, exclusive bespoke services, and invitations to private events in
              London.
            </p>
            <InviteForm />
          </div>
        </section>
      </main>
      <SiteFooter variant="home" />
    </>
  );
}
