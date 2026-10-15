import { Reveal } from '@/components/ui/Reveal'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'

const plates = [
  {
    id: 'running',
    title: 'Running stitch',
    caption: 'Even bites on the face. The foundation of every seam.',
    src: '/images/stitch-running.jpg',
    alt: 'A running stitch in ivory silk on charcoal cloth, the needle still in the work.',
  },
  {
    id: 'fell',
    title: 'Felled seam',
    caption: 'The allowance folded in, stitched twice. The face stays a single plane.',
    src: '/images/stitch-felled.jpg',
    alt: 'The inside of a felled seam: the fold enclosed, two parallel rows of stitching.',
  },
  {
    id: 'pad',
    title: 'Pad stitch',
    caption: 'Rows of hand stitches through the canvas. They shape the collar, then vanish.',
    src: '/images/stitch-pad.jpg',
    alt: 'Pad stitching on collar canvas, rows of espresso silk following the stand.',
  },
  {
    id: 'keyhole',
    title: 'The buttonhole',
    caption: 'The stitch around the opening. The purl sits proud of the cloth.',
    src: '/images/stitch-buttonhole.jpg',
    alt: 'A buttonhole set into the placket, the stitch catching the light.',
  },
] as const

export function StitchArt() {
  return (
    <div>
      <Reveal className="max-w-2xl">
        <Eyebrow>The grammar</Eyebrow>
        <Display className="mt-4 text-4xl md:text-5xl">Stitch, seam, and the hand.</Display>
        <Body className="mt-6">
          A thobe is a column of cloth. The art is what holds it: a seam that does
          not show, a stitch that shapes the neck, a placket that closes without
          announcing itself.
        </Body>
      </Reveal>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {plates.map((plate, index) => (
          <Reveal key={plate.id} delay={index * 70}>
            <figure>
              <div className="img-zoom aspect-[4/3] w-full overflow-hidden bg-ivory-deep">
                <img
                  src={plate.src}
                  alt={plate.alt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
              <figcaption className="mt-5">
                <p className="font-display text-2xl font-light">{plate.title}</p>
                <p className="mt-2 text-[13px] font-light leading-relaxed text-stone">
                  {plate.caption}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
