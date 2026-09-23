import { HouseMark } from '@/components/brand/HouseMark'
import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { Container, Section } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { creedJoin, creedMotto } from '@/data/creed'

type Props = {
  attribution?: string
  quiet?: boolean
}

export function NightMotto({ attribution = creedJoin, quiet = false }: Props) {
  return (
    <Section paper={false} className="bg-night py-32 md:py-44 lg:py-56">
      <Container>
        {quiet ? (
          <Reveal className="flex flex-col items-center text-center">
            <HouseMark compact={false} className="text-bronze" />
            <p className="mt-8 text-[10px] uppercase tracking-[0.32em] text-bronze">{creedJoin}</p>
          </Reveal>
        ) : (
          <QuoteBlock tone="dark" quote={creedMotto} attribution={attribution} />
        )}
      </Container>
    </Section>
  )
}
