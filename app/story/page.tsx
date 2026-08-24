import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Our Story",
};

export default function StoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-32 pb-32">
        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:mb-48 md:px-margin-desktop">
          <div className="grid h-[70vh] min-h-[600px] grid-cols-1 items-end gap-gutter md:grid-cols-12">
            <div className="relative h-full overflow-hidden rounded-DEFAULT bg-surface-container md:col-span-8">
              <img
                src="/images/fabric-detail.png"
                alt="Editorial imagery of Cavendish House aesthetic"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="pb-8 pt-12 md:col-span-4 md:pl-12 md:pt-0">
              <p className="mb-4 font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                Our Story
              </p>
              <h1 className="mb-6 font-display-lg text-display-lg-mobile text-primary md:text-display-lg">
                A Quiet Synthesis
              </h1>
              <p className="max-w-md font-body-lg text-body-lg text-on-surface-variant">
                Where the rigorous discipline of British tailoring meets the considered
                modesty of Islamic tradition. A dialogue spoken in the universal language of
                architectural silhouette.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:mb-48 md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="order-2 mt-12 md:col-span-5 md:col-start-2 md:order-1 md:mt-0">
              <h2 className="mb-8 font-headline-md text-headline-md text-primary">The Vision</h2>
              <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
                Cavendish House was conceived not merely as a label, but as a proposition.
                It seeks to reconcile elements often viewed as disparate—heritage and
                contemporaneity, expression and modesty.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our design philosophy favors reduction over addition. By stripping away
                extraneous detail, we allow the intrinsic quality of the materials and the
                precision of the cut to define the garment&apos;s narrative. It is a wardrobe
                for those who command a room through presence, not noise.
              </p>
            </div>
            <div className="order-1 h-[600px] overflow-hidden rounded-DEFAULT bg-surface-container md:col-span-5 md:col-start-8 md:order-2">
              <img
                src="/images/story-vision.jpg"
                alt="Close up of thick olive wool weave and a tailored seam"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:mb-48 md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
            <div className="mb-16 text-center md:col-span-12">
              <h2 className="font-headline-md text-headline-md text-primary">London Rooted</h2>
            </div>
            <div className="h-[700px] overflow-hidden rounded-DEFAULT bg-surface-container md:col-span-6">
              <img
                src="/images/story-london.jpg"
                alt="A model in a dark stone overcoat against London brutalist concrete"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center md:col-span-5 md:col-start-8">
              <div className="relative rounded-DEFAULT border border-secondary/20 bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined absolute top-8 left-8 text-4xl text-secondary/30">
                  format_quote
                </span>
                <p className="relative z-10 mb-8 pt-8 font-headline-sm text-headline-sm text-primary">
                  &ldquo;The city dictates the form. The geometry of the skyline, the
                  brutalist textures of the Barbican, the understated elegance of
                  Mayfair—these are woven into every silhouette.&rdquo;
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Our aesthetic is intrinsically tied to the urban landscape of London. It
                  is clothing designed for motion, for transitioning through the varied
                  environments of a modern metropolis while maintaining an unyielding
                  standard of decorum.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container py-32">
          <div className="mx-auto max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
            <p className="mb-6 font-label-caps text-label-caps uppercase tracking-widest text-secondary">
              A New Standard
            </p>
            <h2 className="mx-auto mb-12 max-w-4xl font-display-lg text-display-lg-mobile text-primary md:text-display-lg">
              Redefining Modest Luxury
            </h2>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              {[
                {
                  icon: "architecture",
                  title: "Architectural Form",
                  copy: "Volume and structure are manipulated to create garments that stand away from the body, offering a sculptural silhouette that respects traditional boundaries.",
                },
                {
                  icon: "diamond",
                  title: "Material Integrity",
                  copy: "We source only the most resilient, natural fibers. Heavyweight cottons, dense wools, and structured twills that age with grace and maintain their form.",
                },
                {
                  icon: "all_inclusive",
                  title: "Enduring Purpose",
                  copy: "Designing beyond the seasonal cycle. Each piece is constructed to be a foundational element of the wardrobe, relevant today and indispensable tomorrow.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-DEFAULT border border-secondary/10 bg-surface p-8 text-left transition-colors duration-300 hover:border-secondary/30"
                >
                  <span className="material-symbols-outlined mb-6 text-primary">
                    {item.icon}
                  </span>
                  <h3 className="mb-4 font-headline-sm text-headline-sm text-primary">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
