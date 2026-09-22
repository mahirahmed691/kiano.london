import { EditorialSplit } from '@/components/editorial/EditorialSplit'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { measureLead, measureLeadAr, measureStill } from '@/data/sizing'

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
      <p lang="ar" dir="rtl" className="mt-4 w-fit max-w-md font-arabic text-lg font-light leading-relaxed text-ivory/70">
        {measureLeadAr}
      </p>
    </EditorialSplit>
  )
}
