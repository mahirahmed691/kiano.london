import { Link } from 'react-router-dom'
import { ReturnForm } from '@/components/visit/ReturnForm'
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
          not drop it at a shop window. There is no shop window. The letter is held; it is not a
          refund.
        </Body>

        <ul className="mt-14 space-y-10">
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Fourteen days</p>
            <Body className="mt-3">
              From the day it arrives, fourteen days to write with the reservation and the size.
              Unworn, with the house card, the bag, and the box.
            </Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The packing</p>
            <Body className="mt-3">{packingNote}</Body>
          </li>
          <li>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The refund</p>
            <Body className="mt-3">
              A return, if agreed, is a refund in Stripe. When Stripe has returned the payment, the
              house book is written and the size is put back on the line. Do not open a dispute
              before you have written.
            </Body>
          </li>
        </ul>

        <div className="mt-16 border-t border-rule pt-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">The letter</p>
          <Display as="h2" className="mt-4 text-4xl md:text-5xl">
            Write first.
          </Display>
          <Body className="mt-6">
            The house keeps the letter in the diary. If you would rather write directly:{' '}
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </Body>
          <div className="mt-10">
            <ReturnForm />
          </div>
        </div>

        <p className="mt-16">
          <Link to="/account" className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70">
            Account
          </Link>
        </p>
      </Container>
    </Section>
  )
}
