import { type ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'

type Plate = {
  id: string
  title: string
  caption: string
  art: ReactNode
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className="h-auto w-full text-ink"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width="199" height="139" stroke="currentColor" strokeOpacity="0.18" />
      {children}
    </svg>
  )
}

const plates: Plate[] = [
  {
    id: 'running',
    title: 'Running stitch',
    caption: 'Even bites. The foundation of every seam.',
    art: (
      <Frame>
        <path
          d="M18 70 H182"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        <path
          d="M22 70h10 M42 70h10 M62 70h10 M82 70h10 M102 70h10 M122 70h10 M142 70h10 M162 70h10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="square"
        />
        <path
          d="M32 70h10 M52 70h10 M72 70h10 M92 70h10 M112 70h10 M132 70h10 M152 70h10"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1.4"
          strokeDasharray="1 3"
        />
      </Frame>
    ),
  },
  {
    id: 'fell',
    title: 'Felled seam',
    caption: 'Allowance enclosed. The face stays a single plane.',
    art: (
      <Frame>
        <path d="M40 28 L160 28 L160 112 L40 112 Z" stroke="currentColor" strokeOpacity="0.22" />
        <path d="M40 28 L100 70 L40 112" stroke="currentColor" strokeWidth="1.2" />
        <path d="M100 70 L160 28" stroke="currentColor" strokeOpacity="0.35" />
        <path
          d="M52 48 L88 70 L52 92"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="miter"
        />
        <path
          d="M58 55 L82 70 L58 85"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        <path d="M96 48 v44" stroke="currentColor" strokeWidth="1.1" />
        <path
          d="M96 52v4 M96 62v4 M96 72v4 M96 82v4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </Frame>
    ),
  },
  {
    id: 'pad',
    title: 'Pad stitch',
    caption: 'Concentric bites. They shape the collar, then vanish.',
    art: (
      <Frame>
        <path
          d="M58 24 C92 36, 108 36, 142 24 C150 62, 150 86, 100 118 C50 86, 50 62, 58 24 Z"
          stroke="currentColor"
          strokeOpacity="0.28"
        />
        <path
          d="M70 40 C90 50, 110 50, 130 40"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray="3 4"
          strokeLinecap="square"
        />
        <path
          d="M66 54 C90 66, 110 66, 134 54"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray="3 4"
          strokeLinecap="square"
        />
        <path
          d="M70 70 C90 82, 110 82, 130 70"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray="3 4"
          strokeLinecap="square"
        />
        <path
          d="M78 86 C90 96, 110 96, 122 86"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray="3 4"
          strokeLinecap="square"
        />
      </Frame>
    ),
  },
  {
    id: 'keyhole',
    title: 'Silk buttonhole',
    caption: 'Worked in twist. The purl sits proud of the cloth.',
    art: (
      <Frame>
        <path d="M86 28 H114" stroke="currentColor" strokeWidth="1.3" />
        <path d="M100 28 V108" stroke="currentColor" strokeWidth="1.2" />
        <path d="M86 108 H114" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M90 32 C78 40, 78 52, 90 58"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M110 32 C122 40, 122 52, 110 58"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path d="M90 62 V102 M110 62 V102" stroke="currentColor" strokeWidth="1.1" />
        <path
          d="M84 36h6 M84 44h6 M84 52h6 M114 36h-6 M114 44h-6 M114 52h-6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="square"
        />
        <path
          d="M84 68h6 M84 76h6 M84 84h6 M84 92h6 M114 68h-6 M114 76h-6 M114 84h-6 M114 92h-6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="square"
        />
        <circle cx="100" cy="45" r="3.2" stroke="currentColor" strokeWidth="1.1" />
      </Frame>
    ),
  },
]

export function StitchArt() {
  return (
    <div>
      <Reveal className="max-w-2xl">
        <Eyebrow>The grammar</Eyebrow>
        <Display className="mt-4 text-4xl md:text-5xl">Stitch, seam, and the hand.</Display>
        <Body className="mt-6">
          A thobe is a column of cloth. The art is what holds it: a felled seam that
          does not show, a pad stitch that shapes the neck, a buttonhole worked in silk
          so the placket closes without announcing itself.
        </Body>
      </Reveal>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {plates.map((plate, index) => (
          <Reveal key={plate.id} delay={index * 70}>
            <figure>
              {plate.art}
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
