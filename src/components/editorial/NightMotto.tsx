import { QuoteBlock } from '@/components/editorial/QuoteBlock'
import { Container, Section } from '@/components/ui/Container'
import { creedJoin, creedMotto } from '@/data/creed'

type Props = {
  attribution?: string
}

export function NightMotto({ attribution = creedJoin }: Props) {
  return (
    <Section paper={false} className="bg-night py-32 md:py-44 lg:py-56">
      <Container>
        <QuoteBlock tone="dark" quote={creedMotto} attribution={attribution} />
      </Container>
    </Section>
  )
}
