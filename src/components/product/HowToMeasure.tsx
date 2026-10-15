import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { measureLead, measureStill } from '@/data/sizing'

export function HowToMeasure() {
  return (
    <EditorialSplit
      image={measureStill.src}
      imageAlt={measureStill.alt}
      objectPosition={measureStill.objectPosition}
      imageOn="left"
    >
      <Eyebrow>Sizes 52–60</Eyebrow>
      <Display className="mt-4 text-4xl md:text-5xl">Against a thobe you own.</Display>
      <Body className="mt-6">{measureLead}</Body>
    </EditorialSplit>
  )
}
