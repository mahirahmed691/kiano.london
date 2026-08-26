import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { Body, Display, Eyebrow } from '@/components/ui/Heading'
import { site } from '@/data/site'
import { packingNote } from '@/data/packing'
import { getShareMeta } from '@/lib/share'
import { usePageMeta } from '@/lib/usePageMeta'

export function ReturnsPage() {
  usePageMeta(getShareMeta('/returns'))

  return (
    <Section className="pt-32 md:pt-40">
      <Container className="max-w-2xl">
        <Eyebrow>After it leaves</Eyebrow>
        <Display as="h1" className="mt-4 text-5xl md:text-6xl">
          If it must return.
        </Display>
        <Body className="mt-6">
          A cut is made when you ask for it. If the piece cannot be worn as reserved, write. Do
          not drop it at a shop window. There is no shop window.
        </Body>

        <ul className="mt-14 space-y-10">
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Fourteen days</p>
            <Body className="mt-3">
              From the day it arrives, fourteen days to write to {site.email} with the reservation
              and the size. Unworn, with the house card, the bag, and the box.
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The packing</p>
            <Body className="mt-3">{packingNote}</Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The till</p>
            <Body className="mt-3">
              A return, if agreed, is a refund in Stripe. When Stripe has returned the till, the
              house book is written and the size is put back on the line. Do not open a dispute
              before you have written.
            </Body>
          </li>
        </ul>

        <div className="mt-14">
          <Button href={`mailto:${site.email}`}>Write to the atelier</Button>
        </div>
        <p className="mt-10">
          <Link to="/account" className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70">
            Account
          </Link>
        </p>
      </Container>
    </Section>
  )
}
